/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import useStore from '../lib/store';
import { createFolder, deleteFolder, applyTemplate, setCurrentView, deleteDocument } from '../lib/actions';
import modes from '../lib/modes';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

// -- Mock Data for Suggested Templates --
const SUGGESTED_TEMPLATES = [
  {
    id: 't1',
    title: 'Divórcio Consensual',
    description: 'Minuta completa com partilha de bens e guarda.',
    emoji: '🤝',
    legalArea: 'direitoFamilia',
    documentTypeKey: 'divorcioConsensualJudicial',
    caseInfo: 'As partes, casadas sob o regime de [REGIME DE BENS], decidiram dissolver o matrimônio consensualmente. O casal possui [NÚMERO] filhos menores. Acordam que a guarda será [TIPO DE GUARDA] e a visitação ocorrerá de forma [FORMA]. Quanto aos bens, decidem partilhar da seguinte forma: [DESCREVER PARTILHA].'
  },
  {
    id: 't2',
    title: 'Habeas Corpus Urgente',
    description: 'Pedido de liberdade para prisão ilegal ou excesso de prazo.',
    emoji: '🗽',
    legalArea: 'direitoPenal',
    documentTypeKey: 'habeasCorpus',
    caseInfo: 'O paciente foi preso em flagrante no dia [DATA] pela suposta prática do crime de [CRIME]. A prisão foi convertida em preventiva sem fundamentação idônea. O paciente é primário, possui bons antecedentes, residência fixa e trabalho lícito. Requer-se a revogação da prisão ou aplicação de medidas cautelares.'
  },
  {
    id: 't3',
    title: 'Contrato de Locação',
    description: 'Residencial ou comercial com garantias.',
    emoji: '🏘️',
    legalArea: 'direitoImobiliario',
    documentTypeKey: 'contratoBuiltToSuit', 
    caseInfo: 'Locação de imóvel situado à [ENDEREÇO], pelo prazo de [PRAZO] meses. O valor do aluguel é R$ [VALOR], com reajuste anual pelo [ÍNDICE]. A garantia locatícia escolhida é [GARANTIA].'
  },
  {
    id: 't4',
    title: 'Petição Trabalhista (Vínculo)',
    description: 'Reconhecimento de vínculo e verbas rescisórias.',
    emoji: '👷',
    legalArea: 'direitoTrabalho',
    documentTypeKey: 'reclamacaoTrabalhistaVinculo',
    caseInfo: 'O reclamante trabalhou para a reclamada de [DATA INÍCIO] a [DATA FIM], na função de [FUNÇÃO], recebendo R$ [SALÁRIO]. Não teve a CTPS assinada. Foi demitido sem justa causa e não recebeu as verbas rescisórias. Requer o reconhecimento do vínculo e o pagamento de todas as verbas.'
  },
  {
    id: 't5',
    title: 'Defesa do Consumidor',
    description: 'Ação por vício do produto não sanado.',
    emoji: '🛍️',
    legalArea: 'direitoConsumidor',
    documentTypeKey: 'acaoIndenizacaoVicioProduto',
    caseInfo: 'O autor adquiriu o produto [PRODUTO] em [DATA], que apresentou defeito. O produto foi enviado para a assistência técnica em [DATA], mas o vício não foi sanado no prazo de 30 dias. Requer a restituição do valor pago corrigido.'
  }
];

export function FoldersView() {
  const { folders } = useStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName);
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="database-view-container">
      <div className="database-header">
        <h2><span className="icon">folder</span> Minhas Pastas (Database)</h2>
        <button className="button primary" onClick={() => setIsCreating(!isCreating)}>
          <span className="icon">create_new_folder</span> Nova Pasta
        </button>
      </div>

      {isCreating && (
        <form className="new-folder-form" onSubmit={handleCreate}>
          <input 
            type="text" 
            placeholder="Nome da nova pasta..." 
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="button minor">Criar</button>
        </form>
      )}

      <div className="folders-grid">
        {folders.map(folder => (
          <div key={folder.id} className="folder-card group">
            <div className="folder-icon">
              <span className="icon filled">folder</span>
            </div>
            <div className="folder-info">
              <h3>{folder.name}</h3>
              <p>{folder.items?.length || 0} documentos</p>
            </div>
            <button 
              className="delete-folder-btn opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setFolderToDelete(folder);
              }}
            >
              <span className="icon">delete</span>
            </button>
          </div>
        ))}
        {folders.length === 0 && (
            <div className="empty-state-message">
                <p>Nenhuma pasta criada.</p>
            </div>
        )}
      </div>

      {folderToDelete && (
        <div className="whatsapp-dialog-overlay" onClick={() => setFolderToDelete(null)}>
          <div className="whatsapp-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="whatsapp-dialog-header">
              <h3>Excluir Pasta</h3>
              <button className="iconButton" onClick={() => setFolderToDelete(null)}>
                <span className="icon">close</span>
              </button>
            </div>
            <div className="confirmation-dialog-content">
              <p>Deseja realmente excluir a pasta <strong>{folderToDelete.name}</strong>?</p>
            </div>
            <div className="confirmation-dialog-actions">
              <button className="button minor" onClick={() => setFolderToDelete(null)}>Cancelar</button>
              <button className="button primary" onClick={() => {
                deleteFolder(folderToDelete.id);
                setFolderToDelete(null);
              }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TemplatesView() {
  return (
    <div className="database-view-container">
      <div className="database-header">
        <h2><span className="icon">lightbulb</span> Databases Sugeridas</h2>
        <p>Modelos prontos e populares para iniciar seu trabalho rapidamente.</p>
      </div>

      <div className="templates-grid">
        {SUGGESTED_TEMPLATES.map(template => (
          <div key={template.id} className="template-card" onClick={() => applyTemplate(template)}>
            <div className="template-icon">{template.emoji}</div>
            <div className="template-content">
              <h3>{template.title}</h3>
              <p>{template.description}</p>
              <span className="template-tag">
                {modes[template.mainCategoryKey || 'juridico']?.areas?.[template.legalArea]?.name || 'Geral'}
              </span>
            </div>
            <div className="template-action">
              <span className="icon">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


