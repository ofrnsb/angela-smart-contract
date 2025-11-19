const hre = require("hardhat");

async function main() {
  console.log("Deploying PRD contracts...\n");

  const [deployer, bankA, bankB, regulator, validator1, validator2, provider, user1, user2] = 
    await hre.ethers.getSigners();

  console.log("Deployer:", deployer.address);
  console.log("BankA:", bankA.address);
  console.log("BankB:", bankB.address);
  console.log("Regulator:", regulator.address);
  console.log("Validator1:", validator1.address);
  console.log("Validator2:", validator2.address);
  console.log("Provider:", provider.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);
  console.log("\n");

  // 1. Deploy IDRToken
  console.log("Deploying IDRToken...");
  const IDRToken = await hre.ethers.getContractFactory("IDRToken");
  const idrToken = await IDRToken.deploy();
  await idrToken.waitForDeployment();
  const idrTokenAddress = await idrToken.getAddress();
  console.log("IDRToken deployed to:", idrTokenAddress);

  // 2. Deploy AccountRegistry
  console.log("Deploying AccountRegistry...");
  const AccountRegistry = await hre.ethers.getContractFactory("AccountRegistry");
  const accountRegistry = await AccountRegistry.deploy();
  await accountRegistry.waitForDeployment();
  const accountRegistryAddress = await accountRegistry.getAddress();
  console.log("AccountRegistry deployed to:", accountRegistryAddress);

  // 3. Deploy InterbankSettlement
  console.log("Deploying InterbankSettlement...");
  const InterbankSettlement = await hre.ethers.getContractFactory("InterbankSettlement");
  const interbankSettlement = await InterbankSettlement.deploy(
    idrTokenAddress,
    accountRegistryAddress,
    2, // approvalThreshold: 2 of 3
    3600 // timeoutSeconds: 1 hour
  );
  await interbankSettlement.waitForDeployment();
  const interbankSettlementAddress = await interbankSettlement.getAddress();
  console.log("InterbankSettlement deployed to:", interbankSettlementAddress);

  // 4. Deploy ProductCatalog
  console.log("Deploying ProductCatalog...");
  const ProductCatalog = await hre.ethers.getContractFactory("ProductCatalog");
  const productCatalog = await ProductCatalog.deploy();
  await productCatalog.waitForDeployment();
  const productCatalogAddress = await productCatalog.getAddress();
  console.log("ProductCatalog deployed to:", productCatalogAddress);

  // 5. Deploy PurchaseProcessor
  console.log("Deploying PurchaseProcessor...");
  const PurchaseProcessor = await hre.ethers.getContractFactory("PurchaseProcessor");
  const purchaseProcessor = await PurchaseProcessor.deploy(
    idrTokenAddress,
    accountRegistryAddress,
    productCatalogAddress,
    3600 // timeoutSeconds: 1 hour
  );
  await purchaseProcessor.waitForDeployment();
  const purchaseProcessorAddress = await purchaseProcessor.getAddress();
  console.log("PurchaseProcessor deployed to:", purchaseProcessorAddress);

  // 6. Setup roles
  console.log("\nSetting up roles...");
  
  // Grant BANK_ROLE to banks
  await idrToken.grantRole(await idrToken.BANK_ROLE(), bankA.address);
  await idrToken.grantRole(await idrToken.BANK_ROLE(), bankB.address);
  await accountRegistry.grantRole(await accountRegistry.BANK_ROLE(), bankA.address);
  await accountRegistry.grantRole(await accountRegistry.BANK_ROLE(), bankB.address);
  await interbankSettlement.grantRole(await interbankSettlement.BANK_ROLE(), bankA.address);
  await interbankSettlement.grantRole(await interbankSettlement.BANK_ROLE(), bankB.address);
  await productCatalog.grantRole(await productCatalog.BANK_ROLE(), bankA.address);
  await productCatalog.grantRole(await productCatalog.BANK_ROLE(), bankB.address);
  console.log("BANK_ROLE granted to BankA and BankB");

  // Grant VALIDATOR_ROLE
  await interbankSettlement.grantRole(await interbankSettlement.VALIDATOR_ROLE(), validator1.address);
  await interbankSettlement.grantRole(await interbankSettlement.VALIDATOR_ROLE(), validator2.address);
  console.log("VALIDATOR_ROLE granted to Validator1 and Validator2");

  // Grant PROVIDER_ROLE
  await productCatalog.grantRole(await productCatalog.PROVIDER_ROLE(), provider.address);
  await purchaseProcessor.grantRole(await purchaseProcessor.PROVIDER_ROLE(), provider.address);
  console.log("PROVIDER_ROLE granted to Provider");

  // Grant GOVERNANCE_ROLE
  await interbankSettlement.grantRole(await interbankSettlement.GOVERNANCE_ROLE(), regulator.address);
  console.log("GOVERNANCE_ROLE granted to Regulator");

  // Save deployment info
  const deploymentInfo = {
    contracts: {
      IDRToken: idrTokenAddress,
      AccountRegistry: accountRegistryAddress,
      InterbankSettlement: interbankSettlementAddress,
      ProductCatalog: productCatalogAddress,
      PurchaseProcessor: purchaseProcessorAddress
    },
    accounts: {
      deployer: deployer.address,
      bankA: bankA.address,
      bankB: bankB.address,
      regulator: regulator.address,
      validator1: validator1.address,
      validator2: validator2.address,
      provider: provider.address,
      user1: user1.address,
      user2: user2.address
    },
    network: "localhost"
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Export for seed script
  console.log("\n=== Export for seed script ===");
  console.log("Copy the addresses above to seed.js");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

