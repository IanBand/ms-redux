// REACT //
import React, { Component } from 'react';

// REDUX //
import { connect } from 'react-redux';
import { leftClick , rightClick } from '../actions/boardActions';
import { setMouseState } from '../actions/general';


// DEFINITIONS //
import {
    // TILE VALUES //
    mine,

    // CLICKS //
    leftMouse, middleMouse, rightMouse,

    // MOUSE STATES //
    up, down,

    // GAME STATES // ... tiles only really care if they are in postGameIdle or
    preGameIdle, gameInProgress, postGameIdle, playingReplay, postReplayIdle, 
    } from '../other/definitions'

class Tile extends Component {

    render() { // tile numbers and graphics will need to be easily rotateable
        //let tile = this.props.board[this.props.y][this.props.x];

        let tile = this.props.tile_data;
        let hoverClickClass = "";
        let tileStateClass = "";
        let valueClass = " tile-val-" + tile.val;
        let val;
        //tile rendering behavior

        //A tile can have the classes: tile-revealed


        // NEED TO FORCE REVEAL ALL TILES IF GAME IS WON //

        // need to write equivelent logic
        switch(this.props.game_state){
            default:
            case preGameIdle:
            case gameInProgress:
            case playingReplay:
            //only reveal revealed tiles
                if(tile.revealed){
                    tileStateClass = " tile-revealed";
                    (tile.val > 0  && tile.val < mine)? val = tile.val: val = null;
                }
                else{
                    tileStateClass = " tile-not-revealed";
                }
                break;
            case postGameIdle:
            case postReplayIdle:
                //reveal revealed tiles and all mines

                // TODO: account for incorrect flags and the clicked mine
                if(tile.revealed){
                    tileStateClass = " tile-revealed";
                    (tile.val > 0  && tile.val < mine)? val = tile.val: val = null;
                }
                else{
                    tileStateClass = " tile-not-revealed";
                }
                if(tile.val === mine){
                    val = '*';
                    tileStateClass = " tile-revealed";
                }
                break;
        }



    

        // assign hover classes based on click state
        if(this.props.mouse_state === up){ // holy shit this works, may have to have this depend on the revealed state as well
            hoverClickClass = " mouse-not-pressed";
        }
        else{ // DISSABLE THIS WHEN GAMESTATE IS POSTGAMEIDLE OR POST REPLAY IDLE
            hoverClickClass = " mouse-pressed";
        }
        return (
            // double click behavior https://www.w3schools.com/jsref/event_ondblclick.asp
            // also might consider using event.buttons (plural) for more specified behavior https://www.w3schools.com/jsref/event_buttons.asp
            <div className={"tile unselectable" + hoverClickClass + tileStateClass + valueClass} id={ "" + this.props.x + "-" + this.props.y}
            onMouseUp={ (event) => { //somewhere in this function I have to set the mouse click state to up
                // mouseUp behavior is dependent on which type of mouse button it is
                switch(event.button){
                    case leftMouse:
                        this.props.leftClick(this.props.x, this.props.y); // should be renamed open tile?
                        this.props.setMouseState(up);
                        break;
                    case middleMouse:
                        break;
                    case rightMouse:
                        break;
                    default:
                        break;
                }
                //console.log("onMouseUp, event.button = " + event.button)
                
                //this.props.leftClick( this.props.x , this.props.y); 
            }}
            onMouseDown={
                (event) => {
                    // prevent dragging
                    event.preventDefault();

                    // mouseUp behavior is dependent on which type of mouse button it is
                    switch(event.button){
                        case leftMouse:
                            this.props.setMouseState(down); // may put this somehwere else in this function
                            break;
                        case middleMouse:
                            //do the 9 tile block thing
                            //this.props.middleClick(this.props.x, this.props.y);
                            break;
                        case rightMouse:
                            //manipulate flags
                            this.props.rightClick(this.props.x, this.props.y)
                            break;
                        default:
                            break;
                    }
                    
                }}
            onContextMenu={
                (event) => {
                    // prevent right click menu
                    event.preventDefault();
                    // I probably wont put anything else in this function. maybe a hint menu or something?
                    //console.log("onContextMenu, event.button = " + event.button)
                }}
            //onContextMenu="return false;"
            
            >
                <div className="num-container">
                    {val}
                </div>
            </div>
        );
    }
}


// REDUX MAPS
const mapStateToProps = (state) => {
    return {
        //board: state.board,
        game_state: state.game_state,
        mouse_state: state.mouse_state,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
        leftClick: (x,y) => dispatch(leftClick(x,y)),
        rightClick: (x,y) => dispatch(rightClick(x,y)),
        setMouseState: (state) => dispatch(setMouseState(state)),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Tile);