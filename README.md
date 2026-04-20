# OrangeHRM Test Automation Project

This project uses **Playwright** with **TypeScript** to perform end-to-end automation testing for the OrangeHRM open-source application.

## Project Structure (Professional POM)
- `pages/`: Contains Page Object classes (`BasePage`, `LoginPage`, etc.).
- `fixtures/`: Custom Playwright **Fixtures** for clean, boilerplate-free tests.
- `tests/`: End-to-end test specification files.
- `test-data/`: Centralized test data (JSON) and credentials.
- `constants/`: UI static text and expected messages.
- `utils/`: Reusable utilities including an **Automatic Logger**.
- `playwright.config.ts`: Advanced Playwright configuration.

## Professional Features
- **Automatic Logging**: Every click and fill action is automatically logged with timestamps for easier debugging.
- **Custom Fixtures**: Simplified test setup using Playwright's fixture system (dependency injection).
- **Inheritance**: Robust base page logic shared across all Page Objects.
- **Centralized Strings**: No more hardcoded strings in tests; everything is managed in constants.
1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests
- Run all tests across all configured browsers:
  ```bash
  npm test
  ```
- Run tests on Chromium only:
  ```bash
  npm run test:chromium
  ```

### Running Specific Modules (Tags)
To dramatically speed up execution, run tests by module using Playwright tags:
- Run **Buzz** module tests: `npm run test:buzz`
- Run **Admin** module tests: `npm run test:admin`
- Run **Dashboard** module tests: `npm run test:dashboard`
- Run **Authentication** module tests: `npm run test:auth`
- Run **Claim** module tests: `npm run test:claim`
- Run **Recruitment** module tests: `npm run test:recruitment`

### Running Single Tests
You can run a specific test by filtering its TC ID:
```bash
npx playwright test -g "TC-0430"
```

## Reporting
- View standard Playwright HTML report:
  ```bash
  npm run report
  ```
- Generate and open **Allure Report** (requires allure installed globally):
  ```bash
  npm run allure:generate
  npm run allure:open
  ```

## Default Credentials
- **Username:** Admin
- **Password:** admin123
