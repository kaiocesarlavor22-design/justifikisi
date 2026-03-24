/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useCallback, useRef, useState, useEffect} from 'react'
import c from 'clsx'
import modes from '../lib/modes'
import models from '../lib/models'
import useStore from '../lib/store'
import {
  addRound,
  setMainCategoryAndLegalArea,
  setDocumentTypeKey,
  setCaseInfo,
  addCaseFile,
  removeCaseFile,
  reset,
  addParty,
  addLink,
  removeLink,
  updateLink,
  addNotification,
  setSearchJurisprudence,
  setTemperature,
  setModel,
  setCurrentView,
  setUser,
  setAuthReady,
  setIsAdmin,
  loginWithGoogle,
  logout,
} from '../lib/actions'
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, orderBy, getDoc, setDoc } from 'firebase/firestore';
import Logo from './Logo';
import FeedItem from './FeedItem'
import Intro from './Intro'
import PartyInput from './PartyInput';
import ToastContainer from './ToastContainer';
import ProcessSearch from './ProcessSearch';
import JustyAssistant from './JustyAssistant';
import OnboardingTour from './OnboardingTour';
import SpeechToTextButton from './SpeechToTextButton';
import WhatsAppChat from './WhatsAppChat';
import ConfirmationDialog from './ConfirmationDialog';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import { FoldersView, TemplatesView } from './DatabaseViews';

const FILES_LIMIT = 10;
const FILES_TOTAL_SIZE_LIMIT_MB = 50;
const FILES_TOTAL_SIZE_LIMIT_BYTES = FILES_TOTAL_SIZE_LIMIT_MB * 1024 * 1024;
const ACCEPTED_TYPES_STRING = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/rtf';
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.rtf'];
const ITEMS_PER_PAGE = 3;


export default function App() {
  const {
    feed,
    mainCategoryKey,
    legalArea,
    documentTypeKey,
    caseFiles,
    caseInfo,
    parties,
    links,
    model,
    searchJurisprudence,
    temperature,
    currentView,
    user,
    isAuthReady,
    isAdmin,
  } = useStore()
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Local state for cascading menu
  const [selectedMainCategory, setSelectedMainCategory] = useState(mainCategoryKey);
  const [selectedArea, setSelectedArea] = useState(legalArea);

  const caseInfoRef = useRef(null)
  const caseFileInputRef = useRef(null)
  const mainRef = useRef(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthReady(true);
      
      if (u) {
        // Create user document if it doesn't exist
        const userRef = doc(db, 'users', u.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              role: 'user',
              createdAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error checking/creating user document:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // User Data Listener (Admin)
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    setIsAdmin(user.email === 'kaiocesarlavor22@gmail.com');
  }, [user]);

  // Folders Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'folders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const folders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), items: [] }));
      useStore.setState(state => { state.folders = folders; });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'folders');
    });
    return () => unsubscribe();
  }, [user]);

  // Rounds (Feed) Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'rounds'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feed = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      useStore.setState(state => { state.feed = feed; });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'rounds');
    });
    return () => unsubscribe();
  }, [user]);
  
  const totalPages = Math.ceil(feed.length / ITEMS_PER_PAGE);
  const paginatedFeed = feed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if(mainRef.current) {
        window.scrollTo({ top: mainRef.current.offsetTop - 70, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    const newTotalPages = Math.ceil(feed.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  }, [feed.length, currentPage]);

  const doGenerate = useCallback(() => {
    setCurrentPage(1);
    addRound({caseFiles, caseInfo, parties, links});
  }, [caseFiles, caseInfo, parties, links]);

  const canGenerate = useCallback(() => {
    return true;
  }, []);
  
  const handleGenerateClick = () => {
    if (canGenerate()) {
        setShowConfirmDialog(true);
    }
  };
  
  const handleConfirmGenerate = () => {
      setShowConfirmDialog(false);
      addNotification('Seu documento está sendo gerado! Acompanhe o resultado em Meus Documentos.', 'info');
      doGenerate();
      setCurrentView('recent');
  };
  
  const handleGenerateFromAssistant = useCallback(() => {
      if (canGenerate()) {
          setShowConfirmDialog(true);
      }
  }, [canGenerate]);
  
  // Listen for custom nav events from components
  useEffect(() => {
    const handleNav = (e) => {
      if (e.detail) setCurrentView(e.detail);
    };
    window.addEventListener('nav', handleNav);
    return () => window.removeEventListener('nav', handleNav);
  }, []);

  const handleNavClick = (viewName) => {
      if (viewName === 'home') {
          reset();
      } else {
          setCurrentView(viewName);
      }
  };


  const handleCaseFileChange = e => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    if (caseFiles.length + newFiles.length > FILES_LIMIT) {
      addNotification(`Você pode anexar no máximo ${FILES_LIMIT} arquivos. Você já tem ${caseFiles.length} e está tentando adicionar ${newFiles.length}.`, 'error');
      e.target.value = '';
      return;
    }

    const validatedFiles = [];
    let newFilesTotalSize = 0;

    for (const file of newFiles) {
      const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
      if (!ACCEPTED_EXTENSIONS.includes(fileExtension)) {
        addNotification(`Tipo de arquivo não suportado (${file.name}). Apenas: ${ACCEPTED_EXTENSIONS.join(', ')}`, 'error');
        e.target.value = '';
        return;
      }
      validatedFiles.push(file);
      newFilesTotalSize += file.size;
    }
    
    const currentTotalSize = caseFiles.reduce((acc, f) => acc + f.size, 0);
    if (currentTotalSize + newFilesTotalSize > FILES_TOTAL_SIZE_LIMIT_BYTES) {
      addNotification(`Tamanho total dos anexos excederia o limite de ${FILES_TOTAL_SIZE_LIMIT_MB}MB.`, 'error');
      e.target.value = '';
      return;
    }

    validatedFiles.forEach(file => addCaseFile(file));
    e.target.value = '';
  };

  const onModifyPrompt = useCallback(() => {
    addNotification(
      'Para modificar uma geração, altere os anexos e a descrição do caso e gere um novo documento.',
      'info'
    )
  }, [])
  
  const renderMainContent = () => {
      if (currentView === 'landing') return <LandingPage />;

      if (currentView === 'recent') {
        return (
          <div className="recent-documents-view animate-in" style={{padding: '2rem'}}>
            <div className="database-header" style={{marginBottom: '2rem'}}>
              <h2><span className="icon">history</span> Meus Documentos</h2>
              <p className="text-muted">Seus documentos gerados pela IA.</p>
            </div>
            {feed.length === 0 ? (
              <div className="empty-state-message">
                <p>Você ainda não gerou nenhum documento.</p>
                <button className="button primary" onClick={() => setCurrentView('home')}>
                  Começar Agora
                </button>
              </div>
            ) : (
              <>
                <ul className="feed">
                    {paginatedFeed.map(round => (
                    <FeedItem
                        key={round.id}
                        round={round}
                        onModifyPrompt={onModifyPrompt}
                    />
                    ))}
                </ul>
                {totalPages > 1 && (
                    <div className="pagination-controls" style={{marginTop: '2rem'}}>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            <span className="icon">chevron_left</span> Anterior
                        </button>
                        <span className="page-info">Página {currentPage} de {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Próxima <span className="icon">chevron_right</span>
                        </button>
                    </div>
                )}
              </>
            )}
          </div>
        );
      }
      if (currentView === 'folders') return <FoldersView />;
      if (currentView === 'templates') return <TemplatesView />;
      if (currentView === 'dashboard') return <Dashboard feed={feed} onViewItem={(id) => setCurrentView('recent')} />;

      if (currentView === 'settings') {
        return (
          <div className="settings-view animate-in" style={{padding: '2rem'}}>
            <div className="database-header" style={{marginBottom: '2rem'}}>
              <h2><span className="icon">settings</span> Configurações</h2>
              <p className="text-muted">Personalize sua experiência no JUSTIFIKISI.</p>
            </div>
            
            <div className="settings-card" style={{background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-primary)'}}>
              <h3>Tour de Boas-vindas</h3>
              <p style={{marginBottom: '1.5rem'}}>Deseja ver o guia interativo novamente?</p>
              <button className="button primary" onClick={() => {
                localStorage.removeItem('hasSeenTour');
                window.location.reload();
              }}>
                Reiniciar Tour
              </button>
            </div>
          </div>
        );
      }
      
      return (
        <div className="maximalist-layout animate-in">
            <div className="maximalist-step" id="tour-step-1">
                <div className="step-header">
                    <span className="step-number">01</span>
                    <h2 className="step-title">Categoria Principal</h2>
                </div>
                <div className="chips giant-chips">
                    {Object.entries(modes).map(([mainCatKey, mainCatData]) => (
                        <button key={mainCatKey} className={c('chip', { active: selectedMainCategory === mainCatKey })}
                            onClick={() => {
                                setSelectedMainCategory(mainCatKey);
                                const firstAreaKey = Object.keys(mainCatData.areas)[0];
                                setSelectedArea(firstAreaKey);
                                setMainCategoryAndLegalArea({ mainCatKey, areaKey: firstAreaKey });
                            }}>
                            {mainCatData.name}
                        </button>
                    ))}
                </div>
            </div>

            {selectedMainCategory && modes[selectedMainCategory] && (
                <div className="maximalist-step animate-in">
                    <div className="step-header">
                        <span className="step-number">02</span>
                        <h2 className="step-title">Área do Direito</h2>
                    </div>
                    <div className="chips giant-chips">
                        {Object.entries(modes[selectedMainCategory].areas).map(([areaKey, areaData]) => (
                            <button key={areaKey} className={c('chip', { active: selectedArea === areaKey })}
                                onClick={() => {
                                    setSelectedArea(areaKey);
                                    setMainCategoryAndLegalArea({ mainCatKey: selectedMainCategory, areaKey });
                                }}>
                                <span className="emoji">{areaData.emoji}</span> {areaData.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedMainCategory && selectedArea && modes[selectedMainCategory]?.areas[selectedArea] && (
                <div className="maximalist-step animate-in">
                    <div className="step-header">
                        <span className="step-number">03</span>
                        <h2 className="step-title">Tipo de Documento</h2>
                    </div>
                    <div className="chips giant-chips">
                        {Object.entries(modes[selectedMainCategory].areas[selectedArea].documents).map(([docKey, docData]) => (
                            <button key={docKey} className={c('chip', { active: documentTypeKey === docKey })}
                                onClick={() => setDocumentTypeKey(docKey)}>
                                <span className="emoji">{docData.emoji}</span> {docData.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedMainCategory && selectedArea && documentTypeKey && (
                <>
                    <div className="maximalist-step animate-in">
                        <div className="step-header">
                            <span className="step-number">04</span>
                            <h2 className="step-title">Modelo de IA</h2>
                        </div>
                <div className="chips">
                     {Object.entries(models).map(([key, modelDef]) => (
                        <button key={key} className={c('chip', { active: key === model })} onClick={() => setModel(key)}>
                           {modelDef.version} {modelDef.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="maximalist-step animate-in" id="tour-step-5">
                <div className="step-header">
                    <span className="step-number">05</span>
                    <h2 className="step-title">Descrição do Caso</h2>
                </div>
                <JustyAssistant onGenerate={handleGenerateFromAssistant} />
                <div className="textarea-with-speech" style={{marginTop: '1.5rem'}}>
                  <textarea
                    ref={caseInfoRef}
                    className="promptInput"
                    placeholder="Descreva os fatos, objetivos e valores..."
                    value={caseInfo}
                    onChange={e => setCaseInfo(e.target.value)}
                    rows={8}
                    style={{fontSize: '1.1rem', padding: '1.5rem'}}
                  />
                  <SpeechToTextButton onUpdate={setCaseInfo} currentText={caseInfo} />
                </div>
                <div className="ai-suggestions" style={{marginTop: '1rem'}}>
                  <button className="button minor small">✨ Sugerir Cláusula IA</button>
                </div>
            </div>

            <div className="maximalist-step animate-in">
                <div className="step-header">
                    <span className="step-number">06</span>
                    <h2 className="step-title" style={{flexGrow: 1}}>Partes Envolvidas</h2>
                    <button className="button minor" onClick={addParty}>
                        <span className="icon">add</span> Adicionar Parte
                    </button>
                </div>
                <div className="parties-list-compact" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    {parties.map(party => (
                      <PartyInput key={party.id} party={party} />
                    ))}
                    {parties.length === 0 && <p className="empty-text" style={{fontSize: '1.1rem'}}>Nenhuma parte adicionada. Adicione as partes para personalizar o documento.</p>}
                </div>
            </div>

            <div className="maximalist-step animate-in">
                <div className="step-header">
                    <span className="step-number">07</span>
                    <h2 className="step-title" style={{flexGrow: 1}}>Anexos & Links</h2>
                    <div className="flex gap-2">
                        <button className="button minor" onClick={() => caseFileInputRef.current.click()}>
                            <span className="icon">attach_file</span> Anexar Arquivo
                        </button>
                        <button className="button minor" onClick={addLink}>
                            <span className="icon">link</span> Adicionar Link
                        </button>
                    </div>
                </div>
                <div className="attachments-grid" style={{marginTop: '1rem'}}>
                    {caseFiles.map((file, index) => (
                        <div key={file.name + index} className="file-chip" style={{padding: '0.75rem 1rem', fontSize: '1rem'}}>
                            <span className="file-name">{file.name}</span>
                            <button onClick={() => removeCaseFile(index)}><span className="icon">close</span></button>
                        </div>
                    ))}
                    {links.map(link => (
                        <div key={link.id} className="file-chip link" style={{padding: '0.75rem 1rem', fontSize: '1rem'}}>
                            <span className="file-name">{link.title || 'Link'}</span>
                            <button onClick={() => removeLink(link.id)}><span className="icon">close</span></button>
                        </div>
                    ))}
                    {caseFiles.length === 0 && links.length === 0 && <p className="empty-text" style={{fontSize: '1.1rem'}}>Nenhum anexo ou link adicionado.</p>}
                </div>
                <input
                    type="file"
                    ref={caseFileInputRef}
                    onChange={handleCaseFileChange}
                    accept={ACCEPTED_TYPES_STRING}
                    style={{ display: 'none' }}
                    multiple
                />
            </div>

            <div className="maximalist-step highlight-step animate-in" id="tour-step-8">
                <div className="step-header">
                    <span className="step-number">08</span>
                    <h2 className="step-title">Geração</h2>
                </div>
                <div className="generation-controls-vertical" style={{gap: '2rem'}}>
                    <div className="control-row" style={{justifyContent: 'flex-start', gap: '2rem'}}>
                        <label style={{fontSize: '1.2rem', fontWeight: '500'}}>Jurisprudência</label>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={searchJurisprudence}
                                onChange={(e) => setSearchJurisprudence(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="control-row" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '1rem'}}>
                        <label style={{fontSize: '1.2rem', fontWeight: '500'}}>Criatividade ({temperature.toFixed(1)})</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            style={{width: '100%', maxWidth: '400px'}}
                        />
                    </div>
                    <button id="tour-generate-btn" className="btn-generate-massive" onClick={handleGenerateClick} style={{marginTop: '1rem', width: '100%', padding: '2rem', fontSize: '1.5rem', alignSelf: 'center'}}>
                        <span className="icon filled">auto_awesome</span> Gerar Documento
                    </button>
                </div>
            </div>
            </>
            )}
        </div>
      );
  };

  if (currentView === 'landing') {
    return (
      <div className="app-container">
        <ToastContainer />
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="app-container">
      <ToastContainer />
      <OnboardingTour currentView={currentView} />
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmGenerate}
        title="Confirmar Geração de Documento"
      >
        <p>Você está prestes a gerar um documento com as informações fornecidas. Deseja continuar?</p>
        {(caseFiles.length === 0 && !caseInfo && parties.length === 0 && links.length === 0) && (
           <p style={{color: 'var(--primary)', marginTop: '0.5rem'}}><strong>Nota:</strong> Como nenhum detalhe foi fornecido, será gerado um <strong>modelo padrão</strong> com lacunas para preenchimento.</p>
        )}
        <p>Esta ação irá consumir créditos de IA e pode levar alguns segundos.</p>
      </ConfirmationDialog>
      
      <header className="global-header">
        <div className="header-brand" onClick={() => handleNavClick('landing')} style={{cursor: 'pointer'}}>
          <h1>
            <Logo />
            JUSTIFIKISI
          </h1>
        </div>
        
        <div className="header-actions">
           <button className="button minor small" onClick={() => {
             localStorage.removeItem('hasSeenTour');
             window.location.reload();
           }} style={{marginRight: '1rem'}}>
             <span className="icon">explore</span> Tour
           </button>
           <button className="iconButton">
            <span className="icon">notifications</span>
            <span className="tooltip">Notificações</span>
          </button>
           <WhatsAppChat />
           {user ? (
             <div className="user-profile-header">
               <img src={user.photoURL} alt={user.displayName} className="user-avatar-small" referrerPolicy="no-referrer" />
               <div className="user-info-mini">
                 <span className="user-name-mini">{user.displayName}</span>
               </div>
               <button className="iconButton" onClick={logout}>
                 <span className="icon">logout</span>
                 <span className="tooltip">Sair</span>
               </button>
             </div>
           ) : (
             <button className="button minor small" onClick={loginWithGoogle}>
               <span className="icon">login</span> Entrar
             </button>
           )}
        </div>
      </header>

      <div className={c("main-layout animate-in", {"hide-sidebars": currentView === 'home_new'})}>
        {currentView !== 'home_new' && (
          <aside className="sidebar" id="tour-sidebar">
            <button id="tour-dashboard" className={c("sidebar-btn", {active: currentView === 'dashboard'})} onClick={() => handleNavClick('dashboard')}>
                <span className="icon">dashboard</span> Dashboard
            </button>
            <button id="tour-new-doc" className={c("sidebar-btn", {active: currentView === 'home' || currentView === 'home_new'})} onClick={() => handleNavClick('home')}>
                <span className="icon">add_circle</span> Novo Documento
            </button>
            <button id="tour-templates" className={c("sidebar-btn", {active: currentView === 'templates'})} onClick={() => handleNavClick('templates')}>
                <span className="icon">lightbulb</span> Meus Modelos
            </button>
            <button id="tour-my-docs" className={c("sidebar-btn", {active: currentView === 'recent'})} onClick={() => handleNavClick('recent')}>
                <span className="icon">folder</span> Meus Documentos
            </button>
            <button id="tour-settings" className={c("sidebar-btn", {active: currentView === 'settings'})} onClick={() => handleNavClick('settings')}>
                <span className="icon">settings</span> Configurações de IA
            </button>
          </aside>
        )}

        <main className="command-center" ref={mainRef}>
          {currentView === 'home' && (
            <>
              <div className="command-center-header">
                <h2>The Command Center</h2>
                <p>Selecione a área do direito para iniciar a geração do documento.</p>
              </div>
              <div className="areas-grid" id="tour-areas-grid">
                {Object.entries(modes).map(([mainCatKey, mainCatData]) => (
                  <div key={mainCatKey} className="area-card" id={`tour-area-${mainCatKey}`} onClick={() => {
                      setSelectedMainCategory(mainCatKey);
                      const firstAreaKey = Object.keys(mainCatData.areas)[0];
                      setSelectedArea(firstAreaKey);
                      setMainCategoryAndLegalArea({ mainCatKey, areaKey: firstAreaKey });
                      handleNavClick('home_new');
                  }}>
                    <div className="area-icon">{mainCatData.emoji || '⚖️'}</div>
                    <div className="area-title">{mainCatData.name}</div>
                    <div className="area-desc">{mainCatData.description || 'Gere documentos para esta área do direito de forma rápida e precisa.'}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {currentView !== 'home' && renderMainContent()}
        </main>

        {currentView !== 'home_new' && (
          <aside className="right-panel">
            <div className="recent-docs-header">Documentos Recentes</div>
            <div className="recent-docs-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {feed.slice(0, 5).map(round => (
                <div key={round.id} className="recent-doc-item" onClick={() => {
                  handleNavClick('recent');
                }}>
                  <div className="recent-doc-title">{round.prompt || 'Documento Gerado'}</div>
                  <div className="recent-doc-meta">
                    <span className="date">{new Date(round.createdAt).toLocaleDateString()}</span>
                    <span className="status-badge completed">Concluído</span>
                  </div>
                </div>
              ))}
              {feed.length === 0 && <p className="empty-text">Nenhum documento recente.</p>}
            </div>
            
            <div className="generate-btn-container">
              <button className="btn-generate-massive" onClick={() => handleNavClick('home_new')}>
                <span className="icon filled">auto_awesome</span> Gerar
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}