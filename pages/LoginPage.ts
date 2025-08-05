import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { loadJsonFileInfo } from '../utility';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async login() {
        const memberInfo = loadJsonFileInfo('data/member_info.json');
        await this.leftPanel.locator('input[name="username"]').fill(memberInfo['Username']);
        await this.leftPanel.locator('input[name="password"]').fill(memberInfo['Password']);
        await this.clickButton('Log In');
    }
}