/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useEffect, useState, memo, useRef} from 'react'
import c from 'clsx'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ShadingType } from 'docx';
import jsPDF from 'jspdf';
import * as asn1js from 'asn1js';
import { ContentInfo, SignedData } from 'pkijs';
import { GoogleGenAI, Modality } from '@google/genai';
import { addNotification, submitFeedback } from '../lib/actions';
import { decode, decodeAudioData } from '../lib/audioUtils';
import models from '../lib/models'
import judges from '../lib/judges';

const MarkdownRenderer = ({ text }) => {
  if (!text) return null;

  return (
    <div className="generated-document-container">
      <div className="generated-document markdown-body">
        <Markdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="code-block-wrapper">
                  <div className="code-header">
                    <span className="lang">{match[1]}</span>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers
                    customStyle={{ margin: 0, borderRadius: '0 0 8px 8px' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {text}
        </Markdown>
      </div>
    </div>
  );
};


function ModelOutput({
  id,
  roundId,
  model,
  outputData,
  isBusy,
  startTime,
  totalTime,
  gotError,
  errorMessage,
  documentName,
  temperature,
  jurisprudence,
  dataType,
  judgeId,
  feedback,
  userLinks, // New prop
}) {
  const [time, setTime] = useState(0)
  const [copied, setCopied] = useState(false)
  const signatureInputRef = useRef(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [signatureInfo, setSignatureInfo] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  
  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  // TTS State
  const [ttsState, setTtsState] = useState('idle'); // 'idle', 'loading', 'playing'
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);

  const judge = judgeId ? judges[judgeId] : null;

  const copySource = () => {
    navigator.clipboard.writeText(outputData.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }
  
  const exportToDocx = () => {
    if (!outputData) return;

    const children = [];

    const processTextRuns = (line) => {
        const runs = [];
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(p => p);
        parts.forEach(part => {
            if (part.startsWith('**') && part.endsWith('**')) {
                runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
            } else {
                runs.push(new TextRun(part));
            }
        });
        return runs;
    };
    
    const parts = outputData.split(/(```[\s\S]*?```)/g);

    parts.forEach(part => {
        if (part.startsWith('```')) {
            const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
            const codeLines = code.split('\n');
            codeLines.forEach(line => {
                children.push(new Paragraph({
                    children: [new TextRun(line)],
                    style: "codeBlock",
                }));
            });
        } else {
            const lines = part.split('\n');
            lines.forEach(line => {
                if (line.startsWith('# ')) {
                    children.push(new Paragraph({ children: processTextRuns(line.substring(2)), heading: HeadingLevel.HEADING_1 }));
                } else if (line.startsWith('## ')) {
                    children.push(new Paragraph({ children: processTextRuns(line.substring(3)), heading: HeadingLevel.HEADING_2 }));
                } else if (line.startsWith('### ')) {
                    children.push(new Paragraph({ children: processTextRuns(line.substring(4)), heading: HeadingLevel.HEADING_3 }));
                } else if (line.startsWith('* ')) {
                    children.push(new Paragraph({ children: processTextRuns(line.substring(2)), bullet: { level: 0 } }));
                } else {
                    children.push(new Paragraph({ children: processTextRuns(line) }));
                }
            });
        }
    });

    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "codeBlock",
                    name: "Code Block",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        font: "Courier New",
                        size: 20, // 10pt
                    },
                    paragraph: {
                        shading: {
                            type: ShadingType.CLEAR,
                            fill: "F2F2F2",
                        },
                        indent: { left: 720 },
                        spacing: { before: 120, after: 120 },
                    },
                },
            ],
        },
        sections: [{ children }],
    });

    Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeDocName = documentName ? documentName.replace(/[\\/:*?"<>|]/g, '') : 'documento';
        a.download = `${safeDocName.replace(/ /g, '_')}.docx`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    });
  };

  const exportToPdf = () => {
    if (!outputData) return;

    try {
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });
        
        doc.setFont('helvetica', 'normal');

        const margin = 15;
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let yPos = margin;

        const checkPageBreak = (heightNeeded) => {
            if (yPos + heightNeeded > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
            }
        };
        
        const parts = outputData.split(/(```[\s\S]*?```)/g).filter(p => p);

        parts.forEach(part => {
            if (part.startsWith('```')) {
                const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
                
                doc.setFont('courier', 'normal');
                doc.setFontSize(10);
                const codeLines = doc.splitTextToSize(code, usableWidth);
                
                const codeBlockHeight = codeLines.length * 4;
                checkPageBreak(codeBlockHeight + 5);
                
                doc.text(codeLines, margin, yPos);
                yPos += codeBlockHeight + 5;
            } else {
                const lines = part.split('\n');
                lines.forEach(line => {
                    if (line.trim() === '') {
                        checkPageBreak(5);
                        yPos += 5;
                        return;
                    }

                    let currentFontSize = 12;
                    let isBold = false;
                    let text = line;
                    
                    if (line.startsWith('# ')) {
                        currentFontSize = 18; isBold = true; text = line.substring(2).trim();
                    } else if (line.startsWith('## ')) {
                        currentFontSize = 16; isBold = true; text = line.substring(3).trim();
                    } else if (line.startsWith('### ')) {
                        currentFontSize = 14; isBold = true; text = line.substring(4).trim();
                    } else if (line.startsWith('* ') || line.startsWith('• ')) {
                        text = `• ${line.replace(/^[*•]\s*/, '').trim()}`;
                    }

                    text = text.replace(/\*\*/g, '');

                    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
                    doc.setFontSize(currentFontSize);

                    const lineHeightMultiplier = 1.4;
                    const lineHeight = (currentFontSize / doc.internal.scaleFactor) * lineHeightMultiplier;
                    const wrappedLines = doc.splitTextToSize(text, usableWidth);

                    checkPageBreak(wrappedLines.length * lineHeight);
                    
                    doc.text(wrappedLines, margin, yPos);
                    yPos += wrappedLines.length * lineHeight + (isBold ? 2 : 0);
                });
            }
        });

        const safeDocName = documentName ? documentName.replace(/[\\/:*?"<>|]/g, '') : 'documento';
        doc.save(`${safeDocName.replace(/ /g, '_')}.pdf`);
        addNotification('Documento exportado para PDF com sucesso.', 'info');
    } catch (error) {
        console.error("PDF Export Error:", error);
        addNotification(`Erro ao exportar PDF: ${error.message}`, 'error');
    }
  };


  const handleSignatureFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setIsVerifying(true);
    setSignatureInfo(null);
    setVerificationError(null);

    try {
      const fileBuffer = await file.arrayBuffer();
      const asn1 = asn1js.fromBER(fileBuffer);
      if (asn1.offset === -1) {
        throw new Error('Não foi possível decodificar o arquivo de assinatura. Formato inválido.');
      }

      const contentInfo = new ContentInfo({ schema: asn1.result });
      if (contentInfo.contentType !== '1.2.840.113549.1.7.2') { // OID for SignedData
          throw new Error('O arquivo não parece ser um contêiner de assinatura PKCS#7 válido.');
      }

      const signedData = new SignedData({ schema: contentInfo.content });
      
      if (!signedData.signerInfos || signedData.signerInfos.length === 0) {
        throw new Error('Nenhuma informação de assinante encontrada no arquivo.');
      }

      const signerInfo = signedData.signerInfos[0];
      const signingTime = signerInfo.signingTime;

      const signerCertificate = signedData.certificates.find(cert => 
        cert.issuer.isEqual(signerInfo.issuerAndSerialNumber.issuer) &&
        cert.serialNumber.isEqual(signerInfo.issuerAndSerialNumber.serialNumber)
      );

      if (!signerCertificate) {
        throw new Error('Certificado do assinante não encontrado no arquivo de assinatura.');
      }
      
      const subjectFields = {};
      signerCertificate.subject.typesAndValues.forEach(tv => {
        const oidMap = { '2.5.4.3': 'CN', '2.5.4.10': 'O' };
        if (oidMap[tv.type]) {
            subjectFields[oidMap[tv.type]] = tv.value.valueBlock.value;
        }
      });
      
      const issuerFields = {};
      signerCertificate.issuer.typesAndValues.forEach(tv => {
        const oidMap = { '2.5.4.3': 'CN', '2.5.4.10': 'O' };
        if (oidMap[tv.type]) {
            issuerFields[oidMap[tv.type]] = tv.value.valueBlock.value;
        }
      });

      setSignatureInfo({
        signer: subjectFields.CN || 'Não especificado',
        organization: subjectFields.O || 'Não especificada',
        date: signingTime ? new Date(signingTime).toLocaleString() : 'Não especificada',
        issuer: issuerFields.CN || 'Não especificado',
      });

    } catch (error) {
      console.error("Signature verification error:", error);
      setVerificationError(error.message || 'Ocorreu um erro desconhecido ao processar a assinatura.');
    } finally {
      setIsVerifying(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleTextToSpeech = async () => {
    // If playing, stop it
    if (ttsState === 'playing') {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
            audioSourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.warn);
        }
        setTtsState('idle');
        return;
    }

    if (ttsState === 'loading' || !outputData) return;

    setTtsState('loading');
    try {
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Leia o seguinte documento jurídico de forma profissional, clara e solene. Mantenha um ritmo equilibrado e firme, adequado para uma leitura técnica: ${outputData}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error('Nenhum áudio recebido da API.');
        }

        const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = ctx;

        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            ctx,
            24000,
            1,
        );
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
            setTtsState('idle');
            audioSourceRef.current = null;
            if (ctx.state !== 'closed') ctx.close().catch(console.warn);
        };
        
        source.start();
        audioSourceRef.current = source;
        setTtsState('playing');
        
    } catch (error) {
        console.error("TTS Error:", error);
        addNotification(`Erro ao gerar áudio: ${error.message}`, 'error');
        setTtsState('idle');
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(console.warn);
        }
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedbackRating) {
      addNotification('Por favor, selecione uma avaliação.', 'error');
      return;
    }
    submitFeedback(roundId, id, feedbackRating, feedbackComment);
    addNotification('Obrigado pelo seu feedback!', 'info');
  };

  useEffect(() => {
    let interval

    if (isBusy) {
      interval = setInterval(() => setTime(Date.now() - startTime), 10)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [startTime, isBusy])
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
            audioSourceRef.current.disconnect();
            audioSourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.warn);
        }
    };
  }, []);

  const ttsIcon = ttsState === 'idle' ? 'volume_up' : ttsState === 'loading' ? 'hourglass_top' : 'stop_circle';
  const ttsTooltip = ttsState === 'idle' ? 'Ouvir Texto' : ttsState === 'loading' ? 'Gerando áudio...' : 'Parar áudio';

  return (
    <div className={c("modelOutput", { "judgment-output": !!judge })}>
       {judge && (
        <div className="judgment-header">
            <h3>
                <span className="icon filled">gavel</span>
                {judge.court === 'Supremo Tribunal' ? 'VOTO' : 'SENTENÇA'}
            </h3>
            <div className="judge-info">
                <strong>{judge.name}</strong>
                <span>{judge.court}</span>
            </div>
        </div>
      )}
      <div className="outputRendering">
          {gotError && (
            <div className="error">
              <p>
                <span className="icon filled">error</span>
                <span>Erro na resposta da API</span>
              </p>
              {errorMessage && <pre className="error-details">{errorMessage}</pre>}
            </div>
          )}

          {isBusy && (
            <div className="loader">
              <span className="icon">hourglass</span>
            </div>
          )}

          {outputData && <MarkdownRenderer text={outputData} />}
        
        <div className={c('outputActions', {active: outputData})}>
           <button className="iconButton" onClick={handleTextToSpeech} disabled={ttsState === 'loading'}>
                <span className={c("icon", { "spin-animation": ttsState === 'loading' })}>{ttsIcon}</span>
                <span className="tooltip">{ttsTooltip}</span>
            </button>
           <button className="iconButton" onClick={() => signatureInputRef.current?.click()} disabled={isVerifying}>
            <span className="icon">verified_user</span>
            <span className="tooltip">Verificar Assinatura</span>
          </button>
          <input type="file" ref={signatureInputRef} onChange={handleSignatureFileChange} style={{ display: 'none' }} accept=".p7s" />
          <button className="iconButton" onClick={exportToDocx}>
            <span className="icon">download</span>
            <span className="tooltip">Exportar para .docx</span>
          </button>
          <button className="iconButton" onClick={exportToPdf}>
            <span className="icon">picture_as_pdf</span>
            <span className="tooltip">Exportar para .pdf</span>
          </button>
          <button className="iconButton" onClick={copySource}>
            <span className="icon">content_copy</span>
            <span className="tooltip">
              {copied
                ? 'Copiado!'
                : 'Copiar texto'}
            </span>
          </button>
        </div>
      </div>

      <div className="modelInfo">
        <div className="modelName">
          <div>
            {models[model].version} {models[model].name}
            {temperature !== undefined && ` @ ${temperature.toFixed(1)} temp`}
          </div>
          {(time || totalTime) && (
            <div className="timer">
              {((isBusy ? time : totalTime) / 1000).toFixed(2)}s
            </div>
          )}
        </div>
      </div>
      
      {((jurisprudence && jurisprudence.length > 0) || (userLinks && userLinks.length > 0)) && (
        <div className="jurisprudence-section">
          {jurisprudence && jurisprudence.length > 0 && (
            <div className="jurisprudence-group">
                <h3><span className="icon">gavel</span> Jurisprudência Relacionada (Auto)</h3>
                <ul style={{marginBottom: userLinks?.length > 0 ? '2rem' : 0}}>
                    {jurisprudence.map((item, index) => (
                    <li key={index}>
                        <a href={item.uri} target="_blank" rel="noopener noreferrer">
                        {item.title}
                        </a>
                        <span className="jurisprudence-uri">{new URL(item.uri).hostname}</span>
                    </li>
                    ))}
                </ul>
            </div>
          )}

          {userLinks && userLinks.length > 0 && (
            <div className="jurisprudence-group">
                <h3><span className="icon">link</span> Referências Anexadas (Usuário)</h3>
                <ul>
                    {userLinks.map((link, index) => (
                    <li key={link.id || index}>
                        <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">
                        {link.title || 'Link Externo'}
                        </a>
                        <span className="jurisprudence-uri">
                            {(() => {
                                try { return new URL(link.url.startsWith('http') ? link.url : `https://${link.url}`).hostname; }
                                catch(e) { return 'link'; }
                            })()}
                        </span>
                    </li>
                    ))}
                </ul>
            </div>
          )}
        </div>
      )}

      {outputData && !isBusy && (
        <>
          {feedback.submitted ? (
            <div className="feedback-submitted">
              <span className="icon filled">check_circle</span> Obrigado pelo seu feedback!
            </div>
          ) : (
            <div className="feedback-section">
              <h4>Avalie a qualidade do documento</h4>
              <div className="feedback-controls">
                <div className="feedback-actions">
                  <button
                    className={c('iconButton', { active: feedbackRating === 'positive' })}
                    onClick={() => setFeedbackRating('positive')}
                    aria-label="Gostei"
                  >
                    <span className="icon">thumb_up</span>
                  </button>
                  <button
                    className={c('iconButton', { active: feedbackRating === 'negative' })}
                    onClick={() => setFeedbackRating('negative')}
                    aria-label="Não gostei"
                  >
                    <span className="icon">thumb_down</span>
                  </button>
                </div>
                {feedbackRating === 'negative' && (
                  <textarea
                    className="feedback-comment"
                    placeholder="Por favor, conte-nos como podemos melhorar..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                  />
                )}
                {feedbackRating && (
                  <button className="button minor" onClick={handleSubmitFeedback}>
                    Enviar Feedback
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

       {dataType !== 'judgment' && (
        <div className="signature-verifier-container">
          {isVerifying && (
              <div className="signature-loader">
                  <span className="icon">hourglass</span> Verificando assinatura...
              </div>
          )}
          {verificationError && (
              <div className="signature-result signature-error">
                  <strong>Falha na Verificação:</strong> {verificationError}
              </div>
          )}
          {signatureInfo && (
              <div className="signature-result signature-success">
                  <h4><span className="icon filled">verified_user</span>Assinatura Digital</h4>
                  <ul>
                      <li><strong>Assinado por:</strong> {signatureInfo.signer}</li>
                      <li><strong>Organização:</strong> {signatureInfo.organization}</li>
                      <li><strong>Data da Assinatura:</strong> {signatureInfo.date}</li>
                      <li><strong>Emitido por:</strong> {signatureInfo.issuer}</li>
                  </ul>
                  <p className="signature-warning">
                      <strong>Aviso:</strong> As informações do assinante foram extraídas com sucesso do arquivo. No entanto, a validação criptográfica da autenticidade da assinatura e da integridade do documento não pode ser realizada no navegador.
                  </p>
              </div>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(ModelOutput)