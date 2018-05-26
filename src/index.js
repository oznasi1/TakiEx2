
import React from "react";
import ReactDOM from "react-dom";
import "./styles/style.css";
import "./styles/cards.css";
import {GameEngine} from './scripts/gameEngine.js';
import takiLogo from "./styles/assets/TAKI_logo.png";
import startGameBtn from "./styles/assets/startGame.png";
import {Deck} from "./scripts/deck.js";
import {init} from "./scripts/controller.js";
import {initGameEngine} from "./scripts/controller.js";
import {engine} from "./scripts/controller.js";


    const GameMenu =(props)=> {
        return(

        <div id="menuWrapper">

            <img src={takiLogo} className={"taki_logo"}/>
            <img id="startGame" src={startGameBtn} onClick={startGame}/>

        </div>
        );
    };


const CardRC = (props) =>{
    return(
            <img id={props.id} className={`${props.arrributes}`} style={props.style}/>
    );
};


class Player extends React.Component{
    constructor(args){
        super(args);
    }

    render(){
        var cardsElems=[];
        var left = 0;
        for (var i = 0; i < this.props.cards.length; i++) {
            left += (80/this.props.cards.length);
            var cardStyle = {
                marginLeft: `${left}%`,
              };
            let cardAttributes = this.props.cards[i].getAttributes();
            cardsElems.push(<CardRC id={i} key={i} arrributes={`${cardAttributes} overLapCard`} style={cardStyle}/>);
         }

        return(
            <div id={this.props.id}>
                {cardsElems}
            </div>
        );
    }
}

class DeckRC extends React.Component{
    constructor(args){
        super(args);
        this.handleDeckClick = this.handleDeckClick.bind(this);
    }

    handleDeckClick(e){
        engine.Deck_OnClick(e);
    }

    render(){
        var cardsElems=[];
        for (var i = 0; i < this.props.cards.length; i++) {
            let top = i/3;
            let left = i/3;
            var cardStyle = {
                margin: `${top}px ${left}px`,
              };
            cardsElems.push(<CardRC key={i} arrributes={`card card_back overLapCard`} style={cardStyle}/>);
         }
        return(
             <div id="deck" onClick={this.handleDeckClick}>
                {cardsElems}
             </div>
      );
    }
}

class PileRC extends React.Component{
    constructor(args){
        super(args);

    }

    render(){
        
        var cardsElems=[];
        for (var i = 0; i < this.props.cards.length; i++) {
            let top = Math.floor(Math.random() * (i*3 - 0 + 1)) + 0;
            let left = Math.floor(Math.random() * (i*3 - 0 + 1)) + 0;
            let right = Math.floor(Math.random() * (i*3 - 0 + 1)) + 0;
            let bottom = Math.floor(Math.random() * (i*3 - 0 + 1)) + 0;
            let angle =  Math.floor(Math.random() * (360/i - 0 + 1)) + 0;
            var cardStyle = {
                transform: `rotate(${angle}deg)`,
                margin:`${top}px ${bottom}px ${left}px ${right}px`
              };
            let cardAttributes = this.props.cards[i].getAttributes();

            cardsElems.push(<CardRC key={i} arrributes={`${cardAttributes} overLapCard`} style={cardStyle} />);
         }
        return(
             <div id="pile">
                {cardsElems}
             </div>
      );
    }
}

class Game extends React.Component{ //contains all - players,deck,pile,stats
    constructor(args){
        super(args);
        this.state = {
            botCards:[],
            deck: [],
            pile:[],
            playerCards:[]
        }
    }


    componentWillMount(){
        init(this);
        initGameEngine();
    }

    render(){

        return(
            <div id="gameWrapper" >
                <Player id="bot" cards={this.state.botCards}/>
                <DeckRC cards={this.state.deck}/>
                <PileRC cards={this.state.pile}/>
                <Player id="player" cards={this.state.playerCards}/>
            </div>
        );
    }
}

ReactDOM.render(<GameMenu />,document.getElementById("root"));


function startGame()
{
    initGame();
}


function initGame(){
    ReactDOM.render(<Game />,document.getElementById("root"));
};




