import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class AddUserPage extends BasePage {
    readonly userRoleDropdown: Locator;
    readonly employeeNameInput: Locator;
    readonly statusDropdown: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly autocompleteOptions: Locator;
    readonly searchingOption: Locator;

    constructor(page: Page) {
        super(page);
        this.userRoleDropdown = page.locator('div.oxd-input-group:has-text("User Role") .oxd-select-wrapper');
        this.employeeNameInput = page.locator('div.oxd-input-group:has-text("Employee Name") input');
        this.statusDropdown = page.locator('div.oxd-input-group:has-text("Status") .oxd-select-wrapper');
        this.usernameInput = page.locator('div.oxd-input-group:has-text("Username") input');
        this.passwordInput = page.locator('div.oxd-input-group:has-text("Password") input[type="password"]').first();
        this.confirmPasswordInput = page.locator('div.oxd-input-group:has-text("Confirm Password") input[type="password"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.autocompleteOptions = page.locator('.oxd-autocomplete-option');
        this.searchingOption = page.locator('.oxd-autocomplete-option', { hasText: 'Searching....' });
    }

    employeeOption(employeeName: string): Locator {
        return this.page.getByRole('option', { name: employeeName }).first();
    }

    async fillUserForm(role: string, employeeName: string, status: string, username: string, password: string) {
        // Select User Role
        await this.userRoleDropdown.click();
        await this.page.getByRole('option', { name: role }).click();

        // Fill Employee Name and wait for autocomplete options to appear
        await this.employeeNameInput.pressSequentially(employeeName);
        
        // Wait for "Searching...." to disappear
        await this.searchingOption.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
        
        // Click the first matching autocomplete option
        const firstOption = this.autocompleteOptions.first();
        await firstOption.waitFor({ state: 'visible' });
        await firstOption.click();

        // Select Status
        await this.statusDropdown.click();
        await this.page.getByRole('option', { name: status }).click();

        // Fill Username and Password
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
    }

    async save() {
        await this.saveButton.click();
        // Wait for navigation back to System Users page
        await this.page.waitForURL('**/viewSystemUsers');
    }
}
