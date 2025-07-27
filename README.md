# Boss Bar Generator

Generate and download custom boss bars in the style of Genshin Impact, Demon's Souls, Tekken 2, and Honkai Impact. Free, fast, and easy to use for stream overlays, memes, and gaming content creation!

## Features

- Multiple game styles (Genshin Impact, Demon's Souls, Tekken 2, Honkai Impact)
- Customizable text fields and colors
- High-resolution downloads (up to 1920x1080)
- Free and easy to use
- No registration required

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## Testing

This project uses Cypress E2E Testing for comprehensive functional testing with visual regression testing.

### Running Tests

```bash
# Open Cypress E2E Test Runner (interactive)
npm run cypress:open

# Run Cypress E2E Tests (headless)
npm run cypress:run
```

### Test Coverage

The tests are designed to:

- Verify default game style (Genshin Impact) is selected
- Check that default texts appear in both form inputs and live preview
- Validate proper form structure and accessibility
- Ensure action buttons have proper ARIA labels
- Test form interactions and state changes
- Test download functionality with file verification
- Perform visual regression testing with pixel-level comparison
- Test all game styles and formats

### Test Structure

- **E2E Tests**: Located in `cypress/e2e/` directory
- **Visual Regression**: Baseline images in `cypress/baseline/` directory
- **Configuration**: See `cypress.config.js`

### Adding New Tests

1. Create a new `.cy.tsx` file in `cypress/e2e/` directory
2. Write tests using Cypress E2E commands
3. Use `cy.visit('/')` to load the application
4. Write assertions to verify functionality and accessibility

Example:

```typescript
describe('New Feature', () => {
  it('should work correctly', () => {
    cy.visit('/')
    cy.get('[data-testid="my-element"]').should('be.visible')
    cy.get('button').contains('Click me').click()
    cy.get('.result').should('contain', 'Success')
  })
})
```

## SEO Features

- Semantic HTML structure with proper ARIA labels
- Open Graph and Twitter Card meta tags
- Structured data (JSON-LD)
- Sitemap and robots.txt
- Optimized meta descriptions and keywords

## License

This project is open source and available under the [MIT License](LICENSE).
