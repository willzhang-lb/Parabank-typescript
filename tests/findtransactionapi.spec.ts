import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { FindTransactionsAPI } from '../api/findTransactions/findTransactionsApi';
import accountInfo from '../data/account_info.json';

const newAccount = accountInfo['new account'];

test('get transactions', async ({ request }) => {
  // Call the API endpoint
  const txApi = new FindTransactionsAPI(request);
  const response: APIResponse = await txApi.findTransactionsByAmount(newAccount, 1);

  console.log('Status:', response.status());
  console.log('Content-Type:', response.headers()['content-type']);
  const responseText = await response.text();
  console.log('Response Text Preview:', responseText.slice(0, 200));

  expect(response.ok(), `API call failed with status ${response.status()}`).toBeTruthy();

  // Check if it's JSON before parsing
  const contentType = response.headers()['content-type'] || '';
  expect(contentType).toContain('application/json');

  const body = await response.json();
  expect(response.status()).toBe(200);
  for (const item of body) {
    expect(Number(item.amount)).toBe(1.0);
  }
});