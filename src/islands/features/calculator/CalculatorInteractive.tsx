import { useState } from 'preact/hooks';

// Types based on original calculator data
interface CalculatorStep {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  required: boolean;
  multiple?: boolean;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    exclusive?: boolean;
  }>;
}

interface CalculatorFormData {
  debtAmount?: string;
  creditors?: string;
  property?: string[];
  income?: string;
  employment?: string;
  overdue?: string;
  enforcement?: string;
  guarantees?: string;
}

interface CalculationResult {
  procedureType: 'court' | 'mfc' | 'restructuring';
  price: { min: number; max: number; installment: number };
  duration: string;
  advantages: string[];
  title: string;
  description: string;
}

const CalculatorInteractive = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CalculatorFormData>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculator steps data
  const steps: CalculatorStep[] = [
    {
      id: 'debt-amount',
      title: 'Укажите общую сумму долга',
      type: 'radio',
      required: true,
      options: [
        {
          value: '50-100',
          label: '50 000 - 100 000 ₽',
          description: 'Возможно внесудебное банкротство',
        },
        {
          value: '100-300',
          label: '100 000 - 300 000 ₽',
          description: 'Подходит внесудебное или судебное',
        },
        {
          value: '300-500',
          label: '300 000 - 500 000 ₽',
          description: 'Рекомендуется судебное банкротство',
        },
        {
          value: '500-1000',
          label: '500 000 - 1 000 000 ₽',
          description: 'Только судебное банкротство',
        },
        {
          value: '1000-3000',
          label: '1 000 000 - 3 000 000 ₽',
          description: 'Судебное банкротство',
        },
        { value: '3000+', label: 'Более 3 000 000 ₽', description: 'Сложное банкротство' },
      ],
    },
    {
      id: 'creditors',
      title: 'Количество кредиторов',
      type: 'radio',
      required: true,
      options: [
        { value: '1', label: '1 кредитор', description: 'Один банк или МФО' },
        { value: '2-3', label: '2-3 кредитора', description: 'Несколько кредитов' },
        { value: '4-6', label: '4-6 кредиторов', description: 'Множественные долги' },
        { value: '7+', label: 'Более 7 кредиторов', description: 'Сложная структура долгов' },
      ],
    },
    {
      id: 'property',
      title: 'Какое имущество у вас есть?',
      type: 'checkbox',
      required: true,
      multiple: true,
      options: [
        { value: 'none', label: 'Нет имущества', exclusive: true },
        {
          value: 'single-home',
          label: 'Единственное жилье',
          description: 'Квартира или дом для проживания',
        },
        {
          value: 'additional-property',
          label: 'Дополнительная недвижимость',
          description: 'Дача, гараж, земельный участок',
        },
        { value: 'car', label: 'Автомобиль', description: 'Личный транспорт' },
        {
          value: 'valuables',
          label: 'Ценное имущество',
          description: 'Драгоценности, антиквариат',
        },
        { value: 'business-assets', label: 'Доля в бизнесе', description: 'ООО, акции, доли' },
      ],
    },
    {
      id: 'income',
      title: 'Ваш ежемесячный доход',
      type: 'radio',
      required: true,
      options: [
        { value: 'none', label: 'Нет дохода', description: 'Безработный' },
        { value: '0-25', label: 'До 25 000 ₽', description: 'Минимальный доход' },
        { value: '25-50', label: '25 000 - 50 000 ₽', description: 'Средний доход' },
        { value: '50-100', label: '50 000 - 100 000 ₽', description: 'Выше среднего' },
        { value: '100+', label: 'Более 100 000 ₽', description: 'Высокий доход' },
      ],
    },
    {
      id: 'employment',
      title: 'Тип трудоустройства',
      type: 'radio',
      required: true,
      options: [
        {
          value: 'employed',
          label: 'Официально трудоустроен',
          description: 'Работа по трудовому договору',
        },
        {
          value: 'self-employed',
          label: 'Самозанятый',
          description: 'Плачу налог на профессиональный доход',
        },
        {
          value: 'ip',
          label: 'Индивидуальный предприниматель',
          description: 'Зарегистрирован как ИП',
        },
        {
          value: 'unofficial',
          label: 'Неофициальная работа',
          description: 'Работаю без оформления',
        },
        { value: 'pension', label: 'Пенсионер', description: 'Получаю пенсию' },
        { value: 'unemployed', label: 'Безработный', description: 'Не работаю' },
      ],
    },
    {
      id: 'overdue',
      title: 'Срок просрочки по платежам',
      type: 'radio',
      required: true,
      options: [
        { value: '0-3', label: 'До 3 месяцев', description: 'Недавняя просрочка' },
        { value: '3-6', label: '3-6 месяцев', description: 'Можно начинать процедуру' },
        { value: '6-12', label: '6-12 месяцев', description: 'Оптимальный срок' },
        { value: '12+', label: 'Более года', description: 'Долгая просрочка' },
      ],
    },
  ];

  const handleOptionSelect = (stepId: string, value: string, isCheckbox = false) => {
    if (isCheckbox) {
      const currentValues = (formData[stepId as keyof CalculatorFormData] as string[]) || [];
      const step = steps.find((s) => s.id === stepId);
      const selectedOption = step?.options.find((opt) => opt.value === value);

      let newValues: string[];

      if (selectedOption?.exclusive) {
        // If exclusive option selected, clear all others
        newValues = [value];
      } else if (currentValues.includes(value)) {
        // Remove value if already selected
        newValues = currentValues.filter((v) => v !== value);
      } else {
        // Add value, but remove exclusive options first
        const exclusiveOption = step?.options.find((opt) => opt.exclusive);
        newValues =
          exclusiveOption && currentValues.includes(exclusiveOption.value)
            ? [value]
            : [...currentValues, value];
      }

      setFormData((prev: CalculatorFormData) => ({ ...prev, [stepId]: newValues }));
    } else {
      setFormData((prev: CalculatorFormData) => ({ ...prev, [stepId]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepValid = (): boolean => {
    const step = steps[currentStep];
    if (!step) return false;

    const value = formData[step.id as keyof CalculatorFormData];

    if (!step.required) return true;

    if (step.multiple) {
      return Array.isArray(value) && value.length > 0;
    }

    return !!value;
  };

  const calculateResult = async () => {
    setIsCalculating(true);

    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = determineRecommendation(formData);
    setResult(result);
    setIsCalculating(false);

    // Track analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'calculator_complete', {
        event_category: 'Calculator',
        event_label: result.procedureType,
        value: result.price.min,
      });
    }
  };

  const determineRecommendation = (data: CalculatorFormData): CalculationResult => {
    const debtAmount = data.debtAmount || '';
    const property = (data.property || []) as string[];
    const income = data.income || '';
    const employment = data.employment || '';

    // Determine if extrajudicial bankruptcy is possible
    const isExtrajudicialEligible =
      ['50-100', '100-300'].includes(debtAmount) &&
      property.includes('none') &&
      ['none', '0-25'].includes(income) &&
      ['unemployed', 'pension'].includes(employment);

    // Determine if restructuring is viable
    const isRestructuringViable =
      ['25-50', '50-100', '100+'].includes(income) &&
      ['employed', 'self-employed', 'ip'].includes(employment);

    if (isExtrajudicialEligible) {
      return {
        procedureType: 'mfc',
        title: 'Подходит внесудебное банкротство',
        description: 'Вы можете воспользоваться упрощенной процедурой через МФЦ',
        price: { min: 25000, max: 40000, installment: 6 },
        duration: '6 месяцев',
        advantages: [
          'Без судебных заседаний',
          'Дешевле судебного',
          'Проще процедура',
          'Гарантированный результат',
        ],
      };
    }

    if (isRestructuringViable && !['3000+'].includes(debtAmount)) {
      return {
        procedureType: 'restructuring',
        title: 'Возможна реструктуризация',
        description: 'При вашем доходе можно попробовать реструктурировать долги',
        price: { min: 40000, max: 80000, installment: 6 },
        duration: '3 года',
        advantages: [
          'Сохранение всего имущества',
          'Снижение процентов',
          'Уменьшение платежей',
          'Фиксированный график',
        ],
      };
    }

    // Default to court bankruptcy
    let minPrice = 60000;
    let maxPrice = 150000;

    // Adjust price based on complexity
    if (['3000+'].includes(debtAmount)) {
      minPrice = 100000;
      maxPrice = 200000;
    }

    if (property.length > 2) {
      minPrice += 20000;
      maxPrice += 30000;
    }

    return {
      procedureType: 'court',
      title: 'Рекомендуем судебное банкротство',
      description: 'Ваша ситуация подходит для процедуры банкротства через Арбитражный суд',
      price: { min: minPrice, max: maxPrice, installment: 12 },
      duration: '4-6 месяцев',
      advantages: [
        'Полное списание долгов',
        'Защита от коллекторов',
        'Сохранение единственного жилья',
        'Остановка начисления процентов',
      ],
    };
  };

  const resetCalculator = () => {
    setCurrentStep(0);
    setFormData({});
    setResult(null);
    setIsCalculating(false);
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (result) {
    return (
      <div className='calculator-result'>
        {/* Result Display */}
        <div className='bg-gradient-to-br from-green-500/90 to-emerald-600/85 backdrop-blur-lg rounded-2xl p-8 text-white border border-green-400/30'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center px-4 py-2 bg-green-600/30 rounded-full text-sm font-medium mb-4'>
              ✓ Расчет завершен
            </div>
            <h3 className='text-2xl font-bold mb-2'>{result.title}</h3>
            <p className='text-green-100 text-lg'>{result.description}</p>
          </div>

          {/* Price Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20'>
              <div className='text-white/70 mb-2'>Стоимость услуги</div>
              <div className='text-3xl font-bold text-white mb-1'>
                {result.price.min.toLocaleString('ru-RU')} ₽
              </div>
              <div className='text-sm text-white/70'>
                до {result.price.max.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20'>
              <div className='text-white/70 mb-2'>Рассрочка</div>
              <div className='text-3xl font-bold text-white mb-1'>
                {Math.round(result.price.min / result.price.installment).toLocaleString('ru-RU')} ₽
              </div>
              <div className='text-sm text-white/70'>на {result.price.installment} месяцев</div>
            </div>

            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20'>
              <div className='text-white/70 mb-2'>Срок процедуры</div>
              <div className='text-3xl font-bold text-white mb-1'>{result.duration}</div>
              <div className='text-sm text-white/70'>полное списание</div>
            </div>
          </div>

          {/* Advantages */}
          <div className='mb-8'>
            <h4 className='text-xl font-semibold text-white mb-4'>Преимущества:</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {result.advantages.map((advantage: string, index: number) => (
                <div key={index} className='flex items-center text-green-100'>
                  <svg
                    className='w-5 h-5 text-green-300 mr-3 flex-shrink-0'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  {advantage}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              className='px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg'
              onClick={() => {
                // Scroll to contact form or trigger modal
                const ctaSection = document.querySelector('#contact, #cta');
                if (ctaSection) {
                  ctaSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Готов к консультации? Нажми здесь!
            </button>

            <button
              className='px-8 py-4 bg-white/20 text-white font-medium rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30'
              onClick={resetCalculator}
            >
              Пересчитать
            </button>
          </div>

          <p className='text-center text-green-100 text-sm mt-6'>
            Это предварительный расчет. Точную стоимость определит юрист после анализа документов.
          </p>
        </div>
      </div>
    );
  }

  if (isCalculating) {
    return (
      <div className='calculator-loading text-center py-12'>
        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse'>
          <svg className='w-8 h-8 text-white animate-spin' fill='none' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        </div>
        <h3 className='text-2xl font-bold text-white mb-2'>Анализируем вашу ситуацию</h3>
        <p className='text-white/70 text-lg'>Подготавливаем персональный расчет...</p>
      </div>
    );
  }

  if (!currentStepData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='calculator-form'>
      {/* Progress Bar */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <span className='text-white/70 text-sm'>
            Шаг {currentStep + 1} из {steps.length}
          </span>
          <span className='text-white/70 text-sm'>{Math.round(progress)}% завершено</span>
        </div>
        <div className='w-full bg-white/20 rounded-full h-2 overflow-hidden'>
          <div
            className='bg-gradient-to-r from-orange-400 to-yellow-500 h-2 rounded-full transition-all duration-500 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className='step-content mb-8'>
        <h3 className='text-2xl md:text-3xl font-bold text-white mb-8 text-center'>
          {currentStepData.title}
        </h3>

        <div className='space-y-4'>
          {currentStepData.options.map((option, _index) => {
            const isSelected = currentStepData.multiple
              ? (
                  (formData[currentStepData.id as keyof CalculatorFormData] as string[]) || []
                ).includes(option.value)
              : formData[currentStepData.id as keyof CalculatorFormData] === option.value;

            return (
              <label
                key={option.value}
                className={`block cursor-pointer transition-all duration-300 ${
                  isSelected ? 'transform scale-[1.02]' : 'hover:transform hover:scale-[1.01]'
                }`}
              >
                <div
                  className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300
                  ${
                    isSelected
                      ? 'bg-white/20 border-orange-400 shadow-lg shadow-orange-400/30'
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                  }
                `}
                >
                  <div className='flex items-start'>
                    <div className='flex-shrink-0 mr-4 mt-1'>
                      <div
                        className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${currentStepData.multiple ? 'rounded-md' : ''}
                        ${isSelected ? 'border-orange-400 bg-orange-400' : 'border-white/40'}
                      `}
                      >
                        {isSelected && (
                          <svg
                            className='w-4 h-4 text-white'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className='flex-1'>
                      <div className='text-lg font-semibold text-white mb-1'>{option.label}</div>
                      {option.description && (
                        <div className='text-white/70 text-sm'>{option.description}</div>
                      )}
                    </div>
                  </div>
                </div>
                <input
                  type={currentStepData.multiple ? 'checkbox' : 'radio'}
                  name={currentStepData.id}
                  value={option.value}
                  checked={isSelected}
                  onChange={() =>
                    handleOptionSelect(currentStepData.id, option.value, currentStepData.multiple)
                  }
                  className='sr-only'
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between items-center pt-8'>
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`
            px-8 py-4 rounded-full font-semibold transition-all duration-300
            ${
              currentStep === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
            }
          `}
        >
          ← Назад
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
          className={`
            px-8 py-4 rounded-full font-bold transition-all duration-300 transform
            ${
              !isCurrentStepValid()
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 hover:scale-105 shadow-lg'
            }
          `}
        >
          {currentStep === steps.length - 1 ? 'Рассчитать' : 'Далее →'}
        </button>
      </div>
    </div>
  );
};

export default CalculatorInteractive;
