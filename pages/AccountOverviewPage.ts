import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountOverviewPage extends BasePage {
    table: Locator;
    targetRow: Locator;

    constructor(page: Page) {
        super(page);
        this.table = this.rightPanel.locator('#accountTable');
        this.targetRow = this.table.locator('tbody > tr');
    }

    async verifyAccountBalance(accountId: string, expectedBalanceValue: string) {
        this.table = this.rightPanel.locator('#accountTable');
        this.targetRow = this.table.locator('tbody > tr', { hasText: accountId });
        const balanceText = await this.targetRow.locator('td:nth-child(2)').textContent();
        const balance = balanceText?.replace('$', '').trim();
        expect(Number(balance)).toBeCloseTo(Number(expectedBalanceValue), 2);
    }
}