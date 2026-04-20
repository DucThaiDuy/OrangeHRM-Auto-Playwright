import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import * as credentials from "../test-data/credentials.json";
import { DASHBOARD_TEXTS } from "../constants/login-texts";

test.describe("Dashboard Page Verification @dashboard", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login to reach the dashboard
    await loginPage.goto();
    await loginPage.login(
      credentials.validUser.username,
      credentials.validUser.password
    );
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test.describe("UI Verifications - Sidebar & Header", () => {
    test("[TC-0203] Verify all main menu items are visible", async () => {
      const expectedMenuItems = [
        "Admin", "PIM", "Leave", "Time", "Recruitment", 
        "My Info", "Performance", "Dashboard", "Directory", 
        "Maintenance", "Claim", "Buzz"
      ];
      
      const count = await dashboardPage.getSidebarItemCount();
      expect(count).toBeGreaterThanOrEqual(expectedMenuItems.length);
      
      for (const item of expectedMenuItems) {
        await expect(dashboardPage.page.locator(`.oxd-main-menu-item:has-text("${item}")`)).toBeVisible();
      }
    });

    test("[TC-0206] Verify 'Dashboard' title is displayed", async () => {
      const title = await dashboardPage.getHeaderTitle();
      expect(title).toContain(DASHBOARD_TEXTS.headerTitle);
    });

    test("[TC-0209] Verify user profile name is displayed", async () => {
      const userName = await dashboardPage.getUserDropdownName();
      expect(userName?.length).toBeGreaterThan(0);
    });

    test("[TC-0207] Verify Upgrade button is visible", async () => {
      await expect(dashboardPage.upgradeButton).toBeVisible();
    });
  });

  test.describe("UI Verifications - Widgets", () => {
    test("[TC-0212] Verify key dashboard widgets are visible", async () => {
      const expectedWidgets = [
        "Time at Work",
        "My Actions",
        "Quick Launch",
        "Buzz Latest Posts",
        "Employees on Leave Today",
        "Employee Distribution by Sub Unit"
      ];

      for (const widgetTitle of expectedWidgets) {
        await expect(dashboardPage.page.locator(`.orangehrm-dashboard-widget-card:has-text("${widgetTitle}")`)).toBeVisible();
      }
    });

    test("[TC-0214] Verify Quick Launch icons are visible", async () => {
      const count = await dashboardPage.quickLaunchItems.count();
      expect(count).toBe(6);
    });
  });

  test.describe("Functional Tests", () => {
    test("[TC-0220] Verify User Dropdown is clickable", async () => {
        await dashboardPage.userDropdownName.click();
        const logoutLink = dashboardPage.page.getByRole('menuitem', { name: 'Logout' });
        await expect(logoutLink).toBeVisible();
    });
  });
});
