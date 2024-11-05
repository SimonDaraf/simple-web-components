import { expect, test } from 'vitest'
import { HtmlHelper } from '../src/htmlHelper.js'

test('Assert can create html element', () => {
  // Arrange
  const html = '<div>My html code.</div>'
  const htmlHelper = new HtmlHelper()

  // Act
  const htmlTemplateElement = htmlHelper.createHtmlElement(html, 'template')

  // Assert
  expect(htmlTemplateElement).instanceOf(HTMLTemplateElement)
  expect(htmlTemplateElement.innerHTML).toStrictEqual(html)
})

test('Assert can create CSS Template element', () => {
  // Arrange
  const htmlHelper = new HtmlHelper()
  const cssCode = `
  #test-text {
    font-size: 20px;
  }
  `

  // Act
  const cssElement = htmlHelper.createCssTemplateElement(cssCode)
  const htmlElement = htmlHelper.createHtmlElement('Hello', 'p')
  htmlElement.id = 'test-text'

  document.body.appendChild(cssElement.content.cloneNode(true))
  document.body.appendChild(htmlElement)

  const computedElement = document.querySelector('#test-text')
  const fontSize = parseFloat(window.getComputedStyle(computedElement, null).getPropertyValue('font-size'))

  // Assert
  expect(fontSize).toEqual(20)
})

test('Assert valid html name', () => {
  // Arrange
  const htmlHelper = new HtmlHelper()
  const validNameOne = 'test-component'
  const validNameTwo = 'test-component-other'

  // Act
  const isValidOne = htmlHelper.isValidHtmlName(validNameOne)
  const isValidTwo = htmlHelper.isValidHtmlName(validNameTwo)

  // Assert
  expect(isValidOne).toBeTruthy()
  expect(isValidTwo).toBeTruthy()
})

test('Assert invalid html name', () => {
  // Arrange
  const htmlHelper = new HtmlHelper()
  const invalidNameOne = 'div'
  const invalidNameTwo = 'customComponent'
  const invalidNameThree = 'my-Custom-Component'

  // Act
  const isInvalidOne = htmlHelper.isValidHtmlName(invalidNameOne)
  const isInvalidTwo = htmlHelper.isValidHtmlName(invalidNameTwo)
  const isInvalidThree = htmlHelper.isValidHtmlName(invalidNameThree)

  // Assert
  expect(isInvalidOne).toBeFalsy()
  expect(isInvalidTwo).toBeFalsy()
  expect(isInvalidThree).toBeFalsy()
})

test('Assert no forbidden html name', () => {
  // Arrange
  const htmlHelper = new HtmlHelper()
  const noForbiddenOne = 'my-component'
  const noForbiddenTwo = 'test-one-two'

  // Act
  const isValidOne = htmlHelper.noForbiddenHtmlNames(noForbiddenOne)
  const isValidTwo = htmlHelper.noForbiddenHtmlNames(noForbiddenTwo)

  // Assert
  expect(isValidOne).toBeTruthy()
  expect(isValidTwo).toBeTruthy()
})
