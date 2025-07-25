const { defineConfig } = require('cypress')
const fs = require('fs')
const path = require('path')

module.exports = defineConfig({
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
        },
        compareScreenshots({ currentFiles, baselineDir, tolerance = 0.1 }) {
          const { promisify } = require('util');
          const exec = promisify(require('child_process').exec);
          
          return new Promise(async (resolve, reject) => {
            try {
              // Escape the JSON string properly for command line
              const escapedFiles = JSON.stringify(currentFiles).replace(/"/g, '\\"');
              const command = `node cypress/pixel-compare.mjs "${escapedFiles}" "${baselineDir}" ${tolerance}`;
              
              const { stdout, stderr } = await exec(command);
              
              if (stderr) {
                console.error('Pixel comparison stderr:', stderr);
              }
              
              const result = JSON.parse(stdout);
              console.log('✅ Pixel-level comparison completed successfully');
              resolve(result);
            } catch (error) {
              console.error('Pixel comparison failed:', error);
              reject(error);
            }
          });
        }
      })
    }
  },
}) 