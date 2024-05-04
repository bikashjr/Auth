import ProtectedRoute from "../routes/Protected";

export default function Admin() {
    return (
        <>
            <ProtectedRoute>
                <h1>Admin Page</h1>
            </ProtectedRoute>
        </>
    )
}