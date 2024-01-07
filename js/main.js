//info on top right
const mousePosText = document.getElementById('mouse-pos');
const mouseFieldText = document.getElementById('mouse-field');

//variables used for board presentation and link to html elements
var chessboard = document.getElementById("chessboard");
var boardparent = document.getElementsByTagName("boardparent");
var mousePos = { x: undefined, y: undefined };

/*
Each square on the board has a certain position. The bottom left square has the coordinates [0, 0] and the top right square has the coordinates [7, 7]
The first number stands for the x-component (left-right) and the second for the y-component (bottom-top) 
The board position is kept track of with 3 different variables
1. squareStates: 2D 8x8 array, which keeps track of the piece color and piece type of every square, if the square is empty its values are "undefined"
2. white-/blackpiecepos: Keeps track of the position of every piece of a color, the indexing is the same as with white-/blackpieces
3. white-/blackpieces: HTML elements, important for moving the images  
*/

//creates 2D 8x8 Array keeping track of Board composition, c is color and t is (piece-)type
var squareStates = [...Array(8)].map(e => Array(8).fill({c:undefined,t:undefined}));

//used for piece selection and highlighting
var pieceSelected = false;
var selectedPiece;

//keeps track of possible castling, the first value is about if short castling is possible (o-o), the second is about if long castling is possible (o-o-o)
whitecastling = [true, true];
blackcastling = [true, true];

//lists containing info on white and black pieces
var whitepieces = document.getElementsByTagName("whitepiece");
var whitepiecepos = [[4, 0], [1, 0], [6, 0], [0, 0], [7, 0], [2, 0], [5, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]];
squareStates[4][0] = {c:"w",t:"k"};
squareStates[1][0] = {c:"w",t:"n"};
squareStates[6][0] = {c:"w",t:"n"};
squareStates[0][0] = {c:"w",t:"r"};
squareStates[7][0] = {c:"w",t:"r"};
squareStates[2][0] = {c:"w",t:"b"};
squareStates[5][0] = {c:"w",t:"b"};
squareStates[3][0] = {c:"w",t:"q"};
squareStates[0][1] = {c:"w",t:"p"};
squareStates[1][1] = {c:"w",t:"p"};
squareStates[2][1] = {c:"w",t:"p"};
squareStates[3][1] = {c:"w",t:"p"};
squareStates[4][1] = {c:"w",t:"p"};
squareStates[5][1] = {c:"w",t:"p"};
squareStates[6][1] = {c:"w",t:"p"};
squareStates[7][1] = {c:"w",t:"p"};

var blackpieces = document.getElementsByTagName("blackpiece");
var blackpiecepos = [[4, 7], [1, 7], [6, 7], [0, 7], [7, 7], [2, 7], [5, 7], [3, 7], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]];
squareStates[4][7] = {c:"b",t:"k"};
squareStates[1][7] = {c:"b",t:"n"};
squareStates[6][7] = {c:"b",t:"n"};
squareStates[0][7] = {c:"b",t:"r"};
squareStates[7][7] = {c:"b",t:"r"};
squareStates[2][7] = {c:"b",t:"b"};
squareStates[5][7] = {c:"b",t:"b"};
squareStates[3][7] = {c:"b",t:"q"};
squareStates[0][6] = {c:"b",t:"p"};
squareStates[1][6] = {c:"b",t:"p"};
squareStates[2][6] = {c:"b",t:"p"};
squareStates[3][6] = {c:"b",t:"p"};
squareStates[4][6] = {c:"b",t:"p"};
squareStates[5][6] = {c:"b",t:"p"};
squareStates[6][6] = {c:"b",t:"p"};
squareStates[7][6] = {c:"b",t:"p"};

//piece-square tables, determine the value of a piece at a given position (found on the Chess Programming Wiki)
//careful: the rows are in reversed order (this means that the 0th element is actually the 8th row)
//they are two-dimensional so we can easily use negative indexing for white
var pawnPST = [[ 0,  0,  0,  0,  0,  0,  0,  0],
                [50, 50, 50, 50, 50, 50, 50, 50],
                [10, 10, 20, 30, 30, 20, 10, 10],
                [5,  5, 10, 25, 25, 10,  5,  5],
                [0,  0,  0, 20, 20,  0,  0,  0],
                [5, -5,-10,  0,  0,-10, -5,  5],
                [5, 10, 10,-20,-20, 10, 10,  5],
                [0,  0,  0,  0,  0,  0,  0,  0]]

var knightPST = [[-50,-40,-30,-30,-30,-30,-40,-50],
                [-40,-20,  0,  0,  0,  0,-20,-40],
                [-30,  0, 10, 15, 15, 10,  0,-30],
                [-30,  5, 15, 20, 20, 15,  5,-30],
                [-30,  0, 15, 20, 20, 15,  0,-30],
                [-30,  5, 10, 15, 15, 10,  5,-30],
                [-40,-20,  0,  5,  5,  0,-20,-40],
                [-50,-40,-30,-30,-30,-30,-40,-50]]

var bishopPST = [[-20,-10,-10,-10,-10,-10,-10,-20],
                [-10,  0,  0,  0,  0,  0,  0,-10],
                [-10,  0,  5, 10, 10,  5,  0,-10],
                [-10,  5,  5, 10, 10,  5,  5,-10],
                [-10,  0, 10, 10, 10, 10,  0,-10],
                [-10, 10, 10, 10, 10, 10, 10,-10],
                [-10,  5,  0,  0,  0,  0,  5,-10],
                [-20,-10,-10,-10,-10,-10,-10,-20]]

var rookPST =   [[0,  0,  0,  0,  0,  0,  0,  0],
                [5, 10, 10, 10, 10, 10, 10,  5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [-5,  0,  0,  0,  0,  0,  0, -5],
                [0,  0,  0,  5,  5,  0,  0,  0]]

var queenPST = [[-20,-10,-10, -5, -5,-10,-10,-20],
                [-10,  0,  0,  0,  0,  0,  0,-10],
                [-10,  0,  5,  5,  5,  5,  0,-10],
                [-5,  0,  5,  5,  5,  5,  0, -5],
                [0,  0,  5,  5,  5,  5,  0, -5],
                [-10,  5,  5,  5,  5,  5,  0,-10],
                [-10,  0,  5,  0,  0,  0,  0,-10],
                [-20,-10,-10, -5, -5,-10,-10,-20]]


//the king has two different PSTs because he has very different behaviour in middle- and endgame
//differentiation has yet to be implemented, currently only kingMGPST is used
var kingMGPST = [[-30,-40,-40,-50,-50,-40,-40,-30],
                [-30,-40,-40,-50,-50,-40,-40,-30],
                [-30,-40,-40,-50,-50,-40,-40,-30],
                [-30,-40,-40,-50,-50,-40,-40,-30],
                [-20,-30,-30,-40,-40,-30,-30,-20],
                [-10,-20,-20,-20,-20,-20,-20,-10],
                [ 20, 20,  0,  0,  0,  0, 20, 20],
                [ 20, 30, 10,  0,  0, 10, 30, 20]]

var kingEGPST = [[-50,-40,-30,-20,-20,-30,-40,-50],
                [-30,-20,-10,  0,  0,-10,-20,-30],
                [-30,-10, 20, 30, 30, 20,-10,-30],
                [-30,-10, 30, 40, 40, 30,-10,-30],
                [-30,-10, 30, 40, 40, 30,-10,-30],
                [-30,-10, 20, 30, 30, 20,-10,-30],
                [-30,-30,  0,  0,  0,  0,-30,-30],
                [-50,-30,-30,-30,-30,-30,-30,-50]]


//selected position
var selectpos = [0, 0];

// indicator positions
var indpos = [];

//amount of indicators on board
var indcounter = 0;

//bottom leftmost point of chessboard
var botleft = {x:undefined,y:undefined};

//array containing legal moves
var legalmoves = [];
var selectedlegalmoves = [];

//unit variable contains length of square
var unit = 0;

//used for resizing
var viewport_width = window.innerWidth;
var viewport_height = window.innerWidth;

//used for highligting
var highlightSelect;

//function to resize the elements on startup
window.onload = function(){
    //determine length of square by size of chessboard (the chessboard size is automatically determined with the use of css)
    unit = chessboard.clientHeight / 8;
    //determine the position of the bottom left point ([0, 0])
    botleft.x = chessboard.offsetLeft - chessboard.offsetWidth/2;
    botleft.y = chessboard.offsetTop + chessboard.offsetHeight / 2 - unit;

    
    for (let i = 0; i < whitepieces.length; i++) {
        whitepieces[i].style.width = unit;
        whitepieces[i].style.height = unit;
        whitepieces[i].style.left = botleft.x + whitepiecepos[i][0] * unit;
        whitepieces[i].style.top = botleft.y - whitepiecepos[i][1] * unit;

        //set piece id to index for easier referencing
        whitepieces[i].id = i;
    }

    for (let i = 0; i < blackpieces.length; i++) {
        blackpieces[i].style.width = unit;
        blackpieces[i].style.height = unit;
        blackpieces[i].style.left = botleft.x + blackpiecepos[i][0] * unit;
        blackpieces[i].style.top = botleft.y - blackpiecepos[i][1] * unit;

        //index -> piece id
        blackpieces[i].id = i;
    }
}


//this function resizes all elements when the window is resized
window.onresize = function(){
    unit = chessboard.clientHeight / 8;
    botleft.x = chessboard.offsetLeft - chessboard.offsetWidth/2;
    botleft.y = chessboard.offsetTop + chessboard.offsetHeight / 2 - unit;

    for (let i = 0; i < whitepieces.length; i++) {
        //move and resize piece
        whitepieces[i].style.width = unit;
        whitepieces[i].style.height = unit;
        whitepieces[i].style.left = botleft.x + whitepiecepos[i][0] * unit;
        whitepieces[i].style.top = botleft.y - whitepiecepos[i][1] * unit;
    }

    for(let i = 0; i < blackpieces.length; i++) {
        blackpieces[i].style.width = unit;
        blackpieces[i].style.height = unit;
        blackpieces[i].style.left = botleft.x + blackpiecepos[i][0] * unit;
        blackpieces[i].style.top = botleft.y - blackpiecepos[i][1] * unit;
    }
    
    //resize the selection square (yellow) and the indicators (grey dots) aswell
    tempsel = document.getElementById("select");
    if (tempsel != null)
    {
        tempsel.style.width = unit;
        tempsel.style.height = unit;
        tempsel.style.left = botleft.x + selectpos[0] * unit;
        tempsel.style.top = botleft.y - selectpos[1] * unit;
    }

    let gamma = 0;
    while(true)
    {
        indsel = document.getElementsByClassName(gamma);
        if(indsel.length==0) break;
        indsel[0].style.width = unit;
        indsel[0].style.height = unit;
        indsel[0].style.left = botleft.x + indpos[gamma][0] * unit;
        indsel[0].style.top = botleft.y - indpos[gamma][1] * unit;
        gamma++;
    }
}

//make board and pieces "unrightclickable"
chessboard.oncontextmenu = function(event){
    event.preventDefault()
}

//iterate through pieces and make them "unclickable"
for(let i = 0; i < whitepieces.length; i++)
{
    whitepieces[i].oncontextmenu = function(event){
        event.preventDefault()
    }
}

for(let i = 0; i < blackpieces.length; i++)
{
    blackpieces[i].oncontextmenu = function(event){
        event.preventDefault()
    }
}


//function gets called when the chessboard is clicked
chessboard.onclick = function(event){
    //displays the mouse position in the top left (window position and board position)
    var rect = event.target.getBoundingClientRect();
    mousePos = { x: event.clientX - rect.left, y: rect.bottom - event.clientY};
    mousePosText.textContent = `(${mousePos.x}, ${mousePos.y}) \n ${squareStates[2][0].t}`;

    let position = "A8";
    chessmousePos = { x: Math.ceil(mousePos.x / (chessboard.clientWidth / 8)) - 1, y: -Math.ceil(-mousePos.y / (chessboard.clientHeight / 8))};
    mouseFieldText.textContent = `${chessmousePos.x}, ${chessmousePos.y}`

    //if a piece is selected and the chessboard gets clicked, the piece should get deselected
    if (pieceSelected ) {
        var oldhighlight = document.getElementById("select");
        if(oldhighlight != null) {
            oldhighlight.remove();
        }
        if(indcounter == 0) {return;}
        for(i=0;i<indcounter;i++)
        {
            boardparent[0].removeChild(document.getElementById("moveind"));
        }
        pieceSelected = false;
    }
}

//add eventlistener to each piece to check for click
for (let i = 0; i < whitepieces.length; i++) {
    whitepieces[i].addEventListener("click", piececlick);
}

for (let i = 0; i < blackpieces.length; i++) {
    blackpieces[i].addEventListener("click", piececlick);
}

//function is called when piece is clicked on
function piececlick(event) {
    //if the selected piece is white
    if (event.target.tagName == "WHITEPIECE") {
        //if the same piece is already selected, do nothing
        if(selectedPiece == event.target && pieceSelected) return;
        if (indpos.length != 0)
        {
        //if needed, delete old move indicators
        if (pieceSelected == true)
        {
            for(i=0;i<indcounter;i++)
            {
                boardparent[0].removeChild(document.getElementById("moveind"));
            }
        }
    }

        //select the new piece
        selectedPiece = event.target;
        //delete old highlight
        var oldhighlight = document.getElementById("select");
        if(oldhighlight != null) {
            oldhighlight.remove();
        }
        //create and adjust the new select
        var highlightSelect = new Image (1, 1);
        highlightSelect.src = "images/selected.png";
        highlightSelect.style.left = selectedPiece.offsetLeft;
        highlightSelect.style.top = selectedPiece.offsetTop;
        highlightSelect.style.width = unit;
        highlightSelect.style.height = unit;
        highlightSelect.id = "select";
        boardparent[0].appendChild(highlightSelect);
        selectpos = whitepiecepos[selectedPiece.id];
        pieceSelected = true;

        //now that the piece is selected, its legal moves should be displayed aswell
        //display possible moves
        selectedlegalmoves = getselectedlegalmoves(whitepiecepos, selectedPiece.id, "w", squareStates);
        let slmlen = selectedlegalmoves.length;
        let cnt = 0;

        //here we need to filter out moves that would ignore check
        for(let o = 0; o < slmlen; o++)
        {
            if(selectedlegalmoves.length == 0) {return};
            let Sblackpiecepos = JSON.parse(JSON.stringify(blackpiecepos));
            let Swhitepiecepos = JSON.parse(JSON.stringify(whitepiecepos));
            let SsquareStates = JSON.parse(JSON.stringify(squareStates));
            let takenIndex = 0;
            
            //take piece if necessary
            if(SsquareStates[selectedlegalmoves[o - cnt][0]][selectedlegalmoves[o - cnt][1]].c == "b")
            {
                for(let b=0;b<Sblackpiecepos.length;b++)
                {
                    if (Sblackpiecepos[b][0] == selectedlegalmoves[o - cnt][0] && Sblackpiecepos[b][1] == selectedlegalmoves[o - cnt][1])
                    {
                        takenIndex = b;
                        break;
                    }
                }
                Sblackpiecepos.splice(takenIndex, 1);
            }

            SsquareStates[selectedlegalmoves[o - cnt][0]][selectedlegalmoves[o - cnt][1]] = {c: "w", t: SsquareStates[Swhitepiecepos[selectedPiece.id][0]][Swhitepiecepos[selectedPiece.id][1]].t};
            SsquareStates[Swhitepiecepos[selectedPiece.id][0]][Swhitepiecepos[selectedPiece.id][1]] = {c: undefined, t: undefined} ;
            Swhitepiecepos[selectedPiece.id] = selectedlegalmoves[o - cnt];

            let sRes = search(1, Sblackpiecepos, Swhitepiecepos, SsquareStates, false);

            //if the resulting position leads to mate in one, remove the position from selectedlegalmoves 
            if(sRes[2] < -40000)
            {
                selectedlegalmoves.splice(o - cnt, 1);
                cnt = cnt + 1;
            }
        }
        indpos = selectedlegalmoves;
        indcounter = selectedlegalmoves.length;
        if(selectedlegalmoves.length == 0) {return};
        
        //parent element
        var legalmovesarray = [];
        indcounter = selectedlegalmoves.length;
        for(i=0;i<indcounter; i++) {
            //display indicator
            legalmovesarray[i] = new Image (1, 1)
            legalmovesarray[i].src = "images/possmove.png"
            legalmovesarray[i].style.width = unit;
            legalmovesarray[i].style.height = unit;
            legalmovesarray[i].style.top = botleft.y - selectedlegalmoves[i][1] * unit;
            legalmovesarray[i].style.left = botleft.x + selectedlegalmoves[i][0] * unit;
            legalmovesarray[i].style.opacity = 0.7;
            legalmovesarray[i].style.zIndex = 5;
            legalmovesarray[i].id = "moveind";
            legalmovesarray[i].className = i;
            legalmovesarray[i].addEventListener("click", indclick)
            boardparent[0].appendChild(legalmovesarray[i]);
        }
    }
}

//gets called on indicator click
//the main purpose of the indicators is that a move only gets made when an indicator gets clicked
//we don't have to check if the move a player wants to make is legal or not, we only give them the legal options
async function indclick(event){
    //remove selector and indicator
    boardparent[0].removeChild(document.getElementById("select"));
    for(i=0;i<indcounter;i++)
    {
        boardparent[0].removeChild(document.getElementById("moveind"));
    }
    pieceSelected = false;

    //check if black piece gets taken
    var newPos = selectedlegalmoves[event.target.className];
    var takenIndex = 0;
    if (squareStates[newPos[0]][newPos[1]].c == "b")
    {
        //get index of taken piece
        for(i=0;i<blackpiecepos.length;i++)
        {
            if (blackpiecepos[i][0] == newPos[0] && blackpiecepos[i][1] == newPos[1])
            {
                takenIndex = i;
                break;
            }
        }
        
        blackpieces[takenIndex].style.visibility = "hidden";

        //delete piece from all arrays
        blackpiecepos.splice(takenIndex, 1);
        blackpieces[takenIndex].remove();

        //adjust id arrays
        for(i = takenIndex; i < blackpiecepos.length;i++) {
            blackpieces[i].id = parseInt(blackpieces[i].id) - 1;
        }
    }


    selectedPiece.style.left = event.target.style.left;
    selectedPiece.style.top = event.target.style.top;
    SPindex = selectedPiece.id;

    //see if castling becomes illegal
    if(squareStates[4][0].t != "k")
    {
        whitecastling[0] = false;
        whitecastling[1] = false;
    }
    else if(squareStates[0][0].t != "r")
    {
        whitecastling[1] = false;
    }
    else if(squareStates[7][0].t != "r")
    {
        whitecastling[0] = false;
    }

    //change squareStates array
    squareStates[newPos[0]][newPos[1]] = squareStates[whitepiecepos[SPindex][0]][whitepiecepos[SPindex][1]];
    squareStates[whitepiecepos[SPindex][0]][whitepiecepos[SPindex][1]] = {c:undefined,t:undefined};
    //if the piece is a pawn that reaches line 8, promote to queen
    if(squareStates[newPos[0]][newPos[1]].t == "p" && newPos[1] == 7)
    {
        squareStates[newPos[0]][newPos[1]].t = "q";
        whitepieces[SPindex].className = "whitequeen";
    }
   
    //check for castling short
    if(squareStates[newPos[0]][newPos[1]].t == "k" && newPos[0] == 6 && whitecastling[0])
    {
        //move the rook aswell
        squareStates[5][0] = {c: "w", t: "r"};
        squareStates[7][0] = {c: undefined, t: undefined};
        let rookindex = 0;
        rookindex = whitepiecepos.findIndex(x => x[0] == 7 && x[1] == 0);
        whitepiecepos[rookindex][0] = 5;
        whitepieces[rookindex].style.left = botleft.x + 5 * unit;
    }

    //check for castling long
    if(squareStates[newPos[0]][newPos[1]].t == "k" && newPos[0] == 2 && whitecastling[1])
    {
        //move the rook aswell
        squareStates[3][0] = {c: "w", t: "r"};
        squareStates[0][0] = {c: undefined, t: undefined};
        let rookindex = 0;
        rookindex = whitepiecepos.findIndex(x => x[0] == 0 && x[1] == 0);
        whitepiecepos[rookindex][0] = 3;
        whitepieces[rookindex].style.left = botleft.x + 3 * unit;
    }

    //store new position
    whitepiecepos[SPindex][0] = newPos[0];
    whitepiecepos[SPindex][1] = newPos[1];

    //eval position (for debugging purposes)
    //evalboard(blackpiecepos, whitepiecepos, squareStates);

    //end game if checkmate
    if(search(2, blackpiecepos, whitepiecepos, squareStates, -1000000, 1000000, false)[2] > -10000)
    {
        for (let i = 0; i < whitepieces.length; i++) {
            whitepieces[i].removeEventListener("click", piececlick);
        }
        
        for (let i = 0; i < blackpieces.length; i++) {
            blackpieces[i].removeEventListener("click", piececlick);
        }

        alert("Checkmate, you win!");
        return;
    }
    await new Promise(r => setTimeout(r, 10));
    //call func for enemy move
    enemyturn();
}


function enemyturn() {
    //this is where the enemy makes a turn

    //skip if no pieces are left
    if(blackpiecepos.length == 0) return;

    var MPindex = 0;
    //call search function, which returns the best move in the format [[starting position of moving piece], [ending position of moving piece]]
    var solution = search(4, blackpiecepos, whitepiecepos, squareStates, -1000000, 1000000, false);
    movechoice = solution[1];
    MPindex = blackpiecepos.findIndex(x => x[0] == solution[0][0] && x[1] == solution[0][1]);
    
    //take piece if necessary
    var takenIndex = 0;
    if (squareStates[movechoice[0]][movechoice[1]].c == "w")
    {
        //get index of taken piece
        for(i=0;i<whitepiecepos.length;i++)
        {
            if (whitepiecepos[i][0] == movechoice[0] && whitepiecepos[i][1] == movechoice[1])
            {
                takenIndex = i;
                break;
            }
        }
        
        whitepieces[takenIndex].style.visibility = "hidden";

        //delete piece from all arrays
        whitepiecepos.splice(takenIndex, 1);
        whitepieces[takenIndex].remove();

        //adjust id arrays
        for(i = takenIndex; i < whitepiecepos.length;i++) {
            whitepieces[i].id = parseInt(whitepieces[i].id) - 1;
        }
    }

    //adjust variables = make move
    squareStates[movechoice[0]][movechoice[1]] = squareStates[blackpiecepos[MPindex][0]][blackpiecepos[MPindex][1]];
    squareStates[blackpiecepos[MPindex][0]][blackpiecepos[MPindex][1]] = {c:undefined,t:undefined};
    blackpiecepos[MPindex][0] = movechoice[0];
    blackpiecepos[MPindex][1] = movechoice[1];
    blackpieces[MPindex].style.left = botleft.x + blackpiecepos[MPindex][0] * unit;
    blackpieces[MPindex].style.top = botleft.y - blackpiecepos[MPindex][1] * unit;

    //check for castling short
    if(squareStates[movechoice[0]][movechoice[1]].t == "k" && movechoice[0] == 6 && blackcastling[0])
    {
        //move the rook aswell
        squareStates[5][7] = {c: "b", t: "r"};
        squareStates[7][7] = {c: undefined, t: undefined};
        let rookindex = 0;
        rookindex = blackpiecepos.findIndex(x => x[0] == 7 && x[1] == 7);
        blackpiecepos[rookindex][0] = 5;
        blackpieces[rookindex].style.left = botleft.x + 5 * unit;
    }

    //check for castling long
    if(squareStates[movechoice[0]][movechoice[1]].t == "k" && movechoice[0] == 2 && blackcastling[1])
    {
        //move the rook aswell
        squareStates[3][7] = {c: "b", t: "r"};
        squareStates[0][7] = {c: undefined, t: undefined};
        let rookindex = 0;
        rookindex = blackpiecepos.findIndex(x => x[0] == 0 && x[1] == 7);
        blackpiecepos[rookindex][0] = 3;
        blackpieces[rookindex].style.left = botleft.x + 3 * unit;
    }

    //see if castling becomes illegal
    if(squareStates[4][7].t != "k")
    {
        blackcastling[0] = false;
        blackcastling[1] = false;
    }
    else if(squareStates[0][7].t != "r")
    {
        blackcastling[1] = false;
    }
    else if(squareStates[7][7].t != "r")
    {
        blackcastling[0] = false;
    }

    //if the piece is a pawn that reaches line 8, promote to queen
    if(squareStates[movechoice[0]][movechoice[1]].t == "p" && movechoice[1] == 0)
    {
        squareStates[movechoice[0]][movechoice[1]].t = "q";
        blackpieces[MPindex].className = "blackqueen";
    }

    //call for current evaluation (debugging purposes)
    //console.log(evalboard(blackpiecepos, whitepiecepos, squareStates));

    //end game if checkmate
    if(search(2, blackpiecepos, whitepiecepos, squareStates, -1000000, 1000000, true)[2] < -40000)
    {
        for (let i = 0; i < whitepieces.length; i++) {
            whitepieces[i].removeEventListener("click", piececlick);
        }
        
        for (let i = 0; i < blackpieces.length; i++) {
            blackpieces[i].removeEventListener("click", piececlick);
        }

        alert("Checkmate, you lost!");
    }
}

// ---- MOVE GENERATION ----

//this is the function for finding the best move
//not finished yet, this function doesn't work and the next step is a depth of 2
function search(depth, bpp, wpp, sS, alpha, beta, col) {
    //debugger;
    //a lot of variables ._.
    let bestPiece = [0, 0];
    let bestMove = [0, 0];
    let besteval = 100000;
    let Sblackpiecepos = JSON.parse(JSON.stringify(bpp));
    let Swhitepiecepos = JSON.parse(JSON.stringify(wpp));
    let SsquareStates = JSON.parse(JSON.stringify(sS));
    let takenIndex = 0;
    let Seval = 0;
    let currentmove = [0, 0, 0]

    //what if depth isnt one
    if(depth!=1)
    {
        if(!col)
        {
            for (let m=0;m<Sblackpiecepos.length;m++)
            {
                let Slegalmoves = getselectedlegalmoves(Sblackpiecepos, m, "b", SsquareStates);
    
                for(let n=0;n<Slegalmoves.length;n++)
                {
                    //eat if necessary
                    if(SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].c == "w")
                    {
                        takenIndex = Swhitepiecepos.findIndex(x => x[0] == Slegalmoves[n][0] && x[1] == Slegalmoves[n][1]);
                        Swhitepiecepos.splice(takenIndex, 1);
                    }
    
                    SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]] = {c: "b", t: SsquareStates[Sblackpiecepos[m][0]][Sblackpiecepos[m][1]].t};
                    SsquareStates[Sblackpiecepos[m][0]][Sblackpiecepos[m][1]] = {c: undefined, t: undefined} 

                    //castling short
                    if(SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].t == "k" && Slegalmoves[n][0] == 6 && blackcastling[0] && Sblackpiecepos[m][0] == 4 && SsquareStates[7][7].t == "r")
                    {
                        //move the rook aswell
                        SsquareStates[5][7] = {c: "b", t: "r"};
                        SsquareStates[7][7] = {c: undefined, t: undefined};
                        let rookindex = 0;
                        rookindex = Sblackpiecepos.findIndex(x => x[0] == 7 && x[1] == 7);
                        Sblackpiecepos[rookindex][0] = 5;
                    }
                    //castling long
                    if(squareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].t == "k" && Slegalmoves[n][0] == 2 && blackcastling[0] && Sblackpiecepos[m][0] == 4 && SsquareStates[0][7].t == "r")
                    {
                        //move the rook aswell
                        SsquareStates[3][7] = {c: "b", t: "r"};
                        SsquareStates[0][7] = {c: undefined, t: undefined};
                        let rookindex = 0;
                        rookindex = Sblackpiecepos.findIndex(x => x[0] == 0 && x[1] == 7);
                        Sblackpiecepos[rookindex][0] = 3;
                    }

                    Sblackpiecepos[m] = Slegalmoves[n];

                    //promotion
                    if(SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].t == "p" && Slegalmoves[n][1] == 0)
                    {
                        SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].t = "q";
                    }
                    
                    currentmove = search(depth-1, Sblackpiecepos, Swhitepiecepos, SsquareStates, alpha, beta, true);
                    if (currentmove[2] < besteval)
                    {
                        bestPiece = [...bpp[m]];
                        bestMove = [...Slegalmoves[n]];
                        besteval =  currentmove[2];
                        beta = besteval;
                        //alpha-beta-pruning
                        if (beta <= alpha) {break};
                    }
    
                    Sblackpiecepos = JSON.parse(JSON.stringify(bpp));
                    Swhitepiecepos = JSON.parse(JSON.stringify(wpp));
                    SsquareStates = JSON.parse(JSON.stringify(sS));
                }
                //alpha-beta-pruning
                if (beta <= alpha) {break};
            }
            return [bestPiece, bestMove, besteval];
        }

        besteval = -100000;
        for (let m=0;m<Swhitepiecepos.length;m++)
        {
            let Slegalmoves = getselectedlegalmoves(Swhitepiecepos, m, "w", SsquareStates);

            for(let n=0;n<Slegalmoves.length;n++)
            {
                //eat if necessary
                if(SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].c == "b")
                {
                    takenIndex = Sblackpiecepos.findIndex(x => x[0] == Slegalmoves[n][0] && x[1] == Slegalmoves[n][1]);
                    Sblackpiecepos.splice(takenIndex, 1);
                }

                SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]] = {c: "w", t: SsquareStates[Swhitepiecepos[m][0]][Swhitepiecepos[m][1]].t};
                SsquareStates[Swhitepiecepos[m][0]][Swhitepiecepos[m][1]] = {c: undefined, t: undefined} 

                //castling short
                if(SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].t == "k" && Slegalmoves[n][0] == 6 && whitecastling[0] && Swhitepiecepos[m][0] == 4 && SsquareStates[7][0].t == "r")
                {
                    //move the rook aswell
                    SsquareStates[5][0] = {c: "w", t: "r"};
                    SsquareStates[7][0] = {c: undefined, t: undefined};
                    let rookindex = 0;
                    rookindex = Swhitepiecepos.findIndex(x => x[0] == 7 && x[1] == 0);
                    Swhitepiecepos[rookindex][0] = 5;
                }
                //castling long
                if(squareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].t == "k" && Slegalmoves[n][0] == 2 && whitecastling[0] && Swhitepiecepos[m][0] == 4 && SsquareStates[0][0].t == "r")
                {
                    //move the rook aswell
                    SsquareStates[3][0] = {c: "w", t: "r"};
                    SsquareStates[0][0] = {c: undefined, t: undefined};
                    let rookindex = 0;
                    rookindex = Swhitepiecepos.findIndex(x => x[0] == 0 && x[1] == 0);
                    Swhitepiecepos[rookindex][0] = 3;
                }

                Swhitepiecepos[m] = Slegalmoves[n];
                
                //if the piece is a pawn that reaches line 8, promote to queen
                if(SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].t == "p" && Slegalmoves[n][1] == 7)
                {
                    SsquareStates[Slegalmoves[n][0]][Slegalmoves[n][1]].t = "q";
                }

                currentmove = search(depth-1, Sblackpiecepos, Swhitepiecepos, SsquareStates, alpha, beta, false);
                //console.log(currentmove);
                //console.log(Slegalmoves[n][0], Slegalmoves[n][1]);
                if (currentmove[2] > besteval)
                {
                    bestPiece = [...wpp[m]];
                    bestMove = [...Slegalmoves[n]];
                    besteval =  currentmove[2];
                    alpha = besteval;
                    //alpha-beta-pruning
                    if (beta <= alpha) {break};
                }

                Sblackpiecepos = JSON.parse(JSON.stringify(bpp));
                Swhitepiecepos = JSON.parse(JSON.stringify(wpp));
                SsquareStates = JSON.parse(JSON.stringify(sS));
            }
            //alpha-beta-pruning
            if (beta <= alpha) {break};
        }
        return [bestPiece, bestMove, besteval];
    }

    // what if it is

    if (!col)
    {
        besteval = (100000);
        for(let iter=0;iter<Sblackpiecepos.length;iter++)
        {
            //iterate through possible move
            let Slegalmoves = getselectedlegalmoves(Sblackpiecepos, iter, "b", SsquareStates);
            if(Slegalmoves.length == 0) continue;
            for(let l=0;l<Slegalmoves.length;l++)
            {
                //simulate move and evaluate position
                //eat if necessary
                if(SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].c == "w")
                {
                    takenIndex = Swhitepiecepos.findIndex(x => x[0] == Slegalmoves[l][0] && x[1] == Slegalmoves[l][1]);
                    Swhitepiecepos.splice(takenIndex, 1);
                }
                SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]] = {c: "b", t: SsquareStates[Sblackpiecepos[iter][0]][Sblackpiecepos[iter][1]].t};
                SsquareStates[Sblackpiecepos[iter][0]][Sblackpiecepos[iter][1]] = {c: undefined, t: undefined} 

                //castling short
                if(SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].t == "k" && Slegalmoves[l][0] == 6 && blackcastling[0] && Sblackpiecepos[iter][0] == 4 && SsquareStates[7][7].t == "r")
                {
                    //move the rook aswell
                    SsquareStates[5][7] = {c: "b", t: "r"};
                    SsquareStates[7][7] = {c: undefined, t: undefined};
                    let rookindex = 0;
                    rookindex = Sblackpiecepos.findIndex(x => x[0] == 7 && x[1] == 7);
                    Sblackpiecepos[rookindex][0] = 5;
                }
                //castling long
                if(squareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].t == "k" && Slegalmoves[l][0] == 2 && blackcastling[0] && Sblackpiecepos[iter][0] == 4 && SsquareStates[0][7].t == "r")
                {
                    //move the rook aswell
                    SsquareStates[3][7] = {c: "b", t: "r"};
                    SsquareStates[0][7] = {c: undefined, t: undefined};
                    let rookindex = 0;
                    rookindex = Sblackpiecepos.findIndex(x => x[0] == 0 && x[1] == 7);
                    Sblackpiecepos[rookindex][0] = 3;
                }

                Sblackpiecepos[iter] = Slegalmoves[l];

                //promotion
                if(SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].t == "p" && Slegalmoves[l][1] == 0)
                {
                    SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].t = "q";
                }
                
                Seval = evalboard(Sblackpiecepos,Swhitepiecepos,SsquareStates);
                if(Seval < besteval)
                {
                    bestPiece = [...bpp[iter]];
                    bestMove = [...Slegalmoves[l]];
                    besteval = Seval;
                }

                //reset position
                Sblackpiecepos = JSON.parse(JSON.stringify(bpp));
                Swhitepiecepos = JSON.parse(JSON.stringify(wpp));
                SsquareStates = JSON.parse(JSON.stringify(sS));
                Seval=0;
            }
        }   

        //console.log([bestPiece, bestMove, besteval]);
        return [bestPiece, bestMove, besteval];
    }


    //simulate all possible boards
    //iterate through piece
    besteval = (-100000);
    for(let iter=0;iter<Swhitepiecepos.length;iter++)
    {
        //iterate through possible move
        let Slegalmoves = getselectedlegalmoves(Swhitepiecepos, iter, "w", SsquareStates);
        if(Slegalmoves.length == 0) continue;
        for(let l=0;l<Slegalmoves.length;l++)
        {
            //simulate move and evaluate position
            //eat if necessary
            if(SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].c == "b")
            {
                takenIndex = Sblackpiecepos.findIndex(x => x[0] == Slegalmoves[l][0] && x[1] == Slegalmoves[l][1]);
                Sblackpiecepos.splice(takenIndex, 1);
            }
            SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]] = {c: "w", t: SsquareStates[Swhitepiecepos[iter][0]][Swhitepiecepos[iter][1]].t};
            SsquareStates[Swhitepiecepos[iter][0]][Swhitepiecepos[iter][1]] = {c: undefined, t: undefined} 
            
            //castling short
            if(SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].t == "k" && Slegalmoves[l][0] == 6 && whitecastling[0] && Swhitepiecepos[iter][0] == 4 && SsquareStates[7][0].t == "r")
            {
                //move the rook aswell
                SsquareStates[5][0] = {c: "w", t: "r"};
                SsquareStates[7][0] = {c: undefined, t: undefined};
                let rookindex = 0;
                rookindex = Swhitepiecepos.findIndex(x => x[0] == 7 && x[1] == 0);
                Swhitepiecepos[rookindex][0] = 5;
            }
            //castling long
            if(squareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].t == "k" && Slegalmoves[l][0] == 2 && whitecastling[0] && Swhitepiecepos[iter][0] == 4 && SsquareStates[0][0].t == "r")
            {
                //move the rook aswell
                SsquareStates[3][0] = {c: "w", t: "r"};
                SsquareStates[0][0] = {c: undefined, t: undefined};
                let rookindex = 0;
                rookindex = Swhitepiecepos.findIndex(x => x[0] == 0 && x[1] == 0);
                Swhitepiecepos[rookindex][0] = 3;
            }

            Swhitepiecepos[iter] = Slegalmoves[l];

            //if the piece is a pawn that reaches line 8, promote to queen
            if(SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].t == "p" && Slegalmoves[l][1] == 7)
            {
                SsquareStates[Slegalmoves[l][0]][Slegalmoves[l][1]].t = "q";
            }

            Seval = evalboard(Sblackpiecepos,Swhitepiecepos,SsquareStates);
            if(Seval > besteval)
            {
                bestPiece = [...wpp[iter]];
                bestMove = [...Slegalmoves[l]];
                besteval = Seval;
            }
            
            //reset position
            Sblackpiecepos = JSON.parse(JSON.stringify(bpp));
            Swhitepiecepos = JSON.parse(JSON.stringify(wpp));
            SsquareStates = JSON.parse(JSON.stringify(sS));
            Seval=0;
        }
    }
    return [bestPiece, bestMove, besteval];
}

//calculate legal moves for selected piece
function getselectedlegalmoves(piecearray, pieceid, piececolor, currentsS) {

    //identify piece type -> actual function
    switch(currentsS[piecearray[pieceid][0]][piecearray[pieceid][1]].t)
    {
        case "k":
            return(getKingMoves([piecearray[pieceid][0], piecearray[pieceid][1]], piececolor, currentsS));
        case "n":
            return(getKnightMoves([piecearray[pieceid][0], piecearray[pieceid][1]], piececolor, currentsS));
        case "r":
            return(getRookMoves([piecearray[pieceid][0], piecearray[pieceid][1]], piececolor, currentsS));
        case "b":
            return(getBishopMoves([piecearray[pieceid][0], piecearray[pieceid][1]], piececolor, currentsS));
        case "q":
            //queen = rook + bishop :)
            return(getBishopMoves([piecearray[pieceid][0], piecearray[pieceid][1]], piececolor, currentsS).concat(getRookMoves([piecearray[pieceid][0], piecearray[pieceid][1]], piececolor, currentsS)));
        case "p":
            return(getPawnMoves([piecearray[pieceid][0], piecearray[pieceid][1]], piececolor, currentsS));
    }
}

function getKingMoves(pos, col, currentsS) {
    let possiblesquares = [];
    for (let i = -1; i < 2; i++){
        for (let j = -1; j < 2; j++){
            if(i == j && j == 0) continue;
            if(pos[0]+j<0||pos[0]+j>7) continue;
            if(pos[1]+i<0||pos[1]+i>7) continue;
            if(currentsS[pos[0]+j][pos[1]+i].c == col) continue;
            possiblesquares.push([pos[0]+j, pos[1]+i]);
        }
    }

    //castling
    if(col == "w") {
        //short
        if(whitecastling[0] == true)
        {
            //check if space is empty and king is in right space (for search func)
            if(currentsS[5][0].t == undefined && currentsS[6][0].t == undefined && currentsS[4][0].t == "k")
            {
                possiblesquares.push([6, 0]);
            }
        }
        //long
        if(whitecastling[1] == true)
        {
            //check if space is empty
            if(currentsS[1][0].t == undefined && currentsS[2][0].t == undefined && currentsS[3][0].t == undefined && currentsS[4][0].t == "k")
            {
                possiblesquares.push([2, 0]);
            }
        }
    }
    //if black
    else {
        //short
        if(blackcastling[0] == true)
        {
            //check if space is empty
            if(currentsS[5][7].t == undefined && currentsS[6][7].t == undefined && currentsS[4][7].t == "k")
            {
                possiblesquares.push([6, 7]);
            }
        }
        //long
        if(blackcastling[1] == true)
        {
            //check if space is empty
            if(currentsS[1][7].t == undefined && currentsS[2][7].t == undefined && currentsS[3][7].t == undefined && currentsS[4][7].t == "k")
            {
                possiblesquares.push([2, 7]);
            }
        }
    }
    return(possiblesquares);
}

function getKnightMoves(pos, col, currentsS) {
    let possiblesquares = [];

    // here i decided to hardcode all options because i didn't think of an immediate easy way to iterate
    if(!(pos[0]-2<0||pos[1]+1>7||currentsS[pos[0]-2][pos[1]+1].c == col)) possiblesquares.push([pos[0]-2, pos[1]+1]);
    if(!(pos[0]-2<0||pos[1]-1<0||currentsS[pos[0]-2][pos[1]-1].c == col)) possiblesquares.push([pos[0]-2, pos[1]-1]);
    if(!(pos[0]+2>7||pos[1]+1>7||currentsS[pos[0]+2][pos[1]+1].c == col)) possiblesquares.push([pos[0]+2, pos[1]+1]);
    if(!(pos[0]+2>7||pos[1]-1<0||currentsS[pos[0]+2][pos[1]-1].c == col)) possiblesquares.push([pos[0]+2, pos[1]-1]);
    if(!(pos[0]-1<0||pos[1]+2>7||currentsS[pos[0]-1][pos[1]+2].c == col)) possiblesquares.push([pos[0]-1, pos[1]+2]);
    if(!(pos[0]-1<0||pos[1]-2<0||currentsS[pos[0]-1][pos[1]-2].c == col)) possiblesquares.push([pos[0]-1, pos[1]-2]);
    if(!(pos[0]+1>7||pos[1]+2>7||currentsS[pos[0]+1][pos[1]+2].c == col)) possiblesquares.push([pos[0]+1, pos[1]+2]);
    if(!(pos[0]+1>7||pos[1]-2<0||currentsS[pos[0]+1][pos[1]-2].c == col)) possiblesquares.push([pos[0]+1, pos[1]-2]);

    return(possiblesquares);
}

function getRookMoves(pos, col, currentsS) {
    let possiblesquares = [];
    //up
    for (let j = 1; j < 8; j++) {
        if(!(pos[1] + j > 7)) {
            if(currentsS[pos[0]][pos[1]+j].c == col) {break;}
            else if(currentsS[pos[0]][pos[1]+j].c != undefined) {
                possiblesquares.push([pos[0],pos[1]+j]);
                break;
            }
            else {possiblesquares.push([pos[0], pos[1]+j]); }
        }
        else {break;}
    }

    //down
    for (let j = 1; j < 8; j++) {
        if(!(pos[1] - j < 0)) {
            if(currentsS[pos[0]][pos[1]-j].c == col) {break;}
            else if(currentsS[pos[0]][pos[1]-j].c != undefined) {
                possiblesquares.push([pos[0],pos[1]-j]);
                break;
            }
            else {possiblesquares.push([pos[0], pos[1]-j]); }
        }
        else {break;}
    }

    //left
    for (let j = 1; j < 8; j++) {
        if(!(pos[0] - j < 0)) {
            if(currentsS[pos[0]-j][pos[1]].c == col) {break;}
            else if(currentsS[pos[0]-j][pos[1]].c != undefined) {
                possiblesquares.push([pos[0]-j,pos[1]]);
                break;
            }
            else {possiblesquares.push([pos[0]-j, pos[1]]); }
        }
        else {break;}
    }

    //right
    for (let j = 1; j < 8; j++) {
        if(!(pos[0] + j > 7)) {
            if(currentsS[pos[0]+j][pos[1]].c == col) {break;}
            else if(
                currentsS[pos[0]+j][pos[1]].c != undefined) {
                possiblesquares.push([pos[0]+j,pos[1]]);
                break;
            }
            else {possiblesquares.push([pos[0]+j, pos[1]]); }
        }
        else {break;}
    }

    return(possiblesquares);
}

function getBishopMoves(pos, col, currentsS) {
    let possiblesquares = [];
    //upright
    for (let j = 1; j < 8; j++) {
        if(!(pos[0] + j > 7 || pos[1] + j > 7)) {
            if(currentsS[pos[0]+j][pos[1]+j].c == col) {break;}
            else if(currentsS[pos[0]+j][pos[1]+j].c != undefined) {
                possiblesquares.push([pos[0]+j,pos[1]+j]);
                break;
            }
            else {possiblesquares.push([pos[0]+ j, pos[1]+j]); }
        }
        else {break;}
    }

    //downleft
    for (let j = 1; j < 8; j++) {
        if(!(pos[0] - j < 0 || pos[1] - j < 0)) {
            if(currentsS[pos[0]-j][pos[1]-j].c == col) {break;}
            else if(currentsS[pos[0]-j][pos[1]-j].c != undefined) {
                possiblesquares.push([pos[0]-j,pos[1]-j]);
                break;
            }
            else {possiblesquares.push([pos[0]-j, pos[1]-j]); }
        }
        else {break;}
    }

    //upleft
    for (let j = 1; j < 8; j++) {
        if(!(pos[0] - j < 0 || pos[1] + j > 7)) {
            if(currentsS[pos[0]-j][pos[1]+j].c == col) {break;}
            else if(currentsS[pos[0]-j][pos[1]+j].c != undefined) {
                possiblesquares.push([pos[0]-j,pos[1]+j]);
                break;
            }
            else {possiblesquares.push([pos[0]-j, pos[1]+j]); }
        }
        else {break;}
    }

    //downright
    for (let j = 1; j < 8; j++) {
        if(!(pos[0] + j > 7 || pos[1] - j < 0)) {
            if(currentsS[pos[0]+j][pos[1]-j].c == col) {break;}
            else if(currentsS[pos[0]+j][pos[1]-j].c != undefined) {
                possiblesquares.push([pos[0]+j,pos[1]-j]);
                break;
            }
            else {possiblesquares.push([pos[0]+j, pos[1]-j]); }
        }
        else {break;}
    }

    return(possiblesquares);
}

function getPawnMoves(pos, col, currentsS) {
    let possiblesquares = [];
    let dir = 1;
    if(col=="b"){dir = -1}

    //straight
    if(!(pos[1] == 7) && currentsS[pos[0]][pos[1] + dir].c == undefined)
    {
        possiblesquares.push([pos[0], pos[1]+dir]);
        //boost
        if(((col == "w" && pos[1] == 1) || (col == "b" && pos[1] == 6)) && currentsS[pos[0]][pos[1] + 2*dir].c == undefined){
            possiblesquares.push([pos[0], pos[1]+2*dir]);
        }
    }

    //diagonal
    if(pos[0] != 7 && pos[1] != 7)
    {
        if(currentsS[pos[0]+1][pos[1] + dir].c != col && currentsS[pos[0]+1][pos[1] + dir].c != undefined)
        {
            possiblesquares.push([pos[0]+1, pos[1]+dir]);
        }
    }
    
    if(pos[0] != 0 && pos[1] != 7){
        if(currentsS[pos[0]-1][pos[1] + dir].c != col && currentsS[pos[0]-1][pos[1] + dir].c != undefined)
        {
            possiblesquares.push([pos[0]-1, pos[1]+dir]);
        }
    }

    return(possiblesquares);
}

function evalboard(Sblackpiecepos, Swhitepiecepos, SsquareStates)
{
    //very important function, here a certain board can be evaluated, this evaluation is essential for the algorithm to decide upon the best move
    //the evaluation of a board is determined by the amount of pieces and their positions
    //a positive score means white is winning, a negative score means black is winning
    let curreval = 0;

    //get eval by color
    //black
    for(i = 0; i < Sblackpiecepos.length; i++)
    {
        //piece values
        switch (SsquareStates[Sblackpiecepos[i][0]][Sblackpiecepos[i][1]].t) {
            case "p":
                curreval -= 100;
                curreval -= pawnPST[Sblackpiecepos[i][1]][Sblackpiecepos[i][0]];
                break;
            case "q":
                curreval -= 900;
                curreval -= queenPST[Sblackpiecepos[i][1]][Sblackpiecepos[i][0]];
                break;
            case "n":
                curreval -= 320;
                curreval -= knightPST[Sblackpiecepos[i][1]][Sblackpiecepos[i][0]];
                break;
            case "b":
                curreval -= 330;
                curreval -= bishopPST[Sblackpiecepos[i][1]][Sblackpiecepos[i][0]];
                break;
            case "k":
                curreval -= 50000;
                if(Sblackpiecepos.length + Swhitepiecepos <= 10)
                {
                    curreval -= kingEGPST[Sblackpiecepos[i][1]][Sblackpiecepos[i][0]];
                }
                else
                {
                    curreval -= kingMGPST[Sblackpiecepos[i][1]][Sblackpiecepos[i][0]];
                } 
                break;
            case "r":
                curreval -= 500;
                curreval -= rookPST[Sblackpiecepos[i][1]][Sblackpiecepos[i][0]];
                break;
        }
    }

    //white
    for(i = 0; i < Swhitepiecepos.length; i++)
    {
        //piece values
        switch (SsquareStates[Swhitepiecepos[i][0]][Swhitepiecepos[i][1]].t) {
            case "p":
                curreval += 100;
                curreval += pawnPST[7-Swhitepiecepos[i][1]][Swhitepiecepos[i][0]];
                break;
            case "q":
                curreval += 900;
                curreval += queenPST[7-Swhitepiecepos[i][1]][Swhitepiecepos[i][0]];
                break;
            case "n":
                curreval += 320;
                curreval += knightPST[7-Swhitepiecepos[i][1]][Swhitepiecepos[i][0]];
                break;
            case "b":
                curreval += 330;
                curreval += bishopPST[7-Swhitepiecepos[i][1]][Swhitepiecepos[i][0]];
                break;
            case "k":
                curreval += 20000;
                if(Sblackpiecepos.length + Swhitepiecepos <= 10)
                {
                    curreval -= kingEGPST[7-Swhitepiecepos[i][1]][Swhitepiecepos[i][0]];
                }
                else {
                    curreval += kingMGPST[7-Swhitepiecepos[i][1]][Swhitepiecepos[i][0]];
                }
                break;
            case "r":
                curreval += 500;
                curreval += rookPST[7-Swhitepiecepos[i][1]][Swhitepiecepos[i][0]];
                break;
        }
    }
    return curreval;
}