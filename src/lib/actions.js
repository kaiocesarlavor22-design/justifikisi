/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore, { initialState } from './store'
import modes from './modes'
import analysis from './analysis'
import { llmGen } from './llm'
import models from './models'
import { consultarCnpj } from './serpro';
import judges from './judges';
import { consultarProcesso } from './datajud';
import { db, handleFirestoreError, OperationType, signInWithGoogle, logout as firebaseLogout } from '../firebase';
import { collection, addDoc, updateDoc, doc, query, where, onSnapshot, deleteDoc, serverTimestamp } from 'firebase/firestore';

const get = useStore.getState
const set = useStore.setState

export const init = () => {
  if (get().didInit) {
    return
  }

  set(state => {
    state.didInit = true
  })
}

const newOutput = (model) => ({
  model,
  id: crypto.randomUUID(),
  startTime: Date.now(),
  outputData: null,
  isBusy: true,
  gotError: false,
  dataType: 'text',
  judgeId: null,
  feedback: { rating: null, comment: '', submitted: false },
})

// Navigation Actions
export const setCurrentView = (view) => set(state => {
  state.currentView = view;
  // Auto-scroll to top when switching views
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

export const createFolder = async (name) => {
  const { user } = get();
  if (!user) {
    addNotification('Você precisa estar logado para criar pastas.', 'error');
    return;
  }

  const path = 'folders';
  try {
    await addDoc(collection(db, path), {
      name,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
    addNotification(`Pasta "${name}" criada com sucesso!`, 'info');
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const deleteFolder = async (folderId) => {
  const path = 'folders';
  try {
    await deleteDoc(doc(db, path, folderId));
    addNotification('Pasta excluída.', 'info');
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const applyTemplate = (template) => {
  set(state => {
    state.mainCategoryKey = template.mainCategoryKey || 'juridico';
    state.legalArea = template.legalArea;
    state.documentTypeKey = template.documentTypeKey;
    state.caseInfo = template.caseInfo || '';
    state.currentView = 'home'; // Switch back to generator
  });
  addNotification('Template aplicado! Preencha os detalhes restantes e gere o documento.', 'info');
};


export const addRound = async ({
  caseFiles,
  caseInfo,
  parties,
  links,
}) => {
  // Ensure we are on recent view when generating
  set(state => { state.currentView = 'recent'; });
  scrollTo({top: 0, left: 0, behavior: 'smooth'})

  const {mainCategoryKey, legalArea, documentTypeKey, analysisTypeKey, model, temperature, searchJurisprudence} = get()
  const currentDoc = modes[mainCategoryKey]?.areas[legalArea]?.documents?.[documentTypeKey];

  if (!currentDoc) {
    addNotification('Tipo de documento inválido para a área do direito selecionada. Por favor, selecione novamente.', 'error');
    return;
  }

  const analysisMode = analysis[analysisTypeKey];
  const modelKey = model;
  const modelDef = models[modelKey]

  const parts = []
  
  let finalSystemInstruction = currentDoc.systemInstruction;
  let promptForFeed = '';

  if (analysisTypeKey !== 'none' && analysisMode) {
    finalSystemInstruction = analysisMode.systemInstruction
      .replace('{LEGAL_AREA}', modes[mainCategoryKey].areas[legalArea].name)
      .replace('{DOC_TYPE}', currentDoc.name);
    promptForFeed += `[ANÁLISE DE ${analysisMode.name.toUpperCase()}]\n`;
  }
  
  if (searchJurisprudence) {
    finalSystemInstruction += `\n\n**PESQUISA DE JURISPRUDÊNCIA:**\nAdicionalmente, pesquise e inclua jurisprudência relevante e atualizada de tribunais brasileiros (STF, STJ, TJs) que suporte os argumentos apresentados no documento. Cite a fonte de cada julgado (tribunal, número do processo, data de julgamento, e relator).`;
  }

  // Handle caseFiles: Instead of sending binary, send names as text reference
  if (caseFiles && caseFiles.length > 0) {
    const fileNames = caseFiles.map(f => f.name).join(', ');
    parts.push({ text: `DOCUMENTOS ANEXADOS PARA REFERÊNCIA (CONSIDERE SEU CONTEÚDO PARA EMBASAMENTO): ${fileNames}` });
    promptForFeed += `Documentos Anexados: ${fileNames}\n`;
  }

  // Handle Links
  if (links && links.length > 0) {
      const linksText = links.map(l => `${l.title || 'Referência'}: ${l.url}`).join('\n');
      parts.push({ text: `LINKS DE REFERÊNCIA EXTERNA (NOTÍCIAS, VÍDEOS, SITES): \n${linksText}` });
      promptForFeed += `Links de Referência: ${linksText}\n`;
  }

  let textPromptContent = '';
  if (parties && parties.length > 0) {
      textPromptContent += '### PARTES ENVOLVIDAS:\n';
      parties.forEach(party => {
          textPromptContent += `\n**${party.role || '[FUNÇÃO NÃO ESPECIFICADA]'}**\n`;
          if (party.name) textPromptContent += `- Nome: ${party.name}\n`;
          if (party.document) textPromptContent += `- CPF/CNPJ: ${party.document}\n`;
          if (party.address) textPromptContent += `- Endereço: ${party.address}\n`;
          if (party.oab) textPromptContent += `- OAB: ${party.oab}\n`;
      });
  }

  if (caseInfo && caseInfo.trim().length > 0) {
    textPromptContent += `\n\n### DESCRIÇÃO DO CASO:\n${caseInfo}`;
  }

  // If no input provided at all, inject default template request
  if (!textPromptContent && (!caseFiles || caseFiles.length === 0) && (!links || links.length === 0)) {
      textPromptContent = "Gere uma minuta ou modelo padrão completo para este tipo de documento. Como não foram fornecidos detalhes específicos do caso ou das partes, utilize espaços reservados (placeholders) como [NOME DO AUTOR], [DESCRIÇÃO DOS FATOS], etc., para que o usuário possa preencher posteriormente.";
  }

  if (textPromptContent) {
    parts.push({text: textPromptContent.trim()})
    promptForFeed += textPromptContent;
  }

  const { user } = get();
  const newRoundData = {
    prompt: promptForFeed.trim(),
    systemInstruction: finalSystemInstruction,
    mainCategoryKey,
    legalArea,
    documentTypeKey,
    analysisTypeKey,
    model: modelKey,
    temperature: temperature,
    searchJurisprudence: searchJurisprudence,
    userId: user ? user.uid : 'anonymous',
    createdAt: new Date().toISOString(),
    outputs: [newOutput(modelKey)]
  }

  let roundId;
  const path = 'rounds';
  if (user) {
    try {
      const docRef = await addDoc(collection(db, path), newRoundData);
      roundId = docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      roundId = crypto.randomUUID();
    }
  } else {
    roundId = crypto.randomUUID();
  }

  const newRound = { ...newRoundData, id: roundId, promptParts: parts };

  set(state => {
    const exists = state.feed.some(r => r.id === roundId);
    if (!exists) {
      state.feed.unshift(newRound);
    }
  })

  ;(async () => {
    let res
    try {
      res = await llmGen({
        model: modelDef.modelString,
        systemInstruction: newRound.systemInstruction,
        contents: {parts: newRound.promptParts},
        temperature: newRound.temperature,
        searchJurisprudence: newRound.searchJurisprudence,
      })
    } catch (e) {
      console.error(e)
      const updateError = (state) => {
        const round = state.feed.find(round => round.id === roundId)
        if (!round) return
        round.outputs[0] = {
          ...round.outputs[0],
          isBusy: false,
          gotError: true,
          errorMessage: e.message || 'Ocorreu um erro desconhecido na API.',
          totalTime: Date.now() - round.outputs[0].startTime
        }
      }
      set(updateError);
      if (user) {
        const round = get().feed.find(r => r.id === roundId);
        if (round) await updateDoc(doc(db, path, roundId), { outputs: round.outputs });
      }
      return
    }

    if (!res) {
      const updateCancel = (state) => {
        const round = state.feed.find(round => round.id === roundId);
        if (!round) return;
        round.outputs[0] = {
          ...round.outputs[0],
          isBusy: false,
          gotError: true,
          errorMessage: 'A geração foi cancelada ou não retornou dados.',
          totalTime: Date.now() - round.outputs[0].startTime,
        };
      }
      set(updateCancel);
      if (user) {
        const round = get().feed.find(r => r.id === roundId);
        if (round) await updateDoc(doc(db, path, roundId), { outputs: round.outputs });
      }
      return;
    }

    const updateSuccess = (state) => {
      const round = state.feed.find(r => r.id === roundId)
      if (!round) return

      const outputText = res.text || '';
      const groundingChunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const jurisprudence = (groundingChunks
        ?.filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web.title,
          uri: chunk.web.uri,
        }))) || [];

      round.outputs[0] = {
        ...round.outputs[0],
        outputData: outputText,
        jurisprudence,
        isBusy: false,
        totalTime: Date.now() - round.outputs[0].startTime
      }
    }
    set(updateSuccess);
    if (user) {
      const round = get().feed.find(r => r.id === roundId);
      if (round) await updateDoc(doc(db, path, roundId), { outputs: round.outputs });
    }
  })()
}

export const removeRound = async (id) => {
  const { user } = get();
  const path = 'rounds';
  
  set(state => {
    state.feed = state.feed.filter(r => r.id !== id);
  });

  if (user) {
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};

export const addJudgment = async ({ roundId, judgeId }) => {
  const round = get().feed.find(r => r.id === roundId);
  const judge = judges[judgeId];

  if (!round || !judge) {
    console.error('Round or Judge not found for judgment');
    return;
  }

  // Create the new output object for the judgment
  const newJudgmentOutput = {
    ...newOutput(round.model), // reuse newOutput structure
    dataType: 'judgment',
    judgeId: judgeId,
  };

  // Add the new output to the specific round
  set(state => {
    const targetRound = state.feed.find(r => r.id === roundId);
    if (targetRound) {
      targetRound.outputs.push(newJudgmentOutput);
    }
  });

  // Prepare the prompt for the judge
  const generatedDocument = round.outputs.find(o => o.dataType === 'text')?.outputData || '[NENHUM DOCUMENTO GERADO ANTERIORMENTE FOI ENCONTRADO]';
  const fullPromptForJudge = `
    ### CONTEXTO DO CASO FORNECIDO AO ADVOGADO:
    ${round.prompt}

    ### DOCUMENTO GERADO PELO ADVOGADO:
    ${generatedDocument}
  `;

  const judgmentParts = [{ text: fullPromptForJudge }];

  // Call LLM
  ;(async () => {
    let res;
    try {
      res = await llmGen({
        model: models[round.model].modelString,
        systemInstruction: judge.systemInstruction,
        contents: { parts: judgmentParts },
        temperature: 0.3, // Judgments should be less creative
        searchJurisprudence: true, // Judges should use jurisprudence
      });
    } catch (e) {
      console.error(e);
      set(state => {
        const roundToUpdate = state.feed.find(r => r.id === roundId);
        const outputToUpdate = roundToUpdate?.outputs.find(o => o.id === newJudgmentOutput.id);
        if (outputToUpdate) {
          outputToUpdate.isBusy = false;
          outputToUpdate.gotError = true;
          outputToUpdate.errorMessage = e.message || 'Ocorreu um erro desconhecido na API.';
          outputToUpdate.totalTime = Date.now() - outputToUpdate.startTime;
        }
      });
      return;
    }

    if (!res) {
        set(state => {
            const roundToUpdate = state.feed.find(r => r.id === roundId);
            const outputToUpdate = roundToUpdate?.outputs.find(o => o.id === newJudgmentOutput.id);
            if (outputToUpdate) {
                outputToUpdate.isBusy = false;
                outputToUpdate.gotError = true;
                outputToUpdate.errorMessage = 'A geração do julgamento foi cancelada ou não retornou dados.';
                outputToUpdate.totalTime = Date.now() - outputToUpdate.startTime;
            }
        });
        return;
    }

    set(state => {
      const roundToUpdate = state.feed.find(r => r.id === roundId);
      const outputToUpdate = roundToUpdate?.outputs.find(o => o.id === newJudgmentOutput.id);
      if (outputToUpdate) {
        const groundingChunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const jurisprudence = (groundingChunks
          ?.filter(chunk => chunk.web)
          .map(chunk => ({
            title: chunk.web.title,
            uri: chunk.web.uri,
          }))) || [];
        
        outputToUpdate.outputData = res.text || '';
        outputToUpdate.jurisprudence = jurisprudence;
        outputToUpdate.isBusy = false;
        outputToUpdate.totalTime = Date.now() - outputToUpdate.startTime;
      }
    });

    // Persist to Firestore if user is logged in
    const { user } = get();
    if (user) {
      const round = get().feed.find(r => r.id === roundId);
      if (round) {
        try {
          await updateDoc(doc(db, 'rounds', roundId), { outputs: round.outputs });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, 'rounds');
        }
      }
    }
  })();
};

export const submitFeedback = (roundId, outputId, rating, comment) => set(state => {
  const round = state.feed.find(r => r.id === roundId);
  if (round) {
    const output = round.outputs.find(o => o.id === outputId);
    if (output) {
      output.feedback = { rating, comment, submitted: true };
    }
  }
});

export const setMainCategoryAndLegalArea = ({mainCatKey, areaKey}) =>
  set(state => {
    state.mainCategoryKey = mainCatKey;
    state.legalArea = areaKey;
    // When area changes, reset doc type to the first one in the new area
    const firstDocKey = Object.keys(modes[mainCatKey].areas[areaKey].documents)[0];
    state.documentTypeKey = firstDocKey;
  });

export const setDocumentTypeKey = key =>
  set(state => {
    state.documentTypeKey = key;
  });

export const setAnalysisTypeKey = key =>
  set(state => {
    state.analysisTypeKey = key;
  });

export const setModel = model => set(state => {
  state.model = model;
});

export const setSearchJurisprudence = value => set(state => {
    state.searchJurisprudence = value;
});

export const setTemperature = temp => set(state => {
  state.temperature = temp;
});

export const addCaseFile = file =>
  set(state => {
    state.caseFiles.push(file);
  });

export const removeCaseFile = index =>
  set(state => {
    state.caseFiles.splice(index, 1);
  });

export const addLink = () => set(state => {
    state.links.push({ id: crypto.randomUUID(), title: '', url: '' });
});

export const removeLink = id => set(state => {
    state.links = state.links.filter(l => l.id !== id);
});

export const updateLink = (id, field, value) => set(state => {
    const link = state.links.find(l => l.id === id);
    if (link) link[field] = value;
});

export const setCaseInfo = text =>
  set(state => {
    state.caseInfo = text
  })

export const saveDocument = async (docData) => {
  const { user } = get();
  if (!user) {
    addNotification('Você precisa estar logado para salvar documentos.', 'error');
    return;
  }

  const path = 'documents';
  try {
    if (docData.id) {
      const { id, ...data } = docData;
      await updateDoc(doc(db, path, id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      addNotification('Documento atualizado.', 'info');
    } else {
      await addDoc(collection(db, path), {
        ...docData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      addNotification('Documento salvo.', 'info');
    }
  } catch (error) {
    handleFirestoreError(error, docData.id ? OperationType.UPDATE : OperationType.CREATE, path);
  }
};

export const deleteDocument = async (docId) => {
  const path = 'documents';
  try {
    await deleteDoc(doc(db, path, docId));
    addNotification('Documento excluído.', 'info');
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const reset = () => {
  const { mainCategoryKey, legalArea, documentTypeKey } = initialState;
  set(state => {
    state.feed = []
    state.caseFiles = []
    state.caseInfo = ''
    state.parties = []
    state.links = []
    state.analysisTypeKey = 'none'
    // Also reset process search state
    state.processNumberInput = '';
    state.isProcessSearching = false;
    state.processSearchError = null;
    state.processSearchResult = null;
    // Ensure we go back to home view
    state.currentView = 'home';
    // Reset selections to default
    state.mainCategoryKey = mainCategoryKey;
    state.legalArea = legalArea;
    state.documentTypeKey = documentTypeKey;
  })
}

// Party actions
export const addParty = (data = {}) => set(state => {
    state.parties.push({
        id: crypto.randomUUID(),
        role: data.role || '',
        name: data.name || '',
        document: data.document || '',
        address: data.address || '',
        oab: data.oab || ''
    });
});

export const removeParty = id => set(state => {
    state.parties = state.parties.filter(p => p.id !== id);
});

export const updateParty = (id, field, value) => set(state => {
    const party = state.parties.find(p => p.id === id);
    if (party) {
        party[field] = value;
    }
});

// Notification actions
export const addNotification = (message, type = 'error', duration = 5000) => {
  const id = crypto.randomUUID();
  set(state => {
    state.notifications.push({ id, message, type });
  });
  setTimeout(() => removeNotification(id), duration);
};

export const removeNotification = id => set(state => {
  state.notifications = state.notifications.filter(n => n.id !== id);
});


// Process Search actions
export const setProcessNumberInput = input => set(state => {
  state.processNumberInput = input.replace(/[^0-9.-]/g, '');
});

export const setProcessSearchTribunal = tribunal => set(state => {
  state.processSearchTribunal = tribunal;
});

export const searchProcess = async () => {
  const { processNumberInput, processSearchTribunal } = get();
  if (!processNumberInput) {
    set(state => {
      state.processSearchError = 'Por favor, insira um número de processo válido.';
    });
    return;
  }
  set(state => {
    state.isProcessSearching = true;
    state.processSearchError = null;
    state.processSearchResult = null;
  });

  try {
    const data = await consultarProcesso(processNumberInput, processSearchTribunal);
    set(state => {
      state.processSearchResult = data;
    });
  } catch (error) {
    console.error('Falha na busca do processo:', error);
    set(state => {
      state.processSearchError = error.message; 
    });
  } finally {
    set(state => {
      state.isProcessSearching = false;
    });
  }
};

export const clearProcessSearch = () => set(state => {
  state.processNumberInput = '';
  state.isProcessSearching = false;
  state.processSearchError = null;
  state.processSearchResult = null;
});

export const importProcessData = () => {
  const { processSearchResult, parties: existingParties } = get();
  if (!processSearchResult) return;

  const dadosBasicos = processSearchResult.dadosBasicos;
  const movimentos = processSearchResult.movimentos;
  const partesDoProcesso = processSearchResult.partes;

  // Import Parties
  if (partesDoProcesso && Array.isArray(partesDoProcesso) && partesDoProcesso.length > 0) {
    const newParties = partesDoProcesso.map(p => {
      const isPoloAtivo = p?.polo?.toUpperCase() === 'ATIVO';
      let role = isPoloAtivo ? 'Autor(a) / Requerente' : 'Réu / Requerido(a)';

      const isAdvogado = p?.advogado && Array.isArray(p.advogado) && p.advogado.length > 0 && p.advogado.some(adv => adv.numero);
      let oab = '';
      let name = p?.pessoa?.nome;
      
      if (isAdvogado) {
        role = 'Advogado(a)';
        const oabInfo = p.advogado.find(a => a.numero);
        if (oabInfo) {
          oab = `${oabInfo.numero}/${oabInfo.uf}`;
          name = oabInfo.nome;
        }
      }

      return {
        id: crypto.randomUUID(),
        role: role,
        name: name || '[NOME NÃO INFORMADO]',
        document: p?.pessoa?.documento || '',
        address: '', // Datajud doesn't usually provide address
        oab: oab
      };
    });
    
    // Add new parties without duplicating by name
    const currentPartyNames = new Set(existingParties.map(p => p.name));
    const uniqueNewParties = newParties.filter(p => p.name !== '[NOME NÃO INFORMADO]' && !currentPartyNames.has(p.name));
    
    set(state => {
      state.parties.push(...uniqueNewParties);
    });
  }

  // Import Case Info
  let caseInfoText = `\n\n--- DADOS IMPORTADOS DA CONSULTA PROCESSUAL ---\n`;
  if (dadosBasicos) {
      caseInfoText += `Processo: ${dadosBasicos.numero || 'Não informado'}\n`;
      caseInfoText += `Classe: ${dadosBasicos.classe || 'Não informada'}\n`;
      if (dadosBasicos.assunto && Array.isArray(dadosBasicos.assunto) && dadosBasicos.assunto.length > 0) {
        caseInfoText += `Assunto: ${dadosBasicos.assunto.map(a => a.descricao).join(', ')}\n`;
      }
      if (dadosBasicos.dataAjuizamento) {
        caseInfoText += `Data de Ajuizamento: ${new Date(dadosBasicos.dataAjuizamento).toLocaleDateString('pt-BR')}\n`;
      }
  }
  
  if (movimentos && Array.isArray(movimentos) && movimentos.length > 0) {
      caseInfoText += `\nÚLTIMAS MOVIMENTAÇÕES:\n`;
      const latestMovements = movimentos.slice(0, 5); // get latest 5
      latestMovements.forEach(m => {
          if (m?.data && m?.nome) {
            caseInfoText += `- ${new Date(m.data).toLocaleDateString('pt-BR')}: ${m.nome}\n`;
            if(m.complemento) caseInfoText += `  Detalhe: ${m.complemento.substring(0, 100)}...\n`;
          }
      });
  }
  caseInfoText += `----------------------------------------------\n`;
  
  set(state => {
    state.caseInfo = (state.caseInfo ? state.caseInfo + '\n' : '') + caseInfoText;
  });
  
  addNotification('Dados do processo importados com sucesso.', 'info');
};


// CNPJ Verifier actions
export const setCnpjInput = input => set(state => {
  state.cnpjInput = input.replace(/\D/g, '');
});

export const setCnpjQueryType = type => set(state => {
  state.cnpjQueryType = type;
});

export const verifyCnpj = async () => {
  const { cnpjInput, cnpjQueryType } = get();
  if (!cnpjInput || cnpjInput.length !== 14) {
    set(state => {
      state.cnpjError = 'Por favor, insira um CNPJ válido com 14 dígitos.';
    });
    return;
  }
  set(state => {
    state.isCnpjVerifying = true;
    state.cnpjError = null;
    state.cnpjData = null;
  });

  try {
    const data = await consultarCnpj(cnpjInput, cnpjQueryType);
    set(state => {
      state.cnpjData = data;
    });
  } catch (error) {
    console.error('Falha na verificação do CNPJ:', error);
    set(state => {
      state.cnpjError = error.message; 
    });
  } finally {
    set(state => {
      state.isCnpjVerifying = false;
    });
  }
};

export const clearCnpjVerifier = () => set(state => {
  state.cnpjInput = '';
  state.isCnpjVerifying = false;
  state.cnpjError = null;
  state.cnpjData = null;
  state.cnpjQueryType = 'basica';
});

export const appendCnpjDataToCompanyInfo = () => {
  const { cnpjData, caseInfo } = get();
  if (!cnpjData) return;

  const formattedData = `\n\nDADOS DA EMPRESA (CNPJ):\n${JSON.stringify(cnpjData, null, 2)}`;
  set(state => {
    state.caseInfo = (caseInfo ? caseInfo + '\n' : '') + formattedData;
  });
  addNotification('Dados do CNPJ adicionados à descrição do caso.', 'info');
};


export const setUser = user => set(state => {
  state.user = user;
});

export const setAuthReady = ready => set(state => {
  state.isAuthReady = ready;
});

export const setIsAdmin = isAdmin => set(state => {
  state.isAdmin = isAdmin;
});

export const loginWithGoogle = async () => {
  try {
    await signInWithGoogle();
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      addNotification('O login foi cancelado. Por favor, tente novamente.', 'info');
    } else {
      console.error('Erro ao fazer login:', error);
      addNotification('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.', 'error');
    }
  }
};

export const logout = async () => {
  try {
    await firebaseLogout();
    set(state => {
      state.user = null;
      state.isAdmin = false;
    });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    addNotification('Erro ao sair da conta.', 'error');
  }
};

init()