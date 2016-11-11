module.exports = function(deployer) {
  deployer.deploy(Mortal);
  deployer.deploy(Bet);
  deployer.deploy(OraclizeBet);
};
