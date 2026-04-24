import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    readonly headerTitle: Locator;
    readonly userDropdownName: Locator;
    readonly sidebarItems: Locator;
    readonly dashboardWidgets: Locator;
    readonly quickLaunchItems: Locator;
    readonly upgradeButton: Locator;
    readonly iconChevronLeft: Locator;
    readonly bodySidebar: Locator;

    constructor(page: Page) {
        super(page);
        this.headerTitle = page.locator('.oxd-topbar-header-title');
        this.userDropdownName = page.locator('.oxd-userdropdown-name');
        this.sidebarItems = page.locator('.oxd-main-menu-item');
        this.dashboardWidgets = page.locator('.oxd-grid-item.orangehrm-dashboard-widget');
        this.quickLaunchItems = page.locator('.orangehrm-quick-launch-card');
        this.upgradeButton = page.locator('.orangehrm-upgrade-button');
        this.iconChevronLeft = page.locator('i.oxd-icon.bi-chevron-left');
        this.bodySidebar = page.locator('div.oxd-sidepanel-body')
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
