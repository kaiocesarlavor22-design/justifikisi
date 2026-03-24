/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect } from 'react';
import { updateParty, removeParty } from '../lib/actions';

const PREDEFINED_ROLES = [
    'Autor(a) / Requerente',
    'Réu / Requerido(a)',
    'Advogado(a)',
    'Contratante',
    'Contratado(a)',
    'Locador(a)',
    'Locatário(a)',
    'Vendedor(a)',
    'Comprador(a)',
    'Testemunha',
];

export default function PartyInput({ party }) {
    const handleUpdate = (field, value) => {
        updateParty(party.id, field, value);
    };

    // Determine if the role is custom to decide if the custom input should be shown.
    const [isCustom, setIsCustom] = useState(
        party.role ? !PREDEFINED_ROLES.includes(party.role) : false
    );
    
    // Sync local state if party role changes from global state (e.g., reset)
    useEffect(() => {
        setIsCustom(party.role ? !PREDEFINED_ROLES.includes(party.role) : false);
    }, [party.role]);

    const handleRoleChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setIsCustom(true);
            handleUpdate('role', ''); // Clear role to force user input
        } else {
            setIsCustom(false);
            handleUpdate('role', value);
        }
    };
    
    // The select's value is 'custom' if we're showing the custom input, otherwise it's the role itself.
    const selectValue = isCustom ? 'custom' : party.role;

    return (
        <div className="party-input">
            <div className="party-header">
                <div className="party-role-selector">
                    <div className="selectWrapper">
                        <select
                            value={selectValue}
                            onChange={handleRoleChange}
                            aria-label="Função da parte"
                        >
                            <option value="" disabled>Selecione a Função</option>
                            {PREDEFINED_ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                            <option value="custom">Outro...</option>
                        </select>
                    </div>
                    {isCustom && (
                         <input
                            type="text"
                            placeholder="Especifique a função"
                            value={party.role}
                            onChange={(e) => handleUpdate('role', e.target.value)}
                            className="party-role-input-custom"
                            aria-label="Função customizada"
                        />
                    )}
                </div>

                <button className="iconButton remove-party-button" onClick={() => removeParty(party.id)}>
                    <span className="icon">delete</span>
                    <span className="tooltip right">Remover Parte</span>
                </button>
            </div>
            <div className="party-fields">
                <input
                    type="text"
                    placeholder="Nome Completo / Razão Social"
                    value={party.name}
                    onChange={(e) => handleUpdate('name', e.target.value)}
                    aria-label="Nome da parte"
                />
                <input
                    type="text"
                    placeholder="CPF / CNPJ"
                    value={party.document}
                    onChange={(e) => handleUpdate('document', e.target.value)}
                    aria-label="Documento da parte"
                />
                <input
                    type="text"
                    placeholder="Endereço Completo"
                    value={party.address}
                    onChange={(e) => handleUpdate('address', e.target.value)}
                    aria-label="Endereço da parte"
                />
                <input
                    type="text"
                    placeholder="OAB (se advogado)"
                    value={party.oab}
                    onChange={(e) => handleUpdate('oab', e.target.value)}
                    aria-label="OAB do advogado"
                />
            </div>
        </div>
    );
}
