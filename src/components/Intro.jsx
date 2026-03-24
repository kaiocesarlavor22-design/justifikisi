
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {setCurrentView} from '../lib/actions'

export default function Intro() {
  return (
    <section className="intro">
      <h2>⚖️ Bem-vindo ao JUSTIFIKISI</h2>
      <p>
        Seu cockpit inteligente para a criação de documentos jurídicos. Utilize o menu superior para navegar por mais de 60 áreas do direito e 500 tipos de documentos. Descreva seu caso, anexe os arquivos relevantes e deixe nossa IA gerar peças de alto nível para você.
      </p>
       <div style={{ marginTop: '2rem' }}>
        <button className="button primary" style={{fontSize: '1rem'}} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="icon">navigation</span> Comece a Navegar
        </button>
      </div>
    </section>
  )
}