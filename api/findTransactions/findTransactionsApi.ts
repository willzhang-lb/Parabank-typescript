import { APIRequestContext, APIResponse } from '@playwright/test';

export class FindTransactionsAPI {
  constructor(private apiRequestContext: APIRequestContext) {}

  async findTransactionsByAmount(accountId: string, amount: number): Promise<APIResponse> {
    return await this.apiRequestContext.get(`/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${amount}?timeout=30000`);
  }
}