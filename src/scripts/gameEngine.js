
import {Deck} from './deck.js';
import {Pile} from './pile.js';
import {Players} from './players.js';
import {ActionManager} from './actionManager';
import {updateByRef} from "../scripts/controller.js";
var eGameState = { "normal": 0, "change_colorful": 1, "taki": 2, "stop": 3 };
var s_gameTimer = 0;

class GameEngine{

    constructor(){
        this.Running = false; 
        this.UI = null;       
        this.Deck = new Deck();
        this.Players = new Players();
        this.Pile = new Pile();
        this.ActionManager = new ActionManager(this.Pile);
        
        this.timeInterval = null;
    }

    timer(){
        s_gameTimer += 1;
    }

    initEngine(i_UI, i_NumberOfHuman, i_NumberOfBots) {
        this.timeInterval = setInterval(this.timer, 1000);
        this.Running = true; // will enable/disable click events
        this.UI = i_UI; //will help us print to screen
        this.Deck.init();
        this.Pile.init(this.Deck);
        this.Players.init(this, this.Pile, this.Deck, i_NumberOfHuman, i_NumberOfBots); // 1 bot, 1 human
        this.ActionManager.init();
        //this.UI.Render(this.Deck, this.Pile, this.Players); //new
        let showError=false;
        let showColorPicker = false;
        let endGame = false;
        updateByRef(showError,showColorPicker,endGame);
    }

    hasMoreCards(i_CurrPlayer) {

        var result = false;
        var cards = i_CurrPlayer.getCards();
        var pileColor = this.Pile.getTopCardColor();

        for(var i = 0; i < cards.length; i++) {

            if (cards[i].getColor() === pileColor){
                result = true;
                break;
            }
        }

        return result;
    };

    Deck_OnClick(event) {

        if (this.Running) {
            this.DeckClick();

            var isDeckEmpty = (this.Deck.Cards.length === 0);
            if(isDeckEmpty){
                var pileCards = this.Pile.getCards();
                this.Deck.createDeckFromPile(pileCards);
            }
        }
    };

    DeckClick(){

            var cardFromDeck = this.Deck.getTopCardFromDeck();
            var currPlayer = this.Players.getCurrentPlayer();
            currPlayer.addCard(cardFromDeck);
            this.Players.nextPlayerTurn();
            //this.UI.Render(this.Deck, this.Pile, this.Players);
            let showError=false;
            let showColorPicker= false;
            let endGame = false;
            updateByRef(showError,showColorPicker,endGame);
            this.Players.startTurn();
    };
    
    getTimer(){
        return s_gameTimer;
    }
    //info:
    //-1 = falid
    // 0 = added card
    // 1 = change color
    // 2 = taki
    // // 3 = stop
    Card_OnClick(event) {

        if (this.Running) {
            var cardIndex = event.target.id;
            this.CardClick(cardIndex);
        }
    };

    CardClick(i_CardIndex){
        this.startTurn(i_CardIndex);
        this.endTurn();
        this.update(); //deck cards = 1 =>> shffle + check winner losser
        this.Players.startTurn();
    };

    update() {
        var winnerIndex = this.checkForWinner();
        if (winnerIndex != null) {//somebody won
            clearInterval(this.timeInterval);
            this.Running = false;
            let showError=false;
            let showColorPicker= false;
            let endGame = true;
            updateByRef(showError,showColorPicker,endGame);
            //this.UI.RenderWinnerScreen(this.Players.getPlayersList(), winnerIndex, s_gameTimer);
        }
    };

    checkForWinner(){

        var winnerIndex = null;
        var playersList = this.Players.getPlayersList();

        for (var i = 0; i < playersList.length; i++) {

            if (playersList[i].getCards().length === 0) {
                winnerIndex = i;
                break;
            }
        }

        return winnerIndex;
    }

    startTurn(i_CardIndex) {

        var gameState = this.ActionManager.getCurrentGameState();

        switch (gameState) {
            case eGameState["normal"]: //try to add card to pile
                var currPlayer = this.Players.getCurrentPlayer();
                var card = currPlayer.getCards()[i_CardIndex];
                this.ActionManager.AddCardToPile(currPlayer, card);
                break;

            case eGameState["change_colorful"]: //change the pile color
                var newPileColor = i_CardIndex; /////////in this call i_CardIndex == new color
                this.Pile.setTopCardColor(newPileColor);
                var topPileCard = this.Pile.getTopCardFromPile();
                topPileCard.setAttributes("card_change_"+ i_CardIndex);
                topPileCard.setColor(i_CardIndex);
                this.ActionManager.setDefaultState();  //return to normal state & isValidCard = true
                break;

            case eGameState["taki"]:
                var currPlayer = this.Players.getCurrentPlayer();
                var card = currPlayer.getCards()[i_CardIndex];
                this.ActionManager.AddCardToPileWhenTaki(currPlayer, card); //try to add card to pile
                break;

            case eGameState["stop"]: //switch to next player but don't start his turn if he is a bo

                break;
        }
    };

    endTurn() {
        //render end
        var turnResult = this.ActionManager.getTurnResult();
        var showError =false;
        var showColorPicker= false;
        var endGame = false;
        switch (turnResult) {
            case -1:        //failed to add card to pile
                //this.UI.ShowError();
                showError=true;
                updateByRef(showError,showColorPicker,endGame);
                break;

            case eGameState["normal"]: //render after player play and then change to next player
                this.Players.nextPlayerTurn(); //add delay to the bot algo
                //this.UI.Render(this.Deck, this.Pile, this.Players);
                updateByRef(showError,showColorPicker,endGame);
                break;

            case eGameState["change_colorful"]:  //user or bot need to pick color
                //this.UI.Render(this.Deck, this.Pile, this.Players);
                showColorPicker=true;
                updateByRef(showError,showColorPicker,endGame);
                //this.UI.ShowColorPicker();
                break;

            case eGameState["taki"]:
                if (!this.hasMoreCards(this.Players.getCurrentPlayer())) // run out of Cards in the same color
                {
                    this.ActionManager.setDefaultState();
                    this.Players.nextPlayerTurn();
                    //this.UI.Render(this.Deck, this.Pile, this.Players);
                    updateByRef(showError,showColorPicker,endGame);
                }
                else{
                    this.Players.getCurrentPlayer().setPlayingToFalse();
                    //this.UI.Render(this.Deck, this.Pile, this.Players);
                    updateByRef(showError,showColorPicker,endGame);
                }

                break;

            case eGameState["stop"]:
                this.Players.nextPlayerTurn();
                //this.UI.Render(this.Deck, this.Pile, this.Players);
                updateByRef(showError,showColorPicker,endGame);
                this.Players.nextPlayerTurn();
                this.ActionManager.setDefaultState();
                break;
        }

    }
}

export {GameEngine,s_gameTimer};