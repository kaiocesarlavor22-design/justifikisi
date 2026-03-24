import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import useStore from '../lib/store';
import { addNotification, saveDocument } from '../lib/actions';

export default function RichTextEditor() {
  const { user } = useStore();
  const [title, setTitle] = useState('Documento sem título');
  const [currentDocId, setCurrentDocId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
          ],
        },
        placeholder: "Comece a escrever seu documento jurídico aqui..."
      });

      quillRef.current.on('text-change', () => {
        // We don't necessarily need to sync to state on every stroke if we use quillRef.current.root.innerHTML on save
      });
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setDocuments([]);
      return;
    }

    const path = 'documents';
    const q = query(collection(db, path), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      addNotification('Por favor, faça login para salvar seus documentos.', 'error');
      return;
    }

    const content = quillRef.current.root.innerHTML;
    setIsSaving(true);
    try {
      await saveDocument({
        id: currentDocId,
        title,
        content,
      });
      // If it was a new doc, we'd need the ID back. 
      // For simplicity, let's assume the listener in useEffect will update the documents list.
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNew = () => {
    setCurrentDocId(null);
    setTitle('Documento sem título');
    quillRef.current.root.innerHTML = '';
  };

  const loadDocument = (doc) => {
    setCurrentDocId(doc.id);
    setTitle(doc.title);
    quillRef.current.root.innerHTML = doc.content;
  };

  return (
    <div className="rich-text-editor-container panel">
      <div className="editor-header">
        <input
          type="text"
          className="document-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título do Documento"
        />
        <div className="editor-actions">
          <button className="button minor" onClick={handleNew}>
            <span className="icon">add</span> Novo
          </button>
          <button className="button primary" onClick={handleSave} disabled={isSaving}>
            <span className="icon">save</span> {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="editor-main">
        <div className="quill-wrapper">
          <div ref={editorRef} />
        </div>

        {user && documents.length > 0 && (
          <div className="documents-sidebar">
            <h4 className="panel-title">Meus Documentos</h4>
            <ul className="doc-list">
              {documents.map(doc => (
                <li key={doc.id} className={currentDocId === doc.id ? 'active' : ''} onClick={() => loadDocument(doc)}>
                  <span className="icon">description</span>
                  <span className="doc-title">{doc.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
