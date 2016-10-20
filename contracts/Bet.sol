import "./Mortal.sol";

contract Bet is Mortal {
    enum State { New, Open, Closed, Won }

    struct PriceBet {
        uint round;
        uint date;
    }

    State public state;
    uint public pricelevel;
    uint public round;
    address winner;

    address[] betters;
    mapping (address => PriceBet) public bets;

    event Creation(
        address indexed creator,
        uint indexed price,
        uint jackpot,
        uint round
    );

    event ClosingBetting(
        address indexed creator
    );

    event PlacedBet(
        address indexed creator,
        uint indexed date,
        uint round
    );

    event Payout(
        address indexed creator,
        address indexed winner,
        uint indexed prize
    );

    event DeterminedWinner(
        address indexed winner,
        uint bet,
        uint result,
        uint difference
    );

    event Error(
        string message
    );

    function Bet() {
        state = State.New;
    }

    function getBalance() constant returns (uint balance) {
        return this.balance;
    }

    function create(uint price) {

        // new bets are only allowed in state State.New
        if (state != State.New) {
            throw;
        }

        winner = 0;
        betters.length = 0;
        pricelevel = price;
        state = State.Open;
        round++;

        Creation(msg.sender, price, this.balance, round);
    }

    function placeBet (uint date) {

        // bet are allowed during State.Open only
        if (state != State.Open) {
            throw;
        }

        // only one bet allowed, else throw
        if (bets[msg.sender].round == round) {
            throw;
        }

        betters.push(msg.sender);
        bets[msg.sender] = PriceBet(round, date);

        PlacedBet(msg.sender, date, round);
    }

    function closeBetting() {

        // closing the betting period is allowed during State.Open only
        if (state != State.Open) {
            throw;
        }

        state = State.Closed;

        ClosingBetting(msg.sender);
    }

    function determineWinner(uint result) constant returns(bool, address, uint) {
        address currentWinner;
        uint currentDiff = 999999999999;
        bool foundWinner = false;

        for (uint i=0; i<betters.length; i++) {

            uint difference = 999999999999;

            PriceBet bet = bets[betters[i]];

            if (bet.date > result) {
                difference = bet.date - result;
            } else {
                difference = result - bet.date;
            }

            if (difference < currentDiff) {
                currentDiff = difference;
                currentWinner = betters[i];
                foundWinner = true;
            }
        }
        return (foundWinner, currentWinner, currentDiff);
    }

    function evaluateBet() returns (bool) {

        // determine winner is allowed in State.Closed only
        if (state != State.Closed) {
            throw;
        }

        // 1476655200000 is 2016-10-17
        // TODO call oracalize here
        uint result = 1476655200000;
        var (foundWinner, winningAddress, difference) = determineWinner(result);

        if (!foundWinner) {
            // TODO need to refund original creator
            Error('Found no winner');
            return false;
        }

        winner = winningAddress;
        state = State.Won;

        DeterminedWinner(winner, bets[winner].date, result, difference);
        return true;
    }

    function payout() returns (bool) {

        // payout is allowed in State.Won only
        if (state != State.Won) {
            Error('State is not WON');
            throw;
        }

        if (bets[winner].round != round) {
            Error('Rounds is not proper');
            throw;
        }

        uint jackpot = this.balance;

        if (winner.send(this.balance)) {
            Payout(msg.sender, winner, jackpot);
            pricelevel = 0;
            state = State.New;
            return true;
        } else {
            Error('Payout failed.');
            return false;
        }
    }
}
