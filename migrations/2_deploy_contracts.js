const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(NFTMarketplace);
};

// module.exports = async function (deployer, network, accounts) {
//   await deployer.deploy(NFTMarketplace1155);
// };
