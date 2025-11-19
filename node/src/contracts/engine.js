import { TransferIntraBank } from './TransferIntraBank.js';
import { TransferInterBank } from './TransferInterBank.js';
import { PurchaseProduct } from './PurchaseProduct.js';

export class SmartContractEngine {
  constructor() {
    this.contracts = {
      'TransferIntraBank': new TransferIntraBank(),
      'TransferInterBank': new TransferInterBank(),
      'PurchaseProduct': new PurchaseProduct()
    };
  }

  execute(tx, state) {
    const contract = this.contracts[tx.type];
    
    if (!contract) {
      return {
        error: `Unknown contract type: ${tx.type}`,
        stateDiff: {}
      };
    }

    // Execute contract dengan state snapshot
    const result = contract.run(tx.payload, { ...state });

    if (result.error) {
      return {
        error: result.error,
        stateDiff: {}
      };
    }

    return {
      error: null,
      stateDiff: result.stateDiff,
      price: result.price // untuk purchase
    };
  }
}

