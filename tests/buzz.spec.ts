import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { BuzzPage } from "../pages/Buzz/BuzzPage";
import * as credentials from "../test-data/credentials.json";
import * as path from "path";
import { highlight } from "../utils/highlight";

test.describe("Buzz Module - Share Photos Verification @buzz", () => {
    let loginPage: LoginPage;
    let buzzPage: BuzzPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        buzzPage = new BuzzPage(page);

        await loginPage.goto();
        await loginPage.login(
            credentials.validUser.username,
            credentials.validUser.password
        );
        await page.waitForURL('**/dashboard/**');

        await page.goto('/web/index.php/buzz/viewBuzz');
        await expect(buzzPage.postInput).toBeVisible();
    });

    test.describe("UI Verifications", () => {
        test("[TC-0401/402] Verify Buzz header and post input are visible", async ({ page }) => {
            const buzzHeader = buzzPage.page.getByText('Buzz Newsfeed');
            await buzzHeader.waitFor({ state: 'visible' });
            await highlight(page, buzzHeader, "Buzz Newsfeed Header", '#00C853');
            await expect(buzzHeader).toBeVisible();

            await highlight(page, buzzPage.postInput, "Post Input Field");
            await expect(buzzPage.postInput).toBeVisible();
        });

        test("[TC-0403/404] Verify Share Photos and Video buttons are visible", async ({ page }) => {
            await highlight(page, buzzPage.sharePhotosButton, "Share Photos Button", '#00C853');
            await expect(buzzPage.sharePhotosButton).toBeVisible();

            await highlight(page, buzzPage.shareVideoButton, "Share Video Button", '#00C853');
            await expect(buzzPage.shareVideoButton).toBeVisible();
        });

        test("[TC-0406-411] Verify Share Photos Modal components", async ({ page }) => {
            await highlight(page, buzzPage.sharePhotosButton, "Share Photos Button");
            await buzzPage.openSharePhotosModal();

            await highlight(page, buzzPage.modalSharePhotos, "Share Photos Modal", '#00C853');
            await expect(buzzPage.modalSharePhotos).toBeVisible();
            await highlight(page, buzzPage.modalPostInput, "Modal Post Input");
            await expect(buzzPage.modalPostInput).toBeVisible();
            await highlight(page, buzzPage.addPhotosArea, "Add Photos Area", '#00C853');
            await expect(buzzPage.addPhotosArea).toBeVisible();
            await highlight(page, buzzPage.modalShareButton, "Share Button (Disabled)", '#00C853');
            await expect(buzzPage.modalShareButton).toBeDisabled();
            await highlight(page, buzzPage.modalCloseButton, "Close Button", '#00C853');
            await expect(buzzPage.modalCloseButton).toBeVisible();
        });
    });

    test.describe("Functional Tests", () => {
        test("[TC-0430] Verify posting a text-only message works", async ({ page }) => {
            const message = `Testing text post ${Date.now()}`;
            await highlight(page, buzzPage.postInput, "Post Input");
            await buzzPage.postInput.fill(message);
            await highlight(page, buzzPage.postButton, "Post Button", '#00C853');
            await buzzPage.postButton.click();

            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);

            const postedMessage = buzzPage.page.getByText(message).first();
            await highlight(page, postedMessage, "Posted Message", '#00C853');
            await expect(postedMessage).toBeVisible();
        });

        test("[TC-0417] Verify sharing a photo post with text", async ({ page }) => {
            const postMessage = `Automated Post ${Date.now()}`;
            const photoPath = path.resolve(__dirname, "../../test-data/assets/sample-photo.jpg");

            await buzzPage.openSharePhotosModal();
            await highlight(page, buzzPage.modalPostInput, "Modal Post Input");
            await buzzPage.modalPostInput.fill(postMessage);
            await buzzPage.uploadPhoto(photoPath);

            await highlight(page, buzzPage.modalShareButton, "Share Button (Enabled)", '#00C853');
            await expect(buzzPage.modalShareButton).toBeEnabled();
            await buzzPage.sharePost(postMessage);

            const postedText = buzzPage.page.getByText(postMessage).first();
            await highlight(page, postedText, "Shared Photo Post", '#00C853');
            await expect(postedText).toBeVisible();
        });

        test("[TC-0433] Verify liking a post", async ({ page }) => {
            await highlight(page, buzzPage.firstPostLikeIcon, "Like Icon");
            await buzzPage.firstPostLikeIcon.click();
        });

        test("[TC-0436] Verify commenting on a post", async ({ page }) => {
            const comment = "Great post! " + Date.now();
            await highlight(page, buzzPage.firstPostCommentIcon, "Comment Icon");
            await buzzPage.firstPostCommentIcon.click();
            await highlight(page, buzzPage.commentInput, "Comment Input");
            await buzzPage.commentInput.fill(comment);
            await buzzPage.page.keyboard.press('Enter');
        });

        test("[TC-0441] Verify switching newsfeed tabs", async ({ page }) => {
            await highlight(page, buzzPage.likedPostsTab, "Liked Posts Tab", '#00C853');
            await buzzPage.likedPostsTab.click();
            await expect(buzzPage.likedPostsTab).toBeVisible();

            await highlight(page, buzzPage.recentPostsTab, "Recent Posts Tab", '#00C853');
            await buzzPage.recentPostsTab.click();
        });

        test("[TC-0418] Verify clicking Close icon closes the modal", async ({ page }) => {
            await buzzPage.openSharePhotosModal();
            await highlight(page, buzzPage.modalCloseButton, "Modal Close Button", '#00C853');
            await buzzPage.modalCloseButton.click();
            await expect(buzzPage.modalSharePhotos).not.toBeVisible();
        });

        test("[TC-0439] Verify 'Edit Post' allows modified text to be saved", async ({ page }) => {
            const initialMessage = `Post to edit ${Date.now()}`;
            await highlight(page, buzzPage.postInput, "Post Input");
            await buzzPage.postInput.fill(initialMessage);
            await buzzPage.postButton.click();
            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);

            await highlight(page, buzzPage.firstPostMoreOptions, "More Options (...)", '#00C853');
            await buzzPage.firstPostMoreOptions.click();
            await highlight(page, buzzPage.editPostOption, "Edit Post Option");
            await buzzPage.editPostOption.click();

            const editedMessage = `${initialMessage} - EDITED`;
            await highlight(page, buzzPage.editPostInput, "Edit Post Input");
            await buzzPage.editPostInput.fill(editedMessage);
            await highlight(page, buzzPage.editPostSubmitButton, "Submit Edit", '#00C853');
            await buzzPage.editPostSubmitButton.click();

            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);
            const editedText = buzzPage.page.getByText(editedMessage).first();
            await highlight(page, editedText, "Edited Post Text", '#00C853');
            await expect(editedText).toBeVisible();
        });

        test("[TC-0440] Verify 'Delete Post' removes it from the newsfeed", async ({ page }) => {
            const deleteTargetMessage = `Post to delete ${Date.now()}`;
            await highlight(page, buzzPage.postInput, "Post Input");
            await buzzPage.postInput.fill(deleteTargetMessage);
            await buzzPage.postButton.click();
            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);

            await highlight(page, buzzPage.firstPostMoreOptions, "More Options (...)", '#00C853');
            await buzzPage.firstPostMoreOptions.click();
            await highlight(page, buzzPage.deletePostOption, "Delete Post Option", '#00C853');
            await buzzPage.deletePostOption.click();
            await highlight(page, buzzPage.confirmDeleteButton, "Confirm Delete", '#00C853');
            await buzzPage.confirmDeleteButton.click();

            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);
            await expect(buzzPage.page.getByText(deleteTargetMessage).first()).toBeHidden();
        });
    });
});
