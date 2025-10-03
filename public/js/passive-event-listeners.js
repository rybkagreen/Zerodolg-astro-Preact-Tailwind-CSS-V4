// Passive Event Listeners Implementation for Better Performance
// This script adds passive event listeners to improve scrolling performance

console.log('[Passive Events] Initializing passive event listeners...');

// Utility function to check if passive events are supported
function supportsPassiveEvents() {
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true;
        return true;
      },
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}
  return supportsPassive;
}

// Check passive event support
const passiveEventsSupported = supportsPassiveEvents();
const eventOptions = passiveEventsSupported ? { passive: true } : false;

console.log('[Passive Events] Passive events supported:', passiveEventsSupported);

// Add passive listeners to scroll events
document.addEventListener(
  'scroll',
  function (e) {
    // Scroll handling logic - avoid expensive operations here
    // Use requestAnimationFrame for any visual updates
  },
  eventOptions
);

// Add passive listeners to touch events
document.addEventListener(
  'touchstart',
  function (e) {
    // Touch handling logic
  },
  eventOptions
);

document.addEventListener(
  'touchmove',
  function (e) {
    // Touch move handling logic
    // Avoid preventDefault() when using passive listeners
  },
  eventOptions
);

document.addEventListener(
  'touchend',
  function (e) {
    // Touch end handling logic
  },
  eventOptions
);

// Add passive listeners to wheel events
document.addEventListener(
  'wheel',
  function (e) {
    // Wheel handling logic
  },
  eventOptions
);

// Function to create Web Workers for heavy computations
function createWebWorker(workerFunction) {
  const blob = new Blob(['(' + workerFunction.toString() + ')()'], {
    type: 'application/javascript',
  });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

// Example: Offload calculation to Web Worker to reduce TBT
function offloadHeavyComputation(computationFunction, data, callback) {
  const worker = createWebWorker(function () {
    self.onmessage = function (e) {
      // Perform heavy computation
      const result = e.data.computation(e.data.payload);
      self.postMessage(result);
    };
  });

  worker.onmessage = function (e) {
    callback(e.data);
    worker.terminate();
  };

  worker.postMessage({
    computation: computationFunction.toString(),
    payload: data,
  });
}

// Helper function to debounce expensive operations
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Helper function to throttle operations
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttling to scroll handlers
const throttledScrollHandler = throttle(function (e) {
  // Light scroll handling logic
  // Avoid expensive DOM operations here
}, 16); // ~60fps

document.addEventListener('scroll', throttledScrollHandler, eventOptions);

// Apply debouncing to resize handlers
const debouncedResizeHandler = debounce(function (e) {
  // Resize handling logic
  // This will only run after 100ms of no resize events
}, 100);

window.addEventListener('resize', debouncedResizeHandler, eventOptions);

// Intersection Observer for lazy loading with passive options
if ('IntersectionObserver' in window) {
  const lazyLoadObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Lazy load element
          const element = entry.target;
          // Load image or content
          if (element.tagName === 'IMG') {
            const src = element.dataset.src;
            if (src) {
              element.src = src;
            }
          }
          // Stop observing once loaded
          lazyLoadObserver.unobserve(element);
        }
      });
    },
    {
      rootMargin: '50px 0px', // Start loading 50px before element is visible
      threshold: 0.01,
    }
  );

  // Observe lazy elements
  document.querySelectorAll('[data-src]').forEach(function (element) {
    lazyLoadObserver.observe(element);
  });
}

console.log('[Passive Events] Passive event listeners initialized successfully');

// Export functions for global use
window.PassiveEvents = {
  supportsPassiveEvents: supportsPassiveEvents,
  createWebWorker: createWebWorker,
  offloadHeavyComputation: offloadHeavyComputation,
  debounce: debounce,
  throttle: throttle,
};
