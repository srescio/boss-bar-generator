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

This project uses Cypress Component Testing for comprehensive functional testing with code coverage.

### Running Tests

```bash
# Open Cypress Component Test Runner (interactive)
npm run cypress:component:open

# Run Cypress Component Tests (headless)
npm run cypress:component

# Run tests with code coverage
npm run test:coverage
```

### Test Coverage

The tests are designed to:
- Verify default game style (Genshin Impact) is selected
- Check that default texts appear in both form inputs and live preview
- Validate proper form structure and accessibility
- Ensure action buttons have proper ARIA labels
- Test component interactions and state changes

### Test Structure

- **Component Tests**: Located in `src/**/*.cy.tsx` files
- **Coverage Reports**: Generated in `coverage/` directory
- **Configuration**: See `cypress.config.ts` and `.nycrc`

### Adding New Tests

1. Create a new `.cy.tsx` file in the same directory as your component
2. Import the component and write tests using Cypress commands
3. Use `cy.mount()` to render the component
4. Write assertions to verify functionality and accessibility

Example:
```typescript
import React from 'react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    cy.mount(<MyComponent />)
    cy.get('[data-testid="my-element"]').should('be.visible')
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
