import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
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
