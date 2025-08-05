import {test, expect} from '@playwright/test';
import { loadJsonFileInfo } from './utility';

test("Login", async ({page}) => {
    const memberInfo = loadJsonFileInfo('data/member_info.json');
    await page.goto('/parabank/index.htm');
    await page.fill('input[name="username"]', memberInfo.Username);
    await page.fill('input[name="password"]', memberInfo.Password);
    await page.click('input[value="Log In"]');
    await page.context().storageState({ path: "./auth.json" });
});
