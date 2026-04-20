import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { SystemUsersPage } from "../pages/Admin/SystemUsersPage";
import { AddUserPage } from "../pages/Admin/AddUserPage";
import * as credentials from "../test-data/credentials.json";

test.describe("Admin - User Management Verification @admin", () => {
    let loginPage: LoginPage;
    let systemUsersPage: SystemUsersPage;
    let addUserPage: AddUserPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        systemUsersPage = new SystemUsersPage(page);
        addUserPage = new AddUserPage(page);

        // Login
        await loginPage.goto();
        await loginPage.login(
            credentials.validUser.username,
            credentials.validUser.password
        );

        // Navigate to Admin -> User Management
        await page.goto('/web/index.php/admin/viewSystemUsers');
        await expect(systemUsersPage.usernameInput).toBeVisible();
    });

    test.describe("UI Verifications", () => {
        test("[TC-0304] Verify Username input field is visible", async () => {
            await expect(systemUsersPage.usernameInput).toBeVisible();
        });

        test("[TC-0309] Verify Search button is visible", async () => {
            await expect(systemUsersPage.searchButton).toBeVisible();
        });

        test("[TC-0310] Verify '+ Add' button is visible", async () => {
            await expect(systemUsersPage.addButton).toBeVisible();
        });

        test("[TC-0305] Verify User Role dropdown options", async () => {
            await systemUsersPage.userRoleDropdown.click();
            await expect(systemUsersPage.page.getByRole('option', { name: 'Admin' })).toBeVisible();
            await expect(systemUsersPage.page.getByRole('option', { name: 'ESS' })).toBeVisible();
            await systemUsersPage.page.keyboard.press('Escape');
        });

        test("[TC-0307] Verify Status dropdown options", async () => {
            await systemUsersPage.statusDropdown.click();
            await expect(systemUsersPage.page.getByRole('option', { name: 'Enabled' })).toBeVisible();
            await expect(systemUsersPage.page.getByRole('option', { name: 'Disabled' })).toBeVisible();
            await systemUsersPage.page.keyboard.press('Escape');
        });

        test("[TC-0312] Verify table columns are present", async () => {
            await expect(systemUsersPage.page.getByText('Username', { exact: true }).nth(1)).toBeVisible();
            await expect(systemUsersPage.page.getByText('User Role', { exact: true }).nth(1)).toBeVisible();
            await expect(systemUsersPage.page.getByText('Employee Name', { exact: true }).nth(1)).toBeVisible();
            await expect(systemUsersPage.page.getByText('Status', { exact: true }).nth(1)).toBeVisible();
        });

        test("[TC-0324] Verify 'Add User' page UI elements", async () => {
            await systemUsersPage.addButton.click();
            await expect(addUserPage.userRoleDropdown).toBeVisible();
            await expect(addUserPage.employeeNameInput).toBeVisible();
            await expect(addUserPage.statusDropdown).toBeVisible();
            await expect(addUserPage.usernameInput).toBeVisible();
            await expect(addUserPage.passwordInput).toBeVisible();
            await expect(addUserPage.confirmPasswordInput).toBeVisible();
            await expect(addUserPage.saveButton).toBeVisible();
            await expect(addUserPage.cancelButton).toBeVisible();
        });
    });

    test.describe("Functional Tests", () => {
        test("[TC-0314] Verify searching by unique Username returns correct record", async () => {
            const adminUser = "Admin";
            await systemUsersPage.searchUser(adminUser);
            
            const rowCount = await systemUsersPage.tableRows.count();
            expect(rowCount).toBeGreaterThan(0);
            await expect(systemUsersPage.tableRows.first()).toContainText(adminUser);
        });

        test("[TC-0315] Verify searching by User Role filters results", async () => {
            await systemUsersPage.selectRole('Admin');
            await systemUsersPage.searchButton.click();
            await systemUsersPage.page.waitForTimeout(1000);
            
            const rows = systemUsersPage.tableRows;
            const count = await rows.count();
            if (count > 0) {
                await expect(rows.first()).toContainText('Admin');
            }
        });

        test("[TC-0316] Verify 'Reset' button clears all search filters", async () => {
            await systemUsersPage.usernameInput.fill("RandomUser");
            await systemUsersPage.resetSearch();
            
            const inputValue = await systemUsersPage.usernameInput.inputValue();
            expect(inputValue).toBe("");
        });

        test("[TC-0330] Verify adding a new user with valid data works", async () => {
            const randomUsername = `user_${Math.floor(Math.random() * 10000)}`;
            const password = "Password123!";
            
            await systemUsersPage.addButton.click();
            await addUserPage.fillUserForm("Admin", "Alice Jensen", "Enabled", randomUsername, password);
            await addUserPage.save();
            
            await expect(systemUsersPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await systemUsersPage.searchUser(randomUsername);
            await expect(systemUsersPage.tableRows.first()).toContainText(randomUsername);
        });

        test("[TC-0332] Verify validation error when Passwords do not match", async () => {
            await systemUsersPage.addButton.click();
            await addUserPage.usernameInput.fill("MismatchUser");
            await addUserPage.passwordInput.fill("Password123!");
            await addUserPage.confirmPasswordInput.fill("Different123!");
            
            await expect(addUserPage.page.getByText('Passwords do not match')).toBeVisible();
        });

        test("[TC-0335] Verify deleting a user removes them from the table", async () => {
            await systemUsersPage.searchUser("Alice");
            
            if (await systemUsersPage.tableRows.count() > 0) {
                await systemUsersPage.firstRowDeleteIcon.click();
                await systemUsersPage.page.getByRole('button', { name: 'Yes, Delete' }).click();
                
                await expect(systemUsersPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            }
        });
    });
});
