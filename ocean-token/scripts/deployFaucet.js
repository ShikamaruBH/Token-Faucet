const { ethers } = require("hardhat");

function wei(n) {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const Faucet = await ethers.getContractFactory('Faucet')
  const Token = await ethers.getContractFactory('Token')
  const accounts = await ethers.getSigners()

  const deployer = accounts[0]
  console.log('Deployer:', deployer.address)

  quyToken = await Token.deploy('Quy Token', 'QUY', 1000000)
  sbhToken = await Token.deploy('SBH Token', 'SBH', 1000000)
  wibuToken = await Token.deploy('Wibu Token', 'WIBU', 1000000)
  await quyToken.deployed()
  await sbhToken.deployed()
  await wibuToken.deployed()
  console.log('QUY token:', quyToken.address)
  console.log('SBH token:', sbhToken.address)
  console.log('WIBU token:', wibuToken.address)

  faucet = await Faucet.deploy(quyToken.address, sbhToken.address, wibuToken.address)
  await faucet.deployed()
  console.log("Faucet: ", faucet.address);

  amount = wei(2000)
  transaction = await quyToken.transfer(faucet.address, amount)
  await transaction.wait()

  transaction = await sbhToken.transfer(faucet.address, amount)
  await transaction.wait()

  transaction = await wibuToken.transfer(faucet.address, amount)
  await transaction.wait()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
