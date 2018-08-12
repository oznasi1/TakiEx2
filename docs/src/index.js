import React from "react";
import ReactDOM from "react-dom";
import "./styles/style.css";
import "./styles/cards.css";
import takiLogo from "./styles/assets/TAKI_logo.png";
import startGameBtn from "./styles/assets/startGame.png";


import { Game } from "./scripts/react_components/Game.js";


const GameMenu = (props) => {
    return (

        <div id="menuWrapper">
            <div title="flipping TAKI card" className="flipping-card-wrapper">
                <img className="front-card" src={takiLogo} />
                <img className="back-crad" src={takiLogo} />
            </div>
            <img id="startGame" src={startGameBtn} onClick={() => ReactDOM.render(<Game />, document.getElementById("root"))} />

        </div>
    );
};


ReactDOM.render(<GameMenu />, document.getElementById("root"));



