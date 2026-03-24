/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { addNotification, setMainCategoryAndLegalArea, setDocumentTypeKey, setCaseInfo, addParty } from '../lib/actions';
import { encode, decode, decodeAudioData, resampleBuffer } from '../lib/audioUtils';
import JustyButtonIcon from './JustyButtonIcon';
import modes from '../lib/modes';

const generateDocumentFunctionDeclaration = {
  name: 'generateDocument',
  parameters: {
    type: Type.OBJECT,
    description: 'Aciona a geração do documento e abre a caixa de confirmação.',
    properties: {},
    required: [],
  },
};

const setLegalAreaFunctionDeclaration = {
  name: 'setLegalArea',
  parameters: {
    type: Type.OBJECT,
    description: 'Altera a área do direito selecionada na interface.',
    properties: {
      areaKey: {
        type: Type.STRING,
        description: `A chave que identifica a área do direito (ex: 'direitoCivil', 'direitoPenal', 'direitoTributario').`,
      },
    },
    required: ['areaKey'],
  },
};

const setDocumentTypeFunctionDeclaration = {
  name: 'setDocumentType',
  parameters: {
    type: Type.OBJECT,
    description: 'Altera o tipo de documento selecionado na interface, dentro da área do direito atual.',
    properties: {
      documentTypeKey: {
        type: Type.STRING,
        description: 'A chave que identifica o tipo de documento (ex: "acaoCobranca", "contratoSocialLtda", "habeasCorpus").',
      },
    },
    required: ['documentTypeKey'],
  },
};

const updateCaseDescriptionFunctionDeclaration = {
  name: 'updateCaseDescription',
  parameters: {
    type: Type.OBJECT,
    description: 'Preenche ou atualiza o campo de texto com a descrição dos fatos do caso.',
    properties: {
      description: {
        type: Type.STRING,
        description: 'O texto completo narrando os fatos e objetivos do caso.',
      },
    },
    required: ['description'],
  },
};

const addPartyDataFunctionDeclaration = {
  name: 'addPartyData',
  parameters: {
    type: Type.OBJECT,
    description: 'Adiciona uma nova parte (pessoa ou empresa) à lista de partes envolvidas.',
    properties: {
      role: { type: Type.STRING, description: 'A função da parte (ex: Autor, Réu, Advogado, Testemunha).' },
      name: { type: Type.STRING, description: 'O nome completo da pessoa ou razão social.' },
      document: { type: Type.STRING, description: 'CPF ou CNPJ da parte (opcional).' },
      address: { type: Type.STRING, description: 'Endereço da parte (opcional).' },
      oab: { type: Type.STRING, description: 'Número da OAB se for advogado (opcional).' },
    },
    required: ['role', 'name'],
  },
};

const findMainCategoryForArea = (areaKeyToFind) => {
    for (const mainCatKey in modes) {
        if (Object.prototype.hasOwnProperty.call(modes[mainCatKey].areas, areaKeyToFind)) {
            return mainCatKey;
        }
    }
    return null;
};

export default function JustyAssistant({ onGenerate }) {
  const [isConversing, setIsConversing] = useState(false);
  const [status, setStatus] = useState('Pronta para ajudar');
  const [transcript, setTranscript] = useState([]);

  const sessionPromiseRef = useRef(null);
  const inputAudioContextRef = useRef(null);
  const outputAudioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set());
  const transcriptContainerRef = useRef(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  useEffect(() => {
    if (transcriptContainerRef.current) {
        transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);
  
  const handleDisconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();

    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close().catch(console.warn);
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      outputAudioContextRef.current.close().catch(console.warn);
    }

    setIsConversing(false);
    setStatus('Pronta para ajudar');
    setTranscript([]);
    currentInputTranscription.current = '';
    currentOutputTranscription.current = '';
  }, []);

  const handleStartConversation = async () => {
    setIsConversing(true);
    setStatus('Iniciando conexão...');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            callbacks: {
                onopen: async () => {
                    setStatus('Conectada. Pode falar!');
                    mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                    scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const resampled = resampleBuffer(inputData, inputAudioContextRef.current.sampleRate, 16000);
                        const blob = { data: encode(new Uint8Array(new Int16Array(resampled.map(x => x*32768)).buffer)), mimeType: 'audio/pcm;rate=16000' };
                        if (sessionPromiseRef.current) sessionPromiseRef.current.then(s => s.sendRealtimeInput({ audio: blob }));
                    };
                    source.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                },
                onmessage: async (msg) => {
                    if (msg.serverContent) {
                        if (msg.serverContent.inputTranscription) currentInputTranscription.current += msg.serverContent.inputTranscription.text;
                        if (msg.serverContent.outputTranscription) currentOutputTranscription.current += msg.serverContent.outputTranscription.text;
                        if (msg.serverContent.turnComplete) {
                            setTranscript(p => [...p.filter(t=>t.speaker!=='welcome'), { speaker: 'user', text: currentInputTranscription.current.trim() }, { speaker: 'model', text: currentOutputTranscription.current.trim() }]);
                            currentInputTranscription.current = ''; currentOutputTranscription.current = '';
                        }
                        const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audio) {
                            const outCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audio), outCtx, 24000, 1);
                            const source = outCtx.createBufferSource();
                            source.buffer = audioBuffer; source.connect(outCtx.destination);
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration; sourcesRef.current.add(source);
                        }

                        if (msg.serverContent.interrupted) {
                            sourcesRef.current.forEach(source => {
                                try { source.stop(); } catch(e) {}
                            });
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    }
                    if (msg.toolCall?.functionCalls) {
                        for (const fc of msg.toolCall.functionCalls) {
                            let result = 'ok';
                            if (fc.name === 'generateDocument') {
                                addNotification('JUSTY está gerando o documento final...', 'info');
                                onGenerate();
                            } else if (fc.name === 'setLegalArea') {
                                const areaKey = fc.args.areaKey;
                                const mainCatKey = findMainCategoryForArea(areaKey);
                                if (mainCatKey) {
                                    setMainCategoryAndLegalArea({ mainCatKey, areaKey });
                                    addNotification(`Área definida: ${modes[mainCatKey].areas[areaKey].name}`, 'info');
                                } else {
                                    result = `error: area key "${areaKey}" not found.`;
                                }
                            } else if (fc.name === 'setDocumentType') {
                                const docKey = fc.args.documentTypeKey;
                                setDocumentTypeKey(docKey);
                            } else if (fc.name === 'updateCaseDescription') {
                                setCaseInfo(fc.args.description);
                            } else if (fc.name === 'addPartyData') {
                                addParty(fc.args);
                            }
                            sessionPromiseRef.current.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result } } }));
                        }
                    }
                },
                onerror: (e) => { addNotification(`Erro na assistente: ${e.message}`, 'error'); handleDisconnect(); },
                onclose: () => handleDisconnect(),
            },
            config: { 
                responseModalities: [Modality.AUDIO], 
                inputAudioTranscription: {}, 
                outputAudioTranscription: {}, 
                tools: [{ functionDeclarations: [
                    generateDocumentFunctionDeclaration, 
                    setLegalAreaFunctionDeclaration, 
                    setDocumentTypeFunctionDeclaration,
                    updateCaseDescriptionFunctionDeclaration,
                    addPartyDataFunctionDeclaration
                ]}], 
                speechConfig: { voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Zephyr'}} },
                systemInstruction: `
Você é a JUSTY, uma assistente jurídica profissional, prudente e extremamente eficiente. Você fala com a clareza e o peso de quem atua perante a Justiça, mas sem ser lenta.

COMPORTAMENTO INICIAL:
- Assim que a conexão for estabelecida, inicie IMEDIATAMENTE com uma saudação educada: "Boa tarde", "Bom dia" ou "Boa noite" (conforme o horário), identifique-se como JUSTY e pergunte como pode ajudar.

EQUILÍBRIO DE FALA E RESPOSTA:
1. Responda no TEMPO CERTO. Seja ágil: se o usuário parou de falar, processe a informação e aja.
2. Ritmo Profissional: Fale com clareza e solenidade natural.
3. Escuta Ativa: Ouça atentamente e execute as ferramentas assim que os dados necessários forem fornecidos.

MAPEAMENTO DE FERRAMENTAS (MANDATÓRIO):
Para 'setLegalArea', use estas chaves exatas:
- 'civilParteGeral' (Cível / Geral / Petição Inicial)
- 'obrigacoesEContratos' (Contratos / Obrigações)
- 'direitoFamilia' (Família / Divórcio / Alimentos)
- 'direitoSucessoes' (Sucessões / Inventário)
- 'direitoConsumidor' (Consumidor / JEC)
- 'direitoImobiliario' (Imobiliário / Aluguel)
- 'direitoTrabalho' (Trabalhista)
- 'direitoEmpresarialSocietario' (Empresarial)
- 'direitoPenalComum' (Penal / Criminal)
- 'direitoTributario' (Tributário)
- 'direitoPrevidenciarioRGPS' (Previdenciário / INSS)
- 'direitoSaude' (Saúde / Erro Médico)
- 'direitoDigitalLGPD' (Digital / LGPD)
- 'ferramentasJuridicas' (Procuração / Honorários / Notificação)

Para 'setDocumentType', use chaves como:
- 'peticaoInicialCivel' (Petição Inicial Cível)
- 'contestacao' (Contestação)
- 'habeasCorpus' (Habeas Corpus)
- 'reclamacaoTrabalhista' (Reclamação Trabalhista)
- 'divorcioConsensual' (Divórcio Consensual)
- 'contratoSocial' (Contrato Social)
- 'procuracaoAdJudicia' (Procuração)
- 'notificacaoExtrajudicial' (Notificação)

FLUXO DE TRABALHO:
1. Saudação e Identificação.
2. Identificar a Área ('setLegalArea') e o Tipo de Documento ('setDocumentType'). Se o usuário disser "Petição Inicial Cível", chame AMBAS as funções com as chaves correspondentes.
3. Coletar dados das Partes ('addPartyData'). Ex: "Adicionar João Silva, CPF 123, como Autor". O papel (role) deve ser "Autor", "Réu", "Advogado", etc.
4. Coletar a Descrição dos Fatos ('updateCaseDescription').
5. Gerar o documento ('generateDocument') quando o usuário solicitar explicitamente ("gerar", "concluir", "finalizar").

Lembre-se: Você é a JUSTY. Eficiência jurídica em tempo real.
`
            },
        });
    } catch (error) {
        addNotification(`Falha ao conectar: ${error.message}`, 'error');
        setIsConversing(false);
    }
  };

  const renderContent = () => {
    if (isConversing) {
        return (
          <>
            <div className="justy-transcript-container" ref={transcriptContainerRef}>
              <div className="justy-transcript">
                {transcript.map((item, i) => item.text && <p key={i} className={item.speaker}>{item.speaker==='welcome' ? <span className="welcome">{item.text}</span> : <><strong>{item.speaker==='user'?'Você:':'JUSTY:'}</strong> {item.text}</>}</p>)}
              </div>
            </div>
            <div className="justy-status">{status}</div>
            <div className="justy-controls">
                <button className="button minor recording" onClick={handleDisconnect}>
                    <span className="icon">mic_off</span> Desconectar
                </button>
            </div>
          </>
        );
    }
    
    return (
      <>
        <div className="justy-status">{status}</div>
        <div className="justy-mode-choice">
          <button className="button justy-button" onClick={handleStartConversation}>
            <JustyButtonIcon />
            Ativar JUSTY
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="justy-assistant-panel panel">
        <div className="justy-header">
        </div>
        {renderContent()}
    </div>
  );
}