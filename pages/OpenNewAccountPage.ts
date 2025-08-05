import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { dumpToJson } from '../utility';

export class OpenAccountPage extends BasePage {
    newAccountId?: string;

    constructor(page: Page) {
        super(page);
    }

    async openNewAccount(fromAccount: string = ''): Promise<void> {
        await this.rightPanel.locator('#type').selectOption('SAVINGS');
        if (fromAccount) {
            await this.rightPanel.locator('#fromAccountId').selectOption(fromAccount);
        } else {
            await this.rightPanel.locator('#fromAccountId').selectOption({ index: 0 });
        }
        await this.page.waitForSelector('#fromAccountId option', { state: 'attached' });
        await this.clickButton('Open New Account');
        await this.page.waitForSelector('#openAccountResult');
    }

    async saveNewAccountNumber(): Promise<string | undefined> {
        const accountId = await this.rightPanel.locator('#newAccountId').textContent();
        this.newAccountId = accountId === null ? undefined : accountId;
        if (this.newAccountId) {
            dumpToJson('data/account_info.json', 'new account', this.newAccountId);
        }
        return this.newAccountId;
    }

    async getNewAccountBalance(): Promise<number | undefined> {
        const balanceText = await this.rightPanel.locator('p:below(#type)').textContent();
        if (!balanceText) return undefined;
        // Regular expression to match a monetary value
        const match = balanceText.match(/\$([\d,]+(?:\.\d{2})?)/);
        if (match) {
            // Remove commas and convert to float
            const amountStr = match[1].replace(/,/g, '');
            return parseFloat(amountStr);
        } else {
            console.log('No monetary value found.');
            return undefined;
        }
    }
}