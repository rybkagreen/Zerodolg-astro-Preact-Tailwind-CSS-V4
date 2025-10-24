import type { JSX } from 'preact';

// Loading spinner component
export const LoadingSpinner = (): JSX.Element => (
  <svg class='animate-spin h-5 w-5' viewBox='0 0 24 24' aria-label='Загрузка'>
    <circle
      class='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      stroke-width='4'
      fill='none'
    />
    <path
      class='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
);

// Success animation component
export const SuccessCheckmark = (): JSX.Element => (
  <div class='success-checkmark'>
    <svg class='w-16 h-16' viewBox='0 0 52 52'>
      <circle
        class='checkmark-circle'
        cx='26'
        cy='26'
        r='25'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
      />
      <path
        class='checkmark-check'
        fill='none'
        stroke='currentColor'
        stroke-width='3'
        d='M14.1 27.2l7.1 7.2 16.7-16.8'
      />
    </svg>
    <style jsx>{`
      @keyframes stroke {
        100% {
          stroke-dashoffset: 0;
        }
      }
      @keyframes scale {
        0%,
        100% {
          transform: none;
        }
        50% {
          transform: scale3d(1.1, 1.1, 1);
        }
      }
      @keyframes fill {
        100% {
          box-shadow: inset 0px 0px 0px 30px #10b981;
        }
      }
      .checkmark-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      .checkmark-check {
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      .success-checkmark {
        animation:
          fill 0.4s ease-in-out 0.4s both,
          scale 0.3s ease-in-out 0.9s both;
      }
    `}</style>
  </div>
);

// Field Error Component with animation
export const FieldError = ({ message }: { message: string }): JSX.Element => (
  <div class='mt-1 flex items-center text-sm text-red-500 animate-fade-in' role='alert'>
    <svg class='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
      <path
        fill-rule='evenodd'
        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
        clip-rule='evenodd'
      />
    </svg>
    <span>{message}</span>
  </div>
);

// Error Boundary Component
export function FormErrorBoundary({ children, className = '' }: { children: JSX.Element; className?: string }) {
  return (
    <div class={`form-error-boundary ${className}`}>
      {children}
    </div>
  );
}