contract('Bet', function(accounts) {
    var StatusEnum = {
        NEW: 0,
        OPEN: 1,
        CLOSED: 2,
        ENDED: 3
    };

  it("should be in status 'NEW'", function(done) {
    var bet = Bet.deployed();

    bet.state().then(function(value) {
        assert.equal(parseInt(value), StatusEnum.NEW);
    }).then(done).catch(done);
  });

  it("should have 0 balance", function (done) {
      var bet = Bet.deployed();

      bet.getBalance().then(function(balance) {
          assert.equal(balance, 0);
      }).then(done).catch(done);
  });

  // it("should call a function that depends on a linked library  ", function(done){
  //   var meta = MetaCoin.deployed();
  //   var metaCoinBalance;
  //   var metaCoinEthBalance;
  //
  //   meta.getBalance.call(accounts[0]).then(function(outCoinBalance){
  //     metaCoinBalance = outCoinBalance.toNumber();
  //     return meta.getBalanceInEth.call(accounts[0]);
  //   }).then(function(outCoinBalanceEth){
  //     metaCoinEthBalance = outCoinBalanceEth.toNumber();
  //
  //   }).then(function(){
  //     assert.equal(metaCoinEthBalance,2*metaCoinBalance,"Library function returned unexpeced function, linkage may be broken");
  //
  //   }).then(done).catch(done);
  // });
  // it("should send coin correctly", function(done) {
  //   var meta = MetaCoin.deployed();
  //
  //   // Get initial balances of first and second account.
  //   var account_one = accounts[0];
  //   var account_two = accounts[1];
  //
  //   var account_one_starting_balance;
  //   var account_two_starting_balance;
  //   var account_one_ending_balance;
  //   var account_two_ending_balance;
  //
  //   var amount = 10;
  //
  //   meta.getBalance.call(account_one).then(function(balance) {
  //     account_one_starting_balance = balance.toNumber();
  //     return meta.getBalance.call(account_two);
  //   }).then(function(balance) {
  //     account_two_starting_balance = balance.toNumber();
  //     return meta.sendCoin(account_two, amount, {from: account_one});
  //   }).then(function() {
  //     return meta.getBalance.call(account_one);
  //   }).then(function(balance) {
  //     account_one_ending_balance = balance.toNumber();
  //     return meta.getBalance.call(account_two);
  //   }).then(function(balance) {
  //     account_two_ending_balance = balance.toNumber();
  //
  //     assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
  //     assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  //   }).then(done).catch(done);
  // });
});
