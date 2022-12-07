// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';


contract MockERC1155 is ERC1155 {
    constructor() ERC1155('Mock URI') {}

}
