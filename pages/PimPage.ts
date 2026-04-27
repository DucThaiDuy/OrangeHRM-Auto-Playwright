import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import path from "path";

export class PimPage extends BasePage {
  // Title
  readonly titlePage: Locator;
  readonly titleInformation: Locator;

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

  // Select
  readonly employmentStatusSel: Locator;
  readonly includeSel: Locator;
  readonly jobTitleSel: Locator;
  readonly subUnitSel: Locator;

  // Button
  readonly resetBtn: Locator;
  readonly searchBtn: Locator;
  readonly addBtn: Locator;

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

  constructor(page: Page) {
    super(page);
    this.titlePage = page.locator("div.oxd-topbar-header-title");
    this.titleInformation = page.getByRole("heading", {
      name: "Employee Information",
    });

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
  }
}
