//https://code.tutsplus.com/tutorials/build-a-minesweeper-game-within-200-lines-of-code--active-8578

//actions for game initialization logic

export const placeMines = (minesCounter, seed, x_init, y_init) => {
    // TODO; get minesCounter, 
    // and seed from the settings the same way that 
    // I get the board info from the settings.
    return(dispatch, getState) => {

        // need to to salt the seed with x_init, y_init, and board dimensions. this will make it so similar sized
        // boards with the same seed will be sufficently different.

        
        let a = 134775813;
        let c = 1;
        let modulus = Math.pow(2 , 32);

        let board = getState().board;
        let height = getState().board.length;
        let width = getState().board[0].length;
    
        while(minesCounter > 0){
            //linear congruential generator
            seed = ( a * seed + c ) % modulus; // step lcg

            let rng = seed % ( height * width - 1); // why?

            let x = rng * 3 + 2  % width;
            let y = rng * 5 + 6  % height;


            // I think there may be a way to only generate coordinates not neighboring the first click
            // this method is a brute force check 

            // check if x and y are/are neighboring (x_init, y_init). if they are, 
            // skip current x, y and generate a new x, y. This is to guarantee the first click is safe and is a 0
            //this block has about a 9 in boardArea chance of making the loop continue
            if( x == x_init && y == y_init     ) continue; //check first click for mine
            if( x == x_init && y == y_init + 1 ) continue; // check north of first click for mine
            if( x == x_init + 1 && y == y_init ) continue; // check east 
            if( x == x_init && y == y_init - 1 ) continue; // check south
            if( x == x_init - 1 && y == y_init ) continue; // check west
            if( x == x_init - 1 && y == y_init + 1 ) continue; // check north west
            if( x == x_init - 1 && y == y_init - 1 ) continue; // check south west
            if( x == x_init + 1 && y == y_init + 1 ) continue; // check north east
            if( x == x_init + 1 && y == y_init - 1 ) continue; // check south east
            
            //check if the board already has a mine at x,y
            if(board[x][y].val === 9) continue;
            
            dispatch(setMine(x,y));
            minesCounter--;
        }

        // do the next thing, which would be placeNumbers
        console.log("mines placed!");
    }
}

export const setMine = ( x, y ) => {
    return{
        type: 'SET_TILE_TO_MINE',
        x: x,
        y: y,

    }

}