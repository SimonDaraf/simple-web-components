import { EventContainer } from './eventContainer.js'

/**
 * Encapsulates a html element constructor, used to define the custom element.
 */
export class HtmlConstructor {
  /**
   * A util function that defines a custom HTML element to the registry.
   *
   * @param {string} componentName - The name to register the element with.
   * @param {HTMLTemplateElement} html - The HTML to append.
   * @param {HTMLTemplateElement} css - The CSS to append.
   * @param {EventContainer[]} events - Events to append.
   */
  htmlElementConstructor (componentName, html, css, events) {
    // Due to how HTML elements are created (not using new) this is a necessity.
    // Especially if we want to make it somewhat modular.
    customElements.define(componentName,
      /**
       * The custom element constructor.
       */
      class extends HTMLElement {
        /**
         * The abort controller object, used to properly remove any event listeners
         * when the element leaves the DOM.
         *
         * @type {AbortController}
         */
        #abortController

        /**
         * Constructs a new instance of the user-defined HTMLElement.
         */
        constructor () {
          super()

          // Attach a shadow DOM tree to this custom element and
          // append the templates to the shadow root.
          this.attachShadow({ mode: 'open' })
          this.shadowRoot.appendChild(css.content.cloneNode(true))
          this.shadowRoot.appendChild(html.content.cloneNode(true))

          this.#abortController = new AbortController()
        }

        /**
         * Called after the element is inserted into the DOM.
         */
        connectedCallback () {
          for (const event of events) {
            const targetElement = this.#getTargetElement(event.eventListenerElementID)

            targetElement.addEventListener(event.eventName, event.eventFunction, { signal: this.#abortController.signal })
          }
        }

        /**
         * Called after the element is removed from the DOM.
         */
        disconnectedCallback () {
          this.#abortController.abort()
        }

        #getTargetElement (targetID) {
          if (targetID === 'shadow-root') {
            return this
          } else {
            return this.shadowRoot.querySelector(targetID)
          }
        }
      }
    )
  }
}
