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

    await loginPage.goto();
    await loginPage.login(
      credentials.validUser.username,
      credentials.validUser.password,
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
    test("[TC-0401~0411] Verify Buzz page UI elements and Share Photos modal", async ({
      page,
    }) => {
      await test.step("[TC-0401/402] Buzz header and post input are visible", async () => {
        const buzzHeader = buzzPage.page.getByText("Buzz Newsfeed");
        await buzzHeader.waitFor({ state: "visible" });
        await expect(buzzHeader).toBeVisible();

        await expect(buzzPage.postInput).toBeVisible();
      });

      await test.step("[TC-0403/404] Share Photos and Video buttons are visible", async () => {
        await expect(buzzPage.sharePhotosButton).toBeVisible();
        await expect(buzzPage.shareVideoButton).toBeVisible();
      });

      await test.step("[TC-0406-411] Share Photos Modal components are visible", async () => {
        await buzzPage.openSharePhotosModal();

        await expect(buzzPage.modal).toBeVisible();
        await expect(buzzPage.modalPostInput).toBeVisible();
        await expect(buzzPage.addPhotosArea).toBeVisible();
        await expect(buzzPage.modalShareButton).toBeDisabled();
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
    test("[TC-0418/0441] Verify modal close and newsfeed tab switching", async ({
      page,
    }) => {
      await test.step("[TC-0418] Clicking Close icon closes the Share Photos modal", async () => {
        await buzzPage.openSharePhotosModal();
        await buzzPage.modalCloseButton.click();
        await expect(buzzPage.modal).not.toBeVisible();
      });

      await test.step("[TC-0441] Switching between newsfeed tabs works correctly", async () => {
        await buzzPage.likedPostsTab.click();
        await expect(buzzPage.likedPostsTab).toBeVisible();

        await buzzPage.recentPostsTab.click();
      });
    });

    // ─── Grouped: Like + Comment (both interact with the first post, no create/delete)
    test("[TC-0433/0436] Verify liking and commenting on a post", async ({
      page,
    }) => {
      await test.step("[TC-0433] Liking a post works", async () => {
        await buzzPage.firstPostLikeIcon.click();
      });

      await test.step("[TC-0436] Commenting on a post works", async () => {
        const comment = `Great post! ${Date.now()}`;
        await buzzPage.firstPostCommentIcon.click();
        await buzzPage.commentInput.fill(comment);
        await buzzPage.page.keyboard.press("Enter");
      });
    });

    test("[TC-0429] Verify user can like a comment successfully", async ({
      page,
    }) => {
      await buzzPage.firstPost.first().waitFor({ state: "visible" });
      const postCount = await buzzPage.firstPost.first().count();
      console.log("postCount: " + postCount);

      if (postCount === 0) {
        await buzzPage.addSharePhoto();
      }

      await buzzPage.firstPost.first().evaluate((el) => {
        el.scrollIntoView({ block: "center" });
      });
      await buzzPage.likecommentShare.evaluate((el) => {
        el.scrollIntoView({ block: "center" });
      });
      await buzzPage.commentBtn.click();
      // 🔥 Wait for UI to render the comment
      await buzzPage.commentInfomation
        .first()
        .waitFor({
          state: "visible",
          timeout: 5000,
        })
        .catch(() => {}); // Prevent failure if there is no comment

      const countListComment = await buzzPage.commentInfomation.count();

      if (countListComment > 0) {
        // click like button
        await buzzPage.likeCommentOnPost();
      } else {
        // Add new comment
        await buzzPage.addComment();

        // click like button
        await buzzPage.likeCommentOnPost();
      }
    });

    // ─── Standalone: Creates a text post (data mutation) ──────────────────
    test("[TC-0430] Verify posting a text-only message works", async ({
      page,
    }) => {
      const message = `Testing text post ${Date.now()}`;
      await buzzPage.postInput.fill(message);
      await buzzPage.postButton.click();

      await expect(buzzPage.page.locator(".oxd-toast-content"))
        .toBeVisible({ timeout: 10000 })
        .catch(() => {});
      const postedMessage = buzzPage.page.getByText(message).first();
      await expect(postedMessage).toBeVisible();
    });

    // ─── Standalone: Uploads a photo post (data mutation + file upload) ───
    test("[TC-0417] Verify sharing a photo post with text", async ({
      page,
    }) => {
      const postMessage = `Automated Post ${Date.now()}`;
      const photoPath = path.join(
        process.cwd(),
        "test-data",
        "assets",
        "ba-na-hill.jpeg",
      );

      await buzzPage.openSharePhotosModal();
      await buzzPage.modalPostInput.fill(postMessage);
      await buzzPage.uploadPhoto(photoPath);

      await expect(buzzPage.modalShareButton).toBeEnabled();
      await buzzPage.sharePost(postMessage);

      const postedText = buzzPage.page.getByText(postMessage).first();
      await expect(postedText).toBeVisible();
    });

    // ─── Standalone: Creates a post then EDITS it (state mutation chain) ──
    test("[TC-0439] Verify 'Edit Post' allows modified text to be saved", async ({
      page,
    }) => {
      const initialMessage = `Post ${Date.now()}`;
      await buzzPage.createPost(initialMessage);
      await buzzPage.openEditPost(initialMessage);
      console.log("Content initial message: " + initialMessage)

      const initialMessageEdit =  `Edit post ${Date.now()}`;
      await buzzPage.editPost(initialMessageEdit);
      console.log("Content edit message: " + initialMessageEdit)

      const editPost = await buzzPage.searchPost(initialMessageEdit);
      await expect(editPost).toBeVisible();
    });

    // ─── Standalone: Creates a post then DELETES it (state mutation chain) ─
    test.only("[TC-0440] Verify 'Delete Post' removes it from the newsfeed", async ({
      page,
    }) => {
      const deleteTargetMessage = `Post to delete ${Date.now()}`;

      await buzzPage.createPost(deleteTargetMessage);
      await buzzPage.deletePost(true, deleteTargetMessage);

      const searchPost = await buzzPage.searchPost(deleteTargetMessage);
      await expect(searchPost).toBeHidden();
    });

    test("[buzz-0444] Verify that the Share Video pop-up window is working correctly", async ({
      page,
    }) => {
      const message = `Auto ${Date.now()}`;
      const videoUrl = "https://www.youtube.com/watch?v=04Kf_0kppPM";

      await buzzPage.openShareVideoModal(message, videoUrl);

      await buzzPage.deletePost(true, message);
      await expect(await buzzPage.searchPost(message)).toBeHidden();
    });

  });
});
