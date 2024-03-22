export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
                <p className="mt-2">Loading...</p>
            </div>
        </div>
    );
}