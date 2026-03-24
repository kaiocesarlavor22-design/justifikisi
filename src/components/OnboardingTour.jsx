import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const OnboardingTour = ({ currentView }) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const steps = [
    {
      target: 'body',
      content: (
        <div>
          <h3>Bem-vindo ao JUSTIFIKISI! 🚀</h3>
          <p>Vamos te mostrar como criar seu primeiro documento jurídico em segundos.</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '#tour-dashboard',
      content: 'O Dashboard oferece um resumo visual de toda a sua atividade, estatísticas e atalhos rápidos.',
      placement: 'right',
    },
    {
      target: '#tour-sidebar',
      content: 'Aqui você navega entre as principais seções: Novo Documento, Modelos, Documentos Salvos e Configurações.',
      placement: 'right',
    },
    {
      target: '#tour-areas-grid',
      content: 'Escolha uma área do direito para começar. Cada card representa uma especialidade jurídica.',
      placement: 'top',
    },
  ];

  // Add more steps if we are in the generation view
  if (currentView === 'home_new') {
    steps.push(
      {
        target: '#tour-step-1',
        content: 'Selecione a categoria principal do seu documento.',
        placement: 'bottom',
      },
      {
        target: '#tour-step-5',
        content: 'Descreva os fatos e objetivos do caso. Quanto mais detalhes, melhor será o resultado da IA.',
        placement: 'top',
      },
      {
        target: '#tour-step-8',
        content: 'Configure a criatividade e jurisprudência, e clique aqui para gerar seu documento!',
        placement: 'top',
      }
    );
  }

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.setItem('hasSeenTour', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular Tour',
      }}
      styles={{
        options: {
          primaryColor: '#D4AF37',
          zIndex: 10000,
        },
      }}
    />
  );
};

export default OnboardingTour;
