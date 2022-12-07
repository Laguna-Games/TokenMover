// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract MockERC20 is ERC20 {
    constructor() ERC20('Mock Token', 'MOCK') {}

    // event Approval(address indexed owner, address indexed spender, uint256 value);

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

}
