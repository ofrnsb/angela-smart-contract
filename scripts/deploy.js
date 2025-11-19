const { ethers } = require("hardhat");

async function main() {
  const [deployer, user1, user2, providerTreasury] = await ethers.getSigners();

  const Core = await ethers.getContractFactory("BankingCore");
  const core = await Core.deploy();
  await core.waitForDeployment();
  const addr = await core.getAddress();
  console.log("BankingCore deployed:", addr);

  const code = (s) => ethers.encodeBytes32String(s);
  await (await core.registerBank(code("BCA"), "Bank Central Asia")).wait();
  await (await core.registerBank(code("BRI"), "Bank Rakyat Indonesia")).wait();
  await (await core.registerBank(code("BNI"), "Bank Negara Indonesia")).wait();

  await (await core.setInterbankFeeBps(50)).wait();

  await (await core.registerProvider(code("PLN"), "Token Listrik", code("BCA"), providerTreasury.address)).wait();

  await (await core.connect(deployer).openAccount(code("BCA"))).wait();
  await (await core.connect(user1).openAccount(code("BCA"))).wait();
  await (await core.connect(user2).openAccount(code("BRI"))).wait();
  await (await core.connect(providerTreasury).openAccount(code("BCA"))).wait();

  await (await core.connect(deployer).deposit(code("BCA"), { value: ethers.parseEther("5") })).wait();
  await (await core.connect(user1).deposit(code("BCA"), { value: ethers.parseEther("3") })).wait();
  await (await core.connect(user2).deposit(code("BRI"), { value: ethers.parseEther("2") })).wait();

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
