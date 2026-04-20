import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ForgotPasswordPage extends BasePage {
  readonly titlePage: Locator;
  readonly instructionTxt: Locator;
  readonly usernameLabel: Locator;
  readonly usernameInput: Locator;
  readonly cancelButton: Locator;
  readonly resetPasswordButton: Locator;
  readonly errorMessage: Locator;
  readonly successTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.titlePage = page.getByRole("heading", { name: "Reset Password" });
    this.instructionTxt = page.getByText(
      "Please enter your username to identify your account to reset your password",
      { exact: true }
    );
    this.usernameLabel = page.getByText("Username", { exact: true });
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.resetPasswordButton = page.getByRole("button", { name: "Reset Password" });
    this.errorMessage = page.locator('.oxd-input-field-error-message');
    this.successTitle = page.locator('.orangehrm-forgot-password-container h6');
  }

  async getUsernamePlaceholder() {
    return await this.usernameInput.getAttribute('placeholder');
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }

  async resetPassword(username: string) {
    await this.fill(this.usernameInput, username);
    await this.click(this.resetPasswordButton);
  }

  async cancel() {
    await this.click(this.cancelButton);
  }
}
