// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DebugBlock {
    event BlockEmitted(uint256 blockNumber);

    function emitBlock() external {
        emit BlockEmitted(block.number);
    }
}