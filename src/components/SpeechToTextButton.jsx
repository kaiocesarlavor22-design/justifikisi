/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useRef, useCallback } from 'react';
import c from 'clsx';
import { GoogleGenAI } from '@google/genai';
import { addNotification } from '../lib/actions';

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            // result is "data:audio/webm;codecs=opus;base64,GkX..."
            // we only want the part after the comma
            resolve(reader.result.split(',')[1]);
        };
        reader.onerror = reject;
    });
};

export default function SpeechToTextButton({ onUpdate, currentText }) {
    const [status, setStatus] = useState('idle'); // idle, recording, transcribing, error
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleTranscription = async () => {
        if (audioChunksRef.current.length === 0) return;
        setStatus('transcribing');
        try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const base64Audio = await blobToBase64(audioBlob);

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

            const audioPart = {
                inlineData: {
                    mimeType: audioBlob.type,
                    data: base64Audio,
                },
            };
            const textPart = {
                text: 'Transcreva este áudio para texto. Responda apenas com a transcrição.'
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [audioPart, textPart] },
            });
            
            const transcription = response.text;

            if (transcription) {
                 const separator = currentText.trim().length > 0 ? ' ' : '';
                 onUpdate(currentText.trim() + separator + transcription);
            } else {
                 addNotification('A transcrição não retornou texto.', 'info');
            }

        } catch (error) {
            console.error('Transcription error:', error);
            addNotification(`Erro na transcrição: ${error.message}`, 'error');
            setStatus('error');
        } finally {
            audioChunksRef.current = [];
            setStatus('idle');
        }
    };
    
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop(); // onstop event will trigger handleTranscription
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current = null;
        }
    }, []);

    const startRecording = useCallback(async () => {
        if (status !== 'idle' && status !== 'error') return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunksRef.current = [];
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            
            recorder.onstop = handleTranscription;
            
            recorder.start();
            setStatus('recording');
        } catch (error) {
            console.error('Failed to start recording:', error);
            addNotification(`Falha ao iniciar microfone: ${error.message}`, 'error');
            setStatus('error');
        }
    }, [status, handleTranscription]);


    const handleToggleRecording = () => {
        if (status === 'recording') {
            stopRecording();
        } else {
            startRecording();
        }
    };
    
    const getButtonContent = () => {
        switch (status) {
            case 'recording':
                return { icon: 'stop', tooltip: 'Parar Gravação' };
            case 'transcribing':
                return { icon: 'hourglass_top', tooltip: 'Transcrevendo...' };
            case 'error':
                return { icon: 'error', tooltip: 'Erro' };
            case 'idle':
            default:
                return { icon: 'mic', tooltip: 'Gravar Descrição' };
        }
    };

    const { icon, tooltip } = getButtonContent();
    const isDisabled = status === 'transcribing';

    return (
        <button
            className={c('speech-to-text-button', { recording: status === 'recording' })}
            onClick={handleToggleRecording}
            disabled={isDisabled}
            aria-label={tooltip}
        >
            <span className={c("icon", {"spin-animation": isDisabled})}>{icon}</span>
            <span className="tooltip right">{tooltip}</span>
        </button>
    );
}
