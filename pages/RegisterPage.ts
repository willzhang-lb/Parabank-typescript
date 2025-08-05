import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { generateUsername, dumpToJson, loadJsonFileInfo } from '../utility';

export class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page);
        page.goto('/parabank/register.htm');
    }

    async fillRegisterInfo() {
        dumpToJson('data/member_info.json', 'Username', this.randomUsername);
        const memberInfo = loadJsonFileInfo('data/member_info.json');
        await this.page.waitForSelector('h1:has-text("Signing up is easy!")', { state: 'visible' });
        await this.fillForm(memberInfo);
        await this.clickButton('Register');
    }

    async clickRegister() {
        await this.leftPanel.getByText('Register').click();
    }

    async verifyRegisterSuccess() {
        const successMessage = await this.rightPanel.locator('.title').textContent();
        const expectedTitle = 'Welcome ' + this.randomUsername;
        expect(successMessage).toContain(expectedTitle);
    }
}