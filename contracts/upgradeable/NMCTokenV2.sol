// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// contracts/nft/upgradeable/NMCTokenV2.sol
/// @custom:security-contact mouhin1123@gmail.com
contract NMCTokenV2 is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721BurnableUpgradeable,
    OwnableUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 private _nextTokenId;
    bool private _initialized = false;

    bool private _v2Configured; // V2配置标记

    // 添加的新功能：V2 新增的状态变量
    string private baseURI;

    mapping(uint256 => string) private _tokenURIs;
    // V2 新增：最大供应量限制
    uint256 private maxSupply;
    // V2 新增：公开铸造开关
    bool private publicMintingEnabled;

    // V2 新增事件
    event BaseURIUpdated(string newBaseURI);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event PublicMintingToggled(bool enabled);
    event TokenMinted(address indexed to, uint256 indexed tokenId, string uri);
    event BatchMinted(address indexed to, uint256 count);
    event V2Configured(address indexed configurator, uint256 maxSupply);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // 禁用代理模式下的直接部署
    }

    // 代理初始化函数
    function initialize(address initialOwner) public {
        __ERC721_init("NMCToken", "NMC");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __Ownable_init(initialOwner);
        _initialized = true;
    }

    // V2配置函数 - 使用reinitializer
    // function initializeV2() public reinitializer(2) onlyOwner {
    function initializeV2() public {
        // require(_v2Configured, "V2 already configured");
        // 设置V2默认值
        baseURI = "";
        maxSupply = 10000;
        publicMintingEnabled = false;
        _v2Configured = true;
        emit V2Configured(msg.sender, maxSupply);
    }

    function transferOwnership(address newOwner) public override {
        _transferOwnership(newOwner);
    }

    /// @dev V2 新增：设置基础 URI
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /// @dev V2 新增：设置最大供应量
    function setMaxSupply(uint256 newMaxSupply) public onlyOwner {
        require(newMaxSupply >= _nextTokenId, "Max supply cannot be less than current supply");
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }

    /// @dev V2 新增：切换公开铸造状态
    function togglePublicMinting() public onlyOwner {
        publicMintingEnabled = !publicMintingEnabled;
        emit PublicMintingToggled(publicMintingEnabled);
    }

    /// @dev 铸造 NFT（V2 增强版）
    function safeMint(address to, string memory uri) public returns (uint256) {
        // V2 新增：检查是否允许铸造
        require(msg.sender == owner() || publicMintingEnabled, "Minting not allowed");
        require(_nextTokenId < maxSupply, "Max supply reached");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit TokenMinted(to, tokenId, uri);
        return tokenId;
    }

    /// @dev V2 新增：批量铸造
    function safeMintBatch(address to, string[] memory uris) public onlyOwner returns (uint256[] memory) {
        require(_nextTokenId + uris.length <= maxSupply, "Exceeds max supply");

        uint256[] memory tokenIds = new uint256[](uris.length);
        for (uint256 i = 0; i < uris.length; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uris[i]);
            tokenIds[i] = tokenId;
        }

        emit BatchMinted(to, uris.length);
        return tokenIds;
    }

    /// @dev 获取下一个 Token ID
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /// @dev V2 新增：获取总供应量
    function getTotalSupply() public view returns (uint256) {
        return maxSupply;
    }

    /// @dev V2 新增：重写 tokenURI 以支持基础 URI
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        string memory uri = super.tokenURI(tokenId);

        // 如果设置了基础 URI 且 tokenURI 是相对路径
        if (bytes(baseURI).length > 0 && bytes(uri).length > 0) {
            if (bytes(uri)[0] == "/") {
                return string(abi.encodePacked(baseURI, uri));
            }
        }

        return uri;
    }

    // 必须的重写函数
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
