const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('DroppableProxy', function () {
    async function deployFixture() {
        const [sender, receiverA, receiverB, receiverC] = await ethers.getSigners()
        const TokenMover = await ethers.getContractFactory('TokenMover')
        const tokenMover = await TokenMover.deploy()
        const MockERC721 = await ethers.getContractFactory('MockERC721')
        const nft = await MockERC721.deploy()
        const MockERC20 = await ethers.getContractFactory('MockERC20')
        const token = await MockERC20.deploy()
        return { sender, receiverA, receiverB, receiverC, tokenMover, nft, token }
    }

    describe('Deployment', function () {
        it('Has code (is not EOA)', async function() {
            const { tokenMover } = await loadFixture(deployFixture)
            expect(await tokenMover.provider.getCode(tokenMover.address)).to.not.equal('0x')
        })
    })

    describe('ERC20', function () {
        it('Sends tokens to multiple people', async function () {
            const { sender, receiverA, receiverB, receiverC, tokenMover, nft, token } = await loadFixture(deployFixture)

            await expect(token.mint(sender.address, 12345))
                .to.emit(token, 'Transfer')
                .withArgs(ethers.constants.AddressZero, sender.address, 12345)

            expect(await token.balanceOf(sender.address)).to.equal(12345)
            expect(await token.balanceOf(tokenMover.address)).to.equal(0)
            expect(await token.balanceOf(receiverA.address)).to.equal(0)
            expect(await token.balanceOf(receiverB.address)).to.equal(0)
            expect(await token.balanceOf(receiverC.address)).to.equal(0)

            await expect(token.connect(sender).approve(tokenMover.address, 12345))
            .to.emit(token, 'Approval')
            .withArgs(sender.address, tokenMover.address, 12345)

            expect(await token.allowance(sender.address, tokenMover.address)).to.equal(12345)

            await expect(tokenMover.connect(sender).transferMultipleERC20s(
                token.address,
                [1, 2, 3],
                [receiverA.address, receiverB.address, receiverC.address]
            )).to.emit(token, 'Transfer').withArgs(sender.address, receiverA.address, 1)
            .to.emit(token, 'Transfer').withArgs(sender.address, receiverB.address, 2)
            .to.emit(token, 'Transfer').withArgs(sender.address, receiverC.address, 3)

            expect(await token.balanceOf(sender.address)).to.equal(12339)
            expect(await token.balanceOf(tokenMover.address)).to.equal(0)
            expect(await token.balanceOf(receiverA.address)).to.equal(1)
            expect(await token.balanceOf(receiverB.address)).to.equal(2)
            expect(await token.balanceOf(receiverC.address)).to.equal(3)
        })
    })

    describe('ERC721', function() {
        it('Sends tokens to multiple addresses', async function () {
            const { sender, receiverA, receiverB, receiverC, tokenMover, nft, token } = await loadFixture(deployFixture)

            await expect(nft.mint(sender.address, 6))
            .to.emit(nft, 'Transfer')
            .withArgs(ethers.constants.AddressZero, sender.address, 6)

            await expect(nft.mint(sender.address, 7))
            .to.emit(nft, 'Transfer')
            .withArgs(ethers.constants.AddressZero, sender.address, 7)

            await expect(nft.mint(sender.address, 8))
            .to.emit(nft, 'Transfer')
            .withArgs(ethers.constants.AddressZero, sender.address, 8)

            await expect(nft.mint(sender.address, 9))
            .to.emit(nft, 'Transfer')
            .withArgs(ethers.constants.AddressZero, sender.address, 9)

            expect(await nft.balanceOf(sender.address)).to.equal(4)
            expect(await nft.ownerOf(6)).to.equal(sender.address)
            expect(await nft.ownerOf(7)).to.equal(sender.address)
            expect(await nft.ownerOf(8)).to.equal(sender.address)
            expect(await nft.ownerOf(9)).to.equal(sender.address)

            await expect(nft.connect(sender).setApprovalForAll(tokenMover.address, true))
            .to.emit(nft, 'ApprovalForAll')
            .withArgs(sender.address, tokenMover.address, true)

            await expect(tokenMover.connect(sender).transferMultipleNFTs(
                nft.address,
                [6, 7, 8, 9],
                [receiverA.address, receiverA.address, receiverB.address, receiverC.address]
            )).to.emit(nft, 'Transfer').withArgs(sender.address, receiverA.address, 6)
            .to.emit(nft, 'Transfer').withArgs(sender.address, receiverA.address, 7)
            .to.emit(nft, 'Transfer').withArgs(sender.address, receiverB.address, 8)
            .to.emit(nft, 'Transfer').withArgs(sender.address, receiverC.address, 9)

            expect(await nft.balanceOf(sender.address)).to.equal(0)
            expect(await nft.ownerOf(6)).to.equal(receiverA.address)
            expect(await nft.ownerOf(7)).to.equal(receiverA.address)
            expect(await nft.ownerOf(8)).to.equal(receiverB.address)
            expect(await nft.ownerOf(9)).to.equal(receiverC.address)
        })

        it('Sends multiple tokens to one address', async function () {
            const { sender, receiverA, receiverB, receiverC, tokenMover, nft, token } = await loadFixture(deployFixture)

            await expect(nft.mint(sender.address, 25))
            .to.emit(nft, 'Transfer')
            .withArgs(ethers.constants.AddressZero, sender.address, 25)

            await expect(nft.mint(sender.address, 26))
            .to.emit(nft, 'Transfer')
            .withArgs(ethers.constants.AddressZero, sender.address, 26)

            await expect(nft.mint(sender.address, 27))
            .to.emit(nft, 'Transfer')
            .withArgs(ethers.constants.AddressZero, sender.address, 27)

            await expect(nft.mint(sender.address, 28))
            .to.emit(nft, 'Transfer')
            .withArgs(ethers.constants.AddressZero, sender.address, 28)

            expect(await nft.balanceOf(sender.address)).to.equal(4)
            expect(await nft.ownerOf(25)).to.equal(sender.address)
            expect(await nft.ownerOf(26)).to.equal(sender.address)
            expect(await nft.ownerOf(27)).to.equal(sender.address)
            expect(await nft.ownerOf(28)).to.equal(sender.address)

            await expect(nft.connect(sender).approve(tokenMover.address, 25))
            .to.emit(nft, 'Approval')
            .withArgs(sender.address, tokenMover.address, 25)

            await expect(nft.connect(sender).approve(tokenMover.address, 26))
            .to.emit(nft, 'Approval')
            .withArgs(sender.address, tokenMover.address, 26)

            await expect(nft.connect(sender).approve(tokenMover.address, 27))
            .to.emit(nft, 'Approval')
            .withArgs(sender.address, tokenMover.address, 27)

            await expect(nft.connect(sender).approve(tokenMover.address, 28))
            .to.emit(nft, 'Approval')
            .withArgs(sender.address, tokenMover.address, 28)

            await expect(tokenMover.connect(sender).transferMultipleNFTsToSingleAddress(
                nft.address,
                [25, 26, 28],
                receiverB.address
            )).to.emit(nft, 'Transfer').withArgs(sender.address, receiverB.address, 25)
            .to.emit(nft, 'Transfer').withArgs(sender.address, receiverB.address, 26)
            .to.emit(nft, 'Transfer').withArgs(sender.address, receiverB.address, 28)

            expect(await nft.balanceOf(sender.address)).to.equal(1)
            expect(await nft.balanceOf(receiverB.address)).to.equal(3)
            expect(await nft.ownerOf(25)).to.equal(receiverB.address)
            expect(await nft.ownerOf(26)).to.equal(receiverB.address)
            expect(await nft.ownerOf(27)).to.equal(sender.address)
            expect(await nft.ownerOf(28)).to.equal(receiverB.address)
        })

    })

})
