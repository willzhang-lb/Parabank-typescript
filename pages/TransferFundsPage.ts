import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferFundsPage extends BasePage {
    fromAccountDropdown: Locator;
    toAccountDropdown: Locator;

    constructor(page: Page) {
        super(page);
        this.fromAccountDropdown = this.rightPanel.locator('#fromAccountId');
        this.toAccountDropdown = this.rightPanel.locator('#toAccountId');
    }

    async transferFund(firstAccount: string = '', secondAccount: string = '', transferAmount: string = '0.01') {
        // Select value for fromAccountDropdown
        if (firstAccount) {
            await this.fromAccountDropdown.selectOption(firstAccount);
        } else {
            await this.fromAccountDropdown.selectOption({ index: 0 });
        }

        // Get the selected value from fromAccountDropdown
        const firstAccountId = (await this.fromAccountDropdown.locator('option[selected="selected"]').textContent())?.trim();

        // Get all options from toAccountDropdown
        const optionCount = await this.toAccountDropdown.locator('option').count();
        const toAccountIdList: string[] = [];
        for (let i = 0; i < optionCount; i++) {
            const text = await this.toAccountDropdown.locator('option').nth(i).textContent();
            if (text) toAccountIdList.push(text.trim());
        }

        // Select a value for toAccountDropdown that is different from firstAccountId
        if (secondAccount && secondAccount !== firstAccountId) {
            await this.toAccountDropdown.selectOption(secondAccount);
        } else {
            for (const accountId of toAccountIdList) {
                if (accountId !== firstAccountId) {
                    await this.toAccountDropdown.selectOption(accountId);
                    break;
                }
            }
        }

        await this.rightPanel.locator('#amount').fill(transferAmount);

        const [response] = await Promise.all([
            this.page.waitForResponse('**/transfer**'),
            this.rightPanel.locator('input[value="Transfer"]').click()
        ]);
        await this.page.waitForSelector('#amount', { state: 'hidden' });
        return response;
    }
}