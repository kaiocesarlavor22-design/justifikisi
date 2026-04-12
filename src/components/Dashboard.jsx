/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { 
  FileText, Gavel, TrendingUp, Clock, CheckCircle, 
  ChevronRight, Layout, Activity, Award, Zap
} from 'lucide-react';
import modes from '../lib/modes';
import { applyTemplate } from '../lib/actions';

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
  }
];

const COLORS = ['#FF6B00', '#FF8C00', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

export default function Dashboard({ feed, onViewItem }) {
    const stats = useMemo(() => {
        const totalDocs = feed.length;
        const recentDocs = feed.filter(r => new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        
        // Area Distribution
        const areaMap = {};
        const docTypeMap = {};
        let totalTime = 0;
        let timedDocs = 0;
        let successCount = 0;

        feed.forEach(round => {
            const areaName = modes[round.mainCategoryKey]?.areas?.[round.legalArea]?.name || 'Geral';
            areaMap[areaName] = (areaMap[areaName] || 0) + 1;

            const docName = modes[round.mainCategoryKey]?.areas?.[round.legalArea]?.documents?.[round.documentTypeKey]?.name || 'Documento';
            docTypeMap[docName] = (docTypeMap[docName] || 0) + 1;

            const output = round.outputs?.[0];
            if (output) {
                if (output.totalTime) {
                    totalTime += output.totalTime;
                    timedDocs++;
                }
                if (!output.gotError) {
                    successCount++;
                }
            }
        });

        const areaData = Object.entries(areaMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const docTypeData = Object.entries(docTypeMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        // Activity Trend (Last 14 days)
        const trendMap = {};
        for (let i = 13; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            trendMap[dateStr] = 0;
        }

        feed.forEach(round => {
            const dateStr = new Date(round.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            if (trendMap[dateStr] !== undefined) {
                trendMap[dateStr]++;
            }
        });

        const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

        return {
            totalDocs,
            recentDocsCount: recentDocs.length,
            mostUsedArea: areaData[0]?.name || 'N/A',
            avgTime: timedDocs > 0 ? (totalTime / timedDocs / 1000).toFixed(1) : '0',
            successRate: totalDocs > 0 ? Math.round((successCount / totalDocs) * 100) : 100,
            areaData,
            docTypeData,
            trendData,
            recentActivity: feed.slice(0, 5)
        };
    }, [feed]);

    if (feed.length === 0) {
        return (
            <div className="dashboard-container animate-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ background: 'var(--primary-light)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--primary)' }}>
                        <Layout size={40} />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Seu Painel está pronto</h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Comece a gerar documentos jurídicos com IA para ver estatísticas detalhadas, tendências de atividade e resumos de produtividade aqui.
                    </p>
                    <button className="button primary large" onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: 'home' }))}>
                        Criar Primeiro Documento
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container animate-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        Dashboard <span style={{ color: 'var(--primary)' }}>Analítico</span>
                    </h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Visão geral da sua produtividade jurídica e performance de IA.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Última Atualização</div>
                    <div style={{ fontWeight: '600' }}>{new Date().toLocaleTimeString('pt-BR')}</div>
                </div>
            </div>

            {/* Top Stats Bento Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard 
                    icon={<FileText size={24} />} 
                    label="Total de Documentos" 
                    value={stats.totalDocs} 
                    color="var(--primary)" 
                    trend={`+${stats.recentDocsCount} esta semana`}
                />
                <StatCard 
                    icon={<Gavel size={24} />} 
                    label="Área Principal" 
                    value={stats.mostUsedArea} 
                    color="var(--accent)" 
                    isSmallValue
                />
                <StatCard 
                    icon={<Clock size={24} />} 
                    label="Tempo Médio" 
                    value={`${stats.avgTime}s`} 
                    color="#10b981" 
                    trend="Processamento IA"
                />
                <StatCard 
                    icon={<CheckCircle size={24} />} 
                    label="Taxa de Sucesso" 
                    value={`${stats.successRate}%`} 
                    color="#8b5cf6" 
                    trend="Geração sem erros"
                />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Activity Trend */}
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1.25rem', border: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
                            <Activity size={18} color="var(--primary)" /> Fluxo de Trabalho (14 dias)
                        </h3>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Doc Type Distribution */}
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1.25rem', border: '1px solid var(--border-primary)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        <Award size={18} color="var(--accent)" /> Top Documentos
                    </h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.docTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.docTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        {stats.docTypeData.map((item, index) => (
                            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                                    <span className="text-muted">{item.name}</span>
                                </div>
                                <span style={{ fontWeight: '600' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Activity & Templates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                {/* Detailed Activity */}
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1.25rem', border: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
                            <TrendingUp size={18} color="#10b981" /> Histórico Detalhado
                        </h3>
                        <button className="button minor small" onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: 'recent' }))}>Ver Histórico Completo</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.recentActivity.map(round => (
                            <div key={round.id} className="activity-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ background: 'var(--bg-tertiary)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{modes[round.mainCategoryKey]?.areas?.[round.legalArea]?.documents?.[round.documentTypeKey]?.name || 'Documento'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                            {modes[round.mainCategoryKey]?.areas?.[round.legalArea]?.name} • {new Date(round.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginRight: '0.5rem' }}>
                                        {round.outputs?.[0]?.totalTime ? `${(round.outputs[0].totalTime / 1000).toFixed(1)}s` : '--'}
                                    </div>
                                    <button className="iconButton" onClick={() => onViewItem(round.id)}>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Templates */}
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '1.25rem', border: '1px solid var(--border-primary)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        <Zap size={18} color="#f59e0b" /> Acesso Rápido
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {SUGGESTED_TEMPLATES.map(template => (
                            <div 
                                key={template.id} 
                                className="template-mini-card" 
                                onClick={() => applyTemplate(template)} 
                                style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-primary)', display: 'flex', gap: '1.25rem', alignItems: 'center', transition: 'all 0.2s' }}
                            >
                                <div style={{ fontSize: '1.75rem', background: 'var(--bg-tertiary)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {template.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.25rem' }}>{template.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: '1.4' }}>{template.description}</div>
                                </div>
                            </div>
                        ))}
                        <button 
                            className="button minor" 
                            style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
                            onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: 'templates' }))}
                        >
                            Ver Todos os Modelos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color, trend, isSmallValue }) {
    return (
        <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--border-primary)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, color }}>
                {React.cloneElement(icon, { size: 80 })}
            </div>
            <div style={{ color, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', background: `${color}15`, borderRadius: '12px' }}>
                {icon}
            </div>
            <div style={{ fontSize: isSmallValue ? '1.25rem' : '2.25rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
            </div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                {label}
            </div>
            {trend && (
                <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                    {trend}
                </div>
            )}
        </div>
    );
}
