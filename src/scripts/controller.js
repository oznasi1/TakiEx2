

import {GameEngine} from "./gameEngine.js";

const NUM_OF_HUMAN = 1;
const NUM_OF_BOT = 1;
    // this.makeCardFaceUp = function () {
    //     this.attributes[1] = this.cardAtrribute;
    //     this.isUp = true;
    // }

    /*
    function updateByRef(...keys){
        let obj = {};
        keys.forEach((key)=>{
            Object.assign(obj[`${key}`],engine[`${key}`]);
           })

        listener.setState(obj);
    }*/

    var listener;
    var engine;

    function updateByRef(newShowError,newShowColorPicker,newEndGame){
        let newDeck = [];
        let newPile = [];
        let newBotCards = [];
        let newPlayerCards = [];
        let newStats={};
        let newBotStats={};
        let newWinLose={};
        Object.assign(newDeck,engine.Deck.Cards);
        Object.assign(newBotCards,engine.Players.getPlayersList()[1].Cards);
        Object.assign(newPlayerCards,engine.Players.getPlayersList()[0].Cards);
        Object.assign(newPile,engine.Pile.Cards);
        newStats={
           numOfTurs:engine.Players.getPlayersList()[0].Stats.getNumOfTurns(), 
           avgTime:engine.Players.getPlayersList()[0].Stats.getAvgPlayTime(),
           lastCardCount:engine.Players.getPlayersList()[0].Stats.getNumOfOneCard(),
                } 

                if(newEndGame) // if we got this flag that found the winner
                {
                    newBotStats={
                        numOfTurs:engine.Players.getPlayersList()[1].Stats.getNumOfTurns(), 
                        avgTime:engine.Players.getPlayersList()[1].Stats.getAvgPlayTime(),
                        lastCardCount:engine.Players.getPlayersList()[1].Stats.getNumOfOneCard(),
                             } 
                    newWinLose={
                        timer:engine.getTimer(),
                        winnerIndex:engine.checkForWinner(),
                        botStats:newBotStats,
                    }
                }

        listener.setState({deck: newDeck,
                           pile: newPile,
                           botCards: newBotCards,
                           playerCards:newPlayerCards,
                           showError:newShowError,
                           showColorPicker:newShowColorPicker,
                           endGame:newEndGame,
                           stats:newStats,
                           winLose:newWinLose});

        if(newShowError==true) // shuuting down ther error after 1 sec
            {
                setTimeout(function() { 
                    listener.setState({showError: false}) 
                    }, 1000)
            }
        }
 
    function initGameEngine(){
        engine = new GameEngine();
        engine.initEngine(null,NUM_OF_HUMAN,NUM_OF_BOT);

        updateByRef();
    }

    function init (gameRef){
        listener = gameRef;
    }


export {init,initGameEngine,updateByRef,engine};