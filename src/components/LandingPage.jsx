/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import c from 'clsx';
import useStore from '../lib/store';
import { setCurrentView, addNotification, loginWithGoogle, logout } from '../lib/actions';
import Logo from './Logo';
import AdminPanel from './AdminPanel';

export default function LandingPage() {
  const { user, isAdmin, currentView } = useStore();
  const [showAdmin, setShowAdmin] = React.useState(false);

  const handleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="footer-brand">
          <Logo />
          <span className="brand-text">JUSTIFIKISI</span>
        </div>
        <div className="header-auth">
          {user ? (
            <div className="user-profile">
              <div className="user-info-mini mr-4">
                <span className="user-name">Olá, {user.displayName?.split(' ')[0]}</span>
              </div>
              {isAdmin && (
                <button 
                  className={c("button small", showAdmin ? "primary" : "minor")} 
                  onClick={() => setShowAdmin(!showAdmin)}
                >
                  {showAdmin ? 'Editor' : 'Admin'}
                </button>
              )}
              <button className="button minor small" onClick={logout}>Sair</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button 
                  className={c("button small", showAdmin ? "primary" : "minor")} 
                  onClick={() => setShowAdmin(!showAdmin)}
                >
                  {showAdmin ? 'Editor' : 'Admin'}
                </button>
              )}
              <button className="button primary small" onClick={handleLogin}>
                Entrar com Google
              </button>
            </div>
          )}
        </div>
      </header>

      {showAdmin ? (
        <div className="container py-12">
          <AdminPanel />
        </div>
      ) : (
        <main>
          {/* Hero Section - Split Layout */}
          <section className="hero-split">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="icon">auto_awesome</span> IA Jurídica 2.0
              </div>
              <h1 className="hero-title">
                Advocacia <br />
                <span className="text-accent">Inteligente.</span>
              </h1>
              <p className="hero-subtitle">
                A plataforma definitiva para automação de documentos e análise processual no Brasil.
              </p>
              <div className="hero-actions">
                <button className="cta-circle" onClick={() => setCurrentView('home')}>
                  Começar
                </button>
                <div className="hero-meta">
                  <span className="meta-label">Disponível agora</span>
                  <span className="meta-value">STF, STJ e TJs</span>
                </div>
              </div>
            </div>
            <div className="hero-right">
              <div className="visual-container">
                <div className="floating-card c1">
                  <div className="card-icon"><span className="icon">gavel</span></div>
                  <div className="card-text">Petição Inicial Gerada</div>
                </div>
                <div className="floating-card c2">
                  <div className="card-icon"><span className="icon">verified</span></div>
                  <div className="card-text">Jurisprudência Encontrada</div>
                </div>
                <div className="atmosphere"></div>
              </div>
            </div>
          </section>

          {/* Features - Bento Grid Style */}
          <section id="features" className="features-bento">
            <div className="bento-item b1">
              <div className="feature-icon"><span className="icon">description</span></div>
              <h3>Geração de Peças</h3>
              <p>Petições e contratos em segundos.</p>
            </div>
            <div className="bento-item b2">
              <div className="feature-icon"><span className="icon">search</span></div>
              <h3>Datajud</h3>
              <p>Busca automática de processos.</p>
            </div>
            <div className="bento-item b3">
              <div className="feature-icon"><span className="icon">analytics</span></div>
              <h3>Análise IA</h3>
              <p>Riscos e sugestões em PDFs.</p>
            </div>
          </section>

          <footer className="landing-footer">
            <div className="footer-top">
              <div className="footer-brand">
                <Logo />
                <span>JUSTIFIKISI</span>
              </div>
              <div className="footer-links">
                <a href="#">Privacidade</a>
                <a href="#">Termos</a>
                <a href="#">Contato</a>
              </div>
            </div>
            <div className="footer-bottom">
              &copy; {new Date().getFullYear()} Justifikisi. Tecnologia para o Direito.
            </div>
          </footer>
        </main>
      )}

      <style>{`
        :root {
          --c-bg: #000000;
          --c-ink: #ffffff;
          --c-accent: #ffffff;
          --f-sans: 'Inter', system-ui, sans-serif;
        }

        .landing-page {
          background-color: var(--c-bg);
          color: var(--c-ink);
          font-family: var(--f-sans);
          overflow-x: hidden;
        }

        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 4rem;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .brand-text {
          font-weight: 900;
          letter-spacing: -0.05em;
          font-size: 1.25rem;
          color: var(--c-accent);
        }

        .header-nav {
          display: flex;
          gap: 2rem;
        }

        .header-nav a {
          text-decoration: none;
          color: var(--c-ink);
          font-weight: 500;
          font-size: 0.875rem;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .header-nav a:hover {
          opacity: 1;
          color: var(--c-accent);
        }

        /* Hero Split Layout */
        .hero-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 80vh;
          align-items: center;
          padding: 0 4rem;
          gap: 4rem;
        }

        .hero-left {
          max-width: 540px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: var(--c-accent);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .hero-title {
          font-size: 5rem;
          line-height: 0.9;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 2rem;
        }

        .text-accent {
          color: var(--c-accent);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          line-height: 1.5;
          opacity: 0.6;
          margin-bottom: 3rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 3rem;
        }

        .cta-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--c-accent);
          color: black;
          border: none;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .cta-circle:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
        }

        .hero-meta {
          display: flex;
          flex-direction: column;
        }

        .small-caps {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          opacity: 0.5;
          margin-bottom: 0.5rem;
          display: block;
        }

        .meta-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 700;
          opacity: 0.4;
        }

        .meta-value {
          font-weight: 600;
          font-size: 1rem;
          color: var(--c-accent);
        }

        .hero-right {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visual-container {
          position: relative;
          width: 100%;
          height: 400px;
        }

        .floating-card {
          position: absolute;
          background: #0a0a0a;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 20px 40px rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 10;
        }

        .c1 { top: 10%; left: 0; transform: rotate(-5deg); }
        .c2 { bottom: 20%; right: 0; transform: rotate(3deg); }

        .card-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          display: grid;
          place-items: center;
          color: var(--c-accent);
        }

        .card-text {
          font-weight: 600;
          font-size: 0.875rem;
          color: #fff;
        }

        .atmosphere {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
          filter: blur(40px);
        }

        /* Bento Grid */
        .features-bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 4rem;
        }

        .bento-item {
          background: #050505;
          padding: 3rem;
          border-radius: 2rem;
          transition: background 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .bento-item:hover {
          background: #0a0a0a;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .feature-icon {
          margin-bottom: 2rem;
          color: var(--c-accent);
          font-size: 2rem;
        }

        .bento-item h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #fff;
        }

        .bento-item p {
          opacity: 0.6;
          line-height: 1.5;
        }

        /* Editor Preview */
        .editor-preview {
          padding: 6rem 4rem;
        }

        .landing-footer {
          padding: 4rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: #000;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          text-decoration: none;
          color: var(--c-ink);
          font-size: 0.875rem;
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .footer-links a:hover {
          opacity: 1;
          color: var(--c-accent);
        }

        .footer-bottom {
          font-size: 0.75rem;
          opacity: 0.3;
          text-align: center;
        }

        @media (max-width: 968px) {
          .hero-split { grid-template-columns: 1fr; padding: 2rem; text-align: center; }
          .hero-left { max-width: 100%; }
          .hero-actions { justify-content: center; }
          .hero-right { display: none; }
          .features-bento { grid-template-columns: 1fr; padding: 2rem; }
          .pricing-grid { grid-template-columns: 1fr; }
          .price-card.featured { transform: none; }
          .landing-header { padding: 1rem 2rem; }
        }
      `}</style>
    </div>
  );
}
