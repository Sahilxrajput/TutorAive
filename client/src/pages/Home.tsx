import { Button } from '@/components/ui/button';
import React from 'react'


const handleLogin = () => {
    console.log(import.meta.env.VITE_API_URL)
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};


const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <Button onClick={handleLogin}>Sign in with Google</Button>
        </div>
    )
}

export default Home