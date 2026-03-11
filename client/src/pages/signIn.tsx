import { useState,useContext } from "react"
import { socket } from "@/hooks/socket"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { userContext } from "@/contexts/userContext"
import { setStoredUsername } from "@/hooks/storeUserName"
import { useNavigate } from "react-router-dom"
import { signedInContext } from "@/contexts/signedInContext"

export default function SignInPage(){
    const BASE = "http://localhost:5555"

    const [enterUsername,setEnterUsername] = useState('')
    const [password,setPassword] = useState('')
    const { username, setUserName } = useContext(userContext)
    const { signedIn, setSignedIn } = useContext(signedInContext)

    const navigate = useNavigate();

    const navHome = () => {
        navigate("/");
    };

    const signIn = async (e: React.FormEvent) => {
        e.preventDefault()

        try{
            const res = await fetch(`${BASE}/signIn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: enterUsername,
                    password: password,
                    sid: socket.id
                })
            })

            const data = await res.json()
            console.log(data)

            if (res.ok) {
                setSignedIn(true)
                setUserName(data.username)
                setStoredUsername(data.username)
                navHome()
            }
        }

        catch (error) {
            console.log(error)
        }   
    }


        return (
        <>
            <Card className="w-120 text-left">
                <CardHeader className="items-start">
                    <CardTitle className="text-2xl">Sign in to chess games</CardTitle>
                    <CardDescription>Enter your username and password below to sign in</CardDescription>
                    <CardAction>
                        <Button variant="link">Sign up</Button>
                    </CardAction>
                </CardHeader>


                <form onSubmit={signIn} className="">
                    <div className="flex flex-col gap-3 w-3/4 mx-auto">
                        <Input
                            type="text"
                            placeholder="Enter username"
                            value={enterUsername}
                            onChange={(e) => setEnterUsername(e.target.value)} 
                        />

                        <Input 
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            value="Submit" 
                            onClick={() => console.log("Submited")}
                            className="!bg-green-700"
                        >Submit</Button>
                    </div>
                </form>
            </Card>
        </>            
    )
}