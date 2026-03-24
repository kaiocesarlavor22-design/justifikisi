/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// AVISO DE SEGURANÇA: A chave da API e as chamadas agora são processadas
// pelo backend (servidor proxy) próprio para evitar CORS e proteger a chave.

/**
 * Cria uma mensagem de erro detalhada a partir de uma resposta de API.
 * @param {Response} response O objeto de resposta da fetch.
 * @param {string} context Uma string de contexto.
 * @returns {Promise<Error>} Um objeto de erro com uma mensagem amigável.
 */
async function createApiError(response, context) {
    let errorMessage = `Erro ao ${context}: ${response.status} ${response.statusText}`;
    const responseBodyText = await response.text();

    if (responseBodyText.trim().toLowerCase().startsWith('<!doctype html')) {
        return new Error('O serviço de consulta processual está temporariamente indisponível devido a uma falha no proxy. Por favor, tente novamente mais tarde.');
    }

    try {
        const errorBody = JSON.parse(responseBodyText);
        errorMessage = errorBody.error?.reason || errorBody.error?.type || JSON.stringify(errorBody);
    } catch (e) {
        if (responseBodyText) {
            errorMessage = responseBodyText.substring(0, 200);
        }
    }

    if (response.status === 404) {
      errorMessage = 'Processo não encontrado ou tribunal inválido.';
    } else if (response.status >= 500) {
      errorMessage = `O serviço de consulta está indisponível no momento (Erro ${response.status}). Tente novamente mais tarde.`;
    }

    return new Error(errorMessage);
}

/**
 * Consulta um processo através da API Pública do Datajud.
 * @param {string} numeroProcesso O número do processo para consultar.
 * @param {string} tribunal A sigla do tribunal (ex: 'stj', 'tjsp').
 * @returns {Promise<object>} Os dados do processo.
 */
export async function consultarProcesso(numeroProcesso, tribunal = 'stj') {
    const cleanedProcesso = numeroProcesso.replace(/\D/g, '');
    
    const body = {
      "query": {
        "match": {
          "numeroProcesso": cleanedProcesso
        }
      },
      "size": 1
    };

    let response;
    try {
        // Usamos o proxy do nosso próprio servidor para evitar problemas de CORS e proteger a chave
        response = await fetch('/api/datajud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tribunal,
                body
            })
        });
    } catch (networkError) {
        console.error('[Datajud] Network Error:', networkError);
        throw new Error('Falha na rede ao tentar consultar o processo. Verifique sua conexão.');
    }

    if (!response.ok) {
        const error = await createApiError(response, `consultar processo (${cleanedProcesso})`);
        console.error("[Datajud] API Error:", error.message);
        throw error;
    }
    
    const result = await response.json();

    if (result.hits && result.hits.hits.length > 0) {
        return result.hits.hits[0]._source;
    } else {
        throw new Error('Processo não encontrado na base de dados do tribunal selecionado.');
    }
}
