import test from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
    
test('Step 1: Register', async ({ page, context}) => {
    context.clearCookies();
    const registerPage = new RegisterPage(page);
    await registerPage.clickRegister();
    await registerPage.fillRegisterInfo();
    await registerPage.verifyRegisterSuccess();
});