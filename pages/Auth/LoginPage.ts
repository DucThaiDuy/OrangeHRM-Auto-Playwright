import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly brandingLogo: Locator;
  readonly sideImage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator(".oxd-alert-content");
    this.forgotPasswordLink = page.locator(".orangehrm-login-forgot-header");
    this.brandingLogo = page.locator('img[src*="ohrm_branding.png"]');
    this.sideImage = page.locator('img[src*="ohrm_branding.png"]');
  }

  async goto() {
    await this.navigate("/");
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    return await this.getElementText(this.errorMessage);
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
}
