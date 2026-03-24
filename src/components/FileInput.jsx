

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useRef} from 'react';
import { addNotification } from '../lib/actions';

export default function FileInput({ file, onFileChange, label, accept, icon }) {
  const fileInputRef = useRef(null);

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const acceptedTypes = accept.split(',').map(t => t.trim().toLowerCase());
    const fileMimeType = selectedFile.type.toLowerCase();
    const fileExtension = `.${selectedFile.name.split('.').pop().toLowerCase()}`;
    
    const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
            return fileExtension === type;
        }
        if (type.includes('/')) {
            if (type.endsWith('/*')) {
                return fileMimeType.startsWith(type.slice(0, -1));
            }
            return fileMimeType === type;
        }
        return false;
    });

    if (!isAccepted) {
      addNotification(`Tipo de arquivo não suportado. Apenas os seguintes formatos são permitidos: ${accept}`, 'error');
      e.target.value = ''; // Reset the input
      return;
    }

    if (selectedFile.size > 4 * 1024 * 1024) {
      addNotification('O arquivo é muito grande. O limite é de 4MB.', 'error');
      return;
    }
    onFileChange(selectedFile);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onFileChange(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="file-input-wrapper">
      {file ? (
        <div className="file-display">
          <span className="file-name" title={file.name}>{file.name}</span>
          <button
            className="remove-file-button"
            onClick={removeFile}
          >
            <span className="icon">close</span>
          </button>
        </div>
      ) : (
        <button className="iconButton file-upload-button" onClick={() => fileInputRef.current.click()}>
          <span className="icon">{icon}</span>
          <span className="tooltip">{label}</span>
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />
      <div className="label">{label}</div>
    </div>
  );
}