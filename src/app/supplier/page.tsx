import ProtectedRoute from "../routes/Protected";

export default function Supplier() {
    return (
        <>
            <ProtectedRoute>
                <h1>Supplier Page</h1>
            </ProtectedRoute>
        </>
    )
}