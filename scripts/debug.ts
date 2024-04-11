import { HttpClient, ThorClient } from "@vechain/sdk-network";
import { HDNode, Transaction } from "@vechain/sdk-core";
import { DebugBlock__factory as ContractFactory } from "../typechain-types";
import axios from "axios";

const hdNode = HDNode.fromMnemonic("denial kitchen pet squirrel other broom bar gas better priority spoil cross".split(" "));
const privateKey = hdNode.derive(0).privateKey?.toString("hex") as string;
const contractInterface = ContractFactory.createInterface();
const baseUrl = "http://127.0.0.1:8669";

const thorClient = new ThorClient(new HttpClient(baseUrl));

const deploy = async () => {
    const factory = thorClient.contracts.createContractFactory(ContractFactory.abi, ContractFactory.bytecode, privateKey);

    await factory.startDeployment();

    return factory.waitForDeployment();
}

const start = async () => {
    // Test does the following
    // Deploy contract
    // tx1 - setNextBlock
    // estimate tx2 - setNextBlock @ revision tx1.receipt.blocknumber
    // issue tx2 - check for reverts

    const contract = await deploy();

    const tx1 = await contract.transact.setNextBlock();
    const receipt1 = await tx1.wait();
    console.log(`TX1 receipt Info - block: ${receipt1?.meta.blockNumber}, Gas used: ${receipt1?.gasUsed}`);
//    console.log(`TX1 contract Info - nextBlock: ${BigInt(receipt1?.outputs[0].events[0].data).toString()}, Estimated Gas: ${estimatedGas.totalGas}`);


    const clauses = [{
        to: contract.address,
        data: contractInterface.encodeFunctionData("setNextBlock"),
        value: "0x0",
    }]

    const simulated = await thorClient.transactions.simulateTransaction(
        clauses, { revision: receipt1?.meta.blockID }
    )
    const estimatedGas = await thorClient.gas.estimateGas(clauses);

    // @ts-ignore
    console.log(`TX2 Estimated block: ${BigInt(simulated[0].events[0].data).toString()}, Estimated Gas: ${estimatedGas.totalGas}`);

    const { wait } = await contract.transact.setNextBlock();
    const receiptTx2 = await wait();

    console.log(receiptTx2?.reverted ? "TX2 Issued and REVERTED ❌" : "TX2 Issued and Success ✅");
    console.log(`TX2 receipt Info - block: ${receiptTx2?.meta.blockNumber}, Gas used: ${receiptTx2?.gasUsed}`);

    const simulated2 = await thorClient.transactions.simulateTransaction(
        clauses, { revision: receiptTx2?.meta.blockID }
    )
    const estimatedGas2 = await thorClient.gas.estimateGas(clauses);
    // @ts-ignore
    console.log(`TX2 RE-Estimated block: ${BigInt(simulated2[0].events[0].data).toString()}, Estimated Gas: ${estimatedGas2.totalGas}`);
}

start();