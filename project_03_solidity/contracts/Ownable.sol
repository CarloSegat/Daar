pragma solidity >=0.4.22 <0.9.0;

contract Ownable {
  fallback() external payable {}
  receive() external payable {
        // custom function code
    }

  address public owner = msg.sender;

  modifier restricted() {
    require(msg.sender == owner, "Function restricted to contractss owner");
    _;
  }
}
