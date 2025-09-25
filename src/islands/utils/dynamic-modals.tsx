import { type VNode } from 'preact';
import { useDynamicModals } from '@features/modals/model/use-dynamic-modals';
import Modal from '@features/modals/ui/Modal';

export default function DynamicModals(): VNode {
  const { modals } = useDynamicModals();

  const getModalContent = (type: string) => {
    const modalTemplates: { [key: string]: VNode | string } = {
      consultation: (
        <form class="modal-form" data-form-type="consultation">
          <div class="form-group">
            <label for="consultation-name" class="form-label">
              Ваше имя
            </label>
            <input
              type="text"
              id="consultation-name"
              name="name"
              class="form-input"
              required
              autocomplete="name"
            />
          </div>
          <div class="form-group">
            <label for="consultation-phone" class="form-label">
              Телефон
            </label>
            <input
              type="tel"
              id="consultation-phone"
              name="phone"
              class="form-input"
              required
              placeholder="+7 (___) ___-__-__"
              autocomplete="tel"
            />
          </div>
          <div class="form-group">
            <label for="consultation-time" class="form-label">
              Удобное время для звонка
            </label>
            <select
              id="consultation-time"
              name="preferred_time"
              class="form-select"
              autocomplete="off"
            >
              <option value="">Выберите время</option>
              <option value="morning">Утром (9:00 - 12:00)</option>
              <option value="afternoon">Днем (12:00 - 17:00)</option>
              <option value="evening">Вечером (17:00 - 21:00)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="consultation-situation" class="form-label">
              Краткое описание ситуации (необязательно)
            </label>
            <textarea
              id="consultation-situation"
              name="situation"
              class="form-textarea"
              rows={3}
              placeholder="Опишите вашу ситуацию..."
              autocomplete="off"
            ></textarea>
          </div>
          <button type="submit" class="btn btn--primary btn--block">
            Получить консультацию
          </button>
        </form>
      ),

      calculator: (
        <form class="modal-form" data-form-type="calculator">
          <div class="form-group">
            <label for="calculator-debt" class="form-label">
              Общая сумма долгов
            </label>
            <div class="range-value" id="debt-amount-display">
              500 000 ₽
            </div>
            <input
              type="range"
              id="calculator-debt"
              name="debt_amount"
              class="form-range"
              min={100000}
              max={10000000}
              value={500000}
              step={50000}
              autocomplete="off"
            />
          </div>
          <div class="form-group">
            <label for="calculator-creditors" class="form-label">
              Количество кредиторов
            </label>
            <select
              id="calculator-creditors"
              name="creditors_count"
              class="form-select"
              required
              autocomplete="off"
            >
              <option value="">Выберите количество</option>
              <option value="1-3">1-3 кредитора</option>
              <option value="4-7">4-7 кредиторов</option>
              <option value="8+">8 и более кредиторов</option>
            </select>
          </div>
          <div class="form-group">
            <label for="calculator-property" class="form-label">
              Наличие имущества
            </label>
            <select
              id="calculator-property"
              name="property"
              class="form-select"
              required
              autocomplete="off"
            >
              <option value="">Выберите вариант</option>
              <option value="none">Нет имущества</option>
              <option value="apartment">Единственное жилье</option>
              <option value="multiple">Несколько объектов</option>
            </select>
          </div>
          <div class="form-group">
            <label for="calculator-name" class="form-label">
              Ваше имя
            </label>
            <input
              type="text"
              id="calculator-name"
              name="name"
              class="form-input"
              required
              autocomplete="name"
            />
          </div>
          <div class="form-group">
            <label for="calculator-phone" class="form-label">
              Телефон для получения результата
            </label>
            <input
              type="tel"
              id="calculator-phone"
              name="phone"
              class="form-input"
              required
              placeholder="+7 (___) ___-__-__"
              autocomplete="tel"
            />
          </div>
          <button type="submit" class="btn btn--primary btn--block">
            Рассчитать стоимость
          </button>
        </form>
      ),

      'guide-download': (
        <div>
          <div class="guide-preview">
            <div class="guide-preview__features">
              <div class="guide-feature">
                <span class="guide-feature__icon">📖</span>
                <span class="guide-feature__text">47 страниц полезной информации</span>
              </div>
              <div class="guide-feature">
                <span class="guide-feature__icon">⚖️</span>
                <span class="guide-feature__text">Актуальные изменения в законах</span>
              </div>
              <div class="guide-feature">
                <span class="guide-feature__icon">📄</span>
                <span class="guide-feature__text">Шаблоны всех документов</span>
              </div>
            </div>
          </div>
          <form class="modal-form" data-form-type="guide">
            <div class="form-group">
              <label for="guide-name" class="form-label">
                Ваше имя
              </label>
              <input
                type="text"
                id="guide-name"
                name="name"
                class="form-input"
                required
                autocomplete="name"
              />
            </div>
            <div class="form-group">
              <label for="guide-email" class="form-label">
                Email для отправки гида
              </label>
              <input
                type="email"
                id="guide-email"
                name="email"
                class="form-input"
                required
                placeholder="example@mail.com"
                autocomplete="email"
              />
            </div>
            <button type="submit" class="btn btn--primary btn--block">
              Скачать гид бесплатно
            </button>
          </form>
        </div>
      ),

      'checklist-download': (
        <div>
          <p class="modal__description">
            Пошаговый план подготовки к банкротству с 25 пунктами для проверки.
          </p>
          <form class="modal-form" data-form-type="checklist">
            <div class="form-group">
              <label for="checklist-name" class="form-label">
                Ваше имя
              </label>
              <input
                type="text"
                id="checklist-name"
                name="name"
                class="form-input"
                required
                autocomplete="name"
              />
            </div>
            <div class="form-group">
              <label for="checklist-email" class="form-label">
                Email
              </label>
              <input
                type="email"
                id="checklist-email"
                name="email"
                class="form-input"
                required
                autocomplete="email"
              />
            </div>
            <button type="submit" class="btn btn--primary btn--block">
              Получить чек-лист
            </button>
          </form>
        </div>
      ),

      test: (
        <div>
          <p class="modal__description">
            Пройдите тест из 10 вопросов и узнайте, подходит ли вам процедура банкротства.
          </p>
          <form class="modal-form" data-form-type="test">
            <div class="form-group">
              <label for="test-debt" class="form-label">
                Сумма задолженности
              </label>
              <select id="test-debt" name="debt" class="form-select" required autocomplete="off">
                <option value="">Выберите сумму</option>
                <option value="less_300k">Менее 300 000 ₽</option>
                <option value="300k_500k">300 000 - 500 000 ₽</option>
                <option value="500k_1m">500 000 - 1 000 000 ₽</option>
                <option value="more_1m">Более 1 000 000 ₽</option>
              </select>
            </div>
            <div class="form-group">
              <label for="test-name" class="form-label">
                Ваше имя
              </label>
              <input
                type="text"
                id="test-name"
                name="name"
                class="form-input"
                required
                autocomplete="name"
              />
            </div>
            <div class="form-group">
              <label for="test-phone" class="form-label">
                Телефон
              </label>
              <input
                type="tel"
                id="test-phone"
                name="phone"
                class="form-input"
                required
                autocomplete="tel"
              />
            </div>
            <button type="submit" class="btn btn--primary btn--block">
              Получить результат теста
            </button>
          </form>
        </div>
      ),

      emergency: (
        <div>
          <div class="emergency-notice">
            <div class="emergency-notice__icon">🚨</div>
            <div class="emergency-notice__text">Экстренная консультация в течение 2 часов</div>
          </div>
          <form class="modal-form" data-form-type="emergency">
            <div class="form-group">
              <label for="emergency-name" class="form-label">
                Ваше имя
              </label>
              <input
                type="text"
                id="emergency-name"
                name="name"
                class="form-input"
                required
                autocomplete="name"
              />
            </div>
            <div class="form-group">
              <label for="emergency-phone" class="form-label">
                Телефон
              </label>
              <input
                type="tel"
                id="emergency-phone"
                name="phone"
                class="form-input"
                required
                autocomplete="tel"
              />
            </div>
            <div class="form-group">
              <label for="emergency-situation" class="form-label">
                Опишите срочную ситуацию
              </label>
              <textarea
                id="emergency-situation"
                name="emergency_situation"
                class="form-textarea"
                rows={3}
                required
                placeholder="Коллекторы угрожают, арестованы счета, завтра суд..."
                autocomplete="off"
              ></textarea>
            </div>
            <button type="submit" class="btn btn--danger btn--block">
              Получить помощь сейчас
            </button>
          </form>
        </div>
      ),
    };

    return modalTemplates[type] || <div>Modal content not found</div>;
  };

  return (
    <>
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          id={modal.id}
          title={
            modal.type === 'consultation'
              ? 'Бесплатная консультация юриста'
              : modal.type === 'calculator'
                ? 'Калькулятор банкротства'
                : modal.type === 'guide-download'
                  ? 'Скачать гид по банкротству 2025'
                  : modal.type === 'checklist-download'
                    ? 'Получить чек-лист должника'
                    : modal.type === 'test'
                      ? 'Тест на возможность банкротства'
                      : modal.type === 'emergency'
                        ? 'Экстренная правовая помощь'
                        : 'Модальное окно'
          }
        >
          {getModalContent(modal.type)}
        </Modal>
      ))}
    </>
  );
}
