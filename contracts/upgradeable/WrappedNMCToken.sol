// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "./NMCToken.sol";

contract WrappedNMCToken is NMCToken {
    /// @notice Constructor for WrappedNMCToken
    /// @param name The name of the token
    /// @param symbol The symbol of the token
    /// @dev Constructor for WrappedNMCToken
    constructor(string memory name, string memory symbol) NMCToken(name, symbol) {}

    /// @notice Mint a new token with a specific tokenId
    /// @param to The address to mint the token to
    /// @param tokenId The tokenId to mint
    function mintTokenWithSpecificTokenId(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}
