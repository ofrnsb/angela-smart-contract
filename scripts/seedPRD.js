const hre = require("hardhat");

// Contract addresses from deployment (update after deploy)
const CONTRACTS = {
  IDRToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  AccountRegistry: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  InterbankSettlement: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  ProductCatalog: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  PurchaseProcessor: "0xDc64a140Aa3E981100a9becA4E685f962f0cF706"
};

async function main() {
  console.log("Seeding PRD demo data...\n");

  const [deployer, bankA, bankB, regulator, validator1, validator2, provider, user1, user2] = 
    await hre.ethers.getSigners();

  // Get contract instances
  const IDRToken = await hre.ethers.getContractFactory("IDRToken");
  const AccountRegistry = await hre.ethers.getContractFactory("AccountRegistry");
  const ProductCatalog = await hre.ethers.getContractFactory("ProductCatalog");
  
  const idrToken = IDRToken.attach(CONTRACTS.IDRToken);
  const accountRegistry = AccountRegistry.attach(CONTRACTS.AccountRegistry);
  const productCatalog = ProductCatalog.attach(CONTRACTS.ProductCatalog);

  // 1. Register accounts for BankA
  console.log("Registering BankA accounts...");
  const bankAConn = accountRegistry.connect(bankA);
  
  await bankAConn.registerAccount(bankA.address, "1234567890", user1.address);
  console.log("  - Account 1234567890 (User1) registered");
  
  await bankAConn.registerAccount(bankA.address, "1111111111", user2.address);
  console.log("  - Account 1111111111 (User2) registered");

  // 2. Register accounts for BankB
  console.log("Registering BankB accounts...");
  const bankBConn = accountRegistry.connect(bankB);
  
  await bankBConn.registerAccount(bankB.address, "0987654321", user1.address);
  console.log("  - Account 0987654321 (User1) registered");
  
  await bankBConn.registerAccount(bankB.address, "2222222222", user2.address);
  console.log("  - Account 2222222222 (User2) registered");

  // 3. Mint initial balances
  console.log("\nMinting initial IDR balances...");
  const idrTokenBankA = idrToken.connect(bankA);
  const idrTokenBankB = idrToken.connect(bankB);
  
  // Mint to User1 accounts (using parseUnits with 18 decimals)
  await idrTokenBankA.mint(user1.address, hre.ethers.parseUnits("10000000", 18)); // 10M IDR
  console.log("  - Minted 10M IDR to User1 (BankA account)");
  
  await idrTokenBankB.mint(user1.address, hre.ethers.parseUnits("5000000", 18)); // 5M IDR
  console.log("  - Minted 5M IDR to User1 (BankB account)");
  
  // Mint to User2 accounts
  await idrTokenBankA.mint(user2.address, hre.ethers.parseUnits("8000000", 18)); // 8M IDR
  console.log("  - Minted 8M IDR to User2 (BankA account)");
  
  await idrTokenBankB.mint(user2.address, hre.ethers.parseUnits("6000000", 18)); // 6M IDR
  console.log("  - Minted 6M IDR to User2 (BankB account)");

  // 4. Add products
  console.log("\nAdding products...");
  const productCatalogBankA = productCatalog.connect(bankA);
  
  await productCatalogBankA.addProduct(
    1,
    "Token Listrik 20kWh",
    provider.address,
    hre.ethers.parseUnits("50000", 18), // 50k IDR
    "Token listrik untuk 20kWh - PLN"
  );
  console.log("  - Product 1: Token Listrik 20kWh (50k IDR)");

  await productCatalogBankA.addProduct(
    2,
    "Token Listrik 50kWh",
    provider.address,
    hre.ethers.parseUnits("125000", 18), // 125k IDR
    "Token listrik untuk 50kWh - PLN"
  );
  console.log("  - Product 2: Token Listrik 50kWh (125k IDR)");

  await productCatalogBankA.addProduct(
    3,
    "Pulsa 50.000",
    provider.address,
    hre.ethers.parseUnits("50000", 18), // 50k IDR
    "Pulsa seluler 50.000 untuk semua operator"
  );
  console.log("  - Product 3: Pulsa 50.000 (50k IDR)");

  await productCatalogBankA.addProduct(
    4,
    "Paket Data 10GB",
    provider.address,
    hre.ethers.parseUnits("75000", 18), // 75k IDR
    "Paket data internet 10GB - 30 hari"
  );
  console.log("  - Product 4: Paket Data 10GB (75k IDR)");

  // 5. Approve tokens for contracts (needed for transfers)
  console.log("\nApproving tokens for contracts...");
  const idrTokenUser1 = idrToken.connect(user1);
  const idrTokenUser2 = idrToken.connect(user2);
  
  // Approve InterbankSettlement
  await idrTokenUser1.approve(CONTRACTS.InterbankSettlement, hre.ethers.MaxUint256);
  await idrTokenUser2.approve(CONTRACTS.InterbankSettlement, hre.ethers.MaxUint256);
  console.log("  - Approved InterbankSettlement for User1 and User2");
  
  // Approve PurchaseProcessor
  await idrTokenUser1.approve(CONTRACTS.PurchaseProcessor, hre.ethers.MaxUint256);
  await idrTokenUser2.approve(CONTRACTS.PurchaseProcessor, hre.ethers.MaxUint256);
  console.log("  - Approved PurchaseProcessor for User1 and User2");

  console.log("\n=== Seeding Complete ===");
  console.log("\nSeeded Accounts:");
  console.log("  BankA:");
  console.log("    - 1234567890 (User1)");
  console.log("    - 1111111111 (User2)");
  console.log("  BankB:");
  console.log("    - 0987654321 (User1)");
  console.log("    - 2222222222 (User2)");
  console.log("\nInitial Balances:");
  console.log("  User1 BankA: 10M IDR");
  console.log("  User1 BankB: 5M IDR");
  console.log("  User2 BankA: 8M IDR");
  console.log("  User2 BankB: 6M IDR");
  console.log("\nProducts:");
  console.log("  1. Token Listrik 20kWh - 50k IDR");
  console.log("  2. Token Listrik 50kWh - 125k IDR");
  console.log("  3. Pulsa 50.000 - 50k IDR");
  console.log("  4. Paket Data 10GB - 75k IDR");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

