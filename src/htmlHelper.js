/**
 * Utility class containing tailored html methods.
 */
export class HtmlHelper {
  /**
   * Creates a HTML element from specified type with supplied HTML code.
   *
   * WARNING : Make sure you know the contents of the HTML code. The recommended
   * implementation is to use this with local HTML code and not with
   * random html code supplied from elsewhere!
   *
   * @param {string} htmlCode - The HTML code.
   * @param {string} elementType - The element type.
   * @returns {HTMLElement} - The created HTML element.
   */
  createHtmlElement (htmlCode, elementType) {
    const element = document.createElement(elementType)
    element.innerHTML = htmlCode
    return element
  }

  /**
   * Creates a HTMLTemplate element and wraps the css code in a HTML style tag.
   *
   * @param {string} cssCode - The CSS code.
   * @returns {HTMLTemplateElement} - The css template element.
   */
  createCssTemplateElement (cssCode) {
    const element = document.createElement('template')
    element.innerHTML = `<style> ${cssCode} </style>`
    return element
  }

  /**
   * Verifies if the given name is a valid html name.
   *
   * @param {string} componentName - The name to validate.
   * @returns {boolean} - An indication whether the name is valid.
   */
  isValidHtmlName (componentName) {
    // Validate html naming convention
    if (!(/[a-z]-[a-z](-[a-z])*/.test(componentName))) {
      return false
    }
    return true
  }

  /**
   * Verifies if the accessor is either a HtmlTemplateElement, URL or string.
   *
   * @param {HTMLTemplateElement|string|URL}
   */
  isValidHtmlAccessor (accessor) {
    if (!(accessor instanceof HTMLTemplateElement) &&
        !(accessor instanceof URL) &&
        typeof (accessor) !== 'string') {
      return false
    }
    return true
  }

  /**
   * Verifies that the given name is not any of the forbidden names declared by.
   *
   * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name}
   * @param {string} componentName - The name to validate.
   * @returns {boolean} - If name is not one of the forbidden names.
   */
  noForbiddenHtmlNames (componentName) {
    for (const name in forbiddenNames) {
      if (componentName === name) {
        return false
      }
    }
    return true
  }
}

/**
 * Enum like object with forbidden html names.
 */
const forbiddenNames = Object.freeze({
  'annotation-xml': 1,
  'color-profile': 2,
  'font-face': 3,
  'font-face-src': 4,
  'font-face-uri': 5,
  'font-face-format': 6,
  'font-face-name': 7,
  'missing-glyph': 8
})
