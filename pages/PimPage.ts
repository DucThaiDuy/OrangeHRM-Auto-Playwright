import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import path from "path";

export class PimPage extends BasePage {
  // Title
  readonly titlePage: Locator;
  readonly titleInformation: Locator;
  readonly titleAddEmployee: Locator;

  // Lable
  readonly lableEmployeeName: Locator;
  readonly lableEmployeeId: Locator;
  readonly lableEmployeeStatus: Locator;
  readonly lableInclude: Locator;
  readonly lableSupervisorName: Locator;
  readonly lableJobTitle: Locator;
  readonly lableSubUnit: Locator;

  // Input
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly supervisorNameInput: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdAddInput: Locator;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  // Select
  readonly employmentStatusSel: Locator;
  readonly includeSel: Locator;
  readonly jobTitleSel: Locator;
  readonly subUnitSel: Locator;

  // Button
  readonly resetBtn: Locator;
  readonly searchBtn: Locator;
  readonly addBtn: Locator;
  readonly addAvatarBtn: Locator;
  readonly createLoginDetaiBtn: Locator;
  readonly cancelBtn: Locator;
  readonly saveBtn: Locator;

  // Text
  readonly recordFoundTxt: Locator;

  // Heard table
  readonly idColumnHeader: Locator;
  readonly firstNameColumnHeader: Locator;
  readonly lastNameColumnHeader: Locator;
  readonly jobTitleColumnHeader: Locator;
  readonly employmentStatusColumnHeader: Locator;
  readonly subUnitColumnHeader: Locator;
  readonly supervisorColumnHeader: Locator;
  readonly actionsColumnHeader: Locator;
  readonly tableSelectAllCheckbox: Locator;

  //
  readonly avatar: Locator;

  // RadioBtn
  readonly enabledRdo: Locator;
  readonly disabledRdo: Locator;

  constructor(page: Page) {
    super(page);
    // title
    this.titlePage = page.locator("div.oxd-topbar-header-title");
    this.titleInformation = page.getByRole("heading", {
      name: "Employee Information",
    });
    this.titleAddEmployee = page.getByRole("heading", { name: "Add Employee" });

    // lable
    this.lableEmployeeName = page.getByText("Employee Name", { exact: true });
    this.lableEmployeeId = page.getByText("Employee Id", { exact: true });
    this.lableEmployeeStatus = page.locator(
      'label:has-text("Employment Status")',
    );
    this.lableInclude = page.locator('label:has-text("Employment Status")');
    this.lableSupervisorName = page.locator(
      'label:has-text("Employment Status")',
    );
    this.lableJobTitle = page.locator('label:has-text("Job Title")');
    this.lableSubUnit = page.locator('label:has-text("Sub Unit")');

    // Input
    this.employeeNameInput = page.getByPlaceholder("Type for hints...");
    this.employeeIdInput = page.locator(".oxd-input-group input.oxd-input");
    this.supervisorNameInput = page.getByPlaceholder("Type for hints...");
    this.firstNameInput = page.getByRole("textbox", { name: "First Name" });
    this.middleNameInput = page.getByRole("textbox", { name: "Middle Name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name" });
    this.employeeIdAddInput = page.locator(
      "//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']",
    );
    this.userNameInput = page.locator(
      "//body/div[@id='app']/div[@class='oxd-layout orangehrm-upgrade-layout']/div[@class='oxd-layout-container']/div[@class='oxd-layout-context']/div[@class='orangehrm-background-container']/div[@class='orangehrm-card-container']/form[@class='oxd-form']/div[@class='orangehrm-employee-container']/div[@class='orangehrm-employee-form']/div[@class='oxd-form-row']/div[1]/div[1]/div[1]/div[2]/input[1]",
    );
    this.passwordInput = page.locator(
      "//div[@class='oxd-grid-item oxd-grid-item--gutters user-password-cell']//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@type='password']",
    );
    this.confirmPasswordInput = page.locator(
      "//div[@class='oxd-grid-item oxd-grid-item--gutters']//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@type='password']",
    );

    // Select
    this.employmentStatusSel = page
      .locator('label:text("Include")')
      .locator("..")
      .locator(".oxd-select-text");
    this.includeSel = page
      .locator('label:text("Status")')
      .locator("..")
      .locator(".oxd-select-text");
    this.jobTitleSel = page
      .locator('label:text("Job Title")')
      .locator("..")
      .locator(".oxd-select-text");
    this.subUnitSel = page
      .locator('label:text("Sub Unit")')
      .locator("..")
      .locator(".oxd-select-text");

    // Button
    this.resetBtn = page.getByRole("button", { name: "Reset" });
    this.searchBtn = page.getByRole("button", { name: "Search" });
    this.addBtn = page.getByRole("button", { name: "Add" });
    this.addAvatarBtn = page.locator(
      "button.oxd-icon-button.oxd-icon-button--solid-main.employee-image-action",
    );
    this.createLoginDetaiBtn = page.locator(
      "span.oxd-switch-input.oxd-switch-input--focus.--label-right",
    );
    this.cancelBtn = page.getByRole("button", { name: "Cancel" });
    this.saveBtn = page.getByRole("button", { name: "Save" });

    // Heard Table
    this.idColumnHeader = page.getByRole("columnheader", { name: "Id" });
    this.firstNameColumnHeader = page.getByRole("columnheader", {
      name: /First/i,
    });
    this.lastNameColumnHeader = page.getByRole("columnheader", {
      name: /Last Name/i,
    });
    this.jobTitleColumnHeader = page.getByRole("columnheader", {
      name: /Job Title/i,
    });
    this.employmentStatusColumnHeader = page.getByRole("columnheader", {
      name: /Employment Status/i,
    });
    this.subUnitColumnHeader = page.getByRole("columnheader", {
      name: /Sub Unit/i,
    });
    this.supervisorColumnHeader = page.getByRole("columnheader", {
      name: /Supervisor/i,
    });
    this.actionsColumnHeader = page.getByRole("columnheader", {
      name: /Actions/i,
    });
    this.tableSelectAllCheckbox = page.locator('thead input[type="checkbox"]');

    // Text
    this.recordFoundTxt = page.getByText("Records Found");

    this.avatar = page.locator("div.oxd-file-div.oxd-file-div--active");

    // RadioBtn
    this.enabledRdo = page.getByLabel("Enabled");
    this.disabledRdo = page.getByLabel("Disabled");
  }

  async addEmployeeAllInformation() {
    await this.highlight(this.addBtn, "Add new employee button");
    await this.addBtn.click();
    await this.highlight(this.titleAddEmployee, "Title form add new employee");
    await this.highlight(this.firstNameInput, "Firts name");
    await this.highlight(this.middleNameInput, "Middle name");
    await this.highlight(this.lastNameInput, "Last name");
    await this.highlight(this.employeeIdAddInput, "Employee ID form add");
    await this.highlight(this.userNameInput, "user name");
    await this.highlight(this.passwordInput, "password");
    await this.highlight(this.confirmPasswordInput, "confirm password");
    await this.highlight(
      this.createLoginDetaiBtn,
      "Button Create Login Detail",
    );
    await this.highlight(this.enabledRdo, "Enable radio button");
    await this.highlight(this.disabledRdo, "Disabled radio button");
    await this.highlight(this.avatar, "Avatar img");
    await this.highlight(this.cancelBtn, "Cancel button");
    await this.highlight(this.saveBtn, "Save button");
  }

  async resetButton() {
    this.highlight(this.resetBtn, "reset button");
    this.resetBtn.click();
  }

  async searchEmployeeName(employeeName: string) {
    this.highlight(this.employeeNameInput, "Employee name input");
    this.employeeNameInput.fill(employeeName);
    this.highlight(this.searchBtn, "Button search");
    this.searchBtn.click();
  }
}
