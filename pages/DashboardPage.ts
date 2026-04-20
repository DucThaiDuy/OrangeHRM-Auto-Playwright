import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    readonly headerTitle: Locator;
    readonly userDropdownName: Locator;
    readonly sidebarItems: Locator;
    readonly dashboardWidgets: Locator;
    readonly quickLaunchItems: Locator;
    readonly upgradeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.headerTitle = page.locator('.oxd-topbar-header-title');
        this.userDropdownName = page.locator('.oxd-userdropdown-name');
        this.sidebarItems = page.locator('.oxd-main-menu-item');
        this.dashboardWidgets = page.locator('.orangehrm-dashboard-widget-card');
        this.quickLaunchItems = page.locator('.orangehrm-quicklaunch-item');
        this.upgradeButton = page.locator('.orangehrm-upgrade-button');
    }

    async getHeaderTitle() {
        return await this.getElementText(this.headerTitle);
    }

    async getUserDropdownName() {
        return await this.userDropdownName.textContent();
    }

    async getWidgetCount() {
        return await this.dashboardWidgets.count();
    }

    async getSidebarItemCount() {
        return await this.sidebarItems.count();
    }
}
