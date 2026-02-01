// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
// Compatible with OpenZeppelin Contracts ^5.5.0
// import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact mouhin1123@gmail.com
contract NMCToken is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
  // 下一个tokenId
  uint256 private _nextTokenId;

  bool private _initialized = false;

  /// @dev 构造函数，初始化合约的名称和符号，以及合约的所有者
  constructor() ERC721("NMCToken", "NMC") Ownable(msg.sender) {
    _initialized = true;
  }

  // 代理初始化函数
  function initialize(address initialOwner) public {
    require(!_initialized, "Already initialized");
    _transferOwnership(initialOwner);
    _initialized = true;
  }

  /// @dev 铸造一个新的NFT，只能由合约所有者调用
  /// @param to 接收NFT的地址
  /// @param uri NFT的URI，用于存储NFT的元数据
  /// @return tokenId 新铸造的NFT的tokenId
  function safeMint(address to, string memory uri) public onlyOwner returns (uint256) {
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    return tokenId;
  }

  // The following functions are overrides required by Solidity.

  /// @dev 更新NFT的所有者，只能由合约所有者或当前所有者调用
  /// @param to 新的所有者地址
  /// @param tokenId NFT的tokenId
  /// @param auth 调用者地址，必须是合约所有者或当前所有者
  /// @return owner 新的所有者地址
  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal override(ERC721, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, value);
  }

  /// @dev tokenURI返回NFT的URI
  /// @param tokenId NFT的tokenId
  /// @return uri NFT的URI
  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  /// @dev supportsInterface返回合约是否支持指定的接口
  /// @param interfaceId 接口ID
  /// @return 是否支持该接口
  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /// @dev getNextTokenId返回下一个tokenId
  /// @return nextTokenId 下一个tokenId
  function getNextTokenId() public view returns (uint256) {
    return _nextTokenId;
  }
}
