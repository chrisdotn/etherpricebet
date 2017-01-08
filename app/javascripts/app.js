var StatusEnum = {
    NEW: 0,
    OPEN: 1,
    CLOSED: 2,
    WON: 3,
    properties: {
        0: {
            name: 'new'
        },
        1: {
            name: 'open'
        },
        2: {
            name: 'closed'
        },
        3: {
            name: 'won'
        }
    }
};

var AlertType = {
    ALERT: 0,
    SUCCESS: 1,
    WARNING: 2,
    ERROR: 3
};

function updateHtmlValue(id, value) {
    var htmlElement = document.getElementById(id);
    htmlElement.innerHTML = value;
}

function getBet() {
    return OraclizeBet.deployed();
}

function refreshDashboard() {
    var bet = getBet();

    web3.eth.getBalance(bet.address, function(error, balance) {
            if (!error) {
                updateHtmlValue('balance', web3.fromWei(balance, 'ether'));
            } else {
                console.error(e);
            }
        });

        bet.state().then(function(value) {
            updateHtmlValue('state', StatusEnum.properties[value.valueOf()].name);
        }).catch(function(e) {
            console.error(e);
        });

        bet.pricelevel().then(function(value) {
            updateHtmlValue('pricelevel', value.valueOf());
        }).catch(function(e) {
            console.error(e);
        });

    };

    function getAccount(index) {
        return new Promise(function(resolve) {
            web3.eth.getAccounts(function(err, accs) {
                if (err != null) {
                    throw 'Error fetching accounts.';
                }

                if (accs.length == 0) {
                    throw 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.';
                }

                if (index < 0 || index > accs.length - 1) {
                    throw 'Index out of bounds, set an existing value for the index.';
                }

                resolve(accs[index]);
            });
        });
    }

    function updateButtons() {
        var bet = getBet();
        bet.state().then(function(state) {
            switch (parseInt(state)) {
                case StatusEnum.NEW:
                    document.getElementById('create_new_bet').disabled = false;
                    document.getElementById('place_bet').disabled = true;
                    document.getElementById('close_betting').disabled = true;
                    document.getElementById('evaluate').disabled = true;
                    document.getElementById('pay').disabled = true;
                    break;
                case StatusEnum.OPEN:
                    document.getElementById('create_new_bet').disabled = true;
                    document.getElementById('place_bet').disabled = false;
                    document.getElementById('close_betting').disabled = false;
                    document.getElementById('evaluate').disabled = true;
                    document.getElementById('pay').disabled = true;
                    break;
                case StatusEnum.CLOSED:
                    document.getElementById('create_new_bet').disabled = true;
                    document.getElementById('place_bet').disabled = true;
                    document.getElementById('close_betting').disabled = true;
                    document.getElementById('evaluate').disabled = false;
                    document.getElementById('pay').disabled = true;
                    break;
                case StatusEnum.WON:
                    document.getElementById('create_new_bet').disabled = true;
                    document.getElementById('place_bet').disabled = true;
                    document.getElementById('close_betting').disabled = true;
                    document.getElementById('evaluate').disabled = true;
                    document.getElementById('pay').disabled = false;
                    break;
                default:
                    document.getElementById('create_new_bet').disabled = true;
                    document.getElementById('place_bet').disabled = true;
                    document.getElementById('close_betting').disabled = true;
                    document.getElementById('evaluate').disabled = true;
                    document.getElementById('pay').disabled = true;
            }
        });
    }

    function createBet() {
        var dollarValue = parseInt(document.getElementById('dollar_value').value);
        var prizeAmount = parseInt(document.getElementById('prize_amount').value);

        if (isNaN(dollarValue) || isNaN(prizeAmount)) {
            setStatus(AlertType.ERROR, 'Must specify a dollar value and the prize.');
            throw 'Must specify a dollar value and the prize.';
        }

        var prizeInWei = web3.toWei(prizeAmount, 'ether');

        getAccount(0).then(function(account) {
            var bet = getBet();

            return bet.create.sendTransaction(dollarValue.toString(), {
                value: prizeInWei,
                from: account,
                gas: '0xe0000'
            });
        }).catch(function(e) {
            setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
            console.error('Something went wrong: ' + e);
        });
    }

    function placeBet() {
        var betDateHtml = document.getElementById('bet_date').value;

        if (betDateHtml == '') {
            setStatus(AlertType.ERROR, 'Must specify a date.');
            throw 'Must specify a date.';
        }

        var dateElements = betDateHtml.split('-');
        var betDate = new Date(Date.UTC(dateElements[0], (dateElements[1] - 1), dateElements[2]));

        getAccount(0).then(function(account) {
            var bet = getBet();
            return bet.placeBet.sendTransaction(betDate.getTime() / 1000, {
                from: account
            });
        }).catch(function(e) {
            setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
            console.error('Something went wrong: ' + e);
        });
    }

    function closeBetting() {
        getAccount(0).then(function(account) {
            var bet = getBet();

            return bet.closeBetting.sendTransaction({
                from: account
            });
        }).catch(function(e) {
            setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
            console.error('Something went wrong: ' + e);
        });
    }

    function evaluateBet() {
        getAccount(0).then(function(account) {
            var bet = getBet();
            return bet.evaluateBet.sendTransaction({
                from: account,
            });
        }).catch(function(e) {
            setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
            console.error('Something went wrong: ' + e);
        });
    }

    function payPrize() {
        getAccount(0).then(function(account) {
            var bet = getBet();
            return bet.payout.sendTransaction(account, {
                from: account,
                gas: "0x65fb0"
            });
        }).catch(function(e) {
            setStatus(AlertType.ERROR, 'An error occured in the transaction. See log for further information.');
            console.error('Something went wrong: ' + e);
        });
    }

    function hideMessage() {
        var statusMsgElement = document.getElementById('status_message');
        statusMsgElement.classList.add('hidden');
    }

    function setStatus(type, message) {
        var statusMsgElement = document.getElementById('status_message');
        statusMsgElement.classList.remove('hidden');

        var alertBoxElement = document.getElementById('alert_box');
        alertBoxElement.classList.remove('alert--success');
        alertBoxElement.classList.remove('alert--error');
        alertBoxElement.classList.remove('alert--warning');

        var iconElement = document.getElementById('status_icon');
        var messageElement = document.getElementById('message_content');

        switch (type) {
            case AlertType.SUCCESS:
                alertBoxElement.classList.add('alert--success');
                iconElement.innerHTML = 'stars';
                break;
            case AlertType.WARNING:
                alertBoxElement.classList.add('alert--warning');
                iconElement.innerHTML = 'warning';
                break;
            case AlertType.ERROR:
                alertBoxElement.classList.add('alert--error');
                iconElement.innerHTML = 'error_outline';
                break;
            default:
                iconElement.innerHTML = 'info_outline';
                // standard alerts do not need a special class
        };

        messageElement.innerHTML = message;
    }

    function startEventWatchers() {

        var bet = getBet();

        var closingBettingEvent = bet.ClosingBetting();

        closingBettingEvent.watch(function(error, result) {
            if (!error) {
                setStatus(AlertType.SUCCESS, 'Betting closed.');
                console.log('[Bet closed ] hash: \'' + result.transactionHash +
                    '\', creator: \'' + result.args.creator);
                refreshDashboard();
                updateButtons();
            } else {
                console.error('Something went wrong: ' + error);
            }
        });

        // start watching for event
        var creationEvent = bet.Creation();

        creationEvent.watch(function(error, result) {
            if (!error) {
                console.log('[Bet created] hash: \'' + result.transactionHash +
                    '\', creator: \'' + result.args.creator +
                    '\', price: ' + result.args.price + '$' +
                    ', jackpot: ' + web3.fromWei(result.args.jackpot, 'ether') + ' ether.');
                setStatus(AlertType.SUCCESS, 'Tx mined: Bet created.');
                refreshDashboard();
                updateButtons();
            } else {
                console.error(error);
            }
        });

        var placedBetEvent = bet.PlacedBet();

        placedBetEvent.watch(function(error, result) {
            if (!error) {
                var betDate = new Date(parseInt(result.args.date) * 1000).toISOString().slice(0, 10);

                console.log('[Bet placed ] hash: \'' + result.transactionHash +
                    '\', creator: \'' + result.args.creator +
                    '\', date: ' + betDate);
                setStatus(AlertType.SUCCESS, 'Tx mined: Bet placed.');
                refreshDashboard();
                updateButtons();
            } else {
                console.error(error);
            }
        });

        var payoutEvent = bet.Payout();

        payoutEvent.watch(function(error, result) {
            if (!error) {
                console.log('[Prize paid ] hash: \'' + result.transactionHash +
                    '\', creator: \'' + result.args.creator +
                    '\', winner: \'' + result.args.winner +
                    '\', prize: ' + web3.fromWei(result.args.prize, 'ether') + ' ether.');
                setStatus(AlertType.SUCCESS, 'Tx mined: Prize paid out.');
                refreshDashboard();
                updateButtons();
            } else {
                console.error(error);
            }
        });

        var determinedWinnerEvent = bet.DeterminedWinner();

        determinedWinnerEvent.watch(function(error, result) {
            if (!error) {
                console.log('[Got Winner ] winner: ' + result.args.winner +
                    ', bet: ' + result.args.bet +
                    ', result: ' + result.args.result +
                    ', diff: ' + result.args.difference);
                setStatus(AlertType.ALERT, 'Determined Winner');
                refreshDashboard();
                updateButtons();
            } else {
                console.error(error);
            }
        });

        var infoEvent = bet.Info();
        infoEvent.watch(function(error, result) {
            if (!error) {
                console.log('[Solidity Info] ' + result.args.message);
                setStatus(AlertType.ALERT, 'Info from contract, see log.');
            } else {
                console.error(e);
            }
        });

        var errorEvent = bet.Error();
        errorEvent.watch(function(error, result) {
            if (!error) {
                console.error('[Solidity Error] ' + result.args.message);
                setStatus(AlertType.WARNING, 'Error from contract, see log.');
            } else {
                console.error(e);
            }
        });

        var noWinnerEvent = bet.NoWinner();
        noWinnerEvent.watch(function(error, result) {
            if (!error) {
                console.log('[No Winner ] ' + result.args.message);
                setStatus(AlertType.ALERT, 'No winner found.');
                refreshDashboard();
                updateButtons();
            }
        })
    }

    window.onload = function() {
        refreshDashboard();
        updateButtons();
        startEventWatchers();
    }
