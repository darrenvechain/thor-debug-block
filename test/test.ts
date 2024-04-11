import { ethers } from "hardhat"

describe.only("PEDRO_TEST", function () {
    const deploy = async () => {
        // Deploy PEDRO_TEST.sol
        const DebugBlockContract = await ethers.getContractFactory("DebugBlock")
        const deployedDebugBlockContract = await DebugBlockContract.deploy()
        const deployContractReceipt =  await deployedDebugBlockContract.waitForDeployment()
        console.log("pedro test contract", await deployedDebugBlockContract.getAddress());

        return { DebugBlockContract, deployedDebugBlockContract }
    }

    describe("PEDRO_TEST", function () {
        it.only("running pedro test", async function () {
            const { DebugBlockContract,
                deployedDebugBlockContract
            } = await deploy()

            const tx1 = await deployedDebugBlockContract.setNextBlock()
            console.log("Issued Tx1 ")
            const receiptTx1 = await tx1.wait()
            console.log(`Receipt Tx1 
            - status: ${receiptTx1?.status} 
            - blockNo: ${receiptTx1?.blockNumber} 
            - gasUsed: ${receiptTx1?.gasUsed}`

            )

            // there is a connex cache here
            // todo use the direct API to estimate Gas
            //
            // const estimateTx2 = await deployedDebugBlockContract.setNextBlock.estimateGas()
            // console.log("Estimated gas for Tx2: ", estimateTx2)

            const tx2 = await deployedDebugBlockContract.setNextBlock()
            console.log(`Issued Tx2 - providedGas: ${tx2.gasLimit}`)
            const receiptTx2 = await tx2.wait()
            console.log(`Receipt Tx2 
            - status: ${receiptTx2?.status} 
            - blockNo: ${receiptTx2?.blockNumber} 
            - gasUsed: ${receiptTx2?.gasUsed}`

            )

        }).timeout(10000000000000)
    })
})
