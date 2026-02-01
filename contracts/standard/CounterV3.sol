// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./CounterV2.sol";

contract CounterV3 is CounterV2 {
  // 新的事件
  event Cubic(uint result);

  // 立方函数
  function cubic() public {
    x = x * x * x;
    emit Cubic(x);
  }

  function version() public pure virtual override returns (string memory) {
    return "3.0.0";
  }
}
