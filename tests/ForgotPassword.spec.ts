import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { ForgotPasswordPage } from "../pages/Auth/ForgotPasswordPage";
import { RESET_PASSWORD_TEXTS } from "../constants/login-texts";
import * as credentials from "../test-data/credentials.json";

test.describe("Forgot Password Verification @auth", () => {
    let loginPage: LoginPage;
    let forgotPasswordPage: ForgotPasswordPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        forgotPasswordPage = new ForgotPasswordPage(page);
        await loginPage.goto();
        await loginPage.clickForgotPassword();
    });

    test.describe("UI Verifications", () => {
        test("[TC-0101] Verify Reset Password page loads successfully", async ({ page }) => {
            await expect(forgotPasswordPage.titlePage).toBeVisible();
            await expect(forgotPasswordPage.page).toHaveURL(/.*requestPasswordResetCode/);
        });

        test("[TC-0102] Verify page title displays 'Reset Password'", async ({ page }) => {
            await expect(forgotPasswordPage.titlePage).toHaveText(RESET_PASSWORD_TEXTS.title);
        });

        test("[TC-0103] Verify instruction text is displayed correctly", async ({ page }) => {
            await expect(forgotPasswordPage.instructionTxt).toBeVisible();
            await expect(forgotPasswordPage.instructionTxt).toHaveText(RESET_PASSWORD_TEXTS.instruction);
        });

        test("[TC-0104] Verify Username input field is visible", async ({ page }) => {
            await expect(forgotPasswordPage.usernameInput).toBeVisible();
        });

        test("[TC-0105] Verify Username input has correct placeholder", async ({ page }) => {
            const placeholder = await forgotPasswordPage.getUsernamePlaceholder();
            expect(placeholder).toBe("Username");
        });

        test("[TC-0106] Verify 'Reset Password' button is visible", async ({ page }) => {
            await expect(forgotPasswordPage.resetPasswordButton).toBeVisible();
        });

        test("[TC-0107] Verify 'Cancel' button is visible", async ({ page }) => {
            await expect(forgotPasswordPage.cancelButton).toBeVisible();
        });
    });

    test.describe("Navigation", () => {
        test("[TC-0126] Verify clicking 'Cancel' redirects to Login page", async ({ page }) => {
            await forgotPasswordPage.cancel();
            await expect(forgotPasswordPage.page).toHaveURL(/.*login/);
        });
    });

    test.describe("Input Validation", () => {
        test("[TC-0113] Verify error message when Username is empty", async ({ page }) => {
            await forgotPasswordPage.resetPassword("");
            await forgotPasswordPage.errorMessage.waitFor({ state: 'visible' });
            await expect(forgotPasswordPage.errorMessage).toBeVisible();
            await expect(forgotPasswordPage.errorMessage).toHaveText("Required");
        });
    });

    test.describe("Functional Testing", () => {
        test("[TC-0119] Verify user can submit with valid username", async ({ page }) => {
            await forgotPasswordPage.resetPassword(credentials.validUser.username);
            await expect(forgotPasswordPage.page).toHaveURL(/.*sendPasswordReset/);
        });

        test("[TC-0120] Verify success message is displayed after submission", async ({ page }) => {
            await forgotPasswordPage.resetPassword(credentials.validUser.username);
            await forgotPasswordPage.successTitle.waitFor({ state: 'visible' });
            await expect(forgotPasswordPage.successTitle).toBeVisible();
            await expect(forgotPasswordPage.successTitle).toHaveText("Reset Password link sent successfully");
        });
    });
});
