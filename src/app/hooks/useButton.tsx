import { useState } from "react";
import { Token } from '../utils/token';

export default function useButton() {
    const { generateToken } = Token();
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('token') ? true : false)
    const handleLogOut = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        console.log('Log out')
    }
    const handleLogIn = () => {
        const token = generateToken();
        localStorage.setItem('token', token)
        setIsLoggedIn(true)
        console.log('Log In')
    }
    return { isLoggedIn, setIsLoggedIn, handleLogIn, handleLogOut }
}