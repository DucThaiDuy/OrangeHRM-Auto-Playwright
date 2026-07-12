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

  // ─── Standalone: HTTP check ───────────────────────────────────────────────
  test("[TC-0001] Verify Login page loads successfully (HTTP 200)", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  // ─── Grouped: All static UI elements on Login page (1 browser session) ───
  test.only("[TC-0002~0009] Verify Login page UI elements", async ({ page }) => {
    await test.step("[TC-0002] Username input is visible & enabled", async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.usernameInput).toBeEnabled();
    });

    await test.step("[TC-0003] Password input is visible & masked", async () => {
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    });

    await test.step("[TC-0004] Login button is visible & enabled", async () => {
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.loginButton).toBeEnabled();
    });

    await test.step('[TC-0005] "Forgot your password?" link is displayed', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });

    await test.step("[TC-0006] Placeholder texts are correct", async () => {
      await expect(loginPage.usernameInput).toHaveAttribute("placeholder", LOGIN_TEXTS.usernameLabel);
      await expect(loginPage.passwordInput).toHaveAttribute("placeholder", LOGIN_TEXTS.passwordLabel);
    });

    await test.step("[TC-0009] Branding images are displayed correctly", async () => {
      await expect(loginPage.brandingLogo).toBeVisible();
      await expect(loginPage.sideImage).toBeVisible();
    });
  });

  // ─── Grouped: Valid login flow + Session check (share same login action) ──
  test("[TC-0007/0012] Verify successful login and session creation", async ({ page, context }) => {
    await test.step("[TC-0007] Login with valid credentials navigates to Dashboard", async () => {
      await loginPage.login(
        credentials.validUser.username,
        credentials.validUser.password
      );
      await expect(page).toHaveURL(/dashboard/);

      const title = await dashboardPage.getHeaderTitle();
      expect(title).toContain(DASHBOARD_TEXTS.headerTitle);
    });

    await test.step("[TC-0012] Session cookie is created after successful login", async () => {
      const cookies = await context.cookies();
      const sessionCookie = cookies.find((c) => c.name === "orangehrm");
      expect(sessionCookie).toBeDefined();
    });
  });

  // ─── Standalone: Invalid login changes UI state (error message) ───────────
  test("[TC-0008] Verify error message with invalid credentials", async ({ page }) => {
    await loginPage.login(
      credentials.invalidUser.username,
      credentials.invalidUser.password
    );
    await loginPage.errorMessage.waitFor({ state: "visible" });
    await expect(loginPage.errorMessage).toBeVisible();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain(LOGIN_TEXTS.errorMessage);
  });
});
