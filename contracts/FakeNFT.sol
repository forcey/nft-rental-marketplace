// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract FakeNFT is ERC721Enumerable {
    constructor() ERC721("Chicken Katsu", "KASU") {
    }

    uint nextId = 1;
    function mint(uint number) public {
        for (uint i = 0; i < number; i++) {
            _safeMint(msg.sender, nextId++);
        }
    }
}
