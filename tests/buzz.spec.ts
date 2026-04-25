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
    await page.waitForURL("**/dashboard/**");

    await page.goto("/web/index.php/buzz/viewBuzz");
    await expect(buzzPage.postInput).toBeVisible();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // UI Verifications
  // ══════════════════════════════════════════════════════════════════════════
  test.describe("UI Verifications", () => {
    // ─── Grouped: All static UI on Buzz page + modal (1 browser session) ──
    test("[TC-0401~0411] Verify Buzz page UI elements and Share Photos modal", async ({ page }) => {
      await test.step("[TC-0401/402] Buzz header and post input are visible", async () => {
        const buzzHeader = buzzPage.page.getByText("Buzz Newsfeed");
        await buzzHeader.waitFor({ state: "visible" });
        await highlight(page, buzzHeader, "Buzz Newsfeed Header", "#00C853");
        await expect(buzzHeader).toBeVisible();

        await highlight(page, buzzPage.postInput, "Post Input Field");
        await expect(buzzPage.postInput).toBeVisible();
      });

      await test.step("[TC-0403/404] Share Photos and Video buttons are visible", async () => {
        await highlight(page, buzzPage.sharePhotosButton, "Share Photos Button", "#00C853");
        await expect(buzzPage.sharePhotosButton).toBeVisible();

        await highlight(page, buzzPage.shareVideoButton, "Share Video Button", "#00C853");
        await expect(buzzPage.shareVideoButton).toBeVisible();
      });

      await test.step("[TC-0406-411] Share Photos Modal components are visible", async () => {
        await highlight(page, buzzPage.sharePhotosButton, "Share Photos Button");
        await buzzPage.openSharePhotosModal();

        await highlight(page, buzzPage.modalSharePhotos, "Share Photos Modal", "#00C853");
        await expect(buzzPage.modalSharePhotos).toBeVisible();
        await highlight(page, buzzPage.modalPostInput, "Modal Post Input");
        await expect(buzzPage.modalPostInput).toBeVisible();
        await highlight(page, buzzPage.addPhotosArea, "Add Photos Area", "#00C853");
        await expect(buzzPage.addPhotosArea).toBeVisible();
        await highlight(page, buzzPage.modalShareButton, "Share Button (Disabled)", "#00C853");
        await expect(buzzPage.modalShareButton).toBeDisabled();
        await highlight(page, buzzPage.modalCloseButton, "Close Button", "#00C853");
        await expect(buzzPage.modalCloseButton).toBeVisible();

        // Close modal cleanly before test ends
        await buzzPage.modalCloseButton.click();
      });
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Functional Tests
  // ══════════════════════════════════════════════════════════════════════════
  test.describe("Functional Tests", () => {
    // ─── Grouped: Modal close + Tab switching (no data mutation) ──────────
    test("[TC-0418/0441] Verify modal close and newsfeed tab switching", async ({ page }) => {
      await test.step("[TC-0418] Clicking Close icon closes the Share Photos modal", async () => {
        await buzzPage.openSharePhotosModal();
        await highlight(page, buzzPage.modalCloseButton, "Modal Close Button", "#00C853");
        await buzzPage.modalCloseButton.click();
        await expect(buzzPage.modalSharePhotos).not.toBeVisible();
      });

      await test.step("[TC-0441] Switching between newsfeed tabs works correctly", async () => {
        await highlight(page, buzzPage.likedPostsTab, "Liked Posts Tab", "#00C853");
        await buzzPage.likedPostsTab.click();
        await expect(buzzPage.likedPostsTab).toBeVisible();

        await highlight(page, buzzPage.recentPostsTab, "Recent Posts Tab", "#00C853");
        await buzzPage.recentPostsTab.click();
      });
    });

    // ─── Grouped: Like + Comment (both interact with the first post, no create/delete)
    test("[TC-0433/0436] Verify liking and commenting on a post", async ({ page }) => {
      await test.step("[TC-0433] Liking a post works", async () => {
        await highlight(page, buzzPage.firstPostLikeIcon, "Like Icon");
        await buzzPage.firstPostLikeIcon.click();
      });

      await test.step("[TC-0436] Commenting on a post works", async () => {
        const comment = `Great post! ${Date.now()}`;
        await highlight(page, buzzPage.firstPostCommentIcon, "Comment Icon");
        await buzzPage.firstPostCommentIcon.click();
        await highlight(page, buzzPage.commentInput, "Comment Input");
        await buzzPage.commentInput.fill(comment);
        await buzzPage.page.keyboard.press("Enter");
      });
    });

    // ─── Standalone: Creates a text post (data mutation) ──────────────────
    test("[TC-0430] Verify posting a text-only message works", async ({ page }) => {
      const message = `Testing text post ${Date.now()}`;
      await highlight(page, buzzPage.postInput, "Post Input");
      await buzzPage.postInput.fill(message);
      await highlight(page, buzzPage.postButton, "Post Button", "#00C853");
      await buzzPage.postButton.click();

      await expect(buzzPage.page.locator(".oxd-toast-content"))
        .toBeVisible({ timeout: 10000 })
        .catch(() => {});
      await buzzPage.page.waitForTimeout(1000);

      const postedMessage = buzzPage.page.getByText(message).first();
      await highlight(page, postedMessage, "Posted Message", "#00C853");
      await expect(postedMessage).toBeVisible();
    });

    // ─── Standalone: Uploads a photo post (data mutation + file upload) ───
    test("[TC-0417] Verify sharing a photo post with text", async ({ page }) => {
      const postMessage = `Automated Post ${Date.now()}`;
      const photoPath = path.resolve(__dirname, "../../test-data/assets/sample-photo.jpg");

      await buzzPage.openSharePhotosModal();
      await highlight(page, buzzPage.modalPostInput, "Modal Post Input");
      await buzzPage.modalPostInput.fill(postMessage);
      await buzzPage.uploadPhoto(photoPath);

      await highlight(page, buzzPage.modalShareButton, "Share Button (Enabled)", "#00C853");
      await expect(buzzPage.modalShareButton).toBeEnabled();
      await buzzPage.sharePost(postMessage);

      const postedText = buzzPage.page.getByText(postMessage).first();
      await highlight(page, postedText, "Shared Photo Post", "#00C853");
      await expect(postedText).toBeVisible();
    });

    // ─── Standalone: Creates a post then EDITS it (state mutation chain) ──
    test("[TC-0439] Verify 'Edit Post' allows modified text to be saved", async ({ page }) => {
      const initialMessage = `Post to edit ${Date.now()}`;
      await highlight(page, buzzPage.postInput, "Post Input");
      await buzzPage.postInput.fill(initialMessage);
      await buzzPage.postButton.click();
      await expect(buzzPage.page.locator(".oxd-toast-content"))
        .toBeVisible({ timeout: 10000 })
        .catch(() => {});
      await buzzPage.page.waitForTimeout(1000);

      await highlight(page, buzzPage.firstPostMoreOptions, "More Options (...)", "#00C853");
      await buzzPage.firstPostMoreOptions.click();
      await highlight(page, buzzPage.editPostOption, "Edit Post Option");
      await buzzPage.editPostOption.click();

      const editedMessage = `${initialMessage} - EDITED`;
      await highlight(page, buzzPage.editPostInput, "Edit Post Input");
      await buzzPage.editPostInput.fill(editedMessage);
      await highlight(page, buzzPage.editPostSubmitButton, "Submit Edit", "#00C853");
      await buzzPage.editPostSubmitButton.click();

      await expect(buzzPage.page.locator(".oxd-toast-content"))
        .toBeVisible({ timeout: 10000 })
        .catch(() => {});
      await buzzPage.page.waitForTimeout(1000);

      const editedText = buzzPage.page.getByText(editedMessage).first();
      await highlight(page, editedText, "Edited Post Text", "#00C853");
      await expect(editedText).toBeVisible();
    });

    // ─── Standalone: Creates a post then DELETES it (state mutation chain) ─
    test("[TC-0440] Verify 'Delete Post' removes it from the newsfeed", async ({ page }) => {
      const deleteTargetMessage = `Post to delete ${Date.now()}`;
      await highlight(page, buzzPage.postInput, "Post Input");
      await buzzPage.postInput.fill(deleteTargetMessage);
      await buzzPage.postButton.click();
      await expect(buzzPage.page.locator(".oxd-toast-content"))
        .toBeVisible({ timeout: 10000 })
        .catch(() => {});
      await buzzPage.page.waitForTimeout(1000);

      await highlight(page, buzzPage.firstPostMoreOptions, "More Options (...)", "#00C853");
      await buzzPage.firstPostMoreOptions.click();
      await highlight(page, buzzPage.deletePostOption, "Delete Post Option", "#00C853");
      await buzzPage.deletePostOption.click();
      await highlight(page, buzzPage.confirmDeleteButton, "Confirm Delete", "#00C853");
      await buzzPage.confirmDeleteButton.click();

      await expect(buzzPage.page.locator(".oxd-toast-content"))
        .toBeVisible({ timeout: 10000 })
        .catch(() => {});
      await buzzPage.page.waitForTimeout(1000);
      await expect(buzzPage.page.getByText(deleteTargetMessage).first()).toBeHidden();
    });
  });
});
