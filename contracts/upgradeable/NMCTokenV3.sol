// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./NMCTokenV2.sol";

/**
 * @title NMCTokenV3
 * @dev V3版本在V2基础上添加了游戏化功能
 * @custom:security-contact mouhin1123@gmail.com
 */
contract NMCTokenV3 is NMCTokenV2 {
    // V3新增功能：时间戳功能
    uint256 private s_lastTimeStamp;
    bool private _v3Configured;

    // V3新增：代币等级系统
    mapping(uint256 => uint8) private _tokenLevels;
    mapping(uint256 => uint256) private _tokenExperience;

    // V3新增：用户统计
    mapping(address => uint256) private _userTotalExperience;
    mapping(address => uint8) private _userLevel;
    mapping(uint256 => bool) private _existsTokens;

    // V3新增事件
    event V3Configured(address indexed configurator, uint256 timestamp);
    event TokenLevelUp(uint256 indexed tokenId, uint8 newLevel);
    event TokenExperienceGained(uint256 indexed tokenId, uint256 experience);
    event UserLevelUp(address indexed user, uint8 newLevel);

    /// @dev V3初始化函数
    function initializeV3() public {
        require(!_v3Configured, "V3 already configured");
        s_lastTimeStamp = block.timestamp;
        _v3Configured = true;
        emit V3Configured(msg.sender, s_lastTimeStamp);
    }

    /// @dev 获取代币等级
    function getTokenLevel(uint256 tokenId) public view returns (uint8) {
        require(_existsTokens[tokenId], "Token does not exist");
        return _tokenLevels[tokenId];
    }

    /// @dev 获取代币经验值
    function getTokenExperience(uint256 tokenId) public view returns (uint256) {
        require(_existsTokens[tokenId], "Token does not exist");
        return _tokenExperience[tokenId];
    }

    /// @dev 为代币增加经验值
    function addTokenExperience(uint256 tokenId, uint256 experience) public {
        require(_existsTokens[tokenId], "Token does not exist");
        require(experience > 0, "Experience must be positive");

        _tokenExperience[tokenId] += experience;
        address owner = ownerOf(tokenId);
        _userTotalExperience[owner] += experience;

        // 检查升级
        uint8 currentLevel = _tokenLevels[tokenId];
        uint8 newLevel = uint8(_tokenExperience[tokenId] / 1000); // 每1000经验升一级

        if (newLevel > currentLevel) {
            _tokenLevels[tokenId] = newLevel;
            emit TokenLevelUp(tokenId, newLevel);
        }

        emit TokenExperienceGained(tokenId, experience);
    }

    /// @dev 获取用户总经验值
    function getUserTotalExperience(address user) public view returns (uint256) {
        return _userTotalExperience[user];
    }

    /// @dev 获取用户等级
    function getUserLevel(address user) public view returns (uint8) {
        return _userLevel[user];
    }

    /// @dev 获取V3配置状态
    function isV3Configured() public view returns (bool) {
        return _v3Configured;
    }

    /// @dev 获取最后时间戳
    function getLastTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }
}
