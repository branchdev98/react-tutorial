import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


  function Square(props){
      const winningSquareStyle = {
          backgroundColor: '#ccc' //This is the bgcolor of winner screen
      };

      return(
          <button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle: null}>    //
              {props.value}
          </button>
      );
  }
  
  class Board extends React.Component {
  

  
    
    renderSquare(i) {
    
      let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
      return <Square 
            value={this.props.squares[i]}
             onClick={() => this.props.onClick(i)}
            winningSquare = {winningSquare}
            
      />;
    }
  
    render() {
      
     let board=[];
     for (let row=0;row<3; row++){
        let boardrow=[];
        for (let col=0; col<3; col++){
            boardrow.push(<span key={row*3+col}>{this.renderSquare(row*3+col)}</span>);
        }
        board.push(<div className="board-row" key={row}>{boardrow}</div>);
    }
      return (
        <div>
              
             {board}
         
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),

            }],
            stepNumber: 0,
            xIsNext: true,
            ascending: true,
        };
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
      
        
        if (calculateWinner(squares).winner || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                clickedSquare:[Math.floor(i%3)+1, Math.floor((i/3)+1)]
                
            }]),
            
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ===0,
        });
    }

    sortHandleClick(){
        this.setState({
            ascending: !this.state.ascending
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const ascending = this.state.ascending;
        const moves = history.map((step, move) => {
            const clickedSquare = step.clickedSquare;
            const desc = move ?
                `Move # ${move} - (${clickedSquare[0]},${clickedSquare[1]})`:
                'Game start';
            return (
                <li key={move}>
                    <button 
                    className={move === this.state.stepNumber ? 'move-list-item-selected' : ''} 
                    onClick={() => this.jumpTo(move)}>{desc}
                   
                    </button>
                </li>
            );
        })
        let status;
        if (winner.winner){
            status = 'Winner: ' + winner.winner;
        } else {
            if (winner.isDraw === true)
            status = "Draw";
            else 
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winner={winner && winner.winningSquares}
             />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{ascending ? moves : moves.reverse() }</ol>
            <button onClick={()=>this.sortHandleClick()}>Toggle Sort Order</button>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares){
      const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++){
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
              return {
                  winner: squares[a],
                  winningSquares: lines[i],
                  isDraw: false,
              };
          }
          
      }
      let isDraw = true;

      for (let i=0; i<squares.length; i++){
          if (squares[i] === null){
              isDraw = false;
              break;
          }
      }

      return{
          winner: null,
          winningSquares: null,
          isDraw: isDraw,
      };
  }
  // Example usage: <ShoppingList name="Mark" />
  
  // ========================================
  
  ReactDOM.render(
    
    <Game />,
    document.getElementById('root')
  );
  