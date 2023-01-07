const { ethers } = require("hardhat");

async function main() {
  const Faucet = await ethers.getContractFactory('Faucet')
  const accounts = await ethers.getSigners()
  const QUY_ADDRESS = '0x0B6E3d4Da627588a32D772BEF534079b30936707'
  const SBH_ADDRESS = '0x45595b491d0614746437A17061dc40DaE031aC6F'
  const WIBU_ADDRESS = '0x9D5da2DdAe51A5F4191FDbD85b943dA0Ecf2fAb1'

  const deployer = accounts[0]
  console.log('Deployer:', deployer.address)

  faucet = await Faucet.deploy(QUY_ADDRESS, SBH_ADDRESS, WIBU_ADDRESS)
  await faucet.deployed()
  console.log("Faucet: ", faucet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
