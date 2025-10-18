/**
 * Lazy Loader Module
 * 
 * Enhanced lazy loading for various content types:
 * - Images
 * - Videos
 * - Iframes
 * - Background images
 * - Components
 */

class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '100px',
      threshold: 0.01,
      loadingClass: 'lazy-loading',
      loadedClass: 'lazy-loaded',
      errorClass: 'lazy-error',
      ...options
    };

    this.observer = null;
    this.elements = new Map();
    this.init();
  }

  /**
   * Initialize the lazy loader
   */
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold
        }
      );

      this.observeElements();
    } else {
      // Fallback: load everything immediately
      this.loadAll();
    }
  }

  /**
   * Observe all lazy-loadable elements
   */
  observeElements() {
    // Images
    const images = document.querySelectorAll('img[data-lazy-src]');
    images.forEach(img => this.observe(img, 'image'));

    // Background images
    const backgrounds = document.querySelectorAll('[data-lazy-bg]');
    backgrounds.forEach(el => this.observe(el, 'background'));

    // Videos
    const videos = document.querySelectorAll('video[data-lazy-src]');
    videos.forEach(video => this.observe(video, 'video'));

    // Iframes
    const iframes = document.querySelectorAll('iframe[data-lazy-src]');
    iframes.forEach(iframe => this.observe(iframe, 'iframe'));

    // Components (custom elements)
    const components = document.querySelectorAll('[data-lazy-component]');
    components.forEach(comp => this.observe(comp, 'component'));
  }

  /**
   * Observe an element
   */
  observe(element, type) {
    this.elements.set(element, { type, loaded: false });
    this.observer.observe(element);
  }

  /**
   * Handle intersection
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const data = this.elements.get(element);

        if (data && !data.loaded) {
          this.load(element, data.type);
          this.observer.unobserve(element);
        }
      }
    });
  }

  /**
   * Load an element based on type
   */
  load(element, type) {
    element.classList.add(this.options.loadingClass);

    switch (type) {
      case 'image':
        this.loadImage(element);
        break;
      case 'background':
        this.loadBackground(element);
        break;
      case 'video':
        this.loadVideo(element);
        break;
      case 'iframe':
        this.loadIframe(element);
        break;
      case 'component':
        this.loadComponent(element);
        break;
    }
  }

  /**
   * Load an image
   */
  loadImage(img) {
    const src = img.dataset.lazySrc;
    const srcset = img.dataset.lazySrcset;

    const tempImg = new Image();
    tempImg.onload = () => {
      if (srcset) {
        img.srcset = srcset;
      }
      img.src = src;
      this.markAsLoaded(img);
    };

    tempImg.onerror = () => {
      this.markAsError(img);
    };

    tempImg.src = src;
  }

  /**
   * Load background image
   */
  loadBackground(element) {
    const bg = element.dataset.lazyBg;
    
    const tempImg = new Image();
    tempImg.onload = () => {
      element.style.backgroundImage = `url('${bg}')`;
      this.markAsLoaded(element);
    };

    tempImg.onerror = () => {
      this.markAsError(element);
    };

    tempImg.src = bg;
  }

  /**
   * Load video
   */
  loadVideo(video) {
    const src = video.dataset.lazySrc;
    
    // Load video sources
    const sources = video.querySelectorAll('source[data-lazy-src]');
    sources.forEach(source => {
      source.src = source.dataset.lazySrc;
      source.removeAttribute('data-lazy-src');
    });

    if (src) {
      video.src = src;
    }

    video.load();
    
    video.addEventListener('loadeddata', () => {
      this.markAsLoaded(video);
    }, { once: true });

    video.addEventListener('error', () => {
      this.markAsError(video);
    }, { once: true });
  }

  /**
   * Load iframe
   */
  loadIframe(iframe) {
    const src = iframe.dataset.lazySrc;
    
    iframe.onload = () => {
      this.markAsLoaded(iframe);
    };

    iframe.onerror = () => {
      this.markAsError(iframe);
    };

    iframe.src = src;
  }

  /**
   * Load component
   */
  loadComponent(element) {
    const componentName = element.dataset.lazyComponent;
    const componentData = element.dataset.lazyData;

    // Trigger custom event for component loading
    const event = new CustomEvent('lazyLoadComponent', {
      detail: {
        name: componentName,
        data: componentData ? JSON.parse(componentData) : null,
        element
      }
    });

    element.dispatchEvent(event);
    this.markAsLoaded(element);
  }

  /**
   * Mark element as loaded
   */
  markAsLoaded(element) {
    element.classList.remove(this.options.loadingClass);
    element.classList.add(this.options.loadedClass);
    
    const data = this.elements.get(element);
    if (data) {
      data.loaded = true;
    }

    // Remove data attributes
    element.removeAttribute('data-lazy-src');
    element.removeAttribute('data-lazy-srcset');
    element.removeAttribute('data-lazy-bg');

    // Dispatch event
    element.dispatchEvent(new CustomEvent('lazyLoaded'));
  }

  /**
   * Mark element as error
   */
  markAsError(element) {
    element.classList.remove(this.options.loadingClass);
    element.classList.add(this.options.errorClass);

    console.error('Lazy load failed for element:', element);

    // Dispatch event
    element.dispatchEvent(new CustomEvent('lazyError'));
  }

  /**
   * Load all elements immediately (fallback)
   */
  loadAll() {
    document.querySelectorAll('[data-lazy-src], [data-lazy-bg]').forEach(el => {
      const type = el.tagName.toLowerCase();
      this.load(el, type);
    });
  }

  /**
   * Add new elements to observe
   */
  refresh() {
    this.observeElements();
  }

  /**
   * Destroy the lazy loader
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.elements.clear();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyLoader;
}

// Global initialization
if (typeof window !== 'undefined') {
  window.LazyLoader = LazyLoader;
  
  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.lazyLoader = new LazyLoader();
    });
  } else {
    window.lazyLoader = new LazyLoader();
  }
}

