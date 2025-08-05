import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { loadJsonFileInfo } from '../utility';

export class BillPayPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillBillInfo() {
        const billInfo = loadJsonFileInfo('data/bill_info.json');
        const accountInfo = loadJsonFileInfo('data/account_info.json');
        billInfo['From account'] = accountInfo['new account'];
        await this.page.waitForSelector('h1:has-text("Bill Payment Service")', { state: 'visible' });
        await this.fillForm(billInfo);
        await this.clickButton('Send Payment');
        await this.page.waitForSelector('input[value="Send Payment"]', { state: 'visible' });
        await this.page.waitForTimeout(5000);
    }
}