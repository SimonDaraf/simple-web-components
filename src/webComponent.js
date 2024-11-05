import { EventContainer } from './eventContainer.js'
import { FetchHandler } from './fetchHandler.js'
import { HtmlConstructor } from './htmlElementConstructor.js'
import { HtmlHelper } from './htmlHelper.js'

/**
 * The Web Component class builds and defines a web component.
 */
export class WebComponent extends EventTarget {
  /**
   * The component name, used to initialize the component in the DOM.
   *
   * @type {string}
   */
  #componentName

  /**
   * The html template|url.
   *
   * @type {HTMLTemplateElement|string}
   */
  #html

  /**
   * The css template|url.
   *
   * @type {HTMLTemplateElement|string}
   */
  #css

  /**
   * An array of registered events.
   *
   * @type {EventContainer[]}
   */
  #registeredEvents

  /**
   * A helper class for fetch requests.
   *
   * @type {FetchHandler}
   */
  #fetchHandler

  /**
   * Provides the html element constructor.
   *
   * @type {HtmlConstructor}
   */
  #htmlConstructor

  /**
   * Provides relevant validation methods.
   *
   * @type {HtmlHelper}
   */
  #validator

  /**
   * Constructs an instance of a Web Component.
   *
   * @param {string} componentName - The component name, needs to follow the html element name syntax.
   * @param {HTMLTemplateElement|string|URL} html - The html to render | The url to the HTML file as a string | The url to the HTML file as a URL.
   * @param {HTMLTemplateElement|string|URL} css - The css to render | The url to the CSS file as a string | The url to the CSS file as a URL.
   */
  constructor (componentName, html, css) {
    super()
    
    this.#fetchHandler = new FetchHandler()
    this.#validator = new HtmlHelper()
    this.#htmlConstructor = new HtmlConstructor()
    this.#registeredEvents = []

    this.#setComponentName(componentName)
    this.#setHtml(html)
    this.#setCss(css)
  }

  /**
   * Validates input for component name.
   *
   * @throws {Error} - If new component name is invalid.
   * @param {string} newComponentName - The new component name.
   */
  #setComponentName (newComponentName) {
    if (typeof (newComponentName) !== 'string') {
      throw new Error('Invalid type of component name, expected type: string')
    }
    if (!this.#validator.isValidHtmlName(newComponentName)) {
      throw new Error(`Component name: ${newComponentName} does not match naming convention: [a-z]-[a-z](-[a-z])*`)
    }
    if (!this.#validator.noForbiddenHtmlNames(newComponentName)) {
      throw new Error(`Component name: ${newComponentName} is a forbidden component name!`)
    }

    this.#componentName = newComponentName
  }

  /**
   * Sets the html field.
   *
   * @throws {Error} - If new html is invalid.
   * @param {HTMLTemplateElement|string|URL} newHtml - The new HTMLTemplateElement | string | URL.
   */
  #setHtml (newHtml) {
    if (!this.#validator.isValidHtmlAccessor(newHtml)) {
      throw new Error('Invalid type of html, expected type: HTMLTemplateElement, string or URL')
    }

    this.#html = newHtml
  }

  /**
   * Sets the css field.
   *
   * @throws {Error} - If new css is invalid.
   * @param {HTMLTemplateElement|string|URL} newCss - The new HTMLTemplateElement | string | URL.
   */
  #setCss (newCss) {
    if (!this.#validator.isValidHtmlAccessor(newCss)) {
      throw new Error('Invalid type of css, expected type: HTMLTemplateElement, string or URL')
    }

    this.#css = newCss
  }

  /**
   * The component name.
   *
   * @readonly
   * @returns {string} - The component name.
   */
  get componentName () {
    return this.#componentName
  }

  /**
   * Creates a html template element from the given local URL.
   *
   * @param {string} url - The URL to load.
   */
  async #loadHtmlTemplate (url) {
    const htmlCode = await this.#fetchHandler.fetchLocal(url, {
      mode: 'same-origin',
      headers: {
        Accept: 'text/html'
      }
    })
    this.#html = this.#validator.createHtmlElement(htmlCode, 'template')
  }

  /**
   * Creates a css template element from the given local URL.
   *
   * @param {string} url - The URL to load.
   */
  async #loadCssTemplate (url) {
    const cssCode = await this.#fetchHandler.fetchLocal(url, {
      mode: 'same-origin',
      headers: {
        Accept: 'text/css'
      }
    })
    this.#css = this.#validator.createCssTemplateElement(cssCode)
  }

  /**
   * Registers an event to the web component.
   *
   * @param {EventContainer} eventContainer - The event container to register.
   */
  registerEvent (eventContainer) {
    this.#registeredEvents.push(eventContainer)
  }

  /**
   * Defines the web component which
   * allows the component to be utilized withing the DOM.
   * This should be called after the component as a whole has been set up.
   */
  async defineComponent () {
    // Check whether to use HTMLTemplate or assume URL and load.
    if (!(this.#html instanceof HTMLTemplateElement)) {
      await this.#loadHtmlTemplate(this.#html)
    }
    if (!(this.#css instanceof HTMLTemplateElement)) {
      await this.#loadCssTemplate(this.#css)
    }

    this.#htmlConstructor.htmlElementConstructor(this.#componentName, this.#html, this.#css, this.#registeredEvents)
  }
}
