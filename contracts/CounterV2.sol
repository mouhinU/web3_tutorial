// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CounterV2 {
  uint public x;

  string public name;

  event Increment(uint by);
  event Square(uint by);

  function inc() public {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }

  // 写一个x平方的function并赋值给x
  function square() public {
    x = x * x;
    emit Square(x);
  }

  function setName(string memory _name) public {
    name = _name;
  }

  function version() public pure returns (string memory) {
    return "2.0.0";
  }
}
