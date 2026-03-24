import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Ocorreu um erro inesperado.";
      let details = null;

      try {
        const parsedError = JSON.parse(this.state.error.message);
        if (parsedError.error) {
          errorMessage = "Erro de permissão ou acesso ao banco de dados.";
          details = (
            <div className="error-details">
              <p><strong>Operação:</strong> {parsedError.operationType}</p>
              <p><strong>Caminho:</strong> {parsedError.path}</p>
              <p><strong>Mensagem:</strong> {parsedError.error}</p>
            </div>
          );
        }
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="error-boundary-container panel">
          <h2 className="text-red-600 font-bold mb-4">Ops! Algo deu errado.</h2>
          <p className="mb-4">{errorMessage}</p>
          {details}
          <button 
            className="button primary mt-4"
            onClick={() => window.location.reload()}
          >
            Recarregar Página
          </button>
          <style>{`
            .error-boundary-container {
              padding: 2rem;
              border: 2px solid #fee2e2;
              background: #fff5f5;
              margin: 2rem;
              text-align: center;
            }
            .error-details {
              text-align: left;
              background: #fff;
              padding: 1rem;
              border-radius: 0.5rem;
              font-size: 0.875rem;
              margin-top: 1rem;
              border: 1px solid #fecaca;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
