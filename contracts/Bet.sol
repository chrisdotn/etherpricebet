import "./Mortal.sol";

contract Bet is Mortal {
    enum State { New, Open, Closed }

    State public state;
    uint public pricelevel;
    uint public round;
    address[] betters;
    address winner;

    mapping (address => uint) public bets;
    mapping (address => uint) public rounds;

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

    function Bet() {
        state = State.New;
        pricelevel = 0;
    }

    function getBalance() constant returns (uint balance) {
        return this.balance;
    }

    function setPriceLevel(uint level) {
        pricelevel = level;
    }

    function create(uint price) {

        // new bets are only allowed in state State.New or State.Ended
        if (state != State.New) {
            throw;
        }

        betters.length = 0;
        pricelevel = price;
        state = State.Open;
        round++;

        Creation(msg.sender, price, this.balance, round);
    }

    function closeBetting() {

        // closing the betting period is allowd during State.Open bet only
        if (state != State.Open) {
            throw;
        }

        state = State.Closed;

        ClosingBetting(msg.sender);
    }

    function placeBet (uint date) {

        // bet are allowed during State.Open only
        if (state != State.Open) {
            throw;
        }

        // only one bet allowed, else throw
        if (rounds[msg.sender] == round) {
            throw;
        }

        betters.push(msg.sender);
        bets[msg.sender] = date;
        rounds[msg.sender] = round;

        PlacedBet(msg.sender, date, round);
    }

    function determineWinner(uint date) returns(address) {
        address currentWinner;
        uint currentDiff = 999999999999;

        for (uint i=0; i<betters.length; i++) {
            uint difference = 0;

            if (bets[betters[i]] > date) {
                difference = date - bets[betters[i]];
            } else {
                difference = bets[betters[i]] - date;
            }

            if (difference < currentDiff) {
                currentDiff = difference;
                currentWinner = betters[i];
            }
        }

        DeterminedWinner(currentWinner, bets[currentWinner], date, currentDiff);

        return currentWinner;
    }

    function evaluateBet() returns (bool) {
        // 1476655200000 is 2016-10-17
        winner = determineWinner(1476655200000);
    }

    function payout() returns (bool) {
        if (rounds[winner] != round) {
            throw;
        }

        pricelevel = 0;
        state = State.New;

        uint jackpot = this.balance;

        if (winner.send(this.balance)) {
            Payout(msg.sender, winner, jackpot);
            return true;
        } else {
            return false;
        }
    }
}
