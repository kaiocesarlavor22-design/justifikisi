/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState } from 'react';
import c from 'clsx';
import judges from '../lib/judges';
import { addJudgment, addNotification } from '../lib/actions';
import useStore from '../lib/store';

export default function JudgePanel({ round }) {
    const [selectedJudgeId, setSelectedJudgeId] = useState(Object.keys(judges)[0]);
    const { feed } = useStore();

    const isJudging = feed.find(r => r.id === round.id)
        ?.outputs.some(o => o.isBusy && o.dataType === 'judgment');

    const handleJudge = () => {
        if (!selectedJudgeId) {
            addNotification('Por favor, selecione um juiz.', 'error');
            return;
        }
        addJudgment({ roundId: round.id, judgeId: selectedJudgeId });
    };

    return (
        <div className="judge-panel">
            <h4><span className="icon">gavel</span> Modo Juiz</h4>
            <p className="judge-panel-description">Selecione um juiz para analisar este caso e proferir uma sentença simulada com base nos fatos, documentos e na peça gerada.</p>
            <div className="judge-panel-controls">
                <div className="selectWrapper">
                    <select
                        value={selectedJudgeId}
                        onChange={(e) => setSelectedJudgeId(e.target.value)}
                        disabled={isJudging}
                    >
                        {Object.values(judges).map(judge => (
                            <option key={judge.id} value={judge.id}>
                                {judge.name} ({judge.court})
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="button primary"
                    onClick={handleJudge}
                    disabled={isJudging}
                >
                    <span className="icon filled">gavel</span>
                    {isJudging ? 'Julgando...' : 'Proferir Sentença'}
                </button>
            </div>
        </div>
    );
}
