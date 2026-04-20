import { Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class BuzzPage extends BasePage {
    // Top post section
    readonly postInput: Locator;
    readonly sharePhotosButton: Locator;
    readonly shareVideoButton: Locator;
    readonly postButton: Locator;

    // Share Photos Modal
    readonly modalSharePhotos: Locator;
    readonly modalPostInput: Locator;
    readonly addPhotosArea: Locator;
    readonly fileInput: Locator;
    readonly modalShareButton: Locator;
    readonly modalCloseButton: Locator;

    // Share Video Modal
    readonly videoUrlInput: Locator;
    readonly videoSaveButton: Locator;

    // Tabs
    readonly recentPostsTab: Locator;
    readonly likedPostsTab: Locator;
    readonly commentedPostsTab: Locator;

    // Post Interactions (on first post)
    readonly firstPostLikeIcon: Locator;
    readonly firstPostCommentIcon: Locator;
    readonly firstPostMoreOptions: Locator;
    readonly commentInput: Locator;

    // Post Options
    readonly deletePostOption: Locator;
    readonly editPostOption: Locator;
    readonly confirmDeleteButton: Locator;
    readonly editPostInput: Locator;
    readonly editPostSubmitButton: Locator;

    // Newsfeed
    readonly firstPostText: Locator;

    constructor(page: Page) {
        super(page);
        
        // Newsfeed header section
        this.postInput = page.getByPlaceholder("What's on your mind?");
        this.sharePhotosButton = page.locator('button.oxd-glass-button:has-text("Share Photos")');
        this.shareVideoButton = page.locator('button.oxd-glass-button:has-text("Share Video")');
        this.postButton = page.locator('button.oxd-button--main:has-text("Post")');

        // Modal elements
        this.modalSharePhotos = page.getByRole('dialog');
        this.modalPostInput = this.modalSharePhotos.getByPlaceholder("What's on your mind?");
        this.addPhotosArea = page.locator('.oxd-file-div');
        this.fileInput = page.locator('input[type="file"]');
        this.modalShareButton = this.modalSharePhotos.getByRole('button', { name: 'Share' });
        this.modalCloseButton = page.locator('.oxd-dialog-close-button');

        // Video Modal (shares the same dialog selector but different inputs)
        this.videoUrlInput = page.locator('textarea.oxd-buzz-post-input').nth(1); // Usually second textarea in dialog
        this.videoSaveButton = page.getByRole('button', { name: 'Share' });

        // Tabs
        this.recentPostsTab = page.locator('button.orangehrm-post-filters-button:has-text("Most Recent Posts")');
        this.likedPostsTab = page.locator('button.orangehrm-post-filters-button:has-text("Most Liked Posts")');
        this.commentedPostsTab = page.locator('button.orangehrm-post-filters-button:has-text("Most Commented Posts")');

        // Interaction Icons
        this.firstPostLikeIcon = page.locator('.oxd-icon.bi-heart, .oxd-icon.bi-heart-fill, #heart, #heart-fill').first();
        this.firstPostCommentIcon = page.locator('.oxd-icon.bi-chat-dots, .oxd-icon.bi-chat-text-fill').first();
        this.firstPostMoreOptions = page.locator('li i.bi-three-dots, button i.bi-three-dots, .bi-three-dots').first();
        this.commentInput = page.getByPlaceholder('Write your comment...');

        // Post options dropdown
        this.deletePostOption = page.locator('li').filter({ hasText: /^Delete Post$/ });
        this.editPostOption = page.locator('li').filter({ hasText: /^Edit Post$/ });
        this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
        this.editPostInput = page.getByRole('dialog').getByRole('textbox');
        this.editPostSubmitButton = page.locator('.oxd-dialog-container button').filter({ hasText: /Post|Save/i });

        // Post content
        this.firstPostText = page.locator('.oxd-sheet.oxd-sheet--rounded.oxd-sheet--white, .orangehrm-buzz-post-body-text').locator('p').first();
    }

    async openSharePhotosModal() {
        await this.sharePhotosButton.click();
        await this.modalSharePhotos.waitFor({ state: 'visible' });
    }

    async uploadPhoto(filePath: string) {
        // Playwright handles file input even if hidden
        await this.fileInput.setInputFiles(filePath);
    }

    async sharePost(text: string) {
        if (text) {
            await this.modalPostInput.fill(text);
        }
        await this.modalShareButton.click();
        await this.modalSharePhotos.waitFor({ state: 'hidden' });
        await this.page.waitForTimeout(1000); // Allow feed to update
    }
}
