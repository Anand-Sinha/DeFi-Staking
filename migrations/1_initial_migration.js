const Migrations = artifacts.require('./src/contracts/Migrations');

module.exports = function (deployer){
    deployer.deploy(Migrations);
};
