import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ClaimPage extends BasePage {
    // Navigation
    readonly claimTab: Locator;

    // Search Panel (Employee Claims)
    readonly employeeNameSearchInput: Locator;
    readonly referenceIdInput: Locator;
    readonly eventNameDropdown: Locator;
    readonly statusDropdown: Locator;
    readonly includeDropdown: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly assignClaimButton: Locator;

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

        // Search Panel fields
        this.employeeNameSearchInput = page.locator('div.oxd-input-group:has-text("Employee Name") input');
        this.referenceIdInput = page.locator('div.oxd-input-group:has-text("Reference Id") input');
        this.eventNameDropdown = page.locator('div.oxd-input-group:has-text("Event Name") .oxd-select-wrapper');
        this.statusDropdown = page.locator('div.oxd-input-group:has-text("Status") .oxd-select-wrapper');
        this.includeDropdown = page.locator('div.oxd-input-group:has-text("Include") .oxd-select-wrapper');
        
        // Buttons
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.assignClaimButton = page.getByRole('button', { name: 'Assign Claim' });

        this.tableRows = page.locator('.oxd-table-card');
        this.viewDetailsButton = page.getByRole('button', { name: 'View Details' }).first();

        // Claim Details Page
        this.detailsReferenceId = page.locator('div.oxd-grid-item:has-text("Reference Id") div:nth-child(2)');
        this.detailsStatus = page.locator('.orangehrm-claim-status-name'); // Usually a chip or label
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
        await this.page.waitForTimeout(1000); // Wait for page transitions
    }

    async navigateToAssignClaim() {
        await this.assignClaimButton.click();
        await this.page.waitForTimeout(1000); // Wait for form to open
    }

    async selectDropdownOption(dropdown: Locator, optionName: string) {
        await dropdown.click();
        await this.page.waitForTimeout(500); // Wait for dropdown list to render
        await this.page.getByRole('option', { name: optionName }).click();
    }
}
