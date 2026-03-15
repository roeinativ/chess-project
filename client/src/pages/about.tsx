import DigitalClock from "@/components/digitalClock"
import { Button } from "@/components/ui/button"
import { useState } from "react"


export default function About() {
    const [isTurn, setIsTurn] = useState<boolean>(true)

    const clockFunction = () => {
        isTurn ? setIsTurn(false) : setIsTurn(true)
    }

    return (
        <>
            <DigitalClock isTurn={isTurn} pieceColor="b"/>
            <Button onClick={clockFunction}>{isTurn ? "Stop" : "Resume"}</Button>
        </>
    )
}