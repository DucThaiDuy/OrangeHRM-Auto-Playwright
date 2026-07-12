import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../BasePage";
import path from "path";

export class BuzzPage extends BasePage {
  // Top post section
  readonly postInput: Locator;
  readonly sharePhotosButton: Locator;
  readonly shareVideoButton: Locator;
  readonly postButton: Locator;
  readonly titleSharePhotos: Locator;
  readonly postInputSharePhoto: Locator;
  readonly addPhoto: Locator;
  readonly fileInputPhoto: Locator;

  readonly modal: Locator;

  // Share Photos Modal
  readonly modalPostInput: Locator;
  readonly addPhotosArea: Locator;
  readonly fileInput: Locator;
  readonly modalShareButton: Locator;
  readonly modalCloseButton: Locator;
  readonly titleShareVideoModal: Locator;
  readonly activePostInModalHeader: Locator;
  readonly sharePhotosModalTitle: Locator;

  // Share Video Modal
  readonly videoUrlInput: Locator;
  readonly videoSaveButton: Locator;
  readonly videoPreview : Locator;

  // Tabs
  readonly recentPostsTab: Locator;
  readonly likedPostsTab: Locator;
  readonly commentedPostsTab: Locator;

  // Post Interactions (on first post)
  readonly firstPost: Locator;
  readonly firstPostLikeIcon: Locator;
  readonly firstPostCommentIcon: Locator;
  readonly firstPostMoreOptions: Locator;
  readonly commentInput: Locator;
  readonly commentInfomation: Locator;
  readonly likeCommentBtn: Locator;
  readonly heartCommentIcon: Locator;
  readonly comments: Locator;
  readonly commentBtn: Locator;
  readonly post: Locator;
  readonly likecommentShare: Locator;

  // Post Options
  readonly deletePostOption: Locator;
  readonly titleAlert: Locator;
  readonly noCancel: Locator;
  readonly yesDelete: Locator;
  readonly editPostOption: Locator;
  readonly confirmDeleteButton: Locator;
  readonly editPostInput: Locator;
  readonly editPostSubmitButton: Locator;
  readonly postBodyText: Locator;
  readonly postCard: Locator;

  // Newsfeed
  readonly firstPostText: Locator;

  // message
  readonly toastMessage: Locator;
  // readonly toastMassageUpdate: Locator;
  // readonly toastMassageDelete: Locator;

  constructor(page: Page) {
    super(page);

    // Newsfeed header section
    this.postInput = page.getByPlaceholder("What's on your mind?");
    this.sharePhotosButton = page.locator(
      'button.oxd-glass-button:has-text("Share Photos")',
    );
    this.shareVideoButton = page.locator(
      'button.oxd-glass-button:has-text("Share Video")',
    );
    this.postButton = page.locator('button.oxd-button--main:has-text("Post")');
    this.titleSharePhotos = page.locator('p:has-text("Share Photos")');
    this.postInputSharePhoto = page.locator(
      "//div[@class='orangehrm-buzz-post-modal-header-text']//div[@class='oxd-buzz-post oxd-buzz-post--active']",
    );
    this.addPhoto = page.getByText("Add Photos", { exact: true });
    this.fileInputPhoto = page.locator('input[type="file"]');

    // dialog modal
    this.modal = page.locator(".orangehrm-dialog-modal");
    
    // Modal elements
    this.modalPostInput = this.modal.getByPlaceholder(
      "What's on your mind?",
    );
    this.addPhotosArea = page.locator(".oxd-file-div");
    this.fileInput = page.locator('input[type="file"]');
    this.modalShareButton = this.modal.getByRole("button", {
      name: "Share",
    });
    this.modalCloseButton = page.locator(".oxd-dialog-close-button");
    this.titleShareVideoModal = page.locator('p:has-text("Share Video")');
    this.activePostInModalHeader = this.modal.getByPlaceholder("What's on your mind?");
    this.sharePhotosModalTitle = this.modal.getByText("Share Photos");

    // Video Modal (shares the same dialog selector but different inputs)
    this.videoUrlInput = this.modal.getByPlaceholder("Paste Video URL");
    this.videoPreview = this.modal.locator(".orangehrm-buzz-video-frame");
    this.videoSaveButton = this.modal.getByRole("button", { name: "Share" });
    
    // Tabs
    this.recentPostsTab = page.locator(
      'button.orangehrm-post-filters-button:has-text("Most Recent Posts")',
    );
    this.likedPostsTab = page.locator(
      'button.orangehrm-post-filters-button:has-text("Most Liked Posts")',
    );
    this.commentedPostsTab = page.locator(
      'button.orangehrm-post-filters-button:has-text("Most Commented Posts")',
    );

    // Interaction Icons
    this.firstPostLikeIcon = page
      .locator(
        ".oxd-icon.bi-heart, .oxd-icon.bi-heart-fill, #heart, #heart-fill",
      )
      .first();
    this.firstPostCommentIcon = page
      .locator(".oxd-icon.bi-chat-dots, .oxd-icon.bi-chat-text-fill")
      .first();
    this.firstPostMoreOptions = page
      .locator("li i.bi-three-dots, button i.bi-three-dots, .bi-three-dots")
      .first();
    this.commentInput = page.getByPlaceholder("Write your comment...");
    this.commentInfomation = page
      .locator("div.orangehrm-post-comment")
      .locator("div")
      .nth(0);
    this.likeCommentBtn = page.getByText("Like", { exact: true });
    this.heartCommentIcon = page.locator(".orangehrm-post-comment-stats-icon");
    this.firstPost = page.locator(".orangehrm-buzz-post");
    this.comments = page.locator("p").filter({ hasText: /[1-9]\d* Comment/ });
    this.commentBtn = page
      .locator("div.orangehrm-buzz-post-actions")
      .locator("button")
      .nth(0);
    this.post = page
      .locator(".orangehrm-buzz-newsfeed-posts")
      .locator(".orangehrm-buzz-post");
    this.likecommentShare = page
      .locator("div.orangehrm-buzz-post-footer")
      .locator("div")
      .nth(0);

    // Post options dropdown
    this.deletePostOption = page
      .locator("li")
      .filter({ hasText: /^Delete Post$/ });
    this.titleAlert = page.getByText("Are you Sure?", { exact: true });
    this.editPostOption = page.locator("li").filter({ hasText: /^Edit Post$/ });
    this.confirmDeleteButton = page.getByRole("button", {
      name: "Yes, Delete",
    });
    this.editPostInput = this.modal.locator(".oxd-buzz-post-input");
    this.editPostSubmitButton = this.modal.locator('button[type="submit"]');
    this.noCancel = page.getByRole("button", { name: "No, Cancel" });
    this.yesDelete = page.getByRole("button", { name: "Yes, Delete" });

    // Post content
    this.firstPostText = page
      .locator(
        ".oxd-sheet.oxd-sheet--rounded.oxd-sheet--white, .orangehrm-buzz-post-body-text",
      )
      .locator("p")
      .first();
    this.postBodyText = page.locator(".orangehrm-buzz-post-body-text");
    this.postCard = page.locator(".oxd-sheet.orangehrm-buzz");

    this.toastMessage = page.locator(".oxd-toast--success");
    // this.toastMassageUpdate = page
    //   .locator(".oxd-toast-content-text")
    //   .filter({ hasText: "Successfully Updated" });
    // this.toastMassageDelete = page
    //   .locator(".oxd-toast-content-text")
    //   .filter({ hasText: "Successfully Deleted" });
  }

  async openSharePhotosModal() {
    await this.sharePhotosButton.click();
    await this.sharePhotosModalTitle.waitFor({ state: "visible" });
    await this.modal.waitFor({ state: "visible" });
  }

  async openShareVideoModal(content: string, url: string) {
    await this.shareVideoButton.click();
    await this.modal.waitFor({ state: "visible" });

    await this.activePostInModalHeader.fill(content);

    // OrangeHRM auto-submits when it detects a valid video URL.
    // The modal closes by itself — do NOT click Share or assert videoPreview.
    // We fill URL then immediately wait for the modal to auto-close.
    await this.videoUrlInput.fill(url);

    // Modal auto-closes after URL is processed (auto-submit behavior of OrangeHRM)
    await this.modal.waitFor({ state: "hidden", timeout: 15000 });
    await expect(this.toastMessage).toBeVisible();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async uploadPhoto(filePath: string) {
    // Playwright handles file input even if hidden
    await this.fileInput.setInputFiles(filePath);
  }

  async createPost(message:string) {
    await this.postInput.fill(message);
    await this.postButton.click();
    await this.toastMessage.waitFor({ state: "visible" });
    await expect(this.toastMessage).toBeVisible();
    await this.page.waitForLoadState('domcontentloaded'); // Allow feed to update
  }

  async sharePost(text: string) {
    if (text) {
      await this.modalPostInput.fill(text);
    }
    await this.modalShareButton.click();
    await this.modal.waitFor({ state: "hidden" });
    await this.page.waitForLoadState('domcontentloaded'); // Allow feed to update
  }

  async likeCommentOnPost() {
    await this.likeCommentBtn.click();
  }

  async addComment() {
    const text = `Auto comment ${Date.now()}`;
    await this.commentInput.click();
    await this.commentInput.fill(text);
    await this.page.keyboard.press("Enter");
  }

  async addPostArticle() {
    const text = `Auto comment ${Date.now()}`;
    await this.postInput.click();
    await this.postInput.fill(text);
    await this.postButton.click();
    await expect(this.toastMessage).toBeVisible();
  }

  async searchPost(message: string): Promise<Locator> {
    return this.postCard.filter({
      has: this.page.locator(".orangehrm-buzz-post-body-text", {
        hasText: message,
      }),
    });
  }

  async openPostMenu(message: string) {
    const post = await this.searchPost(message);
    await this.firstPostMoreOptions.click();
  }

  async openEditPost(message: string) {
    await this.openPostMenu(message);
    await this.editPostOption.click();
  }

  async editPost(message: string) {
    await this.editPostInput.clear();
    await this.editPostInput.fill(message);
    await this.editPostSubmitButton.click();
    await this.toastMessage.waitFor({ state: "visible" });
    await expect(this.toastMessage).toBeVisible();
    await this.page.waitForLoadState('domcontentloaded'); // Allow feed to update
  }

  async addSharePhoto() {
    await this.sharePhotosButton.click();
    const filePath = path.resolve(
      __dirname,
      "../../test-data/assets/lee-min-ho.jpg",
    );
    await this.fileInputPhoto.setInputFiles(filePath);
  }

  async deletePost(acceptDelete: boolean, message?: string) {
  const post = message
    ? await this.searchPost(message)
    : this.firstPost.first();

  await this.firstPostMoreOptions.click();
  await this.deletePostOption.click();

  if (acceptDelete) {
    await this.yesDelete.click();

    await expect(this.toastMessage).toBeVisible();
    await expect(post).toHaveCount(0);
  } else {
    await this.noCancel.click();

    await expect(post).toBeVisible();
  }
}
}
