var Mortal = artifacts.require('./Mortal.sol');
var Bet = artifacts.require('./Bet.sol');
var usingOraclize = artifacts.require('./lib/usingOraclize.sol');
var OraclizeBet = artifacts.require('./OraclizeBet.sol');
var StringLib = artifacts.require('./lib/StringLib.sol');

module.exports = function(deployer) {
  deployer.deploy(Mortal);
  deployer.deploy(Bet);
  deployer.deploy(StringLib);
  deployer.deploy(OraclizeBet);
};
