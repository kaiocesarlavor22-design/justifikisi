/**
 * Robust fetch utility with retry logic and timeout
 * @license Apache-2.0
 */

export async function robustFetch(url, options, retries, backoff) {
  retries = (retries === undefined) ? 3 : retries;
  backoff = backoff || 1000;
  options = options || {};
  const timeout = options.timeout || 30000;
  const fetchOptions = Object.assign({}, options);
  delete fetchOptions.timeout;
  
  const controller = new AbortController();
  const id = setTimeout(function() { controller.abort(); }, timeout);
  
  try {
    const response = await fetch(url, Object.assign({}, fetchOptions, { signal: controller.signal }));
    clearTimeout(id);
    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        await new Promise(function(res) { setTimeout(res, backoff); });
        return robustFetch(url, options, retries - 1, backoff * 2);
      }
      const errorData = await response.json().catch(function() { return {}; });
      throw new Error(errorData.error || 'HTTP error: ' + response.status);
    }
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Tempo limite da requisicao excedido.');
    }
    if (retries > 0 && error.message && (error.message.includes('NetworkError') || error.message.includes('fetch failed'))) {
      await new Promise(function(res) { setTimeout(res, backoff); });
      return robustFetch(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export async function post(url, data) {
  return robustFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
