import { Table,TableBody,TableCaption,TableHeader,TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"


import { useContext, useEffect, useState } from "react";
import { userContext } from "@/contexts/userContext";
import { historyFetch } from "@/services/historyFetch";

type History = {
  turn: number
  white_move: string | null
  black_move: string | null
}

type GameHistoryType = {
  first_username: string
  second_username: string
  winner: string
  history: History[]
}


export default function GameHistory() {
  
  const { username, setUserName } = useContext(userContext)
  const [games,setGames] = useState<GameHistoryType[]>([])
  const [selectedGame, setSelectedGame] = useState<GameHistoryType | null>(null)


  const fetchHistory = async () => { 
    try {
      const data = await historyFetch(username)
      setGames(data.games)
    }

    catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const isWon = ({first_username,second_username,winner}: GameHistoryType): string => {

    if (winner === "white" && first_username === username || winner === "black" && second_username === username){
      return "text-green-400"
    }

    else if (winner === "white" && first_username != username || winner === "black" && second_username != username)
      return "text-red-400"

    return ""
  }

  return (
    <main className="min-h-screen flex flex-col gap-20">
      <div>
        <h1 className="font-bold font-mono">Game History</h1>
      </div>

      <div>
        <Table className="w-200 font-mono">
          <TableCaption>A list of your game history</TableCaption>
          <TableHeader>

            <TableRow className="[&>*]:text-center [&>*]:text-2xl [&>*]:font-bold [&>*]:text-yellow-500">
              <TableHead>White</TableHead>
              <TableHead>Black</TableHead>
              <TableHead>Winner</TableHead>
            </TableRow>

          </TableHeader>
        

          <TableBody>

          {games.map((game, index) => (
            <TableRow key={index}  className="text-lg" onClick={() => setSelectedGame(game)}>
                <TableCell>{game.first_username}</TableCell>
                <TableCell>{game.second_username}</TableCell>
                <TableCell className={isWon(game)}>{game.winner}</TableCell>
            </TableRow>
          ))}

          </TableBody>
        </Table>


        <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
          <DialogContent className="font-mono">
            <DialogTitle>Game History</DialogTitle>
            <DialogDescription>All games history for {username}</DialogDescription>

            {selectedGame?.history.map((move, index) => (
              <div className="flex gap-2" key={index}>
                <span className="text-yellow-500">{move.turn} - </span>
                <span>{move.white_move}</span>
                <span>{move.black_move}</span>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
