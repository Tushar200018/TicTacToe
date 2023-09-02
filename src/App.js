import { useCallback, useEffect, useState } from 'react';
import './App.css';
import SelectSymbol from './components/SelectSymbol';
import TicTacToeBox from './components/TicTacToeBox';
import axios from 'axios';


async function getComputerResult(gridState){
  const url = "https://hiring-react-assignment.vercel.app/api/bot"
  let result
  try{
    const response = await axios.post(url,gridState)
    result = {
      boxId: response.data,
      error: null
    }
  }catch(e){
    console.log(e)
    result = {
      boxId: -1,
      error: "computer has failed to execute its turn"
    }
  }
  return result
}

const checkWinner = (gridState,setWinningInd)=>{
  const winningCombinations = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if(gridState[a]===gridState[b] && gridState[b]===gridState[c] && gridState[a]) {
      setWinningInd(combination)
      return gridState[a];
    }
  }
  return null;
}

const checkGameOver = (gridState)=>gridState.every(state=>state!==null)
const checkGameStart = (gridState)=>gridState.every(state=>state===null)

function App() {
  const [userSymbol,setUserSymbol] = useState("X")
  const [gridState,setGridState] = useState(new Array(9).fill(null))
  const [gameOverState,setGameOverState] = useState({
    isGameOver: false,
    winner: null,
  })
  const [isPlayerTurn,setIsPlayerTurn] = useState(true)
  const [winningInd,setWinningInd] = useState([null,null,null])

  console.log(isPlayerTurn)
  console.log(gridState)
  const onGridClick = (e)=>{
    const clickedBoxInd = Number(e.target.id)
    if(isPlayerTurn && gridState[clickedBoxInd]===null){
      setIsPlayerTurn(false)
      setGridState(gridState.map((state,ind)=>ind===clickedBoxInd ? userSymbol : state))
    }
  }
  
  const executeComputerTurn = useCallback(async ()=>{
    const computerResponse = await getComputerResult(gridState)
    if(!computerResponse.error && !gridState[computerResponse.boxId]){
      setIsPlayerTurn(true)
      setGridState(gridState.map((state,ind)=>ind===computerResponse.boxId ? (userSymbol==="X" ? "O": "X") : state))
    }
  },[userSymbol,gridState])

  useEffect(()=>{
    const isGameOver = checkGameOver(gridState)
    const winner = checkWinner(gridState,setWinningInd)
    if(winner){
      winner===userSymbol
      ? setGameOverState({
        isGameOver: true,
        winner: "player"
      })
      : setGameOverState({
        isGameOver: true,
        winner: "computer"
      })
    }
    else if(isGameOver){
      setGameOverState({
        isGameOver: true,
        winner: null
      })
    }
    else{
      !isPlayerTurn &&
      executeComputerTurn()
    }
  },[gridState,userSymbol,isPlayerTurn,executeComputerTurn])

  const resetStates = ()=>{
    setUserSymbol("X")
    setGridState(new Array(9).fill(null))
    setGameOverState({
      isGameOver: false,
      winner: null,
    })
    setIsPlayerTurn(true)
    setWinningInd(new Array(3).fill(null))
  }

  return (
    <div className='flex flex-col items-center h-[80vh] min-h-[500px] justify-center'>
      <h1 className='mb-4 text-center md:text-3xl text-2xl font-extrabold'>Tic Tac Toe</h1>
      <SelectSymbol selectedSymbol={userSymbol} setSymbol={setUserSymbol} isGameStart={checkGameStart(gridState)} />
      <div className='mt-8 mb-4 font-semibold'>{gameOverState.isGameOver ? "Game Over!!" : isPlayerTurn ? "Your Turn" : "Computer's Turn"}</div>
      <div onClick={onGridClick} className='grid grid-cols-3 grid-rows-3 gap-3 w-56 h-40'>
        {
          gridState.map((state,ind)=>
          <TicTacToeBox 
            key={ind} 
            boxId={ind} 
            symbol={state} 
            hasWon = {state && winningInd.includes(ind)}
          />)
        }
      </div>
      <div className='mt-8 flex flex-col items-center'>
        {gameOverState.winner==="player" && <div>Congratulations! You Won 🥳</div>}
        {gameOverState.winner==="computer" && <div>Sorry, You Lost 😢</div>}
        {!gameOverState.winner && gameOverState.isGameOver && <div>It is a Draw 😐</div>}
        {gameOverState.isGameOver && 
        <button onClick={resetStates} className="text-black mt-3 border border-black hover:bg-black hover:text-white font-semibold px-8 py-2 rounded outline-none focus:outline-none" type="button">
          Play Again
        </button>
        }
      </div>
      
    </div>
  );
}

export default App;
