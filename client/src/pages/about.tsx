import { useNavigate } from 'react-router-dom'

export default function About() {
    const navigate = useNavigate()

    const navGame = () => {
        navigate('/game')
    }

    return (
        <>
            <h1>This is about page</h1>
            <button onClick={navGame}>Game page</button>
        </>
    )
}