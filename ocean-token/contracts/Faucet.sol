// contracts/Faucet.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Faucet {
    address payable public owner;
    IERC20 public quyToken;
    IERC20 public sbhToken;
    IERC20 public wibuToken;

    uint256 public withdrawalAmount = 1000 * (10**18);
    uint256 public lockTime = 30 seconds;

    event Withdrawal(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    mapping(address => uint256) nextAccessTime;

    constructor(address quyTokenAddress, address sbhTokenAddress, address wibuTokenAddress) payable {
        quyToken = IERC20(quyTokenAddress);
        sbhToken = IERC20(sbhTokenAddress);
        wibuToken = IERC20(wibuTokenAddress);
        owner = payable(msg.sender);
    }

    function requestTokens() public {
        require(
            msg.sender != address(0),
            "Request must not originate from a zero account"
        );
        require(
            quyToken.balanceOf(address(this)) >= withdrawalAmount,
            "Insufficient balance of token in faucet for withdrawal request"
        );
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Insufficient time elapsed since last withdrawal - try again later."
        );

        nextAccessTime[msg.sender] = block.timestamp + lockTime;

        quyToken.transfer(msg.sender, withdrawalAmount);
        sbhToken.transfer(msg.sender, withdrawalAmount);
        wibuToken.transfer(msg.sender, withdrawalAmount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return quyToken.balanceOf(address(this));
    }

    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawalAmount = amount * (10**18);
    }

    function setLockTime(uint256 amount) public onlyOwner {
        lockTime = amount * 1 minutes;
    }

    function withdraw() external onlyOwner {
        emit Withdrawal(msg.sender, quyToken.balanceOf(address(this)));
        quyToken.transfer(msg.sender, quyToken.balanceOf(address(this)));
        sbhToken.transfer(msg.sender, sbhToken.balanceOf(address(this)));
        wibuToken.transfer(msg.sender, wibuToken.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}
