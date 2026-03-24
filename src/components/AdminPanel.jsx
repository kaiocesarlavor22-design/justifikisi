import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [docToDelete, setDocToDelete] = useState(null);

  useEffect(() => {
    const usersPath = 'users';
    const qUsers = query(collection(db, usersPath));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, usersPath);
    });

    const docsPath = 'documents';
    const qDocs = query(collection(db, docsPath));
    const unsubscribeDocs = onSnapshot(qDocs, (snapshot) => {
      setDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, docsPath);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeDocs();
    };
  }, []);

  const handleDeleteDoc = async (id) => {
    const path = `documents/${id}`;
    try {
      await deleteDoc(doc(db, 'documents', id));
      setDocToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const toggleAdmin = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const path = `users/${user.id}`;
    try {
      await updateDoc(doc(db, 'users', user.id), { role: newRole });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando painel...</div>;

  return (
    <div className="admin-panel panel">
      <div className="admin-header">
        <h2 className="panel-title">Painel do Administrador</h2>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Usuários ({users.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            Documentos ({documents.length})
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'users' ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Plano</th>
                  <th>Cargo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.displayName || 'Sem nome'}</td>
                    <td>{u.email}</td>
                    <td>
                      <select 
                        className="plan-select" 
                        value={u.plan || 'none'} 
                        onChange={async (e) => {
                          const newPlan = e.target.value;
                          const path = `users/${u.id}`;
                          try {
                            await updateDoc(doc(db, 'users', u.id), { plan: newPlan });
                          } catch (error) {
                            handleFirestoreError(error, OperationType.UPDATE, path);
                          }
                        }}
                      >
                        <option value="none">Nenhum</option>
                        <option value="basic">Standard</option>
                        <option value="pro">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${u.role}`}>
                        {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>
                    <td>
                      <button className="button minor small" onClick={() => toggleAdmin(u)}>
                        {u.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>ID do Usuário</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(d => (
                  <tr key={d.id}>
                    <td>{d.title}</td>
                    <td>{d.userId}</td>
                    <td>{new Date(d.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <button className="button danger small" onClick={() => setDocToDelete(d)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {docToDelete && (
        <div className="whatsapp-dialog-overlay" onClick={() => setDocToDelete(null)}>
          <div className="whatsapp-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="whatsapp-dialog-header">
              <h3>Excluir Documento</h3>
              <button className="iconButton" onClick={() => setDocToDelete(null)}>
                <span className="icon">close</span>
              </button>
            </div>
            <div className="confirmation-dialog-content">
              <p>Tem certeza que deseja excluir o documento <strong>{docToDelete.title}</strong>?</p>
            </div>
            <div className="confirmation-dialog-actions">
              <button className="button minor" onClick={() => setDocToDelete(null)}>Cancelar</button>
              <button className="button primary" onClick={() => handleDeleteDoc(docToDelete.id)}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-panel {
          margin-top: 2rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-primary);
        }
        .admin-tabs {
          display: flex;
          gap: 1rem;
        }
        .tab-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border-primary);
          background: var(--bg-tertiary);
          cursor: pointer;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .tab-btn.active {
          background: var(--primary);
          color: black;
          border-color: var(--primary);
        }
        .admin-table-wrapper {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th, .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-primary);
        }
        .admin-table th {
          background: var(--bg-tertiary);
          font-weight: 600;
          color: var(--primary);
        }
        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge.admin {
          background: rgba(255, 255, 255, 0.2);
          color: var(--primary);
        }
        .badge.user {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .plan-select {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid var(--border-primary);
          font-size: 0.875rem;
          background: var(--bg-tertiary);
          color: white;
        }
        .button.danger {
          background: rgba(255, 0, 0, 0.2);
          color: #ff4444;
          border: 1px solid rgba(255, 0, 0, 0.3);
        }
        .button.danger:hover {
          background: rgba(255, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
}
