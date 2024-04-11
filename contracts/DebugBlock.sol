// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DebugBlock {
    event BlockEmitted(uint256 blockNumber);

    uint256 private nextBlock;

    function setNextBlock() public {
        if (nextBlock == block.number) {
            emit BlockEmitted(nextBlock);
        } else {
            // extra storage op here
            nextBlock = block.number;
            emit BlockEmitted(nextBlock);
        }
    }
}