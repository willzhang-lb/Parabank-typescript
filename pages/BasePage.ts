import { Page, Locator, expect } from '@playwright/test';
import { generateUsername, getHtmlTagOfNode } from '../utility';

export class BasePage {
    readonly page: Page;
    readonly leftPanel: Locator;
    readonly rightPanel: Locator;
    readonly randomUsername: string;
    readonly baseUrl: string;

    constructor(page: Page) {
        this.page = page;
        this.leftPanel = this.page.locator('#leftPanel');
        this.rightPanel = this.page.locator('#rightPanel');
        this.randomUsername = generateUsername();
    }

    async navigateToHomePage() {
        await this.page.goto('/');
    }

    async verifyTitleCorrect(expectedTitle: string) {
        const title = await this.getVisibleTitle();
        console.log(title);
        expect(title).toBe(expectedTitle);
    }

    async getVisibleTitle(): Promise<string | undefined> {
        await this.page.waitForSelector('#rightPanel', { state: 'visible' });
        const titles = this.rightPanel.locator('.title');
        const count = await titles.count();

        for (let i = 0; i < count; i++) {
            const el = titles.nth(i);
            if (await el.isVisible()) {
                const title = await el.textContent();
                return title?.trim();
            }
        }
        return undefined;
    }

    async clickLeftMenu(menuItem: string) {
        await this.leftPanel.getByText(menuItem).click();
    }

    async fillForm(formData: Record<string, string>) {
        await this.page.waitForSelector('#rightPanel table tbody');
        for (const [key, value] of Object.entries(formData)) {
            const row = this.rightPanel.locator('tr', { hasText: key }).first();
            const targetField = row.locator('td:nth-child(2) > *');
            const tag = (await getHtmlTagOfNode(targetField)).toUpperCase();
            if (tag === 'INPUT') {
                targetField.fill(value);
            } else if (tag === 'SELECT') {
                targetField.selectOption(value);
            }
        }
    }

    async clickButton(buttonText: string) {
        // Click a button with the specified text/value
        const button = this.page.locator(`//input[@class="button" and @value="${buttonText}"]`);
        await this.page.waitForSelector(`//input[@class="button" and @value="${buttonText}"]`, { state: 'visible' });
        if (await button.isVisible() && await button.isEditable()) {
            await button.click();
        } 
        else {
            throw new Error(`Button with text '${buttonText}' is not visible on the page.`);
        }
    }
}
