import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger/Logger';
import { highlight as _highlight } from '../utils/highlight';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string) {
        Logger.info(`Navigating to: ${path}`);
        await this.page.goto(path);
    }

    async click(locator: any) {
        Logger.info(`Clicking on element`);
        await locator.click();
    }

    async fill(locator: any, text: string) {
        Logger.info(`Filling text: ${text}`);
        await locator.fill(text);
    }

    async getElementText(locator: any) {
        return await locator.textContent();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async getTitle() {
        return await this.page.title();
    }

    async selectDropdownOption(dropdown: Locator, optionName: string) {
        Logger.info(`Selecting dropdown option: ${optionName}`);
        await dropdown.click();
        await this.page.getByRole('option', { name: optionName }).click();
    }

    /**
     * Highlight a locator element on screen before asserting it.
     * Shows a colored border + label badge overlay.
     * Usage: await this.highlight(locator, "Label");
     */
    async highlight(locator: Locator, label = '', color = '#FF4500', durationMs = 800) {
        await _highlight(this.page, locator, label, color, durationMs);
    }
}
