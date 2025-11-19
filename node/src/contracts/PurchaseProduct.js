export class PurchaseProduct {
  run(payload, state) {
    const { buyerBank, buyerAcc, merchantId, productId } = payload;

    // Ambil produk
    const productKey = `products/${merchantId}/${productId}`;
    const product = state.products[productKey];

    if (!product) {
      return {
        error: 'PRODUCT_NOT_FOUND',
        stateDiff: {}
      };
    }

    // Cek stok
    if (product.stock <= 0) {
      return {
        error: 'PRODUCT_OUT_OF_STOCK',
        stateDiff: {}
      };
    }

    // Cek saldo pembeli
    const buyerKey = `accounts/${buyerBank}/${buyerAcc}`;
    const buyerBalance = state.accounts[buyerKey];

    if (buyerBalance === undefined) {
      return {
        error: 'ACCOUNT_NOT_FOUND',
        stateDiff: {}
      };
    }

    if (buyerBalance < product.price) {
      return {
        error: 'INSUFFICIENT_BALANCE',
        stateDiff: {}
      };
    }

    // Merchant account (simplified: merchant punya account di ledger)
    const merchantKey = `accounts/${merchantId}/MAIN`;
    const merchantBalance = state.accounts[merchantKey] || 0;

    // Debit pembeli, kredit merchant, kurangi stok
    const stateDiff = {
      accounts: {
        [buyerKey]: buyerBalance - product.price,
        [merchantKey]: merchantBalance + product.price
      },
      products: {
        [productKey]: {
          ...product,
          stock: product.stock - 1
        }
      }
    };

    return {
      error: null,
      stateDiff,
      price: product.price
    };
  }
}

