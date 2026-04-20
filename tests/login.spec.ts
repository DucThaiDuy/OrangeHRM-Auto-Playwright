import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import * as credentials from "../test-data/credentials.json";
import { LOGIN_TEXTS, DASHBOARD_TEXTS } from "../constants/login-texts";

test.describe("Login Functionality @auth", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test("[TC-0001] Verify Login page loads successfully (HTTP 200)", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("[TC-0002] Verify Username input is visible & enabled", async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.usernameInput).toBeEnabled();
  });

  test("[TC-0003] Verify Password input is visible & masked", async () => {
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
  });

  test("[TC-0004] Verify Login button is visible & enabled", async () => {
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test('[TC-0005] Verify "Forgot your password?" link is displayed', async () => {
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test("[TC-0006] Verify placeholder text is correct", async () => {
    await expect(loginPage.usernameInput).toHaveAttribute(
      "placeholder",
      LOGIN_TEXTS.usernameLabel
    );
    await expect(loginPage.passwordInput).toHaveAttribute(
      "placeholder",
      LOGIN_TEXTS.passwordLabel
    );
  });

  test("[TC-0009] Verify branding images are displayed correctly", async () => {
    // Top branding logo
    await expect(loginPage.brandingLogo).toBeVisible();
    // Side circular image
    await expect(loginPage.sideImage).toBeVisible();
  });

  test("[TC-0007] should login successfully with valid credentials", async ({
    page,
  }) => {
    await loginPage.login(
      credentials.validUser.username,
      credentials.validUser.password
    );

    await expect(page).toHaveURL(/dashboard/);
    const title = await dashboardPage.getHeaderTitle();
    expect(title).toContain(DASHBOARD_TEXTS.headerTitle);
  });

  test("[TC-0008] should show error message with invalid credentials", async () => {
    await loginPage.login(
      credentials.invalidUser.username,
      credentials.invalidUser.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain(LOGIN_TEXTS.errorMessage);
  });

  test("[TC-0012] Verify session/cookie is created after successful login", async ({
    context,
  }) => {
    await loginPage.login(
      credentials.validUser.username,
      credentials.validUser.password
    );

    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === "orangehrm");
    expect(sessionCookie).toBeDefined();
  });
});
