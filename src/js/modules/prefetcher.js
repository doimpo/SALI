/**
 * Prefetcher Module
 * 
 * Intelligent link prefetching for faster navigation:
 * - Prefetch on hover
 * - Prefetch on viewport intersection
 * - Priority-based prefetching
 * - Network-aware prefetching
 */

class Prefetcher {
  constructor(options = {}) {
    this.options = {
      mode: 'hover', // 'hover' | 'intersection' | 'aggressive'
      delay: 100, // ms delay before prefetch on hover
      throttle: 2000, // ms between prefetch operations
      respectDataSaver: true,
      respectSlowConnection: true,
      maxConcurrent: 3,
      priorities: {
        high: ['/', '/about', '/services', '/contact'],
        medium: ['/blog/*', '/programmes/*'],
        low: ['/media/*', '/gallery']
      },
      ...options
    };

    this.prefetched = new Set();
    this.pending = new Set();
    this.observer = null;
    this.lastPrefetch = 0;
    this.queue = [];

    this.init();
  }

  /**
   * Initialize the prefetcher
   */
  init() {
    // Check network conditions
    if (!this.shouldPrefetch()) {
      console.log('Prefetching disabled due to network conditions');
      return;
    }

    // Set up based on mode
    switch (this.options.mode) {
      case 'hover':
        this.initHoverPrefetch();
        break;
      case 'intersection':
        this.initIntersectionPrefetch();
        break;
      case 'aggressive':
        this.initAggressivePrefetch();
        break;
    }
  }

  /**
   * Check if we should prefetch based on network conditions
   */
  shouldPrefetch() {
    // Check for data saver mode
    if (this.options.respectDataSaver) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection && connection.saveData) {
        return false;
      }
    }

    // Check for slow connection
    if (this.options.respectSlowConnection) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const slowConnections = ['slow-2g', '2g'];
        if (slowConnections.includes(connection.effectiveType)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Initialize hover-based prefetching
   */
  initHoverPrefetch() {
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.isInternalLink(link)) {
        this.schedulePrefetch(link.href, this.options.delay);
      }
    });

    // Also prefetch on touchstart for mobile
    document.addEventListener('touchstart', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.isInternalLink(link)) {
        this.schedulePrefetch(link.href, 0);
      }
    }, { passive: true });
  }

  /**
   * Initialize intersection-based prefetching
   */
  initIntersectionPrefetch() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const link = entry.target;
              this.prefetch(link.href);
              this.observer.unobserve(link);
            }
          });
        },
        { rootMargin: '200px' }
      );

      this.observeLinks();
    } else {
      // Fallback to hover
      this.initHoverPrefetch();
    }
  }

  /**
   * Initialize aggressive prefetching
   */
  initAggressivePrefetch() {
    // Prefetch all high-priority links immediately
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      if (this.isInternalLink(link)) {
        const priority = this.getLinkPriority(link.href);
        if (priority === 'high') {
          this.prefetch(link.href);
        }
      }
    });

    // Then use intersection observer for the rest
    this.initIntersectionPrefetch();
  }

  /**
   * Observe all links on the page
   */
  observeLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      if (this.isInternalLink(link)) {
        this.observer.observe(link);
      }
    });
  }

  /**
   * Schedule a prefetch with delay
   */
  schedulePrefetch(url, delay) {
    setTimeout(() => {
      this.prefetch(url);
    }, delay);
  }

  /**
   * Prefetch a URL
   */
  async prefetch(url) {
    // Normalize URL
    const normalizedUrl = this.normalizeUrl(url);

    // Check if already prefetched or pending
    if (this.prefetched.has(normalizedUrl) || this.pending.has(normalizedUrl)) {
      return;
    }

    // Check throttle
    const now = Date.now();
    if (now - this.lastPrefetch < this.options.throttle) {
      this.queue.push(normalizedUrl);
      return;
    }

    // Check concurrent limit
    if (this.pending.size >= this.options.maxConcurrent) {
      this.queue.push(normalizedUrl);
      return;
    }

    this.pending.add(normalizedUrl);
    this.lastPrefetch = now;

    try {
      // Use link prefetch if supported
      if ('HTMLLinkElement' in window && 'relList' in HTMLLinkElement.prototype) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = normalizedUrl;
        link.as = 'document';

        link.onload = () => {
          this.prefetched.add(normalizedUrl);
          this.pending.delete(normalizedUrl);
          this.processQueue();
        };

        link.onerror = () => {
          console.warn('Failed to prefetch:', normalizedUrl);
          this.pending.delete(normalizedUrl);
          this.processQueue();
        };

        document.head.appendChild(link);
      } else {
        // Fallback: use fetch
        const response = await fetch(normalizedUrl, {
          method: 'GET',
          credentials: 'same-origin',
          mode: 'no-cors'
        });

        this.prefetched.add(normalizedUrl);
        this.pending.delete(normalizedUrl);
        this.processQueue();
      }
    } catch (error) {
      console.warn('Prefetch error:', error);
      this.pending.delete(normalizedUrl);
      this.processQueue();
    }
  }

  /**
   * Process queued prefetches
   */
  processQueue() {
    if (this.queue.length > 0 && this.pending.size < this.options.maxConcurrent) {
      const url = this.queue.shift();
      this.prefetch(url);
    }
  }

  /**
   * Check if link is internal
   */
  isInternalLink(link) {
    return link.hostname === window.location.hostname && 
           !link.href.includes('#') &&
           !link.href.endsWith('.pdf') &&
           !link.href.endsWith('.zip') &&
           !link.download;
  }

  /**
   * Get priority for a URL
   */
  getLinkPriority(url) {
    const path = new URL(url, window.location.origin).pathname;

    for (const [priority, patterns] of Object.entries(this.options.priorities)) {
      for (const pattern of patterns) {
        if (this.matchPattern(path, pattern)) {
          return priority;
        }
      }
    }

    return 'low';
  }

  /**
   * Match URL path against pattern
   */
  matchPattern(path, pattern) {
    if (pattern === path) return true;
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return path.startsWith(prefix);
    }
    return false;
  }

  /**
   * Normalize URL
   */
  normalizeUrl(url) {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin + parsed.pathname;
  }

  /**
   * Manually prefetch a URL
   */
  add(url) {
    this.prefetch(url);
  }

  /**
   * Destroy the prefetcher
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.prefetched.clear();
    this.pending.clear();
    this.queue = [];
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prefetcher;
}

// Global initialization
if (typeof window !== 'undefined') {
  window.Prefetcher = Prefetcher;
  
  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.prefetcher = new Prefetcher({ mode: 'hover' });
    });
  } else {
    window.prefetcher = new Prefetcher({ mode: 'hover' });
  }
}

