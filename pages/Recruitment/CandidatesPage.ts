import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class CandidatesPage extends BasePage {
    // Top Tabs
    readonly candidatesTab: Locator;
    readonly vacanciesTab: Locator;

    // Search Filters
    readonly jobTitleDropdown: Locator;
    readonly vacancyDropdown: Locator;
    readonly hiringManagerDropdown: Locator;
    readonly statusDropdown: Locator;
    readonly candidateNameInput: Locator;
    readonly keywordsInput: Locator;
    readonly fromDateInput: Locator;
    readonly toDateInput: Locator;
    readonly methodOfApplicationDropdown: Locator;

    // Buttons
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly addButton: Locator;

    // Table
    readonly tableRows: Locator;
    readonly viewCandidateIcon: Locator;

    constructor(page: Page) {
        super(page);

        // Sidebar/Header
        this.candidatesTab = page.locator('a.oxd-topbar-body-nav-tab-item:has-text("Candidates")');
        this.vacanciesTab = page.locator('a.oxd-topbar-body-nav-tab-item:has-text("Vacancies")');

        // Search Panel
        this.jobTitleDropdown = page.locator('div.oxd-input-group:has-text("Job Title") .oxd-select-wrapper');
        this.vacancyDropdown = page.locator('div.oxd-input-group:has-text("Vacancy") .oxd-select-wrapper');
        this.hiringManagerDropdown = page.locator('div.oxd-input-group:has-text("Hiring Manager") .oxd-select-wrapper');
        this.statusDropdown = page.locator('div.oxd-input-group:has-text("Status") .oxd-select-wrapper');
        this.candidateNameInput = page.getByPlaceholder('Type for hints...').first();
        this.keywordsInput = page.locator('div.oxd-input-group:has-text("Keywords") input');
        this.fromDateInput = page.locator('div.oxd-input-group:has-text("Date of Application") input').first();
        this.toDateInput = page.locator('div.oxd-input-group:has-text("Date of Application") input').last();
        this.methodOfApplicationDropdown = page.locator('div.oxd-input-group:has-text("Method of Application") .oxd-select-wrapper');

        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.addButton = page.getByRole('button', { name: 'Add' });

        this.tableRows = page.locator('.oxd-table-card');
        this.viewCandidateIcon = page.locator('.bi-eye-fill').first();
    }

    async navigateToRecruitment() {
        await this.page.locator('.oxd-main-menu-item:has-text("Recruitment")').click();
    }

    async selectDropdownOption(dropdown: Locator, optionName: string) {
        await dropdown.click();
        await this.page.getByRole('option', { name: optionName }).click();
    }
}
