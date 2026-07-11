import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ClaimPage extends BasePage {
    // Navigation
    readonly claimTab: Locator;
    readonly myClaimTitle: Locator;

    // Search Panel (Employee Claims)
    readonly employeeNameSearchInput: Locator;
    readonly referenceIdInput: Locator;
    readonly eventNameDropdown: Locator;
    readonly statusDropdown: Locator;
    readonly includeDropdown: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly assignClaimButton: Locator;


    readonly invalidMessage: Locator;

    // Table Data
    readonly tableRows: Locator;
    readonly viewDetailsButton: Locator;

    // Claim Details Page
    readonly detailsReferenceId: Locator;
    readonly detailsStatus: Locator;
    readonly backButton: Locator;

    // Assign Claim (Create Request)
    readonly assignEmployeeNameInput: Locator;
    readonly assignEventDropdown: Locator;
    readonly assignCurrencyDropdown: Locator;
    readonly remarksTextarea: Locator;
    readonly createButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page);

        // General Navigation
        this.claimTab = page.locator('.oxd-main-menu-item:has-text("Claim")');
        this.myClaimTitle = page.getByRole("heading", { name: "My Claims" });

        // Search Panel fields
        this.employeeNameSearchInput = page.locator('div.oxd-input-group:has-text("Employee Name") input');
        this.referenceIdInput = page.locator('div.oxd-input-group:has-text("Reference Id") input');
        this.eventNameDropdown = page.locator('div.oxd-input-group:has-text("Event Name") .oxd-select-wrapper');
        this.statusDropdown = page.locator('div.oxd-input-group:has-text("Status") .oxd-select-wrapper');
        this.includeDropdown = page.locator('div.oxd-input-group:has-text("Include") .oxd-select-wrapper');

        this.invalidMessage = page.locator('.oxd-input-field-error-message');
       
        // Buttons
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.assignClaimButton = page.getByRole('button', { name: 'Assign Claim' });

        this.tableRows = page.locator('.oxd-table-card');
        this.viewDetailsButton = page.getByRole('button', { name: 'View Details' }).first();

        // Claim Details Page
        this.detailsReferenceId = page.locator('div.oxd-grid-item:has-text("Reference Id") div:nth-child(2)');
        this.detailsStatus = page.locator('.orangehrm-claim-status-name');
        this.backButton = page.getByRole('button', { name: 'Back' });

        // Assign Claim Form fields
        this.assignEmployeeNameInput = page.locator('div.oxd-input-group:has-text("Employee Name") input');
        this.assignEventDropdown = page.locator('div.oxd-input-group:has-text("Event") .oxd-select-wrapper').first();
        this.assignCurrencyDropdown = page.locator('div.oxd-input-group:has-text("Currency") .oxd-select-wrapper');
        this.remarksTextarea = page.locator('textarea.oxd-textarea');
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async navigateToClaimModule() {
        await this.claimTab.click();
        // Wait for the search panel to be ready instead of a fixed delay
        await this.employeeNameSearchInput.waitFor({ state: 'visible' });
    }

    async navigateToAssignClaim() {
        await this.assignClaimButton.click();
        // Wait for the assign form to appear
        await this.createButton.waitFor({ state: 'visible' });
    }

    async selectDropdownOption(dropdown: Locator, optionName: string) {
        await dropdown.click();
        // Wait for options to render before clicking
        await this.page.getByRole('option', { name: optionName }).waitFor({ state: 'visible' });
        await this.page.getByRole('option', { name: optionName }).click();
    }
}
