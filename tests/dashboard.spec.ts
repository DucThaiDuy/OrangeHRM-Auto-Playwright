import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import * as credentials from "../test-data/credentials.json";
import { DASHBOARD_TEXTS } from "../constants/login-texts";
import { highlight } from "../utils/highlight";

test.describe("Dashboard Page Verification @dashboard", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(
      credentials.validUser.username,
      credentials.validUser.password
    );
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForLoadState('networkidle');
  });

  test.describe("UI Verifications - Sidebar & Header", () => {
    test("[TC-0203] Verify all main menu items are visible", async ({ page }) => {
      const expectedMenuItems = [
        "Admin", "PIM", "Leave", "Time", "Recruitment",
        "My Info", "Performance", "Dashboard", "Directory",
        "Maintenance", "Claim", "Buzz"
      ];

      await dashboardPage.sidebarItems.first().waitFor({ state: 'visible' });

      const count = await dashboardPage.getSidebarItemCount();
      expect(count).toBeGreaterThanOrEqual(expectedMenuItems.length);

      for (const item of expectedMenuItems) {
        const locator = page.locator(`.oxd-main-menu-item:has-text("${item}")`);
        await locator.waitFor({ state: 'visible' });
        await highlight(page, locator, `Sidebar: ${item}`);
        await expect(locator).toBeVisible();
      }
    });

    test("[TC-0206] Verify 'Dashboard' title is displayed", async ({ page }) => {
      await dashboardPage.headerTitle.waitFor({ state: 'visible' });
      await highlight(page, dashboardPage.headerTitle, "Header Title");
      const title = await dashboardPage.getHeaderTitle();
      expect(title).toContain(DASHBOARD_TEXTS.headerTitle);
    });

    test("[TC-0209] Verify user profile name is displayed", async ({ page }) => {
      await dashboardPage.userDropdownName.waitFor({ state: 'visible' });
      await highlight(page, dashboardPage.userDropdownName, "User Profile Name");
      const userName = await dashboardPage.getUserDropdownName();
      expect(userName?.length).toBeGreaterThan(0);
    });

    test("[TC-0207] Verify Upgrade button is visible", async ({ page }) => {
      await dashboardPage.upgradeButton.waitFor({ state: 'visible' });
      await highlight(page, dashboardPage.upgradeButton, "Upgrade Button");
      await expect(dashboardPage.upgradeButton).toBeVisible();
    });
  });

  test.describe("UI Verifications - Widgets", () => {
    test("[TC-0212] Verify key dashboard widgets are visible", async ({ page }) => {
      const expectedWidgets = [
        "Time at Work",
        "My Actions",
        "Quick Launch",
        "Buzz Latest Posts",
        "Employees on Leave Today",
        "Employee Distribution by Sub Unit"
      ];

      await dashboardPage.dashboardWidgets.first().waitFor({ state: 'visible' });

      for (const widgetTitle of expectedWidgets) {
        const locator = page.locator(`.oxd-grid-item.orangehrm-dashboard-widget:has-text("${widgetTitle}")`).first();
        await locator.waitFor({ state: 'visible' });
        await highlight(page, locator, `Widget: ${widgetTitle}`, '#00C853');
        await expect(locator).toBeVisible();
      }
    });

    test("[TC-0214] Verify Quick Launch icons are visible", async ({ page }) => {
      const items = dashboardPage.quickLaunchItems;
      await items.first().waitFor({ state: 'visible' });

      const count = await items.count();
      for (let i = 0; i < count; i++) {
        await highlight(page, items.nth(i), `Quick Launch Item ${i + 1}`, '#00C853');
      }

      expect(count).toBe(6);
    });

    test("[TC-0216] Verify sidebar collapses", async ({ page }) => {
      await dashboardPage.bodySidebar.waitFor({ state: 'visible' });
      await highlight(page, dashboardPage.bodySidebar, "Sidebar Body", '#00C853');
      const before = await dashboardPage.bodySidebar.evaluate(el => el.clientWidth);

      await dashboardPage.iconChevronLeft.waitFor({ state: 'visible' });
      await highlight(page, dashboardPage.iconChevronLeft, "Chevron Left (Collapse)", '#00C853');
      await dashboardPage.iconChevronLeft.click();

      await page.waitForTimeout(600);

      const after = await dashboardPage.bodySidebar.evaluate(el => el.clientWidth);
      expect(after).toBeLessThan(before);
    });
  });

  test.describe("Functional Tests", () => {
    test("[TC-0220] Verify User Dropdown is clickable", async ({ page }) => {
      await dashboardPage.userDropdownName.waitFor({ state: 'visible' });
      await highlight(page, dashboardPage.userDropdownName, "User Dropdown Name");
      await dashboardPage.userDropdownName.click();

      const logoutLink = page.getByRole('menuitem', { name: 'Logout' });
      await logoutLink.waitFor({ state: 'visible' });
      await highlight(page, logoutLink, "Logout Menu Item", '#00C853');
      await expect(logoutLink).toBeVisible();
    });
  });
});
