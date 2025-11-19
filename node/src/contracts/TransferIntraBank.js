export class TransferIntraBank {
  run(payload, state) {
    const { fromBank, fromAcc, toBank, toAcc, amount } = payload;

    // Validasi: fromBank == toBank
    if (fromBank !== toBank) {
      return {
        error: 'INVALID_TRANSFER_TYPE',
        stateDiff: {}
      };
    }

    // Cek account sumber
    const fromKey = `accounts/${fromBank}/${fromAcc}`;
    const fromBalance = state.accounts[fromKey];
    
    if (fromBalance === undefined) {
      return {
        error: 'ACCOUNT_NOT_FOUND',
        stateDiff: {}
      };
    }

    // Cek saldo cukup
    if (fromBalance < amount) {
      return {
        error: 'INSUFFICIENT_BALANCE',
        stateDiff: {}
      };
    }

    // Cek account tujuan
    const toKey = `accounts/${toBank}/${toAcc}`;
    const toBalance = state.accounts[toKey] || 0;

    // Debit dan kredit
    const stateDiff = {
      accounts: {
        [fromKey]: fromBalance - amount,
        [toKey]: toBalance + amount
      }
    };

    return {
      error: null,
      stateDiff
    };
  }
}

