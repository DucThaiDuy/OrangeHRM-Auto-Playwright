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
    readonly usernameCol: Locator;
    readonly userRoleCol: Locator;
    readonly employeeNameCol: Locator;
    readonly statusCol: Locator;

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
        this.recordsFoundLabel = page.locator(".orangehrm-horizontal-padding span.oxd-text--span");
        this.tableRows = page.locator('.oxd-table-card');
        this.firstRowEditIcon = page.locator('.oxd-table-cell-actions .oxd-icon.bi-pencil-fill').first();
        this.firstRowDeleteIcon = page.locator('.oxd-table-cell-actions .oxd-icon.bi-trash').first();
        this.usernameCol = page.locator('.oxd-table-header-cell').filter({ hasText: 'Username' });
        this.userRoleCol = page.locator('.oxd-table-header-cell').filter({ hasText: 'User Role' });
        this.employeeNameCol = page.locator('.oxd-table-header-cell').filter({ hasText: 'Employee Name' });
        this.statusCol = page.locator('.oxd-table-header-cell').filter({ hasText: 'Status' });
    }

    async searchUser(username: string) {
        await this.usernameInput.fill(username);
        await this.searchButton.click();
        // Wait for table to refresh by detecting loading indicator disappear or rows update
        await this.page.waitForLoadState('domcontentloaded');
    }

    async resetSearch() {
        await this.resetButton.click();
        // Wait for input to be cleared instead of fixed delay
        await this.usernameInput.waitFor({ state: 'visible' });
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

    async getFirstRowEmployeeName(): Promise<string> {
        return await this.tableRows.first().locator('.oxd-table-cell').nth(3).innerText();
    }
}
