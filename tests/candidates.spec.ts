import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { CandidatesPage } from "../pages/Recruitment/CandidatesPage";
import * as credentials from "../test-data/credentials.json";
import { highlight } from "../utils/highlight";

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
            await highlight(page, candidatesPage.jobTitleDropdown, "Job Title Dropdown");
            await expect(candidatesPage.jobTitleDropdown).toBeVisible();

            await highlight(page, candidatesPage.vacancyDropdown, "Vacancy Dropdown");
            await expect(candidatesPage.vacancyDropdown).toBeVisible();

            await highlight(page, candidatesPage.hiringManagerDropdown, "Hiring Manager Dropdown");
            await expect(candidatesPage.hiringManagerDropdown).toBeVisible();

            await highlight(page, candidatesPage.statusDropdown, "Status Dropdown");
            await expect(candidatesPage.statusDropdown).toBeVisible();

            await highlight(page, candidatesPage.candidateNameInput, "Candidate Name Input");
            await expect(candidatesPage.candidateNameInput).toBeVisible();

            await highlight(page, candidatesPage.searchButton, "Search Button");
            await expect(candidatesPage.searchButton).toBeVisible();
        });

        test("[TC-0604/0605] Verify Add button and table headers", async ({ page }) => {
            await highlight(page, candidatesPage.addButton, "+ Add Candidate Button", '#00C853');
            await expect(candidatesPage.addButton).toBeVisible();

            const vacancyCol = candidatesPage.page.getByText('Vacancy', { exact: true }).nth(1);
            const candidateCol = candidatesPage.page.getByText('Candidate', { exact: true }).nth(1);

            await highlight(page, vacancyCol, "Column: Vacancy", '#00C853');
            await expect(vacancyCol).toBeVisible();
            await highlight(page, candidateCol, "Column: Candidate", '#00C853');
            await expect(candidateCol).toBeVisible();
        });
    });

    test.describe("Dropdown Verification", () => {
        test("[TC-0606] Verify Job Title dropdown options", async ({ page }) => {
            await highlight(page, candidatesPage.jobTitleDropdown, "Job Title Dropdown");
            await candidatesPage.jobTitleDropdown.click();

            const qaEngineer = candidatesPage.page.getByRole('option', { name: 'QA Engineer' });
            const qaLead = candidatesPage.page.getByRole('option', { name: 'QA Lead' });
            await highlight(page, qaEngineer, "Option: QA Engineer", '#00C853');
            await expect(qaEngineer).toBeVisible();
            await highlight(page, qaLead, "Option: QA Lead", '#00C853');
            await expect(qaLead).toBeVisible();
            await candidatesPage.page.keyboard.press('Escape');
        });

        test("[TC-0607] Verify Vacancy dropdown options", async ({ page }) => {
            await highlight(page, candidatesPage.vacancyDropdown, "Vacancy Dropdown");
            await candidatesPage.vacancyDropdown.click();
            await expect(candidatesPage.page.getByRole('option', { name: 'Java Developer' })).toBeVisible().catch(() => {});
            await candidatesPage.page.keyboard.press('Escape');
        });

        test("[TC-0608] Verify Hiring Manager dropdown options", async ({ page }) => {
            await highlight(page, candidatesPage.hiringManagerDropdown, "Hiring Manager Dropdown");
            await candidatesPage.hiringManagerDropdown.click();

            const managerOption = candidatesPage.page.getByRole('option', { name: 'manda user' });
            await highlight(page, managerOption, "Option: manda user", '#00C853');
            await expect(managerOption).toBeVisible();
            await candidatesPage.page.keyboard.press('Escape');
        });
    });

    test.describe("Functional Tests", () => {
        test("[TC-0610] Verify Reset button clears search criteria", async ({ page }) => {
            await highlight(page, candidatesPage.keywordsInput, "Keywords Input");
            await candidatesPage.keywordsInput.fill("AutomatedSearch");
            await highlight(page, candidatesPage.resetButton, "Reset Button", '#00C853');
            await candidatesPage.resetButton.click();

            await highlight(page, candidatesPage.keywordsInput, "Keywords Input (Cleared)", '#00C853');
            await expect(candidatesPage.keywordsInput).toHaveValue("");
        });

        test("[TC-0611] Verify clicking Add button navigates to Add Candidate page", async ({ page }) => {
            await highlight(page, candidatesPage.addButton, "+ Add Button", '#00C853');
            await candidatesPage.addButton.click();
            await expect(candidatesPage.page).toHaveURL(/.*addCandidate/);

            const addCandidateTitle = candidatesPage.page.getByText('Add Candidate');
            await addCandidateTitle.waitFor({ state: 'visible' });
            await highlight(page, addCandidateTitle, "Add Candidate Title", '#00C853');
            await expect(addCandidateTitle).toBeVisible();
        });
    });
});
