import { useState, useEffect } from "react"
import { Item } from "./ui/item"


type DigitalClockProps = {
    isTurn: boolean
    pieceColor: "w" | "b"
}

export default function DigitalClock({ isTurn, pieceColor }: DigitalClockProps) {

    const [time, setTime] = useState(10)

    useEffect(() => {
        if (!isTurn) return

        const interval = setInterval(() => {
            setTime(prev => {
                if (prev <= 0) return 0
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)

    }, [isTurn])

    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    return (
        <Item variant={"outline"} 
            className={
                pieceColor === "w" ?
                    "w-50 justify-center font-mono font-bold tracking-widest !bg-white" :
                    "w-50 justify-center font-mono font-bold tracking-widest !bg-black"
            }
        >
            <h1 className={pieceColor === "w" ? "!text-black" : "!text-white"}>
                {minutes.toString().padStart(2,"0")}:
                {seconds.toString().padStart(2,"0")}
            </h1>
        </Item>
        
    )
}