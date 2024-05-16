/**
 * A hardhat script to deploy a contract to a local geth node
 */

import hre from "hardhat";

const provider = hre.ethers.provider;

const deploy = async () => {
    const DebugBlockFactory = await hre.ethers.getContractFactory("DebugBlock")

    const contract = await DebugBlockFactory.deploy();
    const deployment = await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log(`Contract deployed to: ${address}`);

    const tx1 = await contract.setNextBlock().then(tx => tx.wait())
    console.log(`TX1 block: ${tx1?.blockNumber}, Gas used: ${tx1?.gasUsed}`);

    const estimated2 = await provider.estimateGas({
        to: address,
        data: contract.interface.encodeFunctionData("setNextBlock")
    })
    console.log(`Estimate (2) gas: ${estimated2.toString()}`);

    const tx2 = await contract.setNextBlock({
        gasLimit: estimated2 + 100n
    }).then(tx => tx.wait())

    console.log(`TX2 block: ${tx2?.blockNumber}, Gas used: ${tx2?.gasUsed}`);
}

deploy()