export const CONTRACT_ADDRESS = "";
export const BANKS = ["BCA", "BRI", "BNI"] as const;
export type BankCode = typeof BANKS[number];
export const PROVIDERS = [{ id: "PLN", name: "Token Listrik", settlementBank: "BCA" }];
