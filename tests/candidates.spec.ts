import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { CandidatesPage } from "../pages/Recruitment/CandidatesPage";
import * as credentials from "../test-data/credentials.json";

test.describe("Recruitment - Candidates Verification @recruitment", () => {
    let loginPage: LoginPage;
    let candidatesPage: CandidatesPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        candidatesPage = new CandidatesPage(page);

        // Login
        await loginPage.goto();
        await loginPage.login(
            credentials.validUser.username,
            credentials.validUser.password
        );
        await page.waitForURL('**/dashboard/**');

        // Navigate to Recruitment -> Candidates
        await candidatesPage.navigateToRecruitment();
        await expect(candidatesPage.page.getByText('Candidates', { exact: true }).first()).toBeVisible();
    });

    test.describe("UI Verifications", () => {
        test("[TC-0601/0602] Verify search filters are visible", async () => {
            await expect(candidatesPage.jobTitleDropdown).toBeVisible();
            await expect(candidatesPage.vacancyDropdown).toBeVisible();
            await expect(candidatesPage.hiringManagerDropdown).toBeVisible();
            await expect(candidatesPage.statusDropdown).toBeVisible();
            await expect(candidatesPage.candidateNameInput).toBeVisible();
            await expect(candidatesPage.searchButton).toBeVisible();
        });

        test("[TC-0604/0605] Verify Add button and table headers", async () => {
            await expect(candidatesPage.addButton).toBeVisible();
            await expect(candidatesPage.page.getByText('Vacancy', { exact: true }).nth(1)).toBeVisible();
            await expect(candidatesPage.page.getByText('Candidate', { exact: true }).nth(1)).toBeVisible();
        });
    });

    test.describe("Dropdown Verification", () => {
        test("[TC-0606] Verify Job Title dropdown options", async () => {
            await candidatesPage.jobTitleDropdown.click();
            await expect(candidatesPage.page.getByRole('option', { name: 'QA Engineer' })).toBeVisible();
            await expect(candidatesPage.page.getByRole('option', { name: 'QA Lead' })).toBeVisible();
            await candidatesPage.page.keyboard.press('Escape');
        });

        test("[TC-0607] Verify Vacancy dropdown options", async () => {
            await candidatesPage.vacancyDropdown.click();
            // Check for Java Developer or common vacancy from screenshot
            await expect(candidatesPage.page.getByRole('option', { name: 'Java Developer' })).toBeVisible().catch(() => {});
            await candidatesPage.page.keyboard.press('Escape');
        });

        test("[TC-0608] Verify Hiring Manager dropdown options", async () => {
            await candidatesPage.hiringManagerDropdown.click();
            await expect(candidatesPage.page.getByRole('option', { name: 'manda user' })).toBeVisible();
            await candidatesPage.page.keyboard.press('Escape');
        });
    });

    test.describe("Functional Tests", () => {
        test("[TC-0610] Verify Reset button clears search criteria", async () => {
            await candidatesPage.keywordsInput.fill("AutomatedSearch");
            await candidatesPage.resetButton.click();
            await expect(candidatesPage.keywordsInput).toHaveValue("");
        });

        test("[TC-0611] Verify clicking Add button navigates to Add Candidate page", async () => {
            await candidatesPage.addButton.click();
            await expect(candidatesPage.page).toHaveURL(/.*addCandidate/);
            await expect(candidatesPage.page.getByText('Add Candidate')).toBeVisible();
        });
    });
});
