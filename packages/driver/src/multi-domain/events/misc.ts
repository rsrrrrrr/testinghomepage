import type { $Cy } from '../../cypress/cy'

export const handleMiscEvents = (Cypress: Cypress.Cypress, cy: $Cy) => {
  Cypress.on('viewport:changed', (viewport, callbackFn) => {
    Cypress.specBridgeCommunicator.once('viewport:changed:end', () => {
      callbackFn()
    })

    Cypress.specBridgeCommunicator.toPrimary('viewport:changed', viewport)
  })

  // TODO: Should state syncing be built into cy.state instead of being explicitly called?
  Cypress.specBridgeCommunicator.on('sync:state', (state) => {
    cy.state(state)
  })

  // Listen for window load events from the primary window to resolve page loads
  Cypress.specBridgeCommunicator.on('window:load', ({ url }) => {
    cy.isStable(true, 'load')
    Cypress.emit('internal:window:load', { type: 'cross:domain', url })
  })

  // Forward url:changed Message to the primary domain to enable changing the url displayed in the AUT
  // @ts-ignore
  Cypress.on('url:changed', (url) => {
    Cypress.specBridgeCommunicator.toPrimary('url:changed', { url })
  })
}