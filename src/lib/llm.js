

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI} from '@google/genai'
import {limitFunction} from 'p-limit'

const timeoutMs = 193_333
const maxRetries = 5
const baseDelay = 1_233

const textGenLimiter = limitFunction(
  async ({
    model,
    systemInstruction,
    contents,
    temperature,
    searchJurisprudence,
  }) => {
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), timeoutMs)
        )

        const config = {};
        if (systemInstruction) {
          config.systemInstruction = systemInstruction;
        }
        if (temperature !== undefined) {
          config.temperature = temperature;
        }

        if (searchJurisprudence) {
          config.tools = [{googleSearch: {}}];
        }
        
        config.safetySettings = safetySettings;

        const modelPromise = ai.models.generateContent({
          model,
          contents,
          config,
        });

        const response = await Promise.race([modelPromise, timeoutPromise])
        return response;

      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        console.error(error);

        if (attempt === maxRetries - 1) {
          throw error
        }

        const delay = baseDelay * 2 ** attempt
        await new Promise(res => setTimeout(res, delay))
        console.warn(
          `Attempt ${attempt + 1} failed, retrying after ${delay}ms...`
        )
      }
    }
  },
  {concurrency: 9}
);

export const llmGen = textGenLimiter;

const safetySettings = [
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_DANGEROUS_CONTENT',
  'HARM_CATEGORY_HARASSMENT'
].map(category => ({category, threshold: 'BLOCK_NONE'}))