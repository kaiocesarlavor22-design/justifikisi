/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from '../lib/store';
import { 
    setCnpjInput, 
    verifyCnpj, 
    clearCnpjVerifier, 
    setCnpjQueryType,
    appendCnpjDataToCompanyInfo 
} from '../lib/actions';

export default function CnpjVerifier() {
    const { cnpjInput, isCnpjVerifying, cnpjError, cnpjData, cnpjQueryType } = useStore();

    const handleVerify = (e) => {
        e.preventDefault();
        verifyCnpj();
    };

    return (
        <div className="cnpj-verifier">
            <div className="header">
                <h3><span className="icon">fact_check</span> Verificador de CNPJ</h3>
                {(cnpjError || isCnpjVerifying || cnpjData) && (
                     <button className="iconButton" onClick={clearCnpjVerifier} aria-label="Limpar verificador de CNPJ">
                        <span className="icon">close</span>
                        <span className="tooltip right">Limpar</span>
                    </button>
                )}
            </div>
           
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    placeholder="Digite o CNPJ (só números)"
                    value={cnpjInput}
                    onChange={(e) => setCnpjInput(e.target.value)}
                    disabled={isCnpjVerifying}
                    aria-label="CNPJ Input"
                    maxLength="14"
                />
                <div className="selectWrapper">
                    <select 
                        value={cnpjQueryType} 
                        onChange={e => setCnpjQueryType(e.target.value)}
                        disabled={isCnpjVerifying}
                        aria-label="Tipo de Consulta CNPJ"
                    >
                        <option value="basica">Básica</option>
                        <option value="qsa">QSA (Sócios)</option>
                        <option value="empresa">Completa</option>
                    </select>
                </div>
                <button type="submit" className="button" disabled={isCnpjVerifying || !cnpjInput}>
                    <span className="icon">search</span> Verificar
                </button>
            </form>

            <div className="result-container" aria-live="polite">
                {isCnpjVerifying && (
                    <div className="loader">
                        <span className="icon">hourglass</span>
                    </div>
                )}
                {cnpjError && <p className="error-message">{cnpjError}</p>}
                {cnpjData && (
                    <div className="cnpj-result">
                        <h4>Resultado da Consulta:</h4>
                        <pre>{JSON.stringify(cnpjData, null, 2)}</pre>
                        <button className="button" onClick={appendCnpjDataToCompanyInfo}>
                            <span className="icon">add</span> Adicionar aos Dados da Empresa
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}