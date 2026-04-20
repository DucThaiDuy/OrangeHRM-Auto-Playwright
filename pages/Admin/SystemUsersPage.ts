import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class SystemUsersPage extends BasePage {
    // Search fields
    readonly usernameInput: Locator;
    readonly userRoleDropdown: Locator;
    readonly employeeNameInput: Locator;
    readonly statusDropdown: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;

    // Actions
    readonly addButton: Locator;
    
    // Table components
    readonly recordsFoundLabel: Locator;
    readonly tableRows: Locator;
    readonly firstRowEditIcon: Locator;
    readonly firstRowDeleteIcon: Locator;

    constructor(page: Page) {
        super(page);
        
        // Search Panel
        this.usernameInput = page.locator('div.oxd-input-group:has-text("Username") input');
        this.userRoleDropdown = page.locator('div.oxd-input-group:has-text("User Role") .oxd-select-wrapper');
        this.employeeNameInput = page.locator('div.oxd-input-group:has-text("Employee Name") input');
        this.statusDropdown = page.locator('div.oxd-input-group:has-text("Status") .oxd-select-wrapper');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });

        // Add Button
        this.addButton = page.getByRole('button', { name: 'Add' });

        // Table
        this.recordsFoundLabel = page.locator('span.oxd-text--span').filter({ hasText: 'Records Found' });
        this.tableRows = page.locator('.oxd-table-card');
        this.firstRowEditIcon = page.locator('.oxd-table-cell-actions .oxd-icon.bi-pencil-fill').first();
        this.firstRowDeleteIcon = page.locator('.oxd-table-cell-actions .oxd-icon.bi-trash').first();
    }

    async searchUser(username: string) {
        await this.usernameInput.fill(username);
        await this.searchButton.click();
        await this.page.waitForTimeout(1000); // Allow table to refresh
    }

    async resetSearch() {
        await this.resetButton.click();
        await this.page.waitForTimeout(1000); // Allow table to clear
    }

    async getRecordsCountText() {
        return await this.recordsFoundLabel.textContent();
    }

    async selectRole(role: string) {
        await this.selectDropdownOption(this.userRoleDropdown, role);
    }

    async selectStatus(status: string) {
        await this.selectDropdownOption(this.statusDropdown, status);
    }
}
