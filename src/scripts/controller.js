

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

    function updateByRef(){
        let newDeck = [];
        let newPile = [];
        let newBotCards = [];
        let newPlayerCards = [];
        Object.assign(newDeck,engine.Deck.Cards);
        Object.assign(newBotCards,engine.Players.getPlayersList()[1].Cards);
        Object.assign(newPlayerCards,engine.Players.getPlayersList()[0].Cards);
        Object.assign(newPile,engine.Pile.Cards);
        listener.setState({deck: newDeck,
                           pile: newPile,
                           botCards: newBotCards,
                           playerCards:newPlayerCards});
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