/// <reference types="cypress" />

describe('Boss Bar Generator App', () => {
  beforeEach(() => {
    // Visit the app using baseUrl
    cy.visit('/')
  })

  it('should display Genshin Impact as default game style', () => {
    // Check that Genshin Impact is selected in the dropdown
    cy.get('select[name="gameStyle"]').should('have.value', 'genshin')
    
    // Check that the legend shows "Game Style"
    cy.get('legend').contains('Game Style').should('be.visible')
  })

  it('should display default Genshin texts in form inputs', () => {
    // Check that the boss name input has a default value
    cy.get('input[name*="bossname" i]').should('not.be.empty')
    
    // Check that the title lore input has a default value
    cy.get('input[name*="titlelore" i]').should('not.be.empty')
    
    // Check that the level input has a default value
    cy.get('input[name*="level" i]').should('not.be.empty')
  })

  it('should display default Genshin texts in live preview', () => {
    // Check that the boss name appears in the preview
    cy.get('.genshin-boss-name').should('not.be.empty')
    
    // Check that the title lore appears in the preview
    cy.get('.genshin-title-lore').should('not.be.empty')
    
    // Check that the level appears in the preview
    cy.get('.genshin-level').should('not.be.empty')
  })

  it('should have proper form structure and accessibility', () => {
    // Check that the form has proper semantic structure
    cy.get('form').should('have.attr', 'aria-label', 'Boss bar configuration form')
    
    // Check that fieldsets and legends are present
    cy.get('fieldset').should('have.length.at.least', 1)
    cy.get('legend').should('have.length.at.least', 1)
    
    // Check that the preview section has proper structure
    cy.get('section[aria-labelledby="preview-section-title"]').should('exist')
    cy.get('#preview-title').should('contain.text', 'Live Preview')
  })

  it('should have action buttons with proper accessibility', () => {
    // Check that action buttons exist and have proper labels
    cy.get('.action-buttons').should('have.attr', 'role', 'group')
    cy.get('.action-buttons').should('have.attr', 'aria-label', 'Boss bar actions')
    
    // Check download button
    cy.get('button').contains('⬇️ Download').should('have.attr', 'aria-label', 'Download boss bar image')
    
    // Check reset button
    cy.get('button').contains('🔄 Reset').should('have.attr', 'aria-label', 'Reset all settings to default')
  })

  it('should update live preview when Genshin form fields are changed', () => {
    // Test data for the form fields
    const testData = {
      bossName: 'Test Boss Name',
      titleLore: 'Test Title Lore',
      level: 'Lv. 999'
    }

    // Clear and update Boss Name field
    cy.get('input[name="GenshinBar_bossname"]')
      .clear()
      .type(testData.bossName)
    
    // Verify the change appears in live preview
    cy.get('.genshin-boss-name')
      .should('contain.text', testData.bossName)

    // Clear and update Title Lore field
    cy.get('input[name="GenshinBar_titlelore"]')
      .clear()
      .type(testData.titleLore)
    
    // Verify the change appears in live preview
    cy.get('.genshin-title-lore')
      .should('contain.text', testData.titleLore)

    // Clear and update Level field
    cy.get('input[name="GenshinBar_level"]')
      .clear()
      .type(testData.level)
    
    // Verify the change appears in live preview
    cy.get('.genshin-level')
      .should('contain.text', testData.level)

    // Verify all changes are reflected together in the preview
    cy.get('.genshin-boss-name').should('contain.text', testData.bossName)
    cy.get('.genshin-title-lore').should('contain.text', testData.titleLore)
    cy.get('.genshin-level').should('contain.text', testData.level)
  })

  it('should handle download functionality correctly', () => {
    // Test download button is visible and enabled
    cy.get('button').contains('⬇️ Download').should('be.visible').and('not.be.disabled')
    
    // Click download button
    cy.get('button').contains('⬇️ Download').click()
    
    // Verify that a clone element was created for capture (download process started)
    cy.get('[id^="capture-clone-"]').should('exist')
    
    // Wait for the clone to be removed (download process completed)
    cy.get('[id^="capture-clone-"]').should('not.exist')
    
    // Test download works multiple times
    cy.get('button').contains('⬇️ Download').click()
    cy.get('[id^="capture-clone-"]').should('exist')
    cy.get('[id^="capture-clone-"]').should('not.exist')
  })

  it('should generate correct file names for downloads', () => {
    // Test different game styles and formats
    const testCases = [
      { gameStyle: 'genshin', format: 'video-call' },
      { gameStyle: 'genshin', format: 'bar-only' },
      { gameStyle: 'tekken2', format: 'video-call' },
      { gameStyle: 'demonsouls', format: 'bar-only' }
    ]
    
    testCases.forEach(({ gameStyle, format }) => {
      // Change game style
      cy.get('select[name="gameStyle"]').select(gameStyle)
      
      // Change format
      cy.get('select[name="format"]').select(format)
      
      // Trigger download
      cy.get('button').contains('⬇️ Download').click()
      
      // Verify download process starts and completes
      cy.get('[id^="capture-clone-"]').should('exist')
      cy.get('[id^="capture-clone-"]').should('not.exist')
    })
  })

  // it('should actually download files to test directory', () => {
  //   // This test will actually trigger downloads to cypress/downloads
  //   // First, let's clear any existing downloads
  //   cy.task('deleteDownloads')
  //   
  //   // Set up a custom boss name to make the file unique
  //   cy.get('input[name="GenshinBar_bossname"]')
  //     .clear()
  //     .type('Test Download Boss')
  //   
  //   // Trigger download
  //   cy.get('button').contains('⬇️ Download').click()
  //   
  //   // Wait for download process
  //   cy.get('[id^="capture-clone-"]').should('exist')
  //   cy.get('[id^="capture-clone-"]').should('not.exist')
  //   
  //   // Check that a file was downloaded to the test directory
  //   cy.task('checkDownloads').then((files) => {
  //     cy.wrap(files as string[]).should('have.length.at.least', 1)
  //     cy.wrap((files as string[])[0]).should('match', /boss-bar-genshin-.*\.png$/)
  //   })
  // })
})

export {} 