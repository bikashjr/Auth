'use client'

import useButton from "../hooks/useButton";

export default function Button() {
    const { isLoggedIn, handleLogIn, handleLogOut } = useButton()
    return (
        <>
            <div>
                {isLoggedIn ? (
                    <button className="button" onClick={handleLogOut}>
                        Log Out
                    </button>
                ) : (
                    <button className="button" onClick={handleLogIn}>
                        Log In
                    </button>
                )}
            </div>
        </>
    )
}