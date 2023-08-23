// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9; 

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ERC721Token is ERC721URIStorage, Ownable {
    
    using Counters for Counters.Counter;    //liabrary
    Counters.Counter private _tokenIds;


    constructor() ERC721("Mint NFT","NFT"){ }

    function mint(address recipient, string memory _tokenURI) public returns(uint){
        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(recipient, newItemId);  // attach to item id like recipient == image and newItemid == id like 1, 2
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

}