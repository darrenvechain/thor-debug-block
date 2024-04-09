import { HttpClient, ThorClient } from "@vechain/sdk-network";
import { HDNode } from "@vechain/sdk-core";
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

    const revision = contract.deployTransactionReceipt?.meta.blockID;

    console.log(`Contract deployed @ block ${contract.deployTransactionReceipt?.meta.blockNumber}`)

    const estimation = await axios.post(`${baseUrl}/accounts/*?revision=${revision}`, {
        clauses: [{
            to: contract.address,
            data: contractInterface.encodeFunctionData("emitBlock"),
            value: "0x0",
        }]
    })

    const emittedBlock = estimation.data[0].events[0].data;
    console.log(`Estimated block: ${BigInt(emittedBlock).toString()}`);

    const { wait } = await contract.transact.emitBlock();
    const receipt = await wait();
    const txBlock = receipt?.outputs[0].events[0].data;
    console.log(`TX block: ${BigInt(txBlock as string).toString()}`);
}

start();