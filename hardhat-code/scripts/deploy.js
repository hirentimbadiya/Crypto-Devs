const { ethers } = require("hardhat");

async function main() {
  // * get the contract from getContractFactory
  const whitelistContract = await ethers.getContactFactory("Whitelist");
  // * deploy the selected contract and 
  // * the value 20 is we needed in constructor of the contractor 
  // * so 20 will be passed to the constructor of the contract
  const deployedWhitelistContract = await whitelistContract.deploy(20);

  // * wait till the contract gets deployed.
  await deployedWhitelistContract.deployed();

  console.log("Whitelisted contract Address", deployedWhitelistContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });