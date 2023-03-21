require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path : ".env"});

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const RINKBY_PRIVATE_KEY = process.env.RINKBY_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby:{
      url : ALCHEMY_API_KEY_URL,
      accounts : [RINKBY_PRIVATE_KEY]
    },
  },
}
