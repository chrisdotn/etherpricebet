module.exports = function(deployer) {
  deployer.deploy(Mortal);
  deployer.deploy(Bet);
  deployer.deploy(StringLib);
  deployer.deploy(OraclizeBet);
  deployer.autolink();
};
