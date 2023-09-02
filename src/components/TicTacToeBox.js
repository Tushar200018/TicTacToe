import { memo } from "react"


const TicTacToeBox = memo(({symbol,boxId,hasWon=false})=>{
    return (
        <div 
        id={boxId} 
        className={`${hasWon && "bg-black text-white"} hover:cursor-pointer text-lg px-5 py-2 border border-black rounded-md text-center`}>
            {symbol ?? ""}
        </div>
    )
})

export default TicTacToeBox