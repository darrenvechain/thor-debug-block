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

    const tx1 = await contract.transact.setNextBlock();
    const receipt1 = await tx1.wait();
    console.log(`TX1 block: ${receipt1?.meta.blockNumber}, Gas used: ${receipt1?.gasUsed}`);

    const estimation = await axios.post(`${baseUrl}/accounts/*?revision=${receipt1?.meta.blockID}`, {
        clauses: [{
            to: contract.address,
            data: contractInterface.encodeFunctionData("setNextBlock"),
            value: "0x0",
        }]
    })

    const emittedBlock = estimation.data[0].events[0].data;
    console.log(`Estimated block: ${BigInt(emittedBlock).toString()}, Gas used: ${estimation.data[0].gasUsed}`);

    const { wait } = await contract.transact.setNextBlock();
    const receipt = await wait();

    console.log(`TX2 block: ${receipt?.meta.blockNumber}, Gas used: ${receipt?.gasUsed}`);
}

start();