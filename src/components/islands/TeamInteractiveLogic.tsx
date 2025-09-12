import { useEffect } from 'preact/hooks';

/**
 * Team Interactive Component Logic
 * Handles tab switching for team members
 */
class TeamInteractive {
  private section: HTMLElement | null = null;
  private tabs: HTMLElement[] = [];
  private members: HTMLElement[] = [];
  private currentMember: string = 'mashulia';
  private initialized: boolean = false;

  init(): void {
    this.section = document.querySelector('.team-interactive');
    if (!this.section || this.initialized) return;

    this.tabs = Array.from(this.section.querySelectorAll('.team-tab'));
    this.members = Array.from(this.section.querySelectorAll('.team-member'));

    if (this.tabs.length === 0 || this.members.length === 0) return;

    this.setupEventListeners();
    this.initialized = true;
  }

  private setupEventListeners(): void {
    // Tab click handlers
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const memberId = (tab as HTMLElement).dataset.member;
        if (memberId && memberId !== this.currentMember) {
          this.switchToMember(memberId);
        }
      });

      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          e.preventDefault();
          const memberId = (tab as HTMLElement).dataset.member;
          if (memberId) {
            this.switchToMember(memberId);
          }
        }
      });
    });

    // Keyboard navigation between tabs
    if (this.section) {
      this.section.addEventListener('keydown', (e) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === 'ArrowDown' || keyEvent.key === 'ArrowUp') {
        this.handleArrowNavigation(keyEvent);
      }
      });
    }

    // Mobile swipe support
    if (window.innerWidth <= 968) {
      this.setupSwipeSupport();
    }
  }

  private switchToMember(memberId: string): void {
    // Don't switch if it's the same member
    if (memberId === this.currentMember) return;

    // Update tabs
    this.tabs.forEach((tab) => {
      const tabElement = tab as HTMLElement;
      if (tabElement.dataset.member === memberId) {
        tabElement.classList.add('active');
        tabElement.setAttribute('aria-selected', 'true');
        tabElement.setAttribute('tabindex', '0');
      } else {
        tabElement.classList.remove('active');
        tabElement.setAttribute('aria-selected', 'false');
        tabElement.setAttribute('tabindex', '-1');
      }
    });

    // Hide all members first
    this.members.forEach((member) => {
      const memberElement = member as HTMLElement;
      memberElement.classList.remove('active', 'is-active');
      memberElement.style.display = 'none';
      memberElement.setAttribute('aria-hidden', 'true');
    });

    // Find and show the new member
    const newMember = this.members.find(
      (member) => (member as HTMLElement).dataset.member === memberId
    ) as HTMLElement;

    if (!newMember) {
      console.error(`Team member with id "${memberId}" not found`);
      return;
    }

    // Show the new member
    newMember.style.display = 'block';
    newMember.classList.add('active', 'is-active');
    newMember.setAttribute('aria-hidden', 'false');

    // Update current member tracking
    this.currentMember = memberId;

    // Track analytics
    this.trackEvent('team_member_switch', {
      member_id: memberId,
      member_name: this.getMemberName(memberId),
    });
  }

  private handleArrowNavigation(e: KeyboardEvent): void {
    const currentIndex = this.tabs.findIndex(
      (tab) => (tab as HTMLElement).dataset.member === this.currentMember
    );
    let newIndex: number | undefined;

    if (e.key === 'ArrowDown') {
      newIndex = Math.min(currentIndex + 1, this.tabs.length - 1);
    } else if (e.key === 'ArrowUp') {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    if (newIndex !== undefined && newIndex !== currentIndex) {
      e.preventDefault();
      const newMemberId = (this.tabs[newIndex] as HTMLElement).dataset.member;
      if (newMemberId) {
        this.switchToMember(newMemberId);
        (this.tabs[newIndex] as HTMLElement).focus();
      }
    }
  }

  private setupSwipeSupport(): void {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    // Add touch event listeners to the content area for better mobile UX
    const contentArea = this.section?.querySelector('.team-interactive__content') as HTMLElement;
    const touchTarget = contentArea || this.section;

    if (!touchTarget) return;

    touchTarget.addEventListener('touchstart', (e) => {
      const touchEvent = e as TouchEvent;
      touchStartX = touchEvent.changedTouches[0].screenX;
      touchStartY = touchEvent.changedTouches[0].screenY;
      isSwiping = true;
    }, { passive: true });

    touchTarget.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      
      const touchEvent = e as TouchEvent;
      // Calculate the swipe angle to determine if it's horizontal
      const currentX = touchEvent.changedTouches[0].screenX;
      const currentY = touchEvent.changedTouches[0].screenY;
      const diffX = Math.abs(currentX - touchStartX);
      const diffY = Math.abs(currentY - touchStartY);
      
      // If vertical swipe is dominant, don't handle as team switch
      if (diffY > diffX) {
        isSwiping = false;
      }
    }, { passive: true });

    touchTarget.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      
      const touchEvent = e as TouchEvent;
      touchEndX = touchEvent.changedTouches[0].screenX;
      touchEndY = touchEvent.changedTouches[0].screenY;
      this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
      isSwiping = false;
    }, { passive: true });
  }

  private handleSwipe(startX: number, startY: number, endX: number, endY: number): void {
    const swipeThreshold = 50;
    const diffX = startX - endX;
    const diffY = Math.abs(startY - endY);

    // Only handle horizontal swipes (ignore vertical swipes)
    if (Math.abs(diffX) > swipeThreshold && diffY < 100) {
      const currentIndex = this.tabs.findIndex(
        (tab) => (tab as HTMLElement).dataset.member === this.currentMember
      );
      
      if (diffX > 0 && currentIndex < this.tabs.length - 1) {
        // Swipe left - next member
        const nextMemberId = (this.tabs[currentIndex + 1] as HTMLElement).dataset.member;
        if (nextMemberId) {
          this.switchToMember(nextMemberId);
          // Visual feedback for mobile
          this.showSwipeFeedback('next');
        }
      } else if (diffX < 0 && currentIndex > 0) {
        // Swipe right - previous member
        const prevMemberId = (this.tabs[currentIndex - 1] as HTMLElement).dataset.member;
        if (prevMemberId) {
          this.switchToMember(prevMemberId);
          // Visual feedback for mobile
          this.showSwipeFeedback('prev');
        }
      }
    }
  }

  private showSwipeFeedback(direction: 'next' | 'prev'): void {
    // Add visual indicator for successful swipe
    const indicator = document.createElement('div');
    indicator.className = `swipe-indicator swipe-indicator--${direction}`;
    this.section?.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 500);
  }

  private getMemberName(memberId: string): string {
    const names: Record<string, string> = {
      'mashulia': 'Масхулиа Л.З.',
      'strukova': 'Струкова А.',
      'pashkova': 'Пашкова Д.К.',
      'bryantsev': 'Брянцев А.',
    };
    return names[memberId] || memberId;
  }

  private trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'team_interaction',
        ...parameters,
      });
    }

    // Yandex Metrika
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(98741026, 'reachGoal', eventName, parameters);
    }
  }
}

// Component to initialize the team interactive functionality
export default function TeamInteractiveLogic() {
  useEffect(() => {
    // Initialize the team interactive functionality
    const teamInteractive = new TeamInteractive();
    teamInteractive.init();

    // Store instance for potential cleanup or debugging
    (window as any).teamInteractive = teamInteractive;

    // Cleanup function
    return () => {
      // Remove event listeners if needed (though the component handles this internally)
    };
  }, []);

  return null; // This component doesn't render anything
}
