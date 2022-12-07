// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

//  Deployed to Mumbai: 0x95c465b1a3242c8e336B0f1c9F827E145B17bf6C
//  Deployed to Polygon: 0x119E715fF87FeD19C0E883ab72C56f5A4f5C0288

contract TokenMover {

    //  Send multiple amounts of ERC20 from caller to multiple receivers.
    //
    //  REMINDER: The TokenMover needs `allowance` to send funds. Remember to
    //  call `approve` on the ERC20 contract first.
    //
    //  @param tokenAddress - The ERC20 token
    //  @param amounts - A list of token amounts to transfer
    //  @param receivers - A matching list of addresses to send the tokens to
    function transferMultipleERC20s(address tokenAddress, uint256[] memory amounts, address[] memory receivers) external {
        require(tokenAddress != address(0), "Invalid tokenAddress");
        require(amounts.length == receivers.length, "Number of amounts and receivers does not match");
        IERC20 token = IERC20(tokenAddress);
        uint len = amounts.length;
        for(uint i = 0; i < len; ++i) {
            token.transferFrom(msg.sender, receivers[i], amounts[i]);
        }
    }

    //  Send multiple NFTs from caller to multiple receiver addresses.
    //
    //  REMINDER: The TokenMover needs `allowance` to send NFTs. Remember to
    //  call `approve` or `setApprovalForAll` on the NFT contract first.
    //
    //  @param nftAddress - The NFT token
    //  @param tokenIds - A list of tokens to transfer
    //  @param receivers - A matching list of addresses to send the NFTs to
    function transferMultipleNFTs(address nftAddress, uint256[] memory tokenIds, address[] memory receivers) external {
        require(nftAddress != address(0), "Invalid nftAddress");
        require(tokenIds.length == receivers.length, "Number of tokenIds and receivers does not match");
        IERC721 token = IERC721(nftAddress);
        uint len = tokenIds.length;
        for(uint i = 0; i < len; ++i) {
            token.safeTransferFrom(msg.sender, receivers[i], tokenIds[i]);
        }
    }

    //  Send multiple NFTs from caller to one target receiver address
    //
    //  REMINDER: The TokenMover needs `allowance` to send NFTs. Remember to
    //  call `approve` or `setApprovalForAll` on the NFT contract first.
    //
    //  @param nftAddress - The NFT token
    //  @param tokenIds - A list of tokens to transfer
    //  @param receiver - The address to send the NFTs to
    function transferMultipleNFTsToSingleAddress(address nftAddress, uint256[] memory tokenIds, address receiver) external {
        require(nftAddress != address(0), "Invalid nftAddress");
        IERC721 token = IERC721(nftAddress);
        uint len = tokenIds.length;
        for(uint i = 0; i < len; ++i) {
            token.safeTransferFrom(msg.sender, receiver, tokenIds[i]);
        }
    }


    //  TODO - support for ERC-1155
}
