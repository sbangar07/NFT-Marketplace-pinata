const Migrations = artifacts.require("Migrations");


 module.exports = async function (deployer, network, accounts) {
   const deployerAddress = accounts[0];
   await deployer.deploy(Migrations, deployerAddress);
 };
