/**
 * ApiCostMonitor.jsx
 * Painel de monitoramento de custo e uso da API Gemini
 * Exibe tokens consumidos, custo estimado e status em tempo real
 */
import React, { useState, useEffect } from 'react';
import { getUsageStats, resetUsageStats } from '../lib/llm';

const FREE_TIER_NOTE = 'Plano Gratuito: tokens não têm custo, mas há limite de requisições/dia.';

function formatNumber(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
    return String(n);
}

function StatusBadge({ errors, requests }) {
    if (requests === 0) return <span className="api-badge api-badge--idle">Aguardando</span>span>;
    if (errors > 0)     return <span className="api-badge api-badge--warn">Com Erros</span>span>;
    return                     <span className="api-badge api-badge--ok">Operacional</span>span>;
}

export default function ApiCostMonitor() {
    const [stats, setStats] = useState(getUsageStats());
    const [showDetail, setShowDetail] = useState(false);
  
    // Atualiza a cada 5 segundos
    useEffect(() => {
          const interval = setInterval(() => setStats(getUsageStats()), 5_000);
          return () => clearInterval(interval);
    }, []);
  
    const handleReset = () => {
          resetUsageStats();
          setStats(getUsageStats());
    };
  
    const totalTokens = stats.totalInputTokens + stats.totalOutputTokens;
    const costDisplay = stats.estimatedCostUSD < 0.001
          ? '< US$ 0,001'
          : `US$ ${stats.estimatedCostUSD.toFixed(4)}`;
  
    return (
          <div className="api-cost-monitor">
                <div className="api-cost-header" onClick={() => setShowDetail(v => !v)}>
                        <div className="api-cost-title">
                                  <span className="icon">monitoring</span>span>
                                  <strong>Monitor de API</strong>strong>
                        </div>div>
                        <StatusBadge errors={stats.totalErrors} requests={stats.totalRequests} />
                        <span className="icon api-cost-toggle">{showDetail ? 'expand_less' : 'expand_more'}</span>span>
                </div>div>
          
            {showDetail && (
                    <div className="api-cost-body">
                              <div className="api-cost-grid">
                                          <div className="api-cost-card">
                                                        <span className="icon">send</span>span>
                                                        <div>
                                                                        <div className="api-cost-value">{stats.totalRequests}</div>div>
                                                                        <div className="api-cost-label">Requisições</div>div>
                                                        </div>div>
                                          </div>div>
                              
                                          <div className="api-cost-card">
                                                        <span className="icon">token</span>span>
                                                        <div>
                                                                        <div className="api-cost-value">{formatNumber(totalTokens)}</div>div>
                                                                        <div className="api-cost-label">Tokens totais</div>div>
                                                        </div>div>
                                          </div>div>
                              
                                          <div className="api-cost-card">
                                                        <span className="icon">arrow_downward</span>span>
                                                        <div>
                                                                        <div className="api-cost-value">{formatNumber(stats.totalInputTokens)}</div>div>
                                                                        <div className="api-cost-label">Tokens entrada</div>div>
                                                        </div>div>
                                          </div>div>
                              
                                          <div className="api-cost-card">
                                                        <span className="icon">arrow_upward</span>span>
                                                        <div>
                                                                        <div className="api-cost-value">{formatNumber(stats.totalOutputTokens)}</div>div>
                                                                        <div className="api-cost-label">Tokens saída</div>div>
                                                        </div>div>
                                          </div>div>
                              
                                          <div className="api-cost-card api-cost-card--highlight">
                                                        <span className="icon">payments</span>span>
                                                        <div>
                                                                        <div className="api-cost-value">{costDisplay}</div>div>
                                                                        <div className="api-cost-label">Custo estimado*</div>div>
                                                        </div>div>
                                          </div>div>
                              
                                          <div className="api-cost-card api-cost-card--error">
                                                        <span className="icon">error_outline</span>span>
                                                        <div>
                                                                        <div className="api-cost-value">{stats.totalErrors}</div>div>
                                                                        <div className="api-cost-label">Erros</div>div>
                                                        </div>div>
                                          </div>div>
                              </div>div>
                    
                              <p className="api-cost-note">* {FREE_TIER_NOTE}</p>p>
                              <p className="api-cost-note" style={{opacity:0.5}}>
                                          Última reinicialização: {new Date(stats.lastReset).toLocaleString('pt-BR')}
                              </p>p>
                    
                              <button className="button minor small" onClick={handleReset} style={{marginTop:'1rem'}}>
                                          <span className="icon">refresh</span>span> Zerar contadores
                              </button>button>
                    </div>div>
                )}
          </div>div>
        );
}</span>
