import { Page, Locator, expect, APIResponse } from '@playwright/test';
import { BasePage } from './BasePage';

export class FindTransactionsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Find a transaction by category and value.
     * @param category The category to search for.
     * @param firstValue The first value to use for the search.
     * @param secondValue The second value to use for the search (optional).
     */
    async findTransactionByCategory(
        category: 'transaction_id' | 'transaction_date' | 'transaction_date_range' | 'transaction_amount',
        firstValue: string,
        secondValue: string = ''
    ) {
        let index = 0;
        if (category === 'transaction_id') {
            await this.rightPanel.locator('#transactionId').fill(firstValue);
            index = 0;
        } else if (category === 'transaction_date') {
            await this.rightPanel.locator('#transactionDate').fill(secondValue);
            index = 1;
        } else if (category === 'transaction_date_range') {
            await this.rightPanel.locator('#fromDate').fill(firstValue);
            await this.rightPanel.locator('#toDate').fill(secondValue);
            index = 2;
        } else if (category === 'transaction_amount') {
            await this.rightPanel.locator('#amount').fill(firstValue);
            index = 3;
        }

        const [response] = await Promise.all([
            this.page.waitForResponse('**/transactions/**'),
            this.rightPanel.locator('#transactionForm').getByText('Find Transactions').nth(index).click()
        ]);
        await this.rightPanel.getByRole('button', { name: 'Find Transactions' }).first().waitFor({ state: 'hidden' });
    }
}