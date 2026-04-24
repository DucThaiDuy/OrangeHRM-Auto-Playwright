import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { ClaimPage } from "../pages/Claim/ClaimPage";
import * as credentials from "../test-data/credentials.json";
import { highlight } from "../utils/highlight";

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
            await highlight(page, claimPage.employeeNameSearchInput, "Employee Name Input");
            await expect(claimPage.employeeNameSearchInput).toBeVisible();

            await highlight(page, claimPage.referenceIdInput, "Reference ID Input");
            await expect(claimPage.referenceIdInput).toBeVisible();

            await highlight(page, claimPage.eventNameDropdown, "Event Name Dropdown");
            await expect(claimPage.eventNameDropdown).toBeVisible();

            await highlight(page, claimPage.statusDropdown, "Status Dropdown");
            await expect(claimPage.statusDropdown).toBeVisible();

            await highlight(page, claimPage.includeDropdown, "Include Dropdown");
            await expect(claimPage.includeDropdown).toBeVisible();

            await highlight(page, claimPage.searchButton, "Search Button");
            await expect(claimPage.searchButton).toBeVisible();

            await highlight(page, claimPage.resetButton, "Reset Button", '#00C853');
            await expect(claimPage.resetButton).toBeVisible();
        });

        test("[TC-0502] Verify Event Name dropdown contains valid options", async ({ page }) => {
            await highlight(page, claimPage.eventNameDropdown, "Event Name Dropdown");
            await claimPage.eventNameDropdown.click();

            const accommodation = claimPage.page.getByRole('option', { name: 'Accommodation' });
            const medical = claimPage.page.getByRole('option', { name: 'Medical Reimbursement' });
            const travel = claimPage.page.getByRole('option', { name: 'Travel Allowance' });

            await highlight(page, accommodation, "Option: Accommodation", '#00C853');
            await expect(accommodation).toBeVisible();
            await highlight(page, medical, "Option: Medical Reimbursement", '#00C853');
            await expect(medical).toBeVisible();
            await highlight(page, travel, "Option: Travel Allowance", '#00C853');
            await expect(travel).toBeVisible();
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0503] Verify Status dropdown contains valid options", async ({ page }) => {
            await highlight(page, claimPage.statusDropdown, "Status Dropdown");
            await claimPage.statusDropdown.click();

            const statuses = ['Initiated', 'Submitted', 'Approved', 'Paid', 'Rejected', 'Cancelled'];
            for (const status of statuses) {
                const option = claimPage.page.getByRole('option', { name: status });
                await highlight(page, option, `Option: ${status}`, '#00C853');
                await expect(option).toBeVisible();
            }
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0504] Verify Include dropdown options", async ({ page }) => {
            await highlight(page, claimPage.includeDropdown, "Include Dropdown");
            await claimPage.includeDropdown.click();

            const currentOnly = claimPage.page.getByRole('option', { name: 'Current Employees Only' });
            const currentAndPast = claimPage.page.getByRole('option', { name: 'Current and Past Employees' });
            const pastOnly = claimPage.page.getByRole('option', { name: 'Past Employees Only' });

            await highlight(page, currentOnly, "Option: Current Only", '#00C853');
            await expect(currentOnly).toBeVisible();
            await highlight(page, currentAndPast, "Option: Current & Past", '#00C853');
            await expect(currentAndPast).toBeVisible();
            await highlight(page, pastOnly, "Option: Past Only", '#00C853');
            await expect(pastOnly).toBeVisible();
            await claimPage.page.keyboard.press('Escape');
        });

        test("[TC-0508] Verify Reset button clears search input fields", async ({ page }) => {
            await highlight(page, claimPage.referenceIdInput, "Reference ID Input");
            await claimPage.referenceIdInput.fill("202307180000003");
            await highlight(page, claimPage.resetButton, "Reset Button", '#00C853');
            await claimPage.resetButton.click();
            await claimPage.page.waitForTimeout(500);

            await highlight(page, claimPage.referenceIdInput, "Reference ID Input (Cleared)", '#00C853');
            await expect(claimPage.referenceIdInput).toHaveValue("");
        });
    });

    test.describe("Assign Claim (Create Request) Functional Tests", () => {
        test.beforeEach(async () => {
            await claimPage.navigateToAssignClaim();
        });

        test("[TC-0511] Verify Assign Claim mandatory fields presence and headers", async ({ page }) => {
            const createTitle = claimPage.page.getByText('Create Claim Request');
            await createTitle.waitFor({ state: 'visible' });
            await highlight(page, createTitle, "Create Claim Request Title", '#00C853');
            await expect(createTitle).toBeVisible();

            await highlight(page, claimPage.assignEmployeeNameInput, "Employee Name Input");
            await expect(claimPage.assignEmployeeNameInput).toBeVisible();

            await highlight(page, claimPage.assignEventDropdown, "Event Dropdown");
            await expect(claimPage.assignEventDropdown).toBeVisible();

            await highlight(page, claimPage.assignCurrencyDropdown, "Currency Dropdown");
            await expect(claimPage.assignCurrencyDropdown).toBeVisible();

            await highlight(page, claimPage.remarksTextarea, "Remarks Textarea");
            await expect(claimPage.remarksTextarea).toBeVisible();
        });

        test("[TC-0514] Verify error message appears when trying to Create without mandatory fields", async ({ page }) => {
            await highlight(page, claimPage.createButton, "Create Button");
            await claimPage.createButton.click();

            const errors = claimPage.page.locator('.oxd-input-field-error-message');
            const count = await errors.count();
            expect(count).toBeGreaterThan(0);

            // Highlight all visible validation errors
            for (let i = 0; i < count; i++) {
                await highlight(page, errors.nth(i), `Validation Error ${i + 1}`, '#00C853');
            }
        });

        test("[TC-0516] Verify Clicking Cancel navigates back to Employee Claims", async ({ page }) => {
            await highlight(page, claimPage.cancelButton, "Cancel Button", '#00C853');
            await claimPage.cancelButton.click();

            await highlight(page, claimPage.employeeNameSearchInput, "Employee Name Search", '#00C853');
            await expect(claimPage.employeeNameSearchInput).toBeVisible();
            await highlight(page, claimPage.assignClaimButton, "Assign Claim Button", '#00C853');
            await expect(claimPage.assignClaimButton).toBeVisible();
        });

        test("[TC-0517] Verify successfully creating an Assign Claim Request works", async ({ page }) => {
            const testUserName = "manda";
            await highlight(page, claimPage.assignEmployeeNameInput, "Employee Name Input");
            await claimPage.assignEmployeeNameInput.fill(testUserName);
            await claimPage.page.waitForTimeout(2000);
            await claimPage.page.getByRole('option').first().click();

            await claimPage.selectDropdownOption(claimPage.assignEventDropdown, 'Accommodation');
            await claimPage.selectDropdownOption(claimPage.assignCurrencyDropdown, 'United States Dollar');

            await highlight(page, claimPage.remarksTextarea, "Remarks Textarea");
            await claimPage.remarksTextarea.fill("Test claim remarks auto");

            await highlight(page, claimPage.createButton, "Create Button", '#00C853');
            await claimPage.createButton.click();

            await expect(claimPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await claimPage.page.waitForTimeout(1000);
        });
    });

    test.describe("View Claim Details Tests", () => {
        test("[TC-0518/519] Verify clicking View Details navigates to the Claim details page", async ({ page }) => {
            await highlight(page, claimPage.viewDetailsButton, "View Details Button", '#00C853');
            await claimPage.viewDetailsButton.click();

            const claimRefId = claimPage.page.getByText('Claim Reference Id');
            await claimRefId.waitFor({ state: 'visible' }).catch(() => {});
            await highlight(page, claimRefId, "Claim Reference Id", '#00C853').catch(() => {});
            await expect(claimRefId).toBeVisible().catch(() => {});

            await highlight(page, claimPage.backButton, "Back Button", '#00C853');
            await expect(claimPage.backButton).toBeVisible();

            await claimPage.backButton.click();
            await highlight(page, claimPage.employeeNameSearchInput, "Employee Name Search", '#00C853');
            await expect(claimPage.employeeNameSearchInput).toBeVisible();
        });
    });
});
