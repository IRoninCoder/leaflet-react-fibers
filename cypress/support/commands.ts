/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { addCompareSnapshotCommand } from 'cypress-visual-regression/dist/command'

addCompareSnapshotCommand({
  errorThreshold: 0.2 // %2 difference between expected and actual screenshot / snapshot
})

declare global {
  namespace Cypress {
    // eslint-disable-next-line no-unused-vars
    interface Chainable {
      /** Waits for one or more images to load and be visible */
      waitForImages(selector: string, opts?: { timeout?: number, length?: number }): Cypress.Chainable
    }
  }
}

Cypress.Commands.add('waitForImages', (selector: string, opts) => {
  cy.get<HTMLImageElement>(selector, { timeout: opts?.timeout || 30000 })
    .should('have.length', opts?.length || 1)
    .and(($img) => {
      // "naturalWidth" and "naturalHeight" are set when the image loads
      expect($img[0].naturalWidth).to.be.greaterThan(0)
    })

  // Hacky way of getting around a difficult bug. There is a delay in rendering tile images after they are added to DOM.
  // Snapshots are "fade" and semi-transparent. This only happens when executing `cypress run`. The wait gets around this issue.
  return cy.wait(5000)
})
