import { HardhatUserConfig } from "hardhat/config";
import { VECHAIN_URL_SOLO } from "@vechain/hardhat-vechain";
import "@nomicfoundation/hardhat-toolbox";

// @ts-ignore
const config: HardhatUserConfig = {
    defaultNetwork: "vechain_solo",
    networks: {
        hardhat: {
            chainId: 1337,
        },
        vechain_solo: {
            url: VECHAIN_URL_SOLO,
            accounts: {
                mnemonic: "denial kitchen pet squirrel other broom bar gas better priority spoil cross",
                count: 10,
            },
            // @ts-ignore
            restful: true,
            gas: 10000000,
        },
    },
  solidity: {
    compilers: [
        {
            version: '0.8.20',
            settings: {
                evmVersion: 'paris',
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
            },
        },
    ],
  },
};

export default config;
