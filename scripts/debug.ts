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
    const contract = await deploy();

    const tx1 = await contract.transact.setNextBlock();
    const receipt1 = await tx1.wait();
    console.log(`TX1 block: ${receipt1?.meta.blockNumber}, Gas used: ${receipt1?.gasUsed}`);
    
    const clauses = [{
        to: contract.address,
        data: contractInterface.encodeFunctionData("setNextBlock"),
        value: "0x0",
    }]

    const simulated = await thorClient.transactions.simulateTransaction(clauses, { revision: receipt1?.meta.blockID })
    const estimatedGas = await thorClient.gas.estimateGas(clauses);

    // @ts-ignore
    console.log(`Estimated block: ${BigInt(simulated[0].events[0].data).toString()}, Gas used: ${estimatedGas.totalGas}`);

    const { wait } = await contract.transact.setNextBlock();
    const receipt = await wait();

    console.log(receipt?.reverted ? "TX2 reverted" : "TX2 success");
    console.log(`TX2 block: ${receipt?.meta.blockNumber}, Gas used: ${receipt?.gasUsed}`);
}

start();