import { type VNode } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import { usePerformanceMonitor } from '../../shared/hooks/usePerformanceMonitor';
import { useIntersectionObserver } from '../../shared/hooks/useIntersectionObserver';

// Define TypeScript interfaces - matching team-members.ts
interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  role: string;
  quote: string;
  description: string;
  stats: {
    experience: string;
    cases: string;
    success: string;
  };
  specializations: string[];
  achievements: string[];
  contacts: {
    phone: string;
    email: string;
  };
  documents?: {
    title: string;
    type: string;
    image: string;
    description: string;
    alt: string;
    keywords: string[];
    hashtags: string[];
    issuedBy?: string;
    issueDate?: string;
    validUntil?: string;
    documentNumber?: string;
    seoTitle: string;
    seoDescription: string;
  }[];
}

interface TeamStats {
  totalExperience: string;
  totalCases: string;
  totalSaved: string;
  successRate: string;
}

interface Props {
  members?: TeamMember[];
  stats?: TeamStats;
}

export default function TeamInteractiveEnhanced({ members = [], stats }: Props): VNode {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(members[0]?.id || null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TeamMember['documents'][number] | null>(
    null
  );
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [observerRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const prefersReducedMotion = useReducedMotion();
  usePerformanceMonitor('TeamInteractiveEnhanced');

  // Set visibility when component comes into view
  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true);
    }
  }, [isIntersecting]);

  const handleTabChange = useCallback((memberId: string) => {
    setActiveMemberId(memberId);
    setIsDocumentsOpen(false); // Reset documents accordion
  }, []);

  const handleArrowNavigation = useCallback(
    (e: KeyboardEvent, currentIndex: number) => {
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
    },
    [members]
  );

  const handleDocumentClick = useCallback((document: TeamMember['documents'][number]) => {
    setSelectedDocument(document);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDocument(null);
  }, []);

  const toggleDocuments = useCallback(() => {
    setIsDocumentsOpen((prev) => !prev);
  }, []);

  // Handle ESC key to close modal and prevent body scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDocument) {
        handleCloseModal();
      }
    };

    if (selectedDocument) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = originalStyle;
      };
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [selectedDocument, handleCloseModal]);

  // Early return if no members
  if (!members || members.length === 0) {
    return (
      <section class='py-16 md:py-24' id='team'>
        <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div class='text-center'>
            <h2 class='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Наша команда экспертов
            </h2>
            <p class='text-lg text-gray-600'>Информация о команде обновляется...</p>
          </div>
        </div>
      </section>
    );
  }

  const activeMember = members.find((member) => member.id === activeMemberId);

  // Animation styles based on visibility and reduced motion preference
  const containerStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: prefersReducedMotion ? 'none' : 'all 0.5s ease-out',
  };

  return (
    <>
      <section
        ref={observerRef}
        class='team-section relative py-20 md:py-28 lg:py-36 overflow-hidden'
        id='team'
        style={containerStyle}
        aria-labelledby='team-title'
      >
        {/* Background layers matching Benefits section style */}
        <div class='absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40'></div>

        {/* Team watercolor pattern background */}
        <div
          class='absolute inset-0 opacity-25 mix-blend-multiply'
          style='background-image: url("/patterns/watercolor_team_professionals_00001_.png"); background-size: cover; background-position: center; background-repeat: no-repeat;'
        ></div>

        {/* Subtle dot pattern overlay */}
        <div
          class='absolute inset-0 opacity-5'
          style='background-image: url("/patterns/hero-dots.svg"); background-size: 80px 80px;'
        ></div>

        <div class='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <header class='text-center mb-12 md:mb-16 lg:mb-20'>
            <div class='inline-flex items-center gap-2 rounded-full bg-blue-100/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-blue-700 ring-1 ring-blue-200/50 mb-8'>
              <svg
                class='h-4 w-4 text-blue-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              Наша команда экспертов
            </div>
            <h2
              id='team-title'
              class='text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight'
            >
              Профессионалы судебного банкротства с десятилетним стажем
            </h2>
            <p class='text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium'>
              Профессионалы, которые спасли от долгов более 1000 семей
            </p>
          </header>

          <div class='flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12'>
            {/* Team Tabs */}
            <div
              class='lg:w-2/5 xl:w-1/3 space-y-3 md:space-y-4'
              role='tablist'
              aria-label='Выбор члена команды'
            >
              {members.map((member, index) => {
                const isActive = activeMemberId === member.id;
                const gradientClasses = [
                  'from-blue-500 to-purple-600',
                  'from-emerald-500 to-teal-600',
                  'from-orange-500 to-red-600',
                  'from-violet-500 to-pink-600',
                ];
                const bgGradients = [
                  'bg-gradient-to-br from-blue-50 to-purple-50',
                  'bg-gradient-to-br from-emerald-50 to-teal-50',
                  'bg-gradient-to-br from-orange-50 to-red-50',
                  'bg-gradient-to-br from-violet-50 to-pink-50',
                ];

                const gradient = gradientClasses[index % gradientClasses.length];
                const bgGradient = bgGradients[index % bgGradients.length];

                const tabStyle = {
                  transform: isActive && isVisible ? 'scale(1.02) translateY(-2px)' : 'scale(1)',
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                };

                return (
                  <button
                    key={member.id}
                    style={tabStyle}
                    class={`group relative w-full flex items-center gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
                      isActive
                        ? 'border-blue-500/50 bg-white/80 backdrop-blur-md shadow-lg shadow-slate-900/10 scale-[1.02] -translate-y-1'
                        : 'border-white/50 bg-white/60 backdrop-blur-md shadow-md shadow-slate-900/5 hover:bg-white/85 hover:shadow-lg hover:shadow-slate-900/10 hover:border-slate-200/60'
                    }`}
                    role='tab'
                    aria-selected={isActive}
                    aria-controls={`team-member-${member.id}`}
                    tabindex={isActive ? 0 : -1}
                    onClick={() => handleTabChange(member.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleTabChange(member.id);
                      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                        handleArrowNavigation(e, index);
                      }
                    }}
                  >
                    {/* Gradient accent border */}
                    <div
                      class={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient} ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      } transition-transform duration-500 origin-left rounded-t-2xl`}
                    />

                    {/* Avatar with gradient border */}
                    <div class='relative flex-shrink-0'>
                      <div
                        class={`w-16 h-16 md:w-18 md:h-18 rounded-full p-0.5 bg-gradient-to-r ${gradient} ${
                          isActive ? 'shadow-lg' : 'group-hover:shadow-md'
                        } transition-all duration-300`}
                      >
                        <div class='w-full h-full rounded-full overflow-hidden bg-white p-0.5'>
                          <img
                            class='w-full h-full object-cover rounded-full'
                            src={member.photo}
                            alt={member.name}
                            loading='lazy'
                            decoding='async'
                          />
                        </div>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div
                          class={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}
                        >
                          <svg class='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div class='flex-1 min-w-0'>
                      <div class='font-bold text-slate-900 mb-1 text-lg group-hover:text-blue-600 transition-colors duration-200'>
                        {member.name}
                      </div>
                      <div class='text-slate-600 font-medium text-sm mb-1'>{member.position}</div>
                      <div class='text-xs text-slate-500 font-medium'>
                        {member.stats.experience} лет опыта • {member.stats.cases} дел
                      </div>
                    </div>

                    {/* Hover background gradient */}
                    <div
                      class={`absolute inset-0 ${bgGradient} opacity-0 ${isActive ? 'opacity-100' : 'group-hover:opacity-100'} transition-opacity duration-500 -z-10 rounded-2xl`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Team Content */}
            <div class='lg:w-3/5 xl:w-2/3'>
              {activeMember && (
                <div
                  class='relative p-6 md:p-8 xl:p-10 rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md shadow-lg shadow-slate-900/10 transition-all duration-500 overflow-hidden'
                  id={`team-member-${activeMember.id}`}
                  role='tabpanel'
                  aria-hidden='false'
                >
                  {/* Decorative gradient background */}
                  <div class='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/30 rounded-full -translate-y-8 translate-x-8 blur-xl opacity-60'></div>

                  <div class='relative mb-8'>
                    <h3 class='text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight'>
                      {activeMember.name}
                    </h3>
                    <div class='text-xl font-semibold text-blue-600 mb-2'>{activeMember.role}</div>
                    <div class='flex items-center gap-4 text-sm text-slate-500 font-medium'>
                      <span class='flex items-center gap-1'>
                        <svg
                          class='w-4 h-4 text-emerald-500'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {activeMember.stats.experience} лет опыта
                      </span>
                      <span class='flex items-center gap-1'>
                        <svg class='w-4 h-4 text-blue-500' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        {activeMember.stats.cases} дел
                      </span>
                      <span class='flex items-center gap-1'>
                        <svg class='w-4 h-4 text-amber-500' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                        {activeMember.stats.success} успешность
                      </span>
                    </div>
                  </div>

                  <blockquote class='relative text-xl italic text-slate-700 mb-8 pl-6'>
                    <div class='absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full'></div>
                    <svg
                      class='absolute -left-2 -top-2 w-8 h-8 text-blue-500/20'
                      fill='currentColor'
                      viewBox='0 0 32 32'
                    >
                      <path d='M4 8v20l8-8h16V8H4zm2 2h20v8H13l-7 7V10z' />
                    </svg>
                    <span class='relative z-10'>“{activeMember.quote}”</span>
                  </blockquote>

                  <p class='text-lg text-slate-600 leading-relaxed mb-10 font-medium'>
                    {activeMember.description}
                  </p>

                  <div class='space-y-10'>
                    {/* Stats Cards */}
                    {activeMember.stats && (
                      <div class='grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6'>
                        <div class='group relative text-center p-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-md shadow-slate-900/5 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300'>
                          <div class='absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                          <div class='relative'>
                            <div class='text-3xl font-bold text-emerald-600 mb-2'>
                              {activeMember.stats.experience}
                            </div>
                            <div class='text-sm font-medium text-slate-600'>лет опыта</div>
                          </div>
                        </div>
                        <div class='group relative text-center p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-md shadow-slate-900/5 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300'>
                          <div class='absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                          <div class='relative'>
                            <div class='text-3xl font-bold text-blue-600 mb-2'>
                              {activeMember.stats.cases}
                            </div>
                            <div class='text-sm font-medium text-slate-600'>успешных дел</div>
                          </div>
                        </div>
                        <div class='group relative text-center p-6 bg-gradient-to-br from-amber-50/80 to-orange-50/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-md shadow-slate-900/5 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300'>
                          <div class='absolute inset-0 bg-gradient-to-br from-amber-100/30 to-orange-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                          <div class='relative'>
                            <div class='text-3xl font-bold text-amber-600 mb-2'>
                              {activeMember.stats.success}
                            </div>
                            <div class='text-sm font-medium text-slate-600'>успешность</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Specializations */}
                    {activeMember.specializations && activeMember.specializations.length > 0 && (
                      <div class='space-y-6'>
                        <h4 class='text-2xl font-bold text-slate-900 flex items-center gap-3'>
                          <div class='w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full'></div>
                          Специализация
                        </h4>
                        <div class='flex flex-wrap gap-3'>
                          {activeMember.specializations.map((spec: string, index: number) => {
                            const gradientClasses = [
                              'from-blue-500 to-indigo-600',
                              'from-emerald-500 to-teal-600',
                              'from-orange-500 to-red-600',
                              'from-violet-500 to-pink-600',
                            ];
                            const gradient = gradientClasses[index % gradientClasses.length];

                            return (
                              <span
                                key={index}
                                class={`inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${gradient} text-white rounded-full text-sm font-semibold shadow-lg shadow-slate-900/20 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5`}
                              >
                                <svg class='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                  <path
                                    fillRule='evenodd'
                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                                {spec}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {activeMember.achievements && activeMember.achievements.length > 0 && (
                      <div class='space-y-4'>
                        <h4 class='text-xl font-bold text-slate-900 flex items-center gap-3'>
                          <div class='w-2 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full'></div>
                          Ключевые достижения
                        </h4>
                        <div class='grid grid-cols-1 md:grid-cols-2 gap-3'>
                          {activeMember.achievements.map((achievement: string, index: number) => (
                            <div
                              key={index}
                              class='group flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50/60 to-emerald-50/40 border border-white/40 backdrop-blur-sm hover:from-green-100/60 hover:to-emerald-100/40 transition-all duration-200'
                            >
                              <div class='flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200'>
                                <svg
                                  class='w-3 h-3 text-white'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              </div>
                              <span class='text-slate-700 font-medium text-sm leading-tight group-hover:text-slate-900 transition-colors duration-200'>
                                {achievement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents Accordion */}
                    {activeMember.documents && activeMember.documents.length > 0 && (
                      <div class='space-y-4'>
                        {/* Accordion Header */}
                        <button
                          onClick={toggleDocuments}
                          class='w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 to-blue-50/60 border border-white/50 backdrop-blur-sm hover:from-indigo-100/80 hover:to-blue-100/60 transition-all duration-300 group'
                        >
                          <h4 class='text-xl font-bold text-slate-900 flex items-center gap-3'>
                            <div class='w-2 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full'></div>
                            Лицензии и сертификаты ({activeMember.documents.length})
                          </h4>
                          <div
                            class={`transform transition-transform duration-300 ${isDocumentsOpen ? 'rotate-180' : 'rotate-0'}`}
                          >
                            <svg
                              class='w-5 h-5 text-slate-600 group-hover:text-indigo-600'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M19 9l-7 7-7-7'
                              />
                            </svg>
                          </div>
                        </button>

                        {/* Accordion Content */}
                        <div
                          class={`overflow-hidden transition-all duration-500 ease-in-out ${isDocumentsOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          <div class='grid grid-cols-2 md:grid-cols-4 gap-3 pt-2'>
                            {activeMember.documents.map((document, index: number) => (
                              <div
                                key={index}
                                class='group relative overflow-hidden p-3 rounded-lg border border-white/50 bg-white/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-300 cursor-pointer hover:scale-105'
                                onClick={() => handleDocumentClick(document)}
                              >
                                {/* Document image preview */}
                                <div class='w-full aspect-[3/4] rounded-md overflow-hidden bg-white/80 shadow-inner mb-3'>
                                  <img
                                    src={document.image}
                                    alt={document.alt || document.title}
                                    title={document.seoTitle || document.title}
                                    class='w-full h-full object-cover object-top'
                                    loading='lazy'
                                    decoding='async'
                                  />
                                </div>

                                {/* Document info */}
                                <div class='space-y-1'>
                                  <div class='inline-block px-2 py-1 rounded-md text-xs font-medium text-indigo-700 bg-indigo-100/80'>
                                    {document.type}
                                  </div>
                                  <h5 class='font-semibold text-slate-900 text-xs leading-tight line-clamp-2'>
                                    {document.title}
                                  </h5>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact - Only show for Levan (mashulia) */}
                  {activeMember.contacts && activeMember.id === 'mashulia' && (
                    <div class='flex flex-wrap gap-4 mt-12 pt-8 border-t border-slate-200/60'>
                      <a
                        href={`tel:${activeMember.contacts.phone.replace(/[^\\d+]/g, '')}`}
                        class='group inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-900/25 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-105 hover:-translate-y-1 transition-all duration-300'
                      >
                        <div class='w-5 h-5 group-hover:scale-110 transition-transform duration-200'>
                          <svg fill='currentColor' viewBox='0 0 20 20' class='w-full h-full'>
                            <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                          </svg>
                        </div>
                        Позвонить специалисту
                      </a>
                      <a
                        href={`mailto:${activeMember.contacts.email}`}
                        class='group inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/30 hover:scale-105 hover:-translate-y-1 transition-all duration-300'
                      >
                        <div class='w-5 h-5 group-hover:scale-110 transition-transform duration-200'>
                          <svg fill='currentColor' viewBox='0 0 20 20' class='w-full h-full'>
                            <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                            <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                          </svg>
                        </div>
                        Написать письмо
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Overall Team Stats */}
          {stats && (
            <div class='mt-16 md:mt-20 lg:mt-24'>
              <div class='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div class='pt-12 md:pt-16 border-t border-slate-200/60'>
                  <h3 class='text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-10 md:mb-12 lg:mb-16'>
                    Эффективность нашей работы
                  </h3>
                  <div class='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto'>
                    <div class='group relative overflow-hidden bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-white/50 shadow-lg shadow-slate-900/5 text-center hover:shadow-xl hover:shadow-slate-900/10 hover:scale-105 hover:-translate-y-1 transition-all duration-500 min-h-[160px] md:min-h-[180px] flex flex-col justify-center'>
                      <div class='absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div class='relative flex flex-col items-center justify-center h-full'>
                        <div class='w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                          <svg
                            class='w-5 h-5 md:w-6 md:h-6 text-white'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                        <div class='text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors duration-300'>
                          {stats.totalExperience}
                        </div>
                        <div class='text-xs md:text-sm text-slate-600 font-medium leading-tight text-center px-1'>
                          лет суммарного опыта
                        </div>
                      </div>
                    </div>
                    <div class='group relative overflow-hidden bg-gradient-to-br from-emerald-50/80 to-teal-50/60 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-white/50 shadow-lg shadow-slate-900/5 text-center hover:shadow-xl hover:shadow-slate-900/10 hover:scale-105 hover:-translate-y-1 transition-all duration-500 min-h-[160px] md:min-h-[180px] flex flex-col justify-center'>
                      <div class='absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div class='relative flex flex-col items-center justify-center h-full'>
                        <div class='w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                          <svg
                            class='w-5 h-5 md:w-6 md:h-6 text-white'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                        </div>
                        <div class='text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2 group-hover:text-emerald-600 transition-colors duration-300'>
                          {stats.totalCases}
                        </div>
                        <div class='text-xs md:text-sm text-slate-600 font-medium leading-tight text-center px-1'>
                          проведенных дел
                        </div>
                      </div>
                    </div>
                    <div class='group relative overflow-hidden bg-gradient-to-br from-amber-50/80 to-orange-50/60 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-white/50 shadow-lg shadow-slate-900/5 text-center hover:shadow-xl hover:shadow-slate-900/10 hover:scale-105 hover:-translate-y-1 transition-all duration-500 min-h-[160px] md:min-h-[180px] flex flex-col justify-center'>
                      <div class='absolute inset-0 bg-gradient-to-br from-amber-100/30 to-orange-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div class='relative flex flex-col items-center justify-center h-full'>
                        <div class='w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                          <svg
                            class='w-5 h-5 md:w-6 md:h-6 text-white'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' />
                          </svg>
                        </div>
                        <div class='text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2 group-hover:text-amber-600 transition-colors duration-300'>
                          {stats.totalSaved}
                        </div>
                        <div class='text-xs md:text-sm text-slate-600 font-medium leading-tight text-center px-1'>
                          списано долгов
                        </div>
                      </div>
                    </div>
                    <div class='group relative overflow-hidden bg-gradient-to-br from-violet-50/80 to-pink-50/60 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-2xl border border-white/50 shadow-lg shadow-slate-900/5 text-center hover:shadow-xl hover:shadow-slate-900/10 hover:scale-105 hover:-translate-y-1 transition-all duration-500 min-h-[160px] md:min-h-[180px] flex flex-col justify-center'>
                      <div class='absolute inset-0 bg-gradient-to-br from-violet-100/30 to-pink-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div class='relative flex flex-col items-center justify-center h-full'>
                        <div class='w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-xl bg-gradient-to-r from-violet-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                          <svg
                            class='w-5 h-5 md:w-6 md:h-6 text-white'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        </div>
                        <div class='text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 md:mb-2 group-hover:text-violet-600 transition-colors duration-300'>
                          {stats.successRate}
                        </div>
                        <div class='text-xs md:text-sm text-slate-600 font-medium leading-tight text-center px-1'>
                          успешных дел
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Document Modal rendered via Portal to document.body */}
      {selectedDocument &&
        createPortal(
          <div
            class='fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] p-4 overflow-auto'
            onClick={handleCloseModal}
          >
            <div class='min-h-full flex items-center justify-center'>
              <div
                class='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-4'
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: 'calc(100vh - 2rem)' }}
              >
                {/* Modal Header */}
                <div class='flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white flex-shrink-0'>
                  <div class='flex-1 min-w-0'>
                    <h3 class='text-xl md:text-2xl font-bold text-slate-900 truncate'>
                      {selectedDocument.title}
                    </h3>
                    <p class='text-slate-600 mt-1 text-sm md:text-base'>{selectedDocument.type}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    class='ml-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 flex-shrink-0'
                    aria-label='Закрыть'
                  >
                    <svg
                      class='w-4 h-4 md:w-5 md:h-5 text-gray-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div class='flex-1 overflow-y-auto'>
                  <div class='p-4 md:p-6'>
                    <div class='mb-4 md:mb-6'>
                      <img
                        src={selectedDocument.image}
                        alt={selectedDocument.alt || selectedDocument.title}
                        title={selectedDocument.seoTitle || selectedDocument.title}
                        class='w-full h-auto rounded-lg shadow-lg'
                        loading='lazy'
                        decoding='async'
                      />
                    </div>

                    {/* Document Description */}
                    <div class='p-4 bg-gray-50 rounded-lg'>
                      <p class='text-slate-700 leading-relaxed text-sm md:text-base mb-4'>
                        {selectedDocument.seoDescription || selectedDocument.description}
                      </p>

                      {/* Keywords */}
                      {selectedDocument.keywords && selectedDocument.keywords.length > 0 && (
                        <div class='mb-3'>
                          <h4 class='text-sm font-semibold text-slate-800 mb-2'>Ключевые слова:</h4>
                          <div class='flex flex-wrap gap-1'>
                            {selectedDocument.keywords
                              .slice(0, 5)
                              .map((keyword: string, index: number) => (
                                <span
                                  key={index}
                                  class='inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'
                                >
                                  {keyword}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Document metadata if available */}
                      {(selectedDocument.issuedBy || selectedDocument.issueDate) && (
                        <div class='text-xs text-slate-500 border-t border-gray-200 pt-3 mt-3'>
                          {selectedDocument.issuedBy && (
                            <p>
                              <strong>Выдан:</strong> {selectedDocument.issuedBy}
                            </p>
                          )}
                          {selectedDocument.issueDate && (
                            <p>
                              <strong>Дата выдачи:</strong> {selectedDocument.issueDate}
                            </p>
                          )}
                          {selectedDocument.validUntil && (
                            <p>
                              <strong>Действует до:</strong> {selectedDocument.validUntil}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div class='flex items-center justify-between p-4 md:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0'>
                  <div class='flex items-center gap-2 text-xs md:text-sm text-slate-500'>
                    <svg class='w-3 h-3 md:w-4 md:h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Нажмите ESC чтобы закрыть
                  </div>
                  <button
                    onClick={handleCloseModal}
                    class='px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base'
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
