
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
            <img id={props.id} className={`${props.arrributes}`} style={props.style} onClick={props.onClick}/>
    );
};
const ShowError = (props)=>{
    var errorStyle;
    if(props.enable)
    {   
         errorStyle = {
            display: `block`,
          };
    }
    else{
         errorStyle = {
            display: `none`,
          };
    }

    return(
        <img id={`error_screen`} className={`notValidAction`} style={errorStyle}/>
    );
};
const Stats = (props)=>{
    return(
        <div id="stats">
            <img className={"playerTurn"}/>
            <div id="numTurns">Number player turns: {props.stat.numOfTurs}</div>
            <div id="Human_avg_time">Average time per turn: {props.stat.humanAvgTime} seconds</div>
            <div id ="Human_last_one">Number of last card of player: {props.stat.humanLastCardCount}</div>
        </div>
    );
};

class PicColor extends React.Component{
    constructor(args){
        super(args);
        this.handleColorPickOnClick= this.handleColorPickOnClick.bind(this);
    }

    handleColorPickOnClick(e){
        this.props.handleColorPicker; //hide the color picker
        engine.Card_OnClick(e);
    }

    render(){
        
    var colorPickerStyle;
    if(this.props.enable)
    {   
        colorPickerStyle = {
            display: `block`,
          };
    }
    else{
        colorPickerStyle = {
            display: `none`,
          };
    }
        return(
            <div id="colorPicker" className={"btn-group screen_center"}style={colorPickerStyle}>
                <button id="red" className={"btn-group button red"} onClick={this.handleColorPickOnClick}></button>
                <button id="blue" className={"btn-group button blue"} onClick={this.handleColorPickOnClick}></button>
                <button id="green" className={"btn-group button green"} onClick={this.handleColorPickOnClick}></button>
                <button id="yellow" className={"btn-group button yellow"} onClick={this.handleColorPickOnClick}></button>
            </div>
         );
    }
}


class Player extends React.Component{
    constructor(args){
        super(args);
        this.handlePlayerClick = this.handlePlayerClick.bind(this);

    }
    
    handlePlayerClick(e){
        engine.Card_OnClick(e);
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
            if(this.props.id=="player"){
                cardsElems.push(<CardRC id={i} key={i} arrributes={`${cardAttributes} overLapCard`} style={cardStyle} onClick={this.handlePlayerClick}/>);
            }
            else{
                cardsElems.push(<CardRC id={i} key={i} arrributes={`${cardAttributes} overLapCard`} style={cardStyle}/>);
            }
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
                <ShowError enable ={this.props.toShowError}/>
                <PicColor enable = {this.props.toShowColorPicker} handleColorPicker={this.props.handler}/>
             </div>
      );
    }
}

class Game extends React.Component{ //contains all - players,deck,pile,stats
    constructor(args){
        super(args);

        this.colorPickerHandler = this.colorPickerHandler.bind(this)

        this.state = {
            botCards:[],
            deck: [],
            pile:[],
            playerCards:[],
            showError: false,
            showColorPicker:false,
            stats: {
                numOfTurs:0,
                humanAvgTime:0,
                humanLastCardCount:0,
            }
        }
    }

    colorPickerHandler(e){
        e.preventDefault();
        this.setState({showColorPicker:false});
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
                <PileRC cards={this.state.pile} toShowError={this.state.showError} toShowColorPicker={this.state.showColorPicker} handler ={this.props.colorPickerHandler}/>
                <Player id="player" cards={this.state.playerCards}/>
                <Stats stat={this.state.stats}/>

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




