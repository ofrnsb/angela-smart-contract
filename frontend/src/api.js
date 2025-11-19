// API client untuk berkomunikasi dengan node RPC

const NODE_URLS = {
  BNI: 'http://localhost:3001',
  BCA: 'http://localhost:3002',
  MERCHANT: 'http://localhost:3003'
};

export class BankingAPI {
  constructor(bankId = 'BNI') {
    this.baseURL = NODE_URLS[bankId] || NODE_URLS.BNI;
  }

  async getBalance(bank, acc) {
    try {
      const response = await fetch(`${this.baseURL}/balance?bank=${bank}&acc=${acc}`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data.balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async transfer(fromBank, fromAcc, toBank, toAcc, amount) {
    try {
      const response = await fetch(`${this.baseURL}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromBank,
          fromAcc,
          toBank,
          toAcc,
          amount: parseInt(amount)
        })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.error('Error transferring:', error);
      throw error;
    }
  }

  async purchase(buyerBank, buyerAcc, merchantId, productId) {
    try {
      const response = await fetch(`${this.baseURL}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buyerBank,
          buyerAcc,
          merchantId,
          productId
        })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.error('Error purchasing:', error);
      throw error;
    }
  }

  async getTransactions(bank, acc, limit = 50) {
    try {
      const response = await fetch(`${this.baseURL}/transactions?bank=${bank}&acc=${acc}&limit=${limit}`);
      const data = await response.json();
      return data.transactions || [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  async getProducts(merchantId) {
    try {
      const url = merchantId 
        ? `${this.baseURL}/products?merchantId=${merchantId}`
        : `${this.baseURL}/products`;
      const response = await fetch(url);
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }
}

