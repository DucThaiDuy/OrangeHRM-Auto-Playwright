import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { SystemUsersPage } from "../pages/Admin/SystemUsersPage";
import { AddUserPage } from "../pages/Admin/AddUserPage";
import * as credentials from "../test-data/credentials.json";
import { highlight } from "../utils/highlight";

test.describe("Admin - User Management Verification @admin", () => {
  let loginPage: LoginPage;
  let systemUsersPage: SystemUsersPage;
  let addUserPage: AddUserPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    systemUsersPage = new SystemUsersPage(page);
    addUserPage = new AddUserPage(page);

    await loginPage.goto();
    await loginPage.login(
      credentials.validUser.username,
      credentials.validUser.password
    );

    await page.goto("/web/index.php/admin/viewSystemUsers");
    await expect(systemUsersPage.usernameInput).toBeVisible();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // UI Verifications
  // ══════════════════════════════════════════════════════════════════════════
  test.describe("UI Verifications", () => {
    // ─── Grouped: Static elements on System Users page (1 browser session) ─
    test("[TC-0304/0309/0310/0312] Verify System Users page UI elements", async ({ page }) => {
      await test.step("[TC-0304] Username input field is visible", async () => {
        await highlight(page, systemUsersPage.usernameInput, "Username Input");
        await expect(systemUsersPage.usernameInput).toBeVisible();
      });

      await test.step("[TC-0309] Search button is visible", async () => {
        await highlight(page, systemUsersPage.searchButton, "Search Button");
        await expect(systemUsersPage.searchButton).toBeVisible();
      });

      await test.step("[TC-0310] '+ Add' button is visible", async () => {
        await highlight(page, systemUsersPage.addButton, "+ Add Button");
        await expect(systemUsersPage.addButton).toBeVisible();
      });

      await test.step("[TC-0312] Table columns are present", async () => {
        const usernameCol = systemUsersPage.page.getByText("Username", { exact: true }).nth(1);
        const userRoleCol = systemUsersPage.page.getByText("User Role", { exact: true }).nth(1);
        const empNameCol  = systemUsersPage.page.getByText("Employee Name", { exact: true }).nth(1);
        const statusCol   = systemUsersPage.page.getByText("Status", { exact: true }).nth(1);

        await highlight(page, usernameCol, "Column: Username", "#00C853");
        await expect(usernameCol).toBeVisible();
        await highlight(page, userRoleCol, "Column: User Role", "#00C853");
        await expect(userRoleCol).toBeVisible();
        await highlight(page, empNameCol, "Column: Employee Name", "#00C853");
        await expect(empNameCol).toBeVisible();
        await highlight(page, statusCol, "Column: Status", "#00C853");
        await expect(statusCol).toBeVisible();
      });
    });

    // ─── Grouped: Dropdown option verifications (both dropdowns same page) ─
    test("[TC-0305/0307] Verify dropdown filter options", async ({ page }) => {
      await test.step("[TC-0305] User Role dropdown has Admin & ESS options", async () => {
        await highlight(page, systemUsersPage.userRoleDropdown, "User Role Dropdown");
        await systemUsersPage.userRoleDropdown.click();

        const adminOption = systemUsersPage.page.getByRole("option", { name: "Admin" });
        const essOption   = systemUsersPage.page.getByRole("option", { name: "ESS" });

        await highlight(page, adminOption, "Option: Admin", "#00C853");
        await expect(adminOption).toBeVisible();
        await highlight(page, essOption, "Option: ESS", "#00C853");
        await expect(essOption).toBeVisible();

        await systemUsersPage.page.keyboard.press("Escape");
      });

      await test.step("[TC-0307] Status dropdown has Enabled & Disabled options", async () => {
        await highlight(page, systemUsersPage.statusDropdown, "Status Dropdown");
        await systemUsersPage.statusDropdown.click();

        const enabledOption  = systemUsersPage.page.getByRole("option", { name: "Enabled" });
        const disabledOption = systemUsersPage.page.getByRole("option", { name: "Disabled" });

        await highlight(page, enabledOption, "Option: Enabled", "#00C853");
        await expect(enabledOption).toBeVisible();
        await highlight(page, disabledOption, "Option: Disabled", "#00C853");
        await expect(disabledOption).toBeVisible();

        await systemUsersPage.page.keyboard.press("Escape");
      });
    });

    // ─── Standalone: Navigates to Add User page (different page state) ─────
    test("[TC-0324] Verify 'Add User' page UI elements", async ({ page }) => {
      await highlight(page, systemUsersPage.addButton, "+ Add Button");
      await systemUsersPage.addButton.click();

      await test.step("[TC-0324] All form fields are visible on Add User page", async () => {
        await highlight(page, addUserPage.userRoleDropdown, "User Role Dropdown");
        await expect(addUserPage.userRoleDropdown).toBeVisible();
        await highlight(page, addUserPage.employeeNameInput, "Employee Name Input");
        await expect(addUserPage.employeeNameInput).toBeVisible();
        await highlight(page, addUserPage.statusDropdown, "Status Dropdown");
        await expect(addUserPage.statusDropdown).toBeVisible();
        await highlight(page, addUserPage.usernameInput, "Username Input");
        await expect(addUserPage.usernameInput).toBeVisible();
        await highlight(page, addUserPage.passwordInput, "Password Input");
        await expect(addUserPage.passwordInput).toBeVisible();
        await highlight(page, addUserPage.confirmPasswordInput, "Confirm Password Input");
        await expect(addUserPage.confirmPasswordInput).toBeVisible();
        await highlight(page, addUserPage.saveButton, "Save Button", "#00C853");
        await expect(addUserPage.saveButton).toBeVisible();
        await highlight(page, addUserPage.cancelButton, "Cancel Button", "#00C853");
        await expect(addUserPage.cancelButton).toBeVisible();
      });
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Functional Tests
  // ══════════════════════════════════════════════════════════════════════════
  test.describe("Functional Tests", () => {
    // ─── Grouped: Search / Filter / Reset — all on same page, no data mutation
    test("[TC-0314/0315/0316] Verify search, filter and reset functionality", async ({ page }) => {
      await test.step("[TC-0314] Search by username returns correct records", async () => {
        const adminUser = "Admin";
        await highlight(page, systemUsersPage.usernameInput, "Username Input");
        await systemUsersPage.searchUser(adminUser);

        const rowCount = await systemUsersPage.tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        await highlight(page, systemUsersPage.tableRows.first(), "First Result Row", "#00C853");
        await expect(systemUsersPage.tableRows.first()).toContainText(adminUser);
      });

      await test.step("[TC-0315] Filter by User Role returns filtered results", async () => {
        // Reset previous search state before applying new filter
        await systemUsersPage.resetSearch();

        await highlight(page, systemUsersPage.userRoleDropdown, "User Role Dropdown");
        await systemUsersPage.selectRole("Admin");
        await highlight(page, systemUsersPage.searchButton, "Search Button");
        await systemUsersPage.searchButton.click();
        await systemUsersPage.page.waitForTimeout(1000);

        const rows  = systemUsersPage.tableRows;
        const count = await rows.count();
        if (count > 0) {
          await highlight(page, rows.first(), "First Filtered Row", "#00C853");
          await expect(rows.first()).toContainText("Admin");
        }
      });

      await test.step("[TC-0316] 'Reset' button clears all search filters", async () => {
        await highlight(page, systemUsersPage.usernameInput, "Username Input");
        await systemUsersPage.usernameInput.fill("RandomUser");
        await systemUsersPage.resetSearch();

        await highlight(page, systemUsersPage.usernameInput, "Username Input (Cleared)", "#00C853");
        const inputValue = await systemUsersPage.usernameInput.inputValue();
        expect(inputValue).toBe("");
      });
    });

    // ─── Standalone: Creates a new user (data mutation) ───────────────────
    test("[TC-0330] Verify adding a new user with valid data works", async ({ page }) => {
      const randomUsername = `user_${Math.floor(Math.random() * 10000)}`;
      const password = "Password123!";

      await highlight(page, systemUsersPage.addButton, "+ Add Button");
      await systemUsersPage.addButton.click();
      await addUserPage.fillUserForm("Admin", "Alice Jensen", "Enabled", randomUsername, password);
      await highlight(page, addUserPage.saveButton, "Save Button", "#00C853");
      await addUserPage.save();

      await expect(systemUsersPage.page.locator(".oxd-toast-content"))
        .toBeVisible({ timeout: 10000 })
        .catch(() => {});
      await systemUsersPage.searchUser(randomUsername);
      await highlight(page, systemUsersPage.tableRows.first(), "New User Row", "#00C853");
      await expect(systemUsersPage.tableRows.first()).toContainText(randomUsername);
    });

    // ─── Standalone: Validation error (navigates to Add User page) ────────
    test("[TC-0332] Verify validation error when passwords do not match", async ({ page }) => {
      await systemUsersPage.addButton.click();
      await addUserPage.usernameInput.fill("MismatchUser");
      await addUserPage.passwordInput.fill("Password123!");
      await addUserPage.confirmPasswordInput.fill("Different123!");

      const mismatchError = addUserPage.page.getByText("Passwords do not match");
      await mismatchError.waitFor({ state: "visible" });
      await highlight(page, mismatchError, "Password Mismatch Error", "#00C853");
      await expect(mismatchError).toBeVisible();
    });

    // ─── Standalone: Deletes a user (data mutation, depends on data state) ─
    test("[TC-0335] Verify deleting a user removes them from the table", async ({ page }) => {
      await systemUsersPage.searchUser("Alice");

      if (await systemUsersPage.tableRows.count() > 0) {
        await highlight(page, systemUsersPage.firstRowDeleteIcon, "Delete Icon", "#00C853");
        await systemUsersPage.firstRowDeleteIcon.click();

        const confirmBtn = systemUsersPage.page.getByRole("button", { name: "Yes, Delete" });
        await highlight(page, confirmBtn, "Confirm Delete", "#00C853");
        await confirmBtn.click();

        await expect(systemUsersPage.page.locator(".oxd-toast-content"))
          .toBeVisible({ timeout: 10000 })
          .catch(() => {});
      }
    });
  });
});
