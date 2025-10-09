/**
 * Component Loader Module
 * Handles dynamic loading and injection of HTML components
 */
class ComponentLoader {
  constructor() {
    this.components = new Map();
    this.loadedComponents = new Set();
  }

  /**
   * Register a component template
   * @param {string} name - Component name
   * @param {string} template - HTML template
   */
  registerComponent(name, template) {
    this.components.set(name, template);
  }

  /**
   * Load and inject a component into the DOM
   * @param {string} componentName - Name of the component to load
   * @param {string} targetSelector - CSS selector for target element
   * @param {Object} data - Data to replace in template
   */
  async loadComponent(componentName, targetSelector, data = {}) {
    try {
      const component = this.components.get(componentName);
      if (!component) {
        throw new Error(`Component "${componentName}" not found`);
      }

      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) {
        throw new Error(`Target element "${targetSelector}" not found`);
      }

      // Replace template variables with data
      let processedTemplate = this.processTemplate(component, data);
      
      // Inject the component
      targetElement.innerHTML = processedTemplate;
      
      // Mark as loaded
      this.loadedComponents.add(componentName);
      
      // Trigger custom event
      this.dispatchComponentLoadedEvent(componentName, targetElement);
      
      return true;
    } catch (error) {
      console.error(`Failed to load component "${componentName}":`, error);
      return false;
    }
  }

  /**
   * Process template with data replacement
   * @param {string} template - HTML template
   * @param {Object} data - Data object
   * @returns {string} Processed template
   */
  processTemplate(template, data) {
    let processedTemplate = template;
    
    // Replace {{variable}} with data values
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, data[key] || '');
    });

    // Replace data-* attributes
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`data-${key}="{{${key}}}"`, 'g');
      processedTemplate = processedTemplate.replace(regex, `data-${key}="${data[key] || ''}"`);
    });

    return processedTemplate;
  }

  /**
   * Dispatch component loaded event
   * @param {string} componentName - Component name
   * @param {Element} element - Target element
   */
  dispatchComponentLoadedEvent(componentName, element) {
    const event = new CustomEvent('componentLoaded', {
      detail: {
        componentName,
        element
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Load component from external file
   * @param {string} componentName - Component name
   * @param {string} filePath - Path to component file
   */
  async loadComponentFromFile(componentName, filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch component: ${response.statusText}`);
      }
      
      const template = await response.text();
      this.registerComponent(componentName, template);
      
      return true;
    } catch (error) {
      console.error(`Failed to load component from file "${filePath}":`, error);
      return false;
    }
  }

  /**
   * Initialize all components marked with data-component attribute
   */
  initComponents() {
    const componentElements = document.querySelectorAll('[data-component]');
    
    componentElements.forEach(async (element) => {
      const componentName = element.dataset.component;
      const componentData = element.dataset.componentData ? 
        JSON.parse(element.dataset.componentData) : {};
      
      // Create a temporary container for the component
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      element.id = tempId;
      
      await this.loadComponent(componentName, `#${tempId}`, componentData);
    });
  }
}

// Export for use in other modules
window.ComponentLoader = ComponentLoader;
