const { expect } = require("chai")
const { ethers } = require("hardhat")
const { time } = require("@nomicfoundation/hardhat-network-helpers")

function wei(n) {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Exchange', () => {
    let faucet, deployer, user1
    beforeEach(async () => {
        const Faucet = await ethers.getContractFactory('Faucet')
        const Token = await ethers.getContractFactory('Token')
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        user1 = accounts[1]

        quyToken = await Token.deploy('Quy Token', 'QUY', 1000000)
        sbhToken = await Token.deploy('SBH Token', 'SBH', 1000000)
        wibuToken = await Token.deploy('Wibu Token', 'WIBU', 1000000)
        await quyToken.deployed()
        await sbhToken.deployed()
        await wibuToken.deployed()

        faucet = await Faucet.deploy(quyToken.address, sbhToken.address, wibuToken.address)
        await faucet.deployed()

        amount = wei(2000)
        transaction = await quyToken.transfer(faucet.address, amount)
        await transaction.wait()

        transaction = await sbhToken.transfer(faucet.address, amount)
        await transaction.wait()

        transaction = await wibuToken.transfer(faucet.address, amount)
        await transaction.wait()
    })     
    describe('Deployment', () => {
        it('should have an address', () => {
            expect(faucet.address).to.not.equal('0x0')
            expect(faucet.address).to.not.equal(0)
            expect(faucet.address).to.not.equal(undefined)
            expect(faucet.address).to.not.equal(null)
        })
        it('should have withdrawal amount', async () => {
            expect(await faucet.withdrawalAmount()).to.equal(wei(1000))
        })
        it('should have lock time', async () => {
            expect(await faucet.lockTime()).to.equal(30)
        })
        it('should have owner', async () => {
            expect(await faucet.owner()).to.equal(deployer.address)
        })
        it('should have balance', async () => {
            expect(await faucet.getBalance()).to.equal(amount)
        })
    })
    describe('Request Token', () => {
        beforeEach(async () => {
            await faucet.connect(user1).requestTokens()
        })
        it('should allow request token', async () => {
            let faucetBalance = wei(1000)
            let userBalance = wei(1000)
            expect(await faucet.getBalance()).to.equal(faucetBalance)
            expect(await quyToken.balanceOf(user1.address)).to.equal(userBalance)
            expect(await sbhToken.balanceOf(user1.address)).to.equal(userBalance)
            expect(await wibuToken.balanceOf(user1.address)).to.equal(userBalance)
        })
        it('should revert while user still in lock time', async () => {
            await expect(faucet.connect(user1).requestTokens()).to.be.reverted
        })
        it('should allow request token after lock time is over', async () => {
            let faucetBalance = wei(0)
            let userBalance = wei(2000)
            await time.increase(30)
            await faucet.connect(user1).requestTokens()
            expect(await faucet.getBalance()).to.equal(faucetBalance)
            expect(await quyToken.balanceOf(user1.address)).to.equal(userBalance)
            expect(await sbhToken.balanceOf(user1.address)).to.equal(userBalance)
            expect(await wibuToken.balanceOf(user1.address)).to.equal(userBalance)
        })
        it('should revert when balance not enough', async () => {
            await time.increase(30)
            await faucet.connect(user1).requestTokens()
            await time.increase(30)
            await expect(faucet.connect(user1).requestTokens()).to.be.reverted
        })
    })
})