import { defineConfig } from 'cypress'
import * as fs from 'fs'
import * as path from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    downloadsFolder: 'cypress/downloads',
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 60000,
    experimentalModifyObstructiveThirdPartyCode: true,
    setupNodeEvents(on, config) {
      on('task', {
        deleteDownloads() {
          const downloadsFolder = 'cypress/downloads'
          if (fs.existsSync(downloadsFolder)) {
            fs.readdirSync(downloadsFolder).forEach(file => {
              fs.unlinkSync(path.join(downloadsFolder, file))
            })
          }
          return null
        },
        checkDownloads() {
          const downloadsFolder = 'cypress/downloads'
          if (!fs.existsSync(downloadsFolder)) {
            return []
          }
          return fs.readdirSync(downloadsFolder)
        }
      })
    }
  },
}) 