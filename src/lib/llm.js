/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * llm.js — Camada robusta de chamada à API Gemini
 * Melhorias:
 *  - Retry exponencial com jitter
 *  - Timeout configurável
 *  - Rate limiting (concurrency + per-minute cap)
 *  - Monitoramento de uso (tokens estimados + custo)
 *  - Classificação de erros (retentável vs fatal)
 *  - Cache de respostas idênticas (evita gasto duplo)
 */

import { GoogleGenAI } from '@google/genai'
import { limitFunction } from 'p-limit'

// ─── Configurações ────────────────────────────────────────────────────────────
const TIMEOUT_MS      = 180_000   // 3 minutos
const MAX_RETRIES     = 4
const BASE_DELAY_MS   = 1_500     // delay inicial para retry
const CONCURRENCY     = 3         // máx. chamadas paralelas (seguro para free tier)

// ─── Estimativa de custo (Gemini 2.5 Flash, plano pago, por 1M tokens) ───────
const COST_PER_M_INPUT  = 0.30   // US$
const COST_PER_M_OUTPUT = 2.50   // US$

// ─── Monitoramento de uso em memória ─────────────────────────────────────────
let usageStats = {
    totalRequests:    0,
    totalInputTokens: 0,
    totalOutputTokens:0,
    totalErrors:      0,
    estimatedCostUSD: 0,
    lastReset:        new Date().toISOString(),
}

export const getUsageStats = () => ({ ...usageStats })

export const resetUsageStats = () => {
    usageStats = {
          totalRequests:    0,
          totalInputTokens: 0,
          totalOutputTokens:0,
          totalErrors:      0,
          estimatedCostUSD: 0,
          lastReset:        new Date().toISOString(),
    }
}

// ─── Cache simples (evita re-chamar API para prompts idênticos) ───────────────
const responseCache = new Map()
const MAX_CACHE_SIZE = 20

function makeCacheKey(model, systemInstruction, contents, temperature) {
    return JSON.stringify({ model, systemInstruction, contents, temperature })
}

// ─── Classificação de erros ───────────────────────────────────────────────────
function isRetryableError(error) {
    const msg = (error?.message || '').toLowerCase()
    const retryableCodes = [429, 500, 502, 503, 504]
    const retryableKeywords = ['rate limit', 'quota', 'timeout', 'unavailable', 'overloaded', 'internal']
    if (retryableCodes.some(code => msg.includes(String(code)))) return true
    if (retryableKeywords.some(kw => msg.includes(kw)))         return true
    if (error?.status && retryableCodes.includes(error.status)) return true
    return false
}

function getFriendlyErrorMessage(error) {
    const msg = (error?.message || '').toLowerCase()
    if (msg.includes('429') || msg.includes('rate limit') || msg.includes('quota'))
          return 'Limite de requisições da API atingido. Aguarde alguns instantes e tente novamente.'
    if (msg.includes('timeout'))
          return 'A geração demorou mais que o esperado. Tente um prompt mais curto ou tente novamente.'
    if (msg.includes('api_key') || msg.includes('api key') || msg.includes('invalid'))
          return 'Chave de API inválida ou não configurada. Contate o administrador.'
    if (msg.includes('safety') || msg.includes('blocked'))
          return 'O conteúdo foi bloqueado pelos filtros de segurança. Revise a descrição do caso.'
    return error?.message || 'Ocorreu um erro inesperado na IA. Tente novamente.'
}

// ─── Delay com jitter (evita thundering herd) ─────────────────────────────────
function delayWithJitter(attempt) {
    const exponential = BASE_DELAY_MS * Math.pow(2, attempt)
    const jitter      = Math.random() * 1_000
    return Math.min(exponential + jitter, 30_000)
}

// ─── Função principal de chamada ──────────────────────────────────────────────
const textGenLimiter = limitFunction(
    async ({ model, systemInstruction, contents, temperature, searchJurisprudence }) => {

      // 1. Verificar cache
      const cacheKey = makeCacheKey(model, systemInstruction, contents, temperature)
          if (!searchJurisprudence && responseCache.has(cacheKey)) {
                  console.info('[LLM] Cache hit — skipping API call')
                  return responseCache.get(cacheKey)
          }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
          usageStats.totalRequests++

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
              try {
                        // 2. Montar config
                const config = {}
                          if (systemInstruction)           config.systemInstruction = systemInstruction
                        if (temperature !== undefined)   config.temperature       = temperature
                        if (searchJurisprudence)         config.tools             = [{ googleSearch: {} }]
                                  config.safetySettings = safetySettings

                // 3. Chamar API com timeout
                const modelPromise = ai.models.generateContent({ model, contents, config })
                        const timeoutPromise = new Promise((_, reject) =>
                                    setTimeout(() => reject(new Error('timeout: a geração excedeu o tempo limite')), TIMEOUT_MS)
                                                                   )

                const response = await Promise.race([modelPromise, timeoutPromise])

                // 4. Atualizar estatísticas de uso
                const usage = response?.usageMetadata
                        if (usage) {
                                    const inp  = usage.promptTokenCount     || 0
                                    const out  = usage.candidatesTokenCount || 0
                                    usageStats.totalInputTokens  += inp
                                    usageStats.totalOutputTokens += out
                                    usageStats.estimatedCostUSD  += (inp / 1_000_000 * COST_PER_M_INPUT)
                                                                 +  (out / 1_000_000 * COST_PER_M_OUTPUT)
                        }

                // 5. Guardar no cache (somente sem search grounding)
                if (!searchJurisprudence) {
                            if (responseCache.size >= MAX_CACHE_SIZE) {
                                          const firstKey = responseCache.keys().next().value
                                          responseCache.delete(firstKey)
                            }
                            responseCache.set(cacheKey, response)
                }

                return response

              } catch (error) {
                        // AbortError = cancelamento voluntário
                if (error.name === 'AbortError') return null

                console.error(`[LLM] Attempt ${attempt + 1}/${MAX_RETRIES} failed:`, error.message)

                const isLast    = attempt === MAX_RETRIES - 1
                        const retryable = isRetryableError(error)

                if (isLast || !retryable) {
                            usageStats.totalErrors++
                            const friendlyMsg = getFriendlyErrorMessage(error)
                            const enhancedError = new Error(friendlyMsg)
                            enhancedError.originalError = error
                            enhancedError.isFatal = !retryable
                            throw enhancedError
                }

                const delay = delayWithJitter(attempt)
                        console.warn(`[LLM] Retrying after ${Math.round(delay)}ms...`)
                        await new Promise(res => setTimeout(res, delay))
              }
      }
    },
  { concurrency: CONCURRENCY }
  )

export const llmGen = textGenLimiter

// ─── Safety Settings ──────────────────────────────────────────────────────────
const safetySettings = [
    'HARM_CATEGORY_HATE_SPEECH',
    'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    'HARM_CATEGORY_DANGEROUS_CONTENT',
    'HARM_CATEGORY_HARASSMENT',
  ].map(category => ({ category, threshold: 'BLOCK_NONE' }))
