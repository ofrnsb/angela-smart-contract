// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BankingCore {
    struct Bank {
        bytes32 code;
        string name;
        bool active;
    }

    struct Provider {
        bytes32 id;
        string name;
        bytes32 settlementBank;
        address settlementAccount;
        bool active;
    }

    address public owner;
    uint16 public interbankFeeBps;
    uint256 public feeReserve;

    mapping(bytes32 => Bank) public banks;
    mapping(bytes32 => bool) public bankExists;

    mapping(bytes32 => Provider) public providers;
    mapping(bytes32 => bool) public providerExists;

    mapping(bytes32 => mapping(address => uint256)) private balances;
    mapping(bytes32 => mapping(address => bool)) private hasAccount;

    bool private locked;

    event BankRegistered(bytes32 code, string name);
    event BankStatusChanged(bytes32 code, bool active);
    event ProviderRegistered(bytes32 id, string name, bytes32 bank, address account);
    event ProviderStatusChanged(bytes32 id, bool active);
    event AccountOpened(bytes32 bank, address owner);
    event Deposit(bytes32 bank, address owner, uint256 amount);
    event Withdraw(bytes32 bank, address owner, uint256 amount);
    event TransferIntra(bytes32 bank, address from, address to, uint256 amount);
    event TransferInter(bytes32 fromBank, bytes32 toBank, address from, address to, uint256 amount, uint256 fee);
    event ProductPurchased(bytes32 providerId, bytes32 bank, address buyer, string metadata, uint256 amount);
    event FeeWithdrawn(address to, uint256 amount);
    event InterbankFeeBpsChanged(uint16 bps);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "reentrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerBank(bytes32 code, string calldata name) external onlyOwner {
        require(code != bytes32(0), "code");
        require(!bankExists[code], "exists");
        banks[code] = Bank({code: code, name: name, active: true});
        bankExists[code] = true;
        emit BankRegistered(code, name);
    }

    function setBankActive(bytes32 code, bool active) external onlyOwner {
        require(bankExists[code], "no bank");
        banks[code].active = active;
        emit BankStatusChanged(code, active);
    }

    function registerProvider(
        bytes32 id,
        string calldata name,
        bytes32 settlementBank,
        address settlementAccount
    ) external onlyOwner {
        require(id != bytes32(0), "id");
        require(!providerExists[id], "exists");
        require(bankExists[settlementBank] && banks[settlementBank].active, "no bank");
        providers[id] = Provider({id: id, name: name, settlementBank: settlementBank, settlementAccount: settlementAccount, active: true});
        providerExists[id] = true;
        emit ProviderRegistered(id, name, settlementBank, settlementAccount);
    }

    function setProviderActive(bytes32 id, bool active) external onlyOwner {
        require(providerExists[id], "no provider");
        providers[id].active = active;
        emit ProviderStatusChanged(id, active);
    }

    function setInterbankFeeBps(uint16 bps) external onlyOwner {
        require(bps <= 2000, "too high");
        interbankFeeBps = bps;
        emit InterbankFeeBpsChanged(bps);
    }

    function openAccount(bytes32 bankCode) external {
        require(bankExists[bankCode] && banks[bankCode].active, "no bank");
        require(!hasAccount[bankCode][msg.sender], "exists");
        hasAccount[bankCode][msg.sender] = true;
        emit AccountOpened(bankCode, msg.sender);
    }

    function deposit(bytes32 bankCode) external payable {
        require(hasAccount[bankCode][msg.sender], "no acct");
        require(msg.value > 0, "amount");
        balances[bankCode][msg.sender] += msg.value;
        emit Deposit(bankCode, msg.sender, msg.value);
    }

    function withdraw(bytes32 bankCode, uint256 amount) external nonReentrant {
        require(hasAccount[bankCode][msg.sender], "no acct");
        require(amount > 0, "amount");
        uint256 bal = balances[bankCode][msg.sender];
        require(bal >= amount, "balance");
        balances[bankCode][msg.sender] = bal - amount;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "withdraw fail");
        emit Withdraw(bankCode, msg.sender, amount);
    }

    function transferIntra(bytes32 bankCode, address to, uint256 amount) external {
        require(hasAccount[bankCode][msg.sender], "no acct");
        require(hasAccount[bankCode][to], "to no acct");
        require(amount > 0, "amount");
        uint256 bal = balances[bankCode][msg.sender];
        require(bal >= amount, "balance");
        unchecked {
            balances[bankCode][msg.sender] = bal - amount;
        }
        balances[bankCode][to] += amount;
        emit TransferIntra(bankCode, msg.sender, to, amount);
    }

    function transferInter(
        bytes32 fromBank,
        bytes32 toBank,
        address to,
        uint256 amount
    ) external {
        require(hasAccount[fromBank][msg.sender], "no acct");
        require(bankExists[toBank] && banks[toBank].active, "to bank");
        require(hasAccount[toBank][to], "to no acct");
        require(amount > 0, "amount");
        uint256 fee = (amount * interbankFeeBps) / 10000;
        uint256 total = amount + fee;
        uint256 bal = balances[fromBank][msg.sender];
        require(bal >= total, "balance");
        unchecked {
            balances[fromBank][msg.sender] = bal - total;
        }
        balances[toBank][to] += amount;
        feeReserve += fee;
        emit TransferInter(fromBank, toBank, msg.sender, to, amount, fee);
    }

    function purchaseProduct(
        bytes32 bankCode,
        bytes32 providerId,
        string calldata metadata,
        uint256 amount
    ) external {
        require(hasAccount[bankCode][msg.sender], "no acct");
        require(providerExists[providerId], "no provider");
        Provider memory p = providers[providerId];
        require(p.active, "provider off");
        require(hasAccount[p.settlementBank][p.settlementAccount], "prov acct");
        require(amount > 0, "amount");
        uint256 bal = balances[bankCode][msg.sender];
        require(bal >= amount, "balance");
        unchecked { balances[bankCode][msg.sender] = bal - amount; }
        balances[p.settlementBank][p.settlementAccount] += amount;
        emit ProductPurchased(providerId, bankCode, msg.sender, metadata, amount);
    }

    function getBalance(bytes32 bankCode, address user) external view returns (uint256) {
        return balances[bankCode][user];
    }

    function getMyBalance(bytes32 bankCode) external view returns (uint256) {
        return balances[bankCode][msg.sender];
    }

    function hasBankAccount(bytes32 bankCode, address user) external view returns (bool) {
        return hasAccount[bankCode][user];
    }

    function withdrawFees(address to, uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0 && amount <= feeReserve, "amount");
        feeReserve -= amount;
        (bool ok, ) = payable(to).call{value: amount}("");
        require(ok, "fee withdraw fail");
        emit FeeWithdrawn(to, amount);
    }
}
