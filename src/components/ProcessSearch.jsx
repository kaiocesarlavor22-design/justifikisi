/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from '../lib/store';
import { 
    setProcessNumberInput, 
    searchProcess, 
    clearProcessSearch, 
    setProcessSearchTribunal,
    importProcessData
} from '../lib/actions';

const TRIBUNAIS = {
    'stj': 'STJ',
    'tjsp': 'TJSP',
    'tjrj': 'TJRJ',
    'trf1': 'TRF1',
    'trf2': 'TRF2',
    'trf3': 'TRF3',
    'trf4': 'TRF4',
    'trf5': 'TRF5',
};

export default function ProcessSearch() {
    const { 
        processNumberInput, 
        isProcessSearching, 
        processSearchError, 
        processSearchResult, 
        processSearchTribunal 
    } = useStore();

    const handleSearch = (e) => {
        e.preventDefault();
        searchProcess();
    };

    const handleImport = () => {
        importProcessData();
    };

    const renderMovements = (movements) => {
        if (!movements || movements.length === 0) return <p>Nenhuma movimentação encontrada.</p>;
        const latestMovements = movements.slice(0, 5); // Show latest 5
        return (
            <ul>
                {latestMovements.map((m, index) => (
                    <li key={index}>
                        <strong>{m?.data ? new Date(m.data).toLocaleDateString('pt-BR') : 'Data Indisponível'}:</strong> {m?.nome || 'Movimentação sem descrição'}
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="process-search-section">
            <div className="process-search-header">
                <h3><span className="icon">find_in_page</span> Consulta Processual (Datajud)</h3>
                {(processSearchError || isProcessSearching || processSearchResult) && (
                     <button className="iconButton" onClick={clearProcessSearch} aria-label="Limpar consulta processual">
                        <span className="icon">close</span>
                        <span className="tooltip right">Limpar</span>
                    </button>
                )}
            </div>
           
            <form className="process-search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Número do Processo (CNJ)"
                    value={processNumberInput}
                    onChange={(e) => setProcessNumberInput(e.target.value)}
                    disabled={isProcessSearching}
                    aria-label="Número do Processo"
                />
                <div className="selectWrapper">
                    <select 
                        value={processSearchTribunal} 
                        onChange={e => setProcessSearchTribunal(e.target.value)}
                        disabled={isProcessSearching}
                        aria-label="Tribunal"
                    >
                        {Object.entries(TRIBUNAIS).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="button primary" disabled={isProcessSearching || !processNumberInput}>
                    <span className="icon">search</span> {isProcessSearching ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            <div className="process-search-result-container" aria-live="polite">
                {isProcessSearching && (
                    <div className="loader-container">
                        <div className="loader"><span className="icon">sync</span></div>
                        <p>Consultando a Base Nacional de Dados... Isso pode levar alguns segundos.</p>
                    </div>
                )}
                {processSearchError && <p className="error-message">{processSearchError}</p>}
                {processSearchResult && (
                    <div className="process-search-result">
                        {processSearchResult.dadosBasicos ? (
                            <>
                                <div className="result-header">
                                    <h4>{processSearchResult.dadosBasicos.classe || 'Classe não informada'} N° {processSearchResult.dadosBasicos.numero || 'Número não informado'}</h4>
                                    <button className="button primary" onClick={handleImport}>
                                        <span className="icon">file_download</span> Importar Dados
                                    </button>
                                </div>
                                <div className="result-grid">
                                    <div className="result-details">
                                        <h5>Detalhes do Processo</h5>
                                        {processSearchResult.dadosBasicos.assunto && Array.isArray(processSearchResult.dadosBasicos.assunto) && <p><strong>Assunto:</strong> {processSearchResult.dadosBasicos.assunto.map(a => a.descricao).join(', ')}</p>}
                                        {processSearchResult.dadosBasicos.dataAjuizamento && <p><strong>Data Ajuizamento:</strong> {new Date(processSearchResult.dadosBasicos.dataAjuizamento).toLocaleDateString('pt-BR')}</p>}
                                        {processSearchResult.dadosBasicos.orgaoJulgador?.nome && <p><strong>Órgão Julgador:</strong> {processSearchResult.dadosBasicos.orgaoJulgador.nome}</p>}
                                    </div>
                                    <div className="result-parties">
                                        <h5>Partes</h5>
                                        <ul>
                                            {processSearchResult.partes?.map((p, index) => (
                                                <li key={index}><strong>{p?.polo === 'ATIVO' ? 'Polo Ativo' : 'Polo Passivo'}:</strong> {p?.pessoa?.nome || '[Nome não informado]'}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="result-movements">
                                    <h5>Últimas Movimentações</h5>
                                    {renderMovements(processSearchResult.movimentos)}
                                </div>
                            </>
                        ) : (
                            <p className="error-message">
                                O processo foi localizado, mas os dados básicos não estão disponíveis. O registro pode estar incompleto na base do Datajud.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}