/**
 * Performance Monitor Module
 * Tracks and reports website performance metrics
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = new Map();
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    this.trackPageLoad();
    this.trackCoreWebVitals();
    this.trackResourceTiming();
    this.trackUserInteractions();
  }

  /**
   * Track page load performance
   */
  trackPageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        if (perfData) {
          this.metrics.pageLoad = {
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
            totalLoadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint()
          };

          this.logPerformanceMetrics();
        }
      }, 0);
    });
  }

  /**
   * Track Core Web Vitals
   */
  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.lcp = {
          value: Math.round(lastEntry.startTime),
          element: lastEntry.element?.tagName || 'unknown'
        };
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.fid = {
            value: Math.round(entry.processingStart - entry.startTime),
            eventType: entry.name
          };
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', observer);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.metrics.cls = {
          value: Math.round(clsValue * 1000) / 1000
        };
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', observer);
    }
  }

  /**
   * Track resource timing
   */
  trackResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.initiatorType === 'img') {
            this.trackImageLoad(entry);
          } else if (entry.initiatorType === 'script') {
            this.trackScriptLoad(entry);
          } else if (entry.initiatorType === 'link') {
            this.trackStylesheetLoad(entry);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resources', observer);
    }
  }

  /**
   * Track user interactions
   */
  trackUserInteractions() {
    let interactionCount = 0;
    const startTime = performance.now();

    ['click', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        
        if (!this.metrics.userInteractions) {
          this.metrics.userInteractions = {
            count: 0,
            timeToFirstInteraction: 0
          };
        }

        if (interactionCount === 1) {
          this.metrics.userInteractions.timeToFirstInteraction = 
            Math.round(performance.now() - startTime);
        }

        this.metrics.userInteractions.count = interactionCount;
      }, { passive: true });
    });
  }

  /**
   * Get First Paint timing
   */
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
    return fpEntry ? Math.round(fpEntry.startTime) : null;
  }

  /**
   * Get First Contentful Paint timing
   */
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? Math.round(fcpEntry.startTime) : null;
  }

  /**
   * Track individual image load
   */
  trackImageLoad(entry) {
    if (!this.metrics.images) {
      this.metrics.images = [];
    }

    this.metrics.images.push({
      url: entry.name,
      loadTime: Math.round(entry.duration),
      size: entry.transferSize
    });
  }

  /**
   * Track individual script load
   */
  trackScriptLoad(entry) {
    if (!this.metrics.scripts) {
      this.metrics.scripts = [];
    }

    this.metrics.scripts.push({
      url: entry.name,
      loadTime: Math.round(entry.duration),
      size: entry.transferSize
    });
  }

  /**
   * Track individual stylesheet load
   */
  trackStylesheetLoad(entry) {
    if (!this.metrics.stylesheets) {
      this.metrics.stylesheets = [];
    }

    this.metrics.stylesheets.push({
      url: entry.name,
      loadTime: Math.round(entry.duration),
      size: entry.transferSize
    });
  }

  /**
   * Log performance metrics to console
   */
  logPerformanceMetrics() {
    console.group('🚀 SALi Performance Metrics');
    
    if (this.metrics.pageLoad) {
      console.log('📄 Page Load:', this.metrics.pageLoad);
    }
    
    if (this.metrics.lcp) {
      console.log('🎯 Largest Contentful Paint:', this.metrics.lcp);
    }
    
    if (this.metrics.fid) {
      console.log('⚡ First Input Delay:', this.metrics.fid);
    }
    
    if (this.metrics.cls) {
      console.log('📐 Cumulative Layout Shift:', this.metrics.cls);
    }
    
    if (this.metrics.userInteractions) {
      console.log('👆 User Interactions:', this.metrics.userInteractions);
    }

    console.groupEnd();
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics
    };
  }

  /**
   * Send performance data to analytics (if configured)
   */
  sendToAnalytics() {
    const report = this.getPerformanceReport();
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metrics', {
        event_category: 'Performance',
        event_label: 'Core Web Vitals',
        value: this.metrics.lcp?.value || 0,
        custom_map: {
          lcp: this.metrics.lcp?.value || 0,
          fid: this.metrics.fid?.value || 0,
          cls: this.metrics.cls?.value || 0
        }
      });
    }

    // Example: Send to custom analytics endpoint
    // fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report)
    // });
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Export for use in other modules
window.PerformanceMonitor = PerformanceMonitor;
