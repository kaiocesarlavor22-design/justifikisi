/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// AVISO DE SEGURANÇA: As credenciais da API (Consumer Key/Secret) e um proxy
// público estão sendo usados diretamente no frontend. Esta configuração é
// EXTREMAMENTE INSEGURA e serve apenas para fins de DEMONSTRAÇÃO.
// Em um ambiente de produção, é ESSENCIAL que a obtenção do token e as
// chamadas para a API do Serpro sejam feitas por um backend (servidor proxy)
// próprio. Isso evita a exposição das credenciais, a dependência de serviços
// de terceiros instáveis e problemas com CORS.
const CONSUMER_KEY = 'gofbVMTfCw4vepJK0_sZRTGYvQQa';
const CONSUMER_SECRET = 'pWRj9wHgVreXExWT8GtpckUMCl0a';
const TOKEN_ENDPOINT = 'https://gateway.apiserpro.serpro.gov.br/token';
const SERPRO_API_URL = 'https://gateway.api.serpro.gov.br/consulta-cnpj/v2/';

// Usando um proxy CORS para contornar as limitações do navegador.
// Proxies públicos podem ser instáveis e são trocados conforme necessário.
const CORS_PROXY_URL = 'https://corsproxy.io/?';

/**
 * Cria uma mensagem de erro detalhada a partir de uma resposta de API.
 * @param {Response} response O objeto de resposta da fetch.
 * @param {string} context Uma string de contexto (ex: 'obter token').
 * @returns {Promise<Error>} Um objeto de erro com uma mensagem amigável.
 */
async function createApiError(response, context) {
    let errorMessage = `Erro ao ${context}: ${response.status} ${response.statusText}`;
    const responseBodyText = await response.text();

    if (responseBodyText.trim().toLowerCase().startsWith('<!doctype html')) {
        return new Error('O serviço de verificação de CNPJ está temporariamente indisponível devido a uma falha no proxy. Por favor, tente novamente mais tarde.');
    }

    try {
        const errorBody = JSON.parse(responseBodyText);
        errorMessage = errorBody.message || errorBody.title || JSON.stringify(errorBody);
    } catch (e) {
        if (responseBodyText) {
            errorMessage = responseBodyText.substring(0, 150); // Limita o tamanho do erro
        }
    }

    if (response.status === 404) {
      errorMessage = 'CNPJ não encontrado na base de dados da Receita Federal.';
    } else if (response.status === 401) {
      errorMessage = 'Acesso não autorizado. As credenciais da API podem ser inválidas ou ter expirado.';
    } else if (response.status >= 500) {
      errorMessage = `O serviço de consulta de CNPJ está indisponível no momento (Erro ${response.status}). Tente novamente mais tarde.`;
    }

    return new Error(errorMessage);
}


/**
 * Obtém um token de acesso da API do Serpro.
 * @returns {Promise<string>} O token de acesso.
 */
async function obterToken() {
    const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(TOKEN_ENDPOINT)}`;

    let response;
    try {
        response = await fetch(proxiedUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });
    } catch (networkError) {
        console.error('[Serpro Token] Network Error:', networkError);
        throw new Error('Falha na rede ao tentar obter o token de autenticação. Verifique sua conexão.');
    }

    if (!response.ok) {
        const error = await createApiError(response, 'obter token');
        console.error("[Serpro Token] API Error:", error.message);
        throw error;
    }
    
    try {
        const text = await response.text();
        const data = JSON.parse(text);
        return data.access_token;
    } catch(e) {
        console.error('[Serpro Token] JSON Parse Error:', e);
        throw new Error('Falha ao processar a resposta do token da API.');
    }
}

/**
 * Consulta um CNPJ através da API do Serpro.
 * @param {string} cnpj O número do CNPJ para consultar.
 * @param {string} type O tipo de consulta ('basica', 'qsa', 'empresa').
 * @returns {Promise<object>} Os dados do CNPJ.
 */
export async function consultarCnpj(cnpj, type = 'basica') {
    const cleanedCnpj = cnpj.replace(/\D/g, '');
    const token = await obterToken();

    let response;
    try {
        const originalUrl = `${SERPRO_API_URL}${type}/${cleanedCnpj}`;
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(originalUrl)}`;

        response = await fetch(proxiedUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (networkError) {
        console.error('[Serpro CNPJ] Network Error:', networkError);
        throw new Error('Falha na rede ao consultar o CNPJ. Verifique sua conexão com a internet.');
    }

    if (!response.ok) {
        const error = await createApiError(response, `consultar CNPJ (${cleanedCnpj})`);
        console.error('[Serpro CNPJ] API Error:', error.message);
        throw error;
    }

    try {
        const text = await response.text();
        return JSON.parse(text);
    } catch (parseError) {
        console.error('[Serpro CNPJ] JSON Parse Error:', parseError);
        throw new Error('Falha ao processar a resposta da API de consulta de CNPJ.');
    }
}