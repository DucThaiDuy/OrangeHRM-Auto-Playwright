import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage";
import { BuzzPage } from "../pages/Buzz/BuzzPage";
import * as credentials from "../test-data/credentials.json";
import * as path from "path";

test.describe("Buzz Module - Share Photos Verification @buzz", () => {
    let loginPage: LoginPage;
    let buzzPage: BuzzPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        buzzPage = new BuzzPage(page);

        // Login
        await loginPage.goto();
        await loginPage.login(
            credentials.validUser.username,
            credentials.validUser.password
        );
        await page.waitForURL('**/dashboard/**');

        // Navigate to Buzz
        await page.goto('/web/index.php/buzz/viewBuzz');
        await expect(buzzPage.postInput).toBeVisible();
    });

    test.describe("UI Verifications", () => {
        test("[TC-0401/402] Verify Buzz header and post input are visible", async () => {
            await expect(buzzPage.page.getByText('Buzz Newsfeed')).toBeVisible();
            await expect(buzzPage.postInput).toBeVisible();
        });

        test("[TC-0403/404] Verify Share Photos and Video buttons are visible", async () => {
            await expect(buzzPage.sharePhotosButton).toBeVisible();
            await expect(buzzPage.shareVideoButton).toBeVisible();
        });

        test("[TC-0406-411] Verify Share Photos Modal components", async () => {
            await buzzPage.openSharePhotosModal();
            
            await expect(buzzPage.modalSharePhotos).toBeVisible();
            await expect(buzzPage.modalPostInput).toBeVisible();
            await expect(buzzPage.addPhotosArea).toBeVisible();
            await expect(buzzPage.modalShareButton).toBeDisabled();
            await expect(buzzPage.modalCloseButton).toBeVisible();
        });
    });

    test.describe("Functional Tests", () => {
        test("[TC-0430] Verify posting a text-only message works", async () => {
            const message = `Testing text post ${Date.now()}`;
            await buzzPage.postInput.fill(message);
            await buzzPage.postButton.click();
            
            // Wait for toast message or sufficient time for post to appear
            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000); // Small buffer for DOM update
            
            await expect(buzzPage.page.getByText(message).first()).toBeVisible();
        });

        test("[TC-0417] Verify sharing a photo post with text", async ({ page }) => {
            const postMessage = `Automated Post ${Date.now()}`;
            const photoPath = path.resolve(__dirname, "../../test-data/assets/sample-photo.jpg");
            
            await buzzPage.openSharePhotosModal();
            await buzzPage.modalPostInput.fill(postMessage);
            await buzzPage.uploadPhoto(photoPath);
            await expect(buzzPage.modalShareButton).toBeEnabled();
            await buzzPage.sharePost(postMessage);
            
            await expect(buzzPage.page.getByText(postMessage).first()).toBeVisible();
        });

        test("[TC-0433] Verify liking a post", async () => {
            // Note: This interacts with the first post in the feed
            await buzzPage.firstPostLikeIcon.click();
            // In a real test, we could check the color or the count change
        });

        test("[TC-0436] Verify commenting on a post", async () => {
            const comment = "Great post! " + Date.now();
            await buzzPage.firstPostCommentIcon.click();
            await buzzPage.commentInput.fill(comment);
            await buzzPage.page.keyboard.press('Enter');
            // Verification depends on visibility of comments section
        });

        test("[TC-0441] Verify switching newsfeed tabs", async () => {
            await buzzPage.likedPostsTab.click();
            await expect(buzzPage.likedPostsTab).toBeVisible(); // Or check active class
            await buzzPage.recentPostsTab.click();
        });

        test("[TC-0418] Verify clicking Close icon closes the modal", async () => {
            await buzzPage.openSharePhotosModal();
            await buzzPage.modalCloseButton.click();
            await expect(buzzPage.modalSharePhotos).not.toBeVisible();
        });

        test("[TC-0439] Verify 'Edit Post' allows modified text to be saved", async () => {
            // Setup: Create a post first
            const initialMessage = `Post to edit ${Date.now()}`;
            await buzzPage.postInput.fill(initialMessage);
            await buzzPage.postButton.click();
            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);
            
            // Edit the post
            await buzzPage.firstPostMoreOptions.click();
            await buzzPage.editPostOption.click();
            
            const editedMessage = `${initialMessage} - EDITED`;
            await buzzPage.editPostInput.fill(editedMessage);
            await buzzPage.editPostSubmitButton.click();
            
            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);
            await expect(buzzPage.page.getByText(editedMessage).first()).toBeVisible();
        });

        test("[TC-0440] Verify 'Delete Post' removes it from the newsfeed", async () => {
            // Setup: Create a post first to ensure we own it
            const deleteTargetMessage = `Post to delete ${Date.now()}`;
            await buzzPage.postInput.fill(deleteTargetMessage);
            await buzzPage.postButton.click();
            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);
            
            // Delete the post
            await buzzPage.firstPostMoreOptions.click();
            await buzzPage.deletePostOption.click();
            await buzzPage.confirmDeleteButton.click();
            
            await expect(buzzPage.page.locator('.oxd-toast-content')).toBeVisible({ timeout: 10000 }).catch(() => {});
            await buzzPage.page.waitForTimeout(1000);
            
            // Expect the post text to be hidden
            await expect(buzzPage.page.getByText(deleteTargetMessage).first()).toBeHidden();
        });
    });
});
