import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


export default function SignUpPage(){

    const BASE = "http://localhost:5555"
    const [username, setUsername] = useState<string>('')

    const signUp = async (e: React.FormEvent) => {
        e.preventDefault()

        try{
            const res = await fetch(`${BASE}/signUp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username
                })
            })

            const data = await res.json()
            console.log(data)
        }

        catch(error){
            console.log(error)
        }
    }

    



    return (
        <>
            <Card className="w-120 text-left">
                <CardHeader className="items-start">
                    <CardTitle className="text-2xl">Sign up to chess games</CardTitle>
                    <CardDescription>Enter your username and password below to sign up</CardDescription>
                    <CardAction>
                        <Button variant="link">Sign up</Button>
                    </CardAction>
                </CardHeader>


                <form onSubmit={signUp} className="">
                    <div className="flex flex-col gap-3 w-3/4 mx-auto">
                        <Input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                        />

                        <Button
                            type="submit"
                            value="Submit" 
                            onClick={() => console.log("Submited")}
                            className="!bg-green-700"
                        >Submit</Button>

                        <Button type="submit" value="submit" className="!bg-red-900">Log out</Button>
                    </div>
                </form>
            </Card>
        </>            
    )
}