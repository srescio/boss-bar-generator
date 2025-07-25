/// <reference types="cypress" />

import { BOSS_BARS_DATA } from '../../src/bossBarsData';

describe('Boss Bar Generator App', () => {
  beforeEach(() => {
    // Visit the app using baseUrl
    cy.visit('/')
  })

  before(() => {
    // Clean up any existing downloaded test files before starting tests
    cy.task('deleteDownloads')
  })

  it('should display Genshin Impact as default game style', () => {
    // Check that Genshin Impact is selected in the dropdown
    cy.get('select[name="gameStyle"]').should('have.value', 'genshin')
    
    // Check that the legend shows "Game Style"
    cy.get('legend').contains('Game Style').should('be.visible')
  })

  it('should display default Genshin texts in form inputs', () => {
    // Check that the boss name input has a default value
    cy.get('input[name="GenshinBar_bossname"]').should('not.be.empty')
    
    // Check that the title lore input has a default value
    cy.get('input[name="GenshinBar_titlelore"]').should('not.be.empty')
    
    // Check that the level input has a default value
    cy.get('input[name="GenshinBar_level"]').should('not.be.empty')
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

  it('should reset all settings to default when reset button is clicked', () => {
    // Change multiple settings to non-default values
    const testData = {
      bossName: 'Modified Boss Name',
      titleLore: 'Modified Title Lore',
      level: 'Lv. 888',
      format: 'bar-only'
    }

    // Modify Genshin form fields (keep same game style)
    cy.get('input[name="GenshinBar_bossname"]').clear().type(testData.bossName)
    cy.get('input[name="GenshinBar_titlelore"]').clear().type(testData.titleLore)
    cy.get('input[name="GenshinBar_level"]').clear().type(testData.level)
    cy.get('select[name="format"]').select(testData.format)

    // Verify changes are applied
    cy.get('input[name="GenshinBar_bossname"]').should('have.value', testData.bossName)
    cy.get('input[name="GenshinBar_titlelore"]').should('have.value', testData.titleLore)
    cy.get('input[name="GenshinBar_level"]').should('have.value', testData.level)
    cy.get('select[name="format"]').should('have.value', testData.format)

    // Click reset button
    cy.get('button').contains('🔄 Reset').click()

    // Verify all settings are reset to default Genshin values
    cy.get('input[name="GenshinBar_bossname"]').should('not.have.value', testData.bossName)
    cy.get('input[name="GenshinBar_titlelore"]').should('not.have.value', testData.titleLore)
    cy.get('input[name="GenshinBar_level"]').should('not.have.value', testData.level)
    cy.get('select[name="format"]').should('have.value', 'video-call')

    // Verify live preview is also reset to defaults
    cy.get('.genshin-boss-name').should('not.contain.text', testData.bossName)
    cy.get('.genshin-title-lore').should('not.contain.text', testData.titleLore)
    cy.get('.genshin-level').should('not.contain.text', testData.level)

    // Verify form fields have the expected default values
    cy.get('input[name="GenshinBar_bossname"]').should('have.value', 'Boss Name')
    cy.get('input[name="GenshinBar_titlelore"]').should('have.value', 'Title lore')
    cy.get('input[name="GenshinBar_level"]').should('have.value', 'Lv. 100')

    // Verify live preview shows default content
    cy.get('.genshin-boss-name').should('contain.text', 'Boss Name')
    cy.get('.genshin-title-lore').should('contain.text', 'Title lore')
    cy.get('.genshin-level').should('contain.text', 'Lv. 100')
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
    
    // Wait for all 4 files to be downloaded with correct naming patterns
    const waitForFiles = () => {
      cy.task('checkDownloads').then((files) => {
        const fileArray = files as string[]
        if (fileArray.length === 4) {
          // Check each file follows the expected pattern
          fileArray.forEach((fileName) => {
            cy.wrap(fileName).should('match', /boss-bar-(genshin|tekken2|demonsouls)-(video-call|bar-only)-.*\.png$/)
          })
        } else {
          cy.wait(1000)
          waitForFiles()
        }
      })
    }
    
    waitForFiles()
  })

  it('should verify downloaded file names and patterns', () => {
    // Check that files were actually downloaded
    cy.task('checkDownloads').then((files) => {
      cy.wrap(files as string[]).should('have.length.at.least', 1)
      
      // Check that at least one file follows the expected pattern
      const fileNames = files as string[]
      const hasValidFile = fileNames.some(fileName => 
        /boss-bar-(genshin|tekken2|demonsouls)-(video-call|bar-only)-.*\.png$/.test(fileName)
      )
      cy.wrap(hasValidFile).should('be.true')
    })
  })

  it('should handle download with background URL', () => {
    const backgroundUrl = 'https://cdn.mos.cms.futurecdn.net/52HVcjStCQTsaDJWzEt946-1200-80.jpg.webp'
    
    // Set up the prompt stub before changing the background
    cy.window().then((win) => {
      // Stub the prompt to return our test URL
      cy.stub(win, 'prompt').returns(backgroundUrl)
    })
    
    // Change background to web image
    cy.get('select[name="background"]').select('web-image')
    
    // Verify the background selection changed to web-image
    cy.get('select[name="background"]').should('have.value', 'web-image')
    
    // Wait a moment for the background to load and state to update
    cy.wait(2000)
    
    // Test download with background URL
    cy.get('button').contains('⬇️ Download').click()
    
    // Verify that a clone element was created for capture (download process started)
    cy.get('[id^="capture-clone-"]').should('exist')
    
    // Wait for the clone to be removed (download process completed)
    cy.get('[id^="capture-clone-"]').should('not.exist')
    
    // Verify download works with background URL
    cy.get('button').contains('⬇️ Download').should('be.visible').and('not.be.disabled')
  })

  it('should handle download with CORS-restricted background URL', () => {
    const corsRestrictedUrl = 'https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2F2RNK1P0BYVrSCZEy_Sd1Ew%252F3417757448_4a6bdf36ce_o.jpg&width=1820'
    
    // Set up the prompt stub before changing the background
    cy.window().then((win) => {
      // Stub the prompt to return our CORS-restricted test URL
      cy.stub(win, 'prompt').returns(corsRestrictedUrl)
    })
    
    // Change background to web image
    cy.get('select[name="background"]').select('web-image')
    
    // Verify the background selection changed to web-image
    cy.get('select[name="background"]').should('have.value', 'web-image')
    
    // Wait a moment for the background to load and state to update
    cy.wait(2000)
    
    // Test download with CORS-restricted background URL
    cy.get('button').contains('⬇️ Download').click()
    
    // Verify that a clone element was created for capture (download process started)
    cy.get('[id^="capture-clone-"]').should('exist')
    
    // Wait for the clone to be removed (download process completed)
    cy.get('[id^="capture-clone-"]').should('not.exist')
    
    // Verify download works with CORS-restricted background URL
    cy.get('button').contains('⬇️ Download').should('be.visible').and('not.be.disabled')
    
    // Verify the app handles CORS restrictions gracefully
    // The app should either successfully download or fail gracefully without breaking
    cy.get('body').should('not.contain', 'Error')
  })

  it('should download for all game styles with default data, scale 3, and bar-only format', () => {
    BOSS_BARS_DATA.forEach(({ value, label }) => {
      // Reset to default
      cy.get('button').contains('🔄 Reset').click();
      cy.wait(300); // Wait for reset

      // Change game style if not the first
      if (value !== 'genshin') {
        cy.get('select[name="gameStyle"]').select(value);
        cy.wait(300); // Wait for form to update
      }

      // Set scale to 3
      cy.get('input[name="scale"]').invoke('val', 3).trigger('input').trigger('change');
      cy.get('input[name="scale"]').should('have.value', '3');

      // Set format to bar-only
      cy.get('select[name="format"]').select('bar-only');
      cy.get('select[name="format"]').should('have.value', 'bar-only');

      // Download
      cy.get('button').contains('⬇️ Download').click();
      cy.get('[id^="capture-clone-"]').should('exist');
      cy.get('[id^="capture-clone-"]').should('not.exist');

      // Screenshot for visual confirmation
      cy.screenshot(`download-default-${value}`);
    });
  });

  it('should generate predictable screenshots for visual comparison', () => {
    // Clean up downloads before starting
    cy.task('deleteDownloads');
    
    // Test data for different formats
    const testConfigs = [
      { format: 'bar-only', text: 'default', description: 'bar-only-default' },
      { format: 'video-call', text: 'lorem ipsum dolor sit amet', description: 'video-call-lorem' }
    ];

    BOSS_BARS_DATA.forEach(({ value, label }) => {
      testConfigs.forEach(({ format, text, description }) => {
        // Reset to default
        cy.get('button').contains('🔄 Reset').click();
        cy.wait(300);

        // Change game style if not the first
        if (value !== 'genshin') {
          cy.get('select[name="gameStyle"]').select(value);
          cy.wait(300);
        }

        // Set scale to 3
        cy.get('input[name="scale"]').invoke('val', 3).trigger('input').trigger('change');
        cy.get('input[name="scale"]').should('have.value', '3');

        // Set format
        cy.get('select[name="format"]').select(format);
        cy.get('select[name="format"]').should('have.value', format);

        // Update text for video-call format
        if (text !== 'default') {
          // Update boss name field for all styles
          if (value === 'tekken2') {
            // Tekken 2 has Player 1 and Player 2, not Boss Name
            cy.get('input[name="Tekken2Bar_player1"]').clear().type(text);
            cy.get('input[name="Tekken2Bar_player2"]').clear().type('Opponent');
          } else {
            // Other styles have Boss Name field
            const bossNameKey = `${value.charAt(0).toUpperCase() + value.slice(1)}Bar_bossname`;
            cy.get(`input[name="${bossNameKey}"]`).clear().type(text);
          }
          
          // Skip additional fields for now to avoid field name issues
          // TODO: Add back additional field updates once field names are confirmed
        }

        // Download
        cy.get('button').contains('⬇️ Download').click();
        cy.get('[id^="capture-clone-"]').should('exist');
        cy.get('[id^="capture-clone-"]').should('not.exist');

        // Wait for download to complete
        cy.wait(1000);
      });
    });

    // Verify all expected files were downloaded and perform visual comparison
    cy.task('checkDownloads').then((files) => {
      const fileNames = files as string[];
      const expectedCount = BOSS_BARS_DATA.length * testConfigs.length;
      cy.wrap(fileNames).should('have.length', expectedCount);
      
      // Log file names for reference
      cy.log(`Downloaded files: ${fileNames.join(', ')}`);

      // Visual comparison logic
      // This compares current screenshots against baseline images
      cy.task('compareScreenshots', {
        currentFiles: fileNames,
        baselineDir: 'cypress/baseline/downloads',
        tolerance: 0.1 // 10% tolerance for visual differences
      });
    });
  });

  it('should maintain consistent app UI appearance', () => {
    // Visit the app
    cy.visit('/');
    
    // Wait for app to load
    cy.get('h1').should('contain', 'Boss Bar Generator');
    
    // Take screenshot of the main app interface
    cy.screenshot('app-main-interface');
    
    // Test different game styles and take screenshots
    BOSS_BARS_DATA.forEach(({ value, label }) => {
      if (value !== 'genshin') {
        cy.get('select[name="gameStyle"]').select(value);
        cy.wait(300); // Wait for UI to update
      }
      
      // Take screenshot for each game style
      cy.screenshot(`app-${value}-style`);
    });
    
    // Reset to Genshin for form interaction test
    cy.get('button').contains('🔄 Reset').click();
    cy.wait(300);
    
    // Test form interactions and take screenshots
    cy.get('input[name="GenshinBar_bossname"]').clear().type('Test Boss');
    cy.screenshot('app-form-filled');
    
    // Reset and take screenshot
    cy.get('button').contains('🔄 Reset').click();
    cy.wait(300);
    cy.screenshot('app-after-reset');
    
    // Compare screenshots against baseline
    cy.task('compareScreenshots', {
      currentFiles: [
        'app-main-interface.png',
        'app-genshin-style.png',
        'app-demonsouls-style.png',
        'app-tekken2-style.png',
        'app-honkaiimpact-style.png',
        'app-form-filled.png',
        'app-after-reset.png'
      ],
      baselineDir: 'cypress/baseline/App.cy.tsx',
      tolerance: 0.1
    });
  });
})

export {} 