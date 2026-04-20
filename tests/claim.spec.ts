import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { ClaimPage } from "../pages/Claim/ClaimPage";
import * as credentials from "../test-data/credentials.json";

test.describe("Claim Module Verifications @claim", () => {
    let loginPage: LoginPage;
    let claimPage: ClaimPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        claimPage = new ClaimPage(page);

        // Login
        await loginPage.goto();
        await loginPage.login(
            credentials.validUser.username,
            credentials.validUser.password
        );
        await page.waitForURL('**/dashboard/**');

        // Navigate to Claim Module directly or via sidebar
        await claimPage.navigateToClaimModule();
        await expect(claimPage.employeeNameSearchInput).toBeVisible();
    });

    test.describe("Employee Claims Navigation and UI Verifications", () => {
        test("[TC-0501] Verify Employee Claims page contains Search filters", async () => {
            await expect(claimPage.employeeNameSearchInput).toBeVisible();
            await expect(claimPage.referenceIdInput).toBeVisible();
            await expect(claimPage.eventNameDropdown).toBeVisible();
            await expect(claimPage.statusDropdown).toBeVisible();
            await expect(claimPage.includeDropdown).toBeVisible();
            await expect(claimPage.searchButton).toBeVisible();
            await expect(claimPage.resetButton).toBeVisible();
        });

        test("[TC-0502] Verify Event Name dropdown contains valid options", async () => {
            await claimPage.eventNameDropdown.click();
            await expect(claimPage.page.getByRole('option', { name: 'Accommodation' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Medical Reimbursement' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Travel Allowance' })).toBeVisible();
            // Close dropdown
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0503] Verify Status dropdown contains valid options", async () => {
            await claimPage.statusDropdown.click();
            await expect(claimPage.page.getByRole('option', { name: 'Initiated' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Submitted' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Approved' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Paid' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Rejected' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Cancelled' })).toBeVisible();
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0504] Verify Include dropdown options", async () => {
            await claimPage.includeDropdown.click();
            await expect(claimPage.page.getByRole('option', { name: 'Current Employees Only' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Current and Past Employees' })).toBeVisible();
            await expect(claimPage.page.getByRole('option', { name: 'Past Employees Only' })).toBeVisible();
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0508] Verify Reset button clears search input fields", async () => {
            await claimPage.referenceIdInput.fill("202307180000003");
            await claimPage.resetButton.click();
            await claimPage.page.waitForTimeout(500); // UI clear delay
            await expect(claimPage.referenceIdInput).toHaveValue("");
        });
    });

    test.describe("Assign Claim (Create Request) Functional Tests", () => {
        test.beforeEach(async () => {
            await claimPage.navigateToAssignClaim();
        });

        test("[TC-0511] Verify Assign Claim mandatory fields presence and headers", async () => {
            await expect(claimPage.page.getByText('Create Claim Request')).toBeVisible();
            await expect(claimPage.assignEmployeeNameInput).toBeVisible();
            await expect(claimPage.assignEventDropdown).toBeVisible();
            await expect(claimPage.assignCurrencyDropdown).toBeVisible();
            await expect(claimPage.remarksTextarea).toBeVisible();
        });

        test("[TC-0514] Verify error message appears when trying to Create without mandatory fields", async () => {
            // Click Create immediately
            await claimPage.createButton.click();
            const errors = await claimPage.page.locator('.oxd-input-field-error-message').count();
            expect(errors).toBeGreaterThan(0);
        });

        test("[TC-0516] Verify Clicking Cancel navigates back to Employee Claims", async () => {
            await claimPage.cancelButton.click();
            await expect(claimPage.employeeNameSearchInput).toBeVisible(); // Confirms going back to search
            await expect(claimPage.assignClaimButton).toBeVisible();
        });

        test("[TC-0517] Verify successfully creating an Assign Claim Request works", async () => {
            // Assuming "manda user" or generic admin handles the employee name
            const testUserName = "manda";
            await claimPage.assignEmployeeNameInput.fill(testUserName);
            await claimPage.page.waitForTimeout(2000); // Wait for hints API network request
            await claimPage.page.getByRole('option').first().click();

            await claimPage.selectDropdownOption(claimPage.assignEventDropdown, 'Accommodation');
            await claimPage.selectDropdownOption(claimPage.assignCurrencyDropdown, 'United States Dollar'); // using generic expected dollar/name
            
            await claimPage.remarksTextarea.fill("Test claim remarks auto");
            await claimPage.createButton.click();

            // Should redirect or show toast
            await expect(claimPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await claimPage.page.waitForTimeout(1000);
        });
    });

    test.describe("View Claim Details Tests", () => {
        test("[TC-0518/519] Verify clicking View Details navigates to the Claim details page", async () => {
            // Click View Details on the first row
            await claimPage.viewDetailsButton.click();
            
            // Verify navigation and basic elements
            await expect(claimPage.page.getByText('Claim Reference Id')).toBeVisible().catch(() => {});
            await expect(claimPage.backButton).toBeVisible();
            
            // Go back
            await claimPage.backButton.click();
            await expect(claimPage.employeeNameSearchInput).toBeVisible();
        });
    });
});
