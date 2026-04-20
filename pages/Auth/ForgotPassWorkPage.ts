import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class ForgotPassWorkPage extends BasePage {
  readonly urlForgotPassWork: String;
  readonly forgotPassWork;
  readonly titlePage;
  readonly instructionTxt;
  readonly lableTxt;
  //   readonly placeholderTxt;
  readonly usernameIp;
  readonly cancelBtn;
  readonly resetPassWorkBtn;

  constructor(page: Page) {
    super(page);
    this.urlForgotPassWork =
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode";
    this.titlePage = page.getByRole("heading", {
      name: "Reset Password",
    });
    this.forgotPassWork = page.getByText("Forgot your password?", {
      exact: true,
    });
    this.instructionTxt = page.getByText(
      "Please enter your username to identify your account to reset your password",
      { exact: true },
    );
    this.lableTxt = page.getByText("Username", { exact: true });
    this.usernameIp = page.getByRole("textbox", { name: "Username" });
    this.cancelBtn = page.getByRole("button", { name: "Cancel" });
    this.resetPassWorkBtn = page.getByRole("button", {
      name: "Reset Password",
    });
  }

  async goto() {
    await this.forgotPassWork.click();
  }

  async 
}
