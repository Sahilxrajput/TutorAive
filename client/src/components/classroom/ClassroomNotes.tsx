

const ClassroomNotes = () => {
    const notes = [
        {
            _id: "1",
            title: "React Hooks Overview",
            content: "We covered useState, useEffect and custom hooks.",
            owner: { name: "John Doe" },
            sharedWith: [{ name: "Jane" }, { name: "Alex" }],
            attachments: ["https://example.com/file.pdf"],
            date: "2025-10-20T10:00:00Z",
            rawData: { sessionId: "abc123", notesVersion: 2 },
        },
        {
            _id: "2",
            title: "Node.js Routing",
            content: "Covered Express routing, middleware, and error handling.",
            owner: { name: "John Doe" },
            sharedWith: [],
            attachments: [],
            date: "2025-10-20T11:00:00Z",
            rawData: { sessionId: "def456", notesVersion: 1 },
        },
    ]

    if (!notes.length) return <p className="text-center mt-10">No notes found for previous class.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Previous Class Notes</h1>

            {notes.map((note) => (
                <div key={note._id} className="mb-6 p-5 border rounded-md shadow-sm bg-white">
                    {/* Note Title & Owner */}
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">{note.title}</h2>
                        <span className="text-gray-500 text-sm">
                            By {note.owner?.name || "Unknown"} on {new Date(note.date).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 mb-3">{note.content}</p>

                    {/* Shared With */}
                    {note.sharedWith && note.sharedWith.length > 0 && (
                        <p className="text-gray-600 mb-2">
                            <strong>Shared With:</strong> {note.sharedWith.map((u) => u.name).join(", ")}
                        </p>
                    )}

                    {/* Attachments */}
                    {note.attachments && note.attachments.length > 0 && (
                        <div className="mb-2">
                            <strong>Attachments:</strong>
                            <ul className="list-disc ml-5">
                                {note.attachments.map((file, idx) => (
                                    <li key={idx}>
                                        <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            {file}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Raw Data */}
                    {note.rawData && (
                        <div className="mt-2 p-3 bg-gray-100 rounded-md overflow-x-auto">
                            <strong>Raw Data:</strong>
                            <pre className="text-sm">{JSON.stringify(note.rawData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ClassroomNotes;
