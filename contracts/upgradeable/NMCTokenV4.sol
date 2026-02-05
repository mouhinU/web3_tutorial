// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./NMCTokenV3.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title NMCTokenV4
 * @dev V4版本升级为UUPS模式并添加新功能
 * @custom:security-contact mouhin1123@gmail.com
 */
contract NMCTokenV4 is NMCTokenV3, UUPSUpgradeable {
    // V4新增：UUPS升级授权
    bool private _v4Configured;

    // V4新增：高级游戏化功能
    mapping(uint256 => string) private _tokenAchievements; // 代币成就系统
    mapping(address => uint256) private _userAchievementCount;
    mapping(uint256 => uint256) private _tokenCreationTime; // 代币创建时间

    // V4新增事件
    event V4Configured(address indexed configurator, uint256 timestamp);
    event TokenAchievementUnlocked(uint256 indexed tokenId, string achievement);
    event UserAchievementMilestone(address indexed user, uint256 achievementCount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @dev V4初始化函数
    function initializeV4() public reinitializer(4) {
        require(_v4Configured, "V4 already configured");
        // 初始化UUPS
        __UUPSUpgradeable_init();
        s_lastTimeStamp = block.timestamp;
        _v4Configured = true;
        emit V4Configured(msg.sender, s_lastTimeStamp);
    }

    /// @dev UUPS升级授权 - 只有所有者可以升级合约
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /// @dev 获取V4配置状态
    function isV4Configured() public view returns (bool) {
        return _v4Configured;
    }

    /// @dev 为代币添加成就（仅所有者可以调用）
    function addTokenAchievement(uint256 tokenId, string memory achievement) public onlyOwner {
        require(_existsTokens[tokenId], "Token does not exist");
        require(bytes(achievement).length > 0, "Achievement cannot be empty");

        _tokenAchievements[tokenId] = achievement;
        address owner = ownerOf(tokenId);
        _userAchievementCount[owner]++;

        emit TokenAchievementUnlocked(tokenId, achievement);

        // 检查用户里程碑
        if (_userAchievementCount[owner] % 5 == 0) {
            emit UserAchievementMilestone(owner, _userAchievementCount[owner]);
        }
    }

    /// @dev 获取代币成就
    function getTokenAchievement(uint256 tokenId) public view returns (string memory) {
        require(_existsTokens[tokenId], "Token does not exist");
        return _tokenAchievements[tokenId];
    }

    /// @dev 获取用户成就数量
    function getUserAchievementCount(address user) public view returns (uint256) {
        return _userAchievementCount[user];
    }

    /// @dev 设置代币创建时间（用于年龄计算）
    function setTokenCreationTime(uint256 tokenId) internal {
        if (_tokenCreationTime[tokenId] == 0) {
            _tokenCreationTime[tokenId] = block.timestamp;
        }
    }

    /// @dev 获取代币年龄（以天为单位）
    function getTokenAge(uint256 tokenId) public view returns (uint256) {
        require(_existsTokens[tokenId], "Token does not exist");
        uint256 creationTime = _tokenCreationTime[tokenId];
        if (creationTime == 0) return 0;
        return (block.timestamp - creationTime) / 86400; // 86400秒 = 1天
    }

    /// @dev 获取代币年龄奖励（基于年龄的经验值奖励）
    function getTokenAgeBonus(uint256 tokenId) public view returns (uint256) {
        uint256 age = getTokenAge(tokenId);
        return age * 10; // 每天增加10点经验值奖励
    }

    /// @dev 重写addTokenExperience以包含年龄奖励（保持原有可见性）
    function addTokenExperience(uint256 tokenId, uint256 experience) public virtual override {
        require(_existsTokens[tokenId], "Token does not exist");
        require(experience > 0, "Experience must be positive");

        // 设置创建时间（如果尚未设置）
        setTokenCreationTime(tokenId);
        // 添加年龄奖励
        uint256 ageBonus = getTokenAgeBonus(tokenId);
        uint256 totalExperience = experience + ageBonus;

        _tokenExperience[tokenId] += totalExperience;
        address owner = ownerOf(tokenId);
        _userTotalExperience[owner] += totalExperience;

        // 检查升级
        uint8 currentLevel = _tokenLevels[tokenId];
        uint8 newLevel = uint8(_tokenExperience[tokenId] / 1000); // 每1000经验升一级

        if (newLevel > currentLevel) {
            _tokenLevels[tokenId] = newLevel;
            emit TokenLevelUp(tokenId, newLevel);
        }

        emit TokenExperienceGained(tokenId, totalExperience);
    }

    /// @dev 获取合约版本
    function getVersion() public pure returns (string memory) {
        return "V4 UUPS";
    }
}
