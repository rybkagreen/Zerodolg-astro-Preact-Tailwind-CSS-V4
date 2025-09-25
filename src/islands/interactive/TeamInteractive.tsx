import { type VNode } from 'preact';
import { useState } from 'preact/hooks';

// Define TypeScript interfaces
interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  experience: number;
  verified: boolean;
  photo?: string;
  role?: string;
  quote?: string;
  description?: string;
  stats?: {
    experience: number;
    cases: number;
    success: number;
  };
  specializations?: string[];
  achievements?: string[];
  contacts?: {
    phone: string;
    email: string;
  };
}

interface Props {
  initialMembers: TeamMember[];
}

export default function TeamInteractive({ initialMembers }: Props): VNode {
  const [members] = useState<TeamMember[]>(initialMembers);

  const [activeMemberId, setActiveMemberId] = useState<string | null>(initialMembers[0]?.id || null);

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

  const activeMember = members.find((member) => member.id === activeMemberId);

  return (
    <section class="py-16 md:py-24" id="team">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Наша команда экспертов</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Профессионалы с многолетним опытом в сфере банкротства физических лиц
          </p>
        </div>

        <div class="flex flex-col md:flex-row gap-8">
          {/* Team Tabs */}
          <div class="md:w-1/3 space-y-4" role="tablist" aria-label="Выбор члена команды">
            {members.map((member, index) => (
              <button
                class={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${activeMemberId === member.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
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
                <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
                  <img class="w-full h-full object-cover" src={member.photo} alt={member.name} loading="lazy" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{member.name}</div>
                  <div class="text-gray-600">{member.position}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Team Content */}
          <div class="md:w-2/3">
            {activeMember && (
              <div
                class={'p-6 md:p-8 rounded-xl border border-gray-200 bg-white'}
                id={`team-member-${activeMember.id}`}
                role="tabpanel"
                aria-hidden="false"
              >
                <div class="mb-6">
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">{activeMember.name}</h3>
                  <div class="text-lg text-blue-600 font-medium">{activeMember.role}</div>
                </div>

                <blockquote class="text-lg italic text-gray-700 border-l-4 border-blue-500 pl-4 mb-6">
                  {activeMember.quote}
                </blockquote>

                <p class="text-gray-600 mb-8">{activeMember.description}</p>

                <div class="space-y-8">
                  {/* Stats */}
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                      <div class="text-2xl font-bold text-blue-600">{activeMember.stats.experience}</div>
                      <div class="text-sm text-gray-600">лет опыта</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                      <div class="text-2xl font-bold text-blue-600">{activeMember.stats.cases}</div>
                      <div class="text-sm text-gray-600">успешных дел</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                      <div class="text-2xl font-bold text-blue-600">{activeMember.stats.success}</div>
                      <div class="text-sm text-gray-600">успешность</div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div class="space-y-4">
                    <h4 class="text-xl font-semibold text-gray-900">Специализация</h4>
                    <div class="flex flex-wrap gap-2">
                      {activeMember.specializations.map((spec: string) => (
                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div class="space-y-4">
                    <h4 class="text-xl font-semibold text-gray-900">Достижения</h4>
                    <ul class="space-y-2">
                      {activeMember.achievements.map((achievement: string) => (
                        <li class="flex items-start gap-2">
                          <span class="text-green-500 mt-1">✓</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contact */}
                <div class="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <a
                    href={`tel:${activeMember.contacts.phone.replace(/[^\d+]/g, '')}`}
                    class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
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
                  <a href={`mailto:${activeMember.contacts.email}`} class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
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
