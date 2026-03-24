/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useState} from 'react'
import c from 'clsx'
import {addRound, removeRound} from '../lib/actions'
import modes from '../lib/modes'
import models from '../lib/models'
import analysis from '../lib/analysis'
import useStore from '../lib/store'
import ModelOutput from './ModelOutput'
import JudgePanel from './JudgePanel';

export default function FeedItem({round, onModifyPrompt}) {
  const [showSystemInstruction, setShowSystemInstruction] = useState(false)
  const [showJudgePanel, setShowJudgePanel] = useState(false);
  const { mainCategoryKey, legalArea, documentTypeKey, systemInstruction, analysisTypeKey, searchJurisprudence, temperature, model, links } = round;
  
  const currentArea = modes[mainCategoryKey]?.areas?.[legalArea];
  const currentDoc = currentArea?.documents?.[documentTypeKey];
  const currentAnalysis = analysisTypeKey && analysisTypeKey !== 'none' && analysis[analysisTypeKey];

  if (!currentDoc) {
    return (
      <li key={round.id} id={round.id} className="feed-item-error">
        <div className="error-message">
          <p>
            <span className="icon filled">error</span>
            <span>
              Erro ao carregar este item. O tipo de documento ou área do direito pode não ser mais válido.
            </span>
          </p>
        </div>
      </li>
    );
  }


  const rerun = () => {
    addRound({
      caseFiles: round.files?.caseFiles,
      caseInfo: round.caseInfo,
      parties: round.parties,
      links: round.links,
    })
  }

  return (
    <li key={round.id} id={round.id} className="feed-item">
      <div className={c('header', {anchorTop: showSystemInstruction})}>
        <div className="prompt-display">
            <div className="prompt-header-chips">
              <div className="chip">
                <span className="emoji">{currentDoc.emoji}</span> {currentDoc.name}
              </div>
              <div className="chip">
                <span className="icon" style={{fontSize: '1rem'}}>psychology</span> {models[model]?.shortName || model}
              </div>
               {temperature !== undefined && (
                <div className="chip">
                  <span className="icon" style={{fontSize: '1rem'}}>thermostat</span> {temperature.toFixed(1)}
                </div>
              )}
              {currentAnalysis && (
                <div className="chip primary">
                  <span className="emoji">{currentAnalysis.emoji}</span> {currentAnalysis.name}
                </div>
              )}
              {searchJurisprudence && (
                <div className="chip primary">
                  <span className="icon" style={{fontSize: '1rem'}}>gavel</span> Com Jurisprudência
                </div>
              )}
              {links && links.length > 0 && (
                <div className="chip">
                   <span className="icon" style={{fontSize: '1rem'}}>link</span> {links.length} Links
                </div>
              )}
            </div>
            {showSystemInstruction && systemInstruction && (
              <div className="systemInstruction-container">
                <span className="label">Instrução do Sistema:</span>
                <p className="systemInstruction">{systemInstruction}</p>
              </div>
            )}
            <div className="prompt-content">
               <span className="label">Descrição do Caso:</span>
               <pre className="prompt-text">{round.prompt}</pre>
            </div>
        </div>
        <div className="actions">
          {systemInstruction && (
              <button
                className="iconButton"
                onClick={() => setShowSystemInstruction(!showSystemInstruction)}
              >
                <span className="icon">assignment</span>
                <span className="tooltip">
                  {showSystemInstruction ? 'Esconder' : 'Mostrar'} instrução do sistema
                </span>
              </button>
          )}

          <button className="iconButton" onClick={() => setShowJudgePanel(!showJudgePanel)}>
            <span className="icon">gavel</span>
            <span className="tooltip">{showJudgePanel ? 'Fechar Painel' : 'Julgar Caso'}</span>
          </button>

          <button className="iconButton" onClick={() => removeRound(round.id)}>
            <span className="icon">delete</span>
            <span className="tooltip">Remover</span>
          </button>

          <button
            className="iconButton"
            onClick={() => onModifyPrompt(round)}
          >
            <span className="icon">edit</span>
            <span className="tooltip">Modificar entradas</span>
          </button>

          <button className="iconButton" onClick={rerun}>
            <span className="icon">refresh</span>
            <span className="tooltip">Gerar novamente</span>
          </button>
        </div>
      </div>

      {showJudgePanel && <JudgePanel round={round} />}

      <ul className="outputs">
        {round.outputs.map(output => (
          <li key={output.id}>
            <ModelOutput 
                {...output} 
                roundId={round.id} 
                documentName={currentDoc.name} 
                temperature={round.temperature} 
                userLinks={links} 
            />
          </li>
        ))}
      </ul>
    </li>
  )
}