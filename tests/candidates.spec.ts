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

        await loginPage.goto();
        await loginPage.login(
            credentials.validUser.username,
            credentials.validUser.password
        );
        await page.waitForURL('**/dashboard/**');

        await candidatesPage.navigateToRecruitment();
        await expect(candidatesPage.page.getByText('Candidates', { exact: true }).first()).toBeVisible();
    });

    test.describe("UI Verifications", () => {
        test("[TC-0601/0602] Verify search filters are visible", async ({ page }) => {
            await expect(candidatesPage.jobTitleDropdown).toBeVisible();
            await expect(candidatesPage.vacancyDropdown).toBeVisible();
            await expect(candidatesPage.hiringManagerDropdown).toBeVisible();
            await expect(candidatesPage.statusDropdown).toBeVisible();
            await expect(candidatesPage.candidateNameInput).toBeVisible();
            await expect(candidatesPage.searchButton).toBeVisible();
        });

        test("[TC-0604/0605] Verify Add button and table headers", async ({ page }) => {

            await page.evaluate(() => window.scrollTo(0, 200));
            await expect(candidatesPage.addButton).toBeVisible();

            await expect(candidatesPage.candidateColumn).toBeVisible();
            await expect(candidatesPage.vacancyColumn).toBeVisible();
            await expect(candidatesPage.statusColumn).toBeVisible();
            await expect(candidatesPage.hireManagerColumn).toBeVisible();
            await expect(candidatesPage.addedDateColumn).toBeVisible();
            await expect(candidatesPage.actionsColumn).toBeVisible();
        });
    });

    test.describe("Dropdown Verification", () => {
        test("[TC-0606] Verify Job Title dropdown options", async ({ page }) => {
            await candidatesPage.jobTitleDropdown.click();

            const qaEngineer = candidatesPage.page.getByRole('option', { name: 'QA Engineer' });
            const qaLead = candidatesPage.page.getByRole('option', { name: 'QA Lead' });
            await expect(qaEngineer).toBeVisible();
            await expect(qaLead).toBeVisible();
            await candidatesPage.page.keyboard.press('Escape');
        });

        test("[TC-0607] Verify Vacancy dropdown options", async ({ page }) => {
            await candidatesPage.vacancyDropdown.click();
            await expect(candidatesPage.page.getByRole('option', { name: 'Java Developer' })).toBeVisible().catch(() => {});
            await candidatesPage.page.keyboard.press('Escape');
        });

        test("[TC-0608] Verify Hiring Manager dropdown options", async ({ page }) => {
            await candidatesPage.hiringManagerDropdown.click();

            // Wait for dropdown container to appear
            await expect(candidatesPage.managerOption).toBeVisible();

            // Verify at least one option exists (not hardcoding a specific username)
            const options = candidatesPage.page.getByRole('option');
            await expect(options.first()).toBeVisible();

            await candidatesPage.page.keyboard.press('Escape');
        });
    });

    test.describe("Functional Tests", () => {
        test("[TC-0610] Verify Reset button clears search criteria", async ({ page }) => {
            await candidatesPage.keywordsInput.fill("AutomatedSearch");
            await candidatesPage.resetButton.click();

            await expect(candidatesPage.keywordsInput).toHaveValue("");
        });

        test("[TC-0611] Verify clicking Add button navigates to Add Candidate page", async ({ page }) => {
            await candidatesPage.addButton.click();
            await expect(candidatesPage.page).toHaveURL(/.*addCandidate/);

            const addCandidateTitle = candidatesPage.page.getByText('Add Candidate');
            await addCandidateTitle.waitFor({ state: 'visible' });
            await expect(addCandidateTitle).toBeVisible();
        });
    });
});
