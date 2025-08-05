import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { BillPayPage } from '../pages/BillPayPage';
import { OpenAccountPage } from '../pages/OpenNewAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { AccountOverviewPage } from '../pages/AccountOverviewPage';
import { FindTransactionsPage } from '../pages/FindTransactionsPage';

let newAccount: string | undefined;
const transferAmount = '1';
    
test.describe.serial(() => {
    
    test('Step 1: Register', async ({ page}) => {
        const registerPage = new RegisterPage(page);
        await registerPage.fillRegisterInfo();
        await registerPage.verifyRegisterSuccess();
    });

    test('Step 2: Open New Account', async ({ page }) => {
        const homePage = new HomePage(page);
        const openAccountPage = new OpenAccountPage(page);
        const accountOverviewPage = new AccountOverviewPage(page);

        await homePage.clickLeftMenu('Open New Account');
        await openAccountPage.verifyTitleCorrect('Open New Account');
        const newAccountBalance = await openAccountPage.getNewAccountBalance();
        await openAccountPage.openNewAccount();
        await openAccountPage.verifyTitleCorrect('Account Opened!');
        newAccount = await openAccountPage.saveNewAccountNumber();
        await homePage.clickLeftMenu('Accounts Overview');
        await accountOverviewPage.verifyTitleCorrect('Accounts Overview');
        if (newAccount && newAccountBalance !== undefined) {
            await accountOverviewPage.verifyAccountBalance(newAccount, newAccountBalance.toString());
        }
    });

    test('Step 3: Transfer Fund', async ({ page }) => {
        const homePage = new HomePage(page);
        const transferFundsPage = new TransferFundsPage(page);

        await homePage.clickLeftMenu('Transfer Funds');
        await transferFundsPage.verifyTitleCorrect('Transfer Funds');

        if (newAccount) {
            await transferFundsPage.transferFund(newAccount, '', transferAmount);
            await transferFundsPage.verifyTitleCorrect('Transfer Complete!');
        }
    });

    test('Step 4: Bill Pay', async ({ page }) => {
        const homePage = new HomePage(page);
        const billPayPage = new BillPayPage(page);

        await homePage.clickLeftMenu('Bill Pay');
        await billPayPage.verifyTitleCorrect('Bill Payment Service');
        await billPayPage.fillBillInfo();
        await billPayPage.verifyTitleCorrect('Bill Payment Complete');
    });

    test('Step 5: Find Transactions', async ({ page }) => {
        const homePage = new HomePage(page);
        const findTransactionsPage = new FindTransactionsPage(page);

        await homePage.clickLeftMenu('Find Transactions');
        await findTransactionsPage.verifyTitleCorrect('Find Transactions');
        await findTransactionsPage.findTransactionByCategory('transaction_amount', transferAmount);
        await findTransactionsPage.verifyTitleCorrect('Transaction Results');
    });
});