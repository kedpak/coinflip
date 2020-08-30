var web3 = new Web3(Web3.givenProvider);
var contractInstance;


$(document).ready(function() {
    window.ethereum.enable().then((accounts) => {
        contractInstance = new web3.eth.Contract(abi, "0x0c21530A43465C6375f49502a2F0DD99a8Cd3131", { from: accounts[0] });
        console.log('contractInstance ', contractInstance);

        let randomNumber = contractInstance.events.generateRandomNumber({
            fromBlock: 0
        }, (err, event) => {
            console.log('event ', event)
            console.log('err ', err);
        }).on('data', (event) => {
            console.log('event2 ', event);
            console.log('contractinstance ', contractInstance);

            let finalResult = res.events.coinFlipped.returnValues.result;
            let amount = web3.utils.fromWei(res.events.winPayout.returnValues.betAmount, "ether");

            if (finalResult === "0") {
                $("#bet-winnings").text("Congrats! You won " + amount + " Ether!");
            } else {
                $("#bet-winnings").text("Sorry you lost!");
            }
        }).on('error', console.error)


    });


    $("#place-amount-button").click(placeAmount);
    $("#submit-button").click(makeBet);


});

placeAmount = () => {
    let amount = $("#bet-input").val();

    console.log("amountt ", contractInstance.options.from)
    let config = {
        value: web3.utils.toWei(amount.toString(), "ether"),
        gas: 100000,
        from: contractInstance.options.from
    };

    $("#bet-amount").text("Processing your bet, please stand by!!");

    contractInstance.methods.intakeToken().send(config).on("transactionHash", (hash) => {
        console.log("Hash ", hash);
    }).on("confirmation", (confirmationNr) => {
        console.log("confirmation number ", confirmationNr); // number of confirmations
    }).on("receipt", (receipt) => {
        console.log("receipt333 ", receipt);
        $("#bet-amount").text(web3.utils.fromWei(receipt.events.betTaken.returnValues.betAmount, "ether"));
    });
}


makeBet = () => {

    let config2 = {
            gas: 200000,
            from: contractInstance.options.from
        }
        // console.log(contractInstance.methods.update())
    $("#bet-winnings").text("Bet placed, please stand by!");
    contractInstance.methods.flipCoin().send(config2).then((res) => {
        $("#bet-winnings").text("Bet processed, waiting on results!");
        console.log("res flipcoin ", res)
        callSub();
    });
}


/*
let subscription = contractInstance.events.generateRandomNumber({
    fromBlock: 0
});
console.log("YOYO")
subscription.on('data', (event) => {
    console.log("event ", event);
    console.log('contractinstance ', contractInstance);
}).on("error", (err) => {
    console.log('error ', err)
    console.log('contractinstance ', contractInstance);
})
*/

/*


contractInstance.events.generateRandomNumber({}, (err, event) => {
    console.log('event ', event)
    console.log('err ', err);
}).on('data', (event) => {
    console.log('event2 ', event);
    console.log('contractinstance ', contractInstance);

    let finalResult = res.events.coinFlipped.returnValues.result;
    let amount = web3.utils.fromWei(res.events.winPayout.returnValues.betAmount, "ether");

    if (finalResult === "0") {
        $("#bet-winnings").text("Congrats! You won " + amount + " Ether!");
    } else {
        $("#bet-winnings").text("Sorry you lost!");
    }
})*/