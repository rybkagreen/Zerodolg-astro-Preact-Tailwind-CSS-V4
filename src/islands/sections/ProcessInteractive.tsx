import { useState, useEffect } from 'preact/hooks';

interface Step {
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  icon: string;
  gradient: string;
  hoverColor: string;
  bgGradient: string;
  details: string[];
  warning?: string;
}

interface ProcessData {
  title: string;
  subtitle: string;
  steps: Step[];
}

interface ProcessInteractiveProps {
  processData: ProcessData;
}

const ProcessInteractive = ({ processData }: ProcessInteractiveProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  // Handle step navigation
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < processData.steps.length) {
      setCurrentStep(stepIndex);
      setShowCTA(stepIndex === processData.steps.length - 1);
    }
  };

  const nextStep = () => {
    if (currentStep < processData.steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const currentStepData = processData.steps[currentStep];

  useEffect(() => {
    setShowCTA(currentStep === processData.steps.length - 1);
  }, [currentStep, processData.steps.length]);

  // Guard clause for safety
  if (!currentStepData) {
    return <div class='text-center py-8'>Загрузка...</div>;
  }

  return (
    <div class='process-interactive-wrapper'>
      {/* Step Navigation Pills */}
      <div class='flex flex-wrap gap-2 md:gap-3 mb-8 justify-center'>
        {processData.steps.map((step, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            class={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm ${
              index === currentStep
                ? `bg-gradient-to-r ${step.gradient} text-white shadow-lg`
                : 'bg-white/40 text-slate-800 border border-white/60 hover:bg-white/60 hover:shadow-md drop-shadow-sm'
            }`}
          >
            <span class='text-sm font-bold'>{step.number}</span>
            <span class='hidden sm:inline ml-2'>{step.shortTitle}</span>
          </button>
        ))}
      </div>

      {/* Current Step Content */}
      <div class='process-content bg-white/50 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/40 shadow-lg'>
        {/* Step Icon and Header */}
        <div class='flex items-start gap-4 mb-6'>
          <div
            class={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${currentStepData.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            <img
              src={currentStepData.icon}
              alt={currentStepData.title}
              class='w-6 h-6 md:w-8 md:h-8 filter brightness-0 invert'
            />
          </div>
          <div class='flex-1'>
            <h3 class='text-2xl md:text-3xl font-bold text-slate-900 mb-2 drop-shadow-sm'>
              {currentStepData.title}
            </h3>
            <div class='flex items-center gap-3 mb-4'>
              <span
                class={
                  'px-3 py-1 rounded-full text-sm font-semibold bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 shadow-sm'
                }
              >
                {currentStepData.duration}
              </span>
              <span class='text-slate-500'>•</span>
              <span class='text-slate-700 font-medium'>
                Этап {currentStepData.number} из {processData.steps.length}
              </span>
            </div>
            <p class='text-lg text-slate-800 leading-relaxed font-medium drop-shadow-sm'>
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Details */}
        <div class='mb-6'>
          <h4 class='text-lg font-semibold text-slate-900 mb-4 drop-shadow-sm'>Что включает:</h4>
          <ul class='space-y-3'>
            {currentStepData.details.map((detail, idx) => (
              <li key={idx} class='flex items-start gap-3'>
                <div class='mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 shadow-sm'>
                  <svg
                    class='w-3 h-3 text-green-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='3'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <span class='text-slate-800 font-medium'>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warning */}
        {currentStepData.warning && (
          <div class='mb-6 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200'>
            <div class='flex gap-3'>
              <div class='mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10'>
                <svg
                  class='h-4 w-4 text-amber-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <p class='text-amber-800 font-medium'>{currentStepData.warning}</p>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div class='flex items-center justify-between pt-6 border-t border-slate-300'>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            class='flex items-center gap-2 px-4 py-2 rounded-xl text-slate-700 font-medium hover:text-slate-900 hover:bg-white/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm'
          >
            <svg class='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M15 19l-7-7 7-7'
              />
            </svg>
            <span>Назад</span>
          </button>

          {/* Progress Dots */}
          <div class='flex items-center gap-2'>
            {processData.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                class={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === processData.steps.length - 1}
            class={`flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-300 ${
              currentStep === processData.steps.length - 1
                ? 'bg-green-500 hover:bg-green-600'
                : `bg-gradient-to-r ${currentStepData.gradient} hover:shadow-lg`
            }`}
          >
            <span>{currentStep === processData.steps.length - 1 ? 'Завершено' : 'Далее'}</span>
            <svg class='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d={currentStep === processData.steps.length - 1 ? 'M5 13l4 4L19 7' : 'M9 5l7 7-7 7'}
              />
            </svg>
          </button>
        </div>

        {/* CTA Section - показывается только на последнем шаге */}
        {showCTA && (
          <div class='mt-8 pt-8 border-t border-slate-300 text-center animate-fade-in'>
            <div class='mb-6'>
              <div class='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg'>
                <svg
                  class='w-8 h-8 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 class='text-2xl md:text-3xl font-bold text-slate-900 mb-3 drop-shadow-sm'>
                Готовы начать процедуру?
              </h3>
              <p class='text-lg text-slate-700 mb-6 max-w-2xl mx-auto font-medium drop-shadow-sm'>
                Мы проведем вас через все этапы банкротства от консультации до полного списания
                долгов
              </p>
            </div>

            <div class='flex justify-center'>
              <button
                class='inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105'
                data-modal='callback'
              >
                <svg class='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
                Заказать звонок
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessInteractive;
