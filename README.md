# Automation Testing Framework - Playwright + TypeScript

A production-ready test automation framework using Playwright with TypeScript, implementing Page Object Model (POM) and best practices for E2E and API testing.

## 🚀 Features

- **Page Object Model (POM)** - Maintainable and scalable test structure
- **TypeScript** - Type-safe code with excellent IDE support
- **Test Fixtures** - Reusable test setup and teardown
- **API Testing** - Comprehensive API test utilities
- **Parallel Execution** - Fast test execution across multiple browsers
- **CI/CD Ready** - GitHub Actions integration
- **Comprehensive Logging** - Detailed logging for debugging
- **Error Handling** - Robust error handling and retry mechanisms
- **Environment Configuration** - Multiple environment support
- **Code Quality** - ESLint, Prettier, and TypeScript strict mode

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd automation-assignment

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers

# Create environment file
cp .env.example .env
# Edit .env with your credentials
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
BASE_URL=https://community.cloud.automationanywhere.digital
TEST_USERNAME=your-test-username
TEST_PASSWORD=your-test-password
HEADLESS=true
```

### Browser Configuration

Configure browsers in `playwright.config.ts`:
- Chromium
- Firefox
- WebKit
- Mobile Chrome

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific browser tests
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run API tests only
npm run test:api

# Run tests in parallel
npm run test:parallel

# Run tests serially
npm run test:serial
```

## 📁 Project Structure

```
automation-assignment/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── fixtures/
│   └── test.fixtures.ts        # Test fixtures and setup
├── pages/
│   ├── BasePage.ts             # Base page object
│   ├── LoginPage.ts            # Login page object
│   ├── DashboardPage.ts        # Dashboard page object
│   ├── TaskBotPage.ts          # Task bot page object
│   └── FormBuilderPage.ts     # Form builder page object
├── tests/
│   ├── messageBox.spec.ts      # Message box tests
│   ├── formUpload.spec.ts      # Form upload tests
│   └── learningInstance.api.test.ts  # API tests
├── utils/
│   ├── apiClient.ts            # API client utility
│   ├── logger.ts               # Logging utility
│   └── testHelpers.ts          # Test helper functions
├── .env.example                # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .prettierrc.json            # Prettier configuration
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🎯 Test Scenarios

### UI Tests

1. **Message Box Task**
   - Login
   - Navigate to Automation
   - Create Task Bot
   - Add Message Box action
   - Save configuration

2. **Form with Upload**
   - Login
   - Navigate to Automation
   - Create Form
   - Add form controls (textbox, file upload)
   - Fill and upload file
   - Save form

### API Tests

1. **Learning Instance API**
   - Create learning instance
   - Get instance by ID
   - Update instance
   - Delete instance
   - List all instances
   - Error handling

## 📊 Reporting

```bash
# View HTML report
npm run report

# Reports are generated in:
# - playwright-report/ (HTML report)
# - test-results/ (JSON, JUnit XML)
```

## 🔧 Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npm run typecheck
```

## 🚀 CI/CD

The project includes a GitHub Actions workflow that:
- Runs tests on multiple browsers
- Performs code quality checks
- Generates and uploads test reports
- Runs on push, PR, and scheduled intervals

## 🏗️ Best Practices Implemented

1. **Page Object Model** - Separation of test logic and page elements
2. **DRY Principle** - Reusable components and utilities
3. **Test Fixtures** - Consistent test setup
4. **Explicit Waits** - Reliable element interactions
5. **Error Handling** - Comprehensive error management
6. **Logging** - Detailed test execution logs
7. **Type Safety** - Full TypeScript coverage
8. **Code Quality** - Linting and formatting
9. **Documentation** - Clear inline comments
10. **Version Control** - Proper .gitignore configuration

## 🐛 Debugging

```bash
# Run in debug mode
npm run test:debug

# Run with Playwright Inspector
npx playwright test --debug

# Generate code
npm run codegen
```

## 📝 Writing New Tests

1. Create page objects in `pages/` directory
2. Add test fixtures if needed in `fixtures/`
3. Write tests in `tests/` directory
4. Use descriptive test names and steps
5. Follow existing patterns and conventions

Example:

```typescript
import { test, expect } from '../fixtures/test.fixtures';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Setup code
  });

  test('should do something', async ({ page }) => {
    // Test steps
    await test.step('Step description', async () => {
      // Step implementation
    });
  });
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and code quality checks
5. Submit a pull request

## 📄 License

ISC

## 🆘 Support

For issues and questions, please open an issue in the repository.

---

**Happy Testing! 🎉**