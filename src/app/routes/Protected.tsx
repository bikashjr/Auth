"use client"

import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const token = localStorage.getItem('token');

    if (!token) {
        router.push('/home');
        return null;
    }

    return children;
};
export default ProtectedRoute;