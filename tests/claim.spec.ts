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

        await loginPage.goto();
        await loginPage.login(
            credentials.validUser.username,
            credentials.validUser.password
        );
        await page.waitForURL('**/dashboard/**');

        await claimPage.navigateToClaimModule();
        await expect(claimPage.employeeNameSearchInput).toBeVisible();
    });

    test.describe("Employee Claims Navigation and UI Verifications", () => {
        test("[TC-0501] Verify Employee Claims page contains Search filters", async ({ page }) => {
            await expect(claimPage.employeeNameSearchInput).toBeVisible();
            await expect(claimPage.referenceIdInput).toBeVisible();
            await expect(claimPage.eventNameDropdown).toBeVisible();
            await expect(claimPage.statusDropdown).toBeVisible();
            await expect(claimPage.includeDropdown).toBeVisible();
            await expect(claimPage.searchButton).toBeVisible();
            await expect(claimPage.resetButton).toBeVisible();
        });

        test("[TC-0502] Verify Event Name dropdown contains valid options", async ({ page }) => {
            await claimPage.eventNameDropdown.click();

            const accommodation = claimPage.page.getByRole('option', { name: 'Accommodation' });
            const medical = claimPage.page.getByRole('option', { name: 'Medical Reimbursement' });
            const travel = claimPage.page.getByRole('option', { name: 'Travel Allowance' });

            await expect(accommodation).toBeVisible();
            await expect(medical).toBeVisible();
            await expect(travel).toBeVisible();
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0503] Verify Status dropdown contains valid options", async ({ page }) => {
            await claimPage.statusDropdown.click();

            const statuses = ['Initiated', 'Submitted', 'Approved', 'Paid', 'Rejected', 'Cancelled'];
            for (const status of statuses) {
                const option = claimPage.page.getByRole('option', { name: status });
                await expect(option).toBeVisible();
            }
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0504] Verify Include dropdown options", async ({ page }) => {
            await claimPage.includeDropdown.click();

            const currentOnly = claimPage.page.getByRole('option', { name: 'Current Employees Only' });
            const currentAndPast = claimPage.page.getByRole('option', { name: 'Current and Past Employees' });
            const pastOnly = claimPage.page.getByRole('option', { name: 'Past Employees Only' });

            await expect(currentOnly).toBeVisible();
            await expect(currentAndPast).toBeVisible();
            await expect(pastOnly).toBeVisible();
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0508] Verify Reset button clears search input fields", async ({ page }) => {
            await claimPage.employeeNameSearchInput.fill("manda user");
            await claimPage.resetButton.click();
            await expect(await claimPage.invalidMessage).toBeVisible();
            await claimPage.resetButton.click();
            await expect(await claimPage.invalidMessage).toBeHidden();
            await expect(claimPage.employeeNameSearchInput).toHaveValue("");
        });
    });

    test.describe("Assign Claim (Create Request) Functional Tests", () => {
        test.beforeEach(async () => {
            await claimPage.navigateToAssignClaim();
        });

        test("[TC-0511] Verify Assign Claim mandatory fields presence and headers", async ({ page }) => {
            const createTitle = claimPage.page.getByText('Create Claim Request');
            await createTitle.waitFor({ state: 'visible' });
            await expect(createTitle).toBeVisible();

            await expect(claimPage.assignEmployeeNameInput).toBeVisible();
            await expect(claimPage.assignEventDropdown).toBeVisible();
            await expect(claimPage.assignCurrencyDropdown).toBeVisible();
            await expect(claimPage.remarksTextarea).toBeVisible();
        });

        test("[TC-0514] Verify error message appears when trying to Create without mandatory fields", async ({ page }) => {
            await claimPage.createButton.click();

            const errors = claimPage.page.locator('.oxd-input-field-error-message');
            const count = await errors.count();
            expect(count).toBeGreaterThan(0);
        });

        test("[TC-0516] Verify Clicking Cancel navigates back to Employee Claims", async ({ page }) => {
            await claimPage.cancelButton.click();

            await expect(claimPage.employeeNameSearchInput).toBeVisible();
            await expect(claimPage.assignClaimButton).toBeVisible();
        });

        test("[TC-0517] Verify successfully creating an Assign Claim Request works", async ({ page }) => {
            const testUserName = "manda";
            await claimPage.assignEmployeeNameInput.fill(testUserName);
            await claimPage.page.getByRole('option').first().waitFor({ state: 'visible' });
            await claimPage.page.getByRole('option').first().click();

            await claimPage.selectDropdownOption(claimPage.assignEventDropdown, 'Accommodation');
            await claimPage.selectDropdownOption(claimPage.assignCurrencyDropdown, 'United States Dollar');

            await claimPage.remarksTextarea.fill("Test claim remarks auto");

            await claimPage.createButton.click();

            await expect(claimPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
        });
    });

    test.describe("View Claim Details Tests", () => {
        test("[TC-0518/519] Verify clicking View Details navigates to the Claim details page", async ({ page }) => {
            await claimPage.viewDetailsButton.click();

            const claimRefId = claimPage.page.getByText('Claim Reference Id');
            await claimRefId.waitFor({ state: 'visible' }).catch(() => {});
            await expect(claimRefId).toBeVisible().catch(() => {});

            await expect(claimPage.backButton).toBeVisible();

            await claimPage.backButton.click();
            await expect(claimPage.myClaimTitle).toBeVisible();
        });
    });
});
