import { useState } from 'preact/hooks';
import type { TeamMember } from '../../types/team';

interface Props {
  members: TeamMember[];
}

export default function TeamInteractive({ members }: Props) {
  const [activeMemberId, setActiveMemberId] = useState<string>(members[0]?.id || '');

  const handleTabChange = (memberId: string): void => {
    setActiveMemberId(memberId);
  };

  const handleArrowNavigation = (e: KeyboardEvent, currentIndex: number): void => {
    let newIndex: number | undefined;

    if (e.key === 'ArrowDown') {
      newIndex = Math.min(currentIndex + 1, members.length - 1);
    } else if (e.key === 'ArrowUp') {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    if (newIndex !== undefined && newIndex !== currentIndex) {
      e.preventDefault();
      const memberId = members[newIndex]?.id;
      if (memberId) {
        setActiveMemberId(memberId);
      }
    }
  };

  const activeMember = members.find(member => member.id === activeMemberId);

  return (
    <section class="team-interactive" id="team">
      <div class="container">
        <div class="team-interactive__header">
          <h2 class="team-interactive__title section-title">Наша команда экспертов</h2>
          <p class="team-interactive__subtitle">
            Профессионалы с многолетним опытом в сфере банкротства физических лиц
          </p>
        </div>

        <div class="team-interactive__wrapper">
          {/* Team Tabs */}
          <div 
            class="team-interactive__tabs" 
            role="tablist" 
            aria-label="Выбор члена команды"
          >
            {members.map((member, index) => (
              <button
                class={`team-tab ${activeMemberId === member.id ? 'active' : ''}`}
                role="tab"
                aria-selected={activeMemberId === member.id ? 'true' : 'false'}
                aria-controls={`team-member-${member.id}`}
                tabindex={activeMemberId === member.id ? 0 : -1}
                onClick={() => handleTabChange(member.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTabChange(member.id);
                  } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    handleArrowNavigation(e, index);
                  }
                }}
              >
                <div class="team-tab__photo">
                  <img src={member.photo} alt={member.name} loading="lazy" />
                </div>
                <div class="team-tab__info">
                  <div class="team-tab__name">{member.name}</div>
                  <div class="team-tab__position">{member.position}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Team Content */}
          <div class="team-interactive__content">
            {activeMember && (
              <div
                class={`team-member active`}
                id={`team-member-${activeMember.id}`}
                role="tabpanel"
                aria-hidden="false"
              >
                <div class="team-member__header">
                  <h3 class="team-member__name">{activeMember.name}</h3>
                  <div class="team-member__role">{activeMember.role}</div>
                </div>

                <blockquote class="team-member__quote">{activeMember.quote}</blockquote>

                <p class="team-member__description">{activeMember.description}</p>

                <div class="team-member__details">
                  {/* Stats */}
                  <div class="team-member__stats">
                    <div class="team-member__stat">
                      <span class="team-member__stat-value">{activeMember.stats.experience}</span>
                      <span class="team-member__stat-label">лет опыта</span>
                    </div>
                    <div class="team-member__stat">
                      <span class="team-member__stat-value">{activeMember.stats.cases}</span>
                      <span class="team-member__stat-label">успешных дел</span>
                    </div>
                    <div class="team-member__stat">
                      <span class="team-member__stat-value">{activeMember.stats.success}</span>
                      <span class="team-member__stat-label">успешность</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div class="team-member__section">
                    <h4 class="team-member__subtitle">Специализация</h4>
                    <div class="team-member__tags">
                      {activeMember.specializations.map((spec: string) => (
                        <span class="team-member__tag">{spec}</span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div class="team-member__section">
                    <h4 class="team-member__subtitle">Достижения</h4>
                    <ul class="team-member__list">
                      {activeMember.achievements.map((achievement: string) => (
                        <li>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contact */}
                <div class="team-member__contact">
                  <a
                    href={`tel:${activeMember.contacts.phone.replace(/[^\d+]/g, '')}`}
                    class="team-member__link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Позвонить
                  </a>
                  <a href={`mailto:${activeMember.contacts.email}`} class="team-member__link">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Написать
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}