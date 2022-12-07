// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

interface IERC721ReceiverTest {
     //  0x150b7a02
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);

    //  0xf0b9e5ba
    function onERC721Received(address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}


contract MockERC721 is ERC721Enumerable {
    constructor() ERC721('Mock Asset', 'MOCK_NFT') {}

    function mint(address account, uint256 tokenId) public {
        _mint(account, tokenId);
    }

    bytes4 private _testNewSignature;
    bytes4 private _testOldSignature;

    //  0x150b7a02
    function testOnERC721ReceivedNew(address proxy) external {
        IERC721ReceiverTest p = IERC721ReceiverTest(proxy);

        address operator = 0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f;
        address from = 0x94f557dDdb245b11d031F57BA7F2C4f28C4A203e;
        uint256 tokenId = 123;
        bytes memory data = '0x';

        _testNewSignature = p.onERC721Received(operator, from, tokenId, data);
    }

    //  0xf0b9e5ba
    function testOnERC721ReceivedOld(address proxy) external {
        IERC721ReceiverTest p = IERC721ReceiverTest(proxy);

        address from = 0x94f557dDdb245b11d031F57BA7F2C4f28C4A203e;
        uint256 tokenId = 123;
        bytes memory  data = '0x';

        _testOldSignature = p.onERC721Received(from, tokenId, data);
    }

    function getNewTestResults() external view returns (bytes4) {
        return _testNewSignature;
    }

    function getOldTestResults() external view returns (bytes4) {
        return _testOldSignature;
    }


}
