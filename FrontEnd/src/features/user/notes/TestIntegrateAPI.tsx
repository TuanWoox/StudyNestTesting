import React, { useState } from "react";
import useGetFolderDetail from "@/hooks/folderHook/useGetFolderDetail";
import useGetNoteDetail from "@/hooks/noteHook/useGetNoteDetail";
import useGetTagDetail from "@/hooks/tagHook/useGetTagDetail";
import { toast } from "sonner";
import useCreateTag from "@/hooks/tagHook/useCreateTag";
import useDeleteTag from "@/hooks/tagHook/useDeleteTag";
import useUpdateTag from "@/hooks/tagHook/useUpdateTag"; // 👈 thêm hook update

const CollapsibleSection: React.FC<{
    title: string;
    children: React.ReactNode;
}> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between rounded-lg items-center px-4 py-3 text-left text-lg font-semibold bg-gray-100 hover:bg-gray-200 transition"
            >
                <span>{title}</span>
                <span className={`transform transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
            </button>

            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[1000px] p-4" : "max-h-0 p-0"
                    }`}
            >
                {children}
            </div>
        </div>
    );
};

const TestIntegrateAPI: React.FC = () => {
    // === Folder GET by ID ===
    const [folderId, setFolderId] = useState("");
    const {
        data: folderDetail,
        isLoading: isFolderDetailLoading,
        isError: isFolderDetailError,
        error: folderDetailError,
        refetch: refetchFolder,
    } = useGetFolderDetail(folderId, { enabled: false });

    // === Note GET by ID ===
    const [noteId, setNoteId] = useState("");
    const {
        data: noteDetail,
        isLoading: isNoteDetailLoading,
        isError: isNoteDetailError,
        error: noteDetailError,
        refetch: refetchNote,
    } = useGetNoteDetail(noteId, { enabled: false });

    // === Tag GET by ID ===
    const [tagId, setTagId] = useState("");
    const {
        data: tagDetail,
        isLoading: isTagDetailLoading,
        isError: isTagDetailError,
        error: tagDetailError,
        refetch: refetchTag,
    } = useGetTagDetail(tagId, { enabled: false });

    // === Create Tag ===
    // Trong trường hợp muốn lấy data của tag vừa tạo thì sử dụng createTagAsync để lấy response trả về (vì mutate sẽ ko trả về gì)
    const { createTagAsync, isLoading: isTagCreating } = useCreateTag();
    const [tagName, setTagName] = useState("");
    const [response, setResponse] = useState<any>(null);

    // === Delete Tag ===
    const { deleteTagAsync, isLoading: isDeleting } = useDeleteTag();
    const [deleteTagId, setDeleteTagId] = useState("");

    // === Update Tag ===
    const { updateTagAsync, isLoading: isUpdating } = useUpdateTag();
    const [updateTagId, setUpdateTagId] = useState("");
    const [updateTagName, setUpdateTagName] = useState("");
    const [updateResponse, setUpdateResponse] = useState<any>(null);

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold">Test API integration</h1>

            {/* 📁 Folder Detail */}
            <CollapsibleSection title="📁 GET /api/v1/Folder/{id}">
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter Folder ID..."
                        value={folderId}
                        onChange={(e) => setFolderId(e.target.value)}
                        className="border border-gray-400 rounded-md px-3 py-2 w-96"
                    />
                    <button
                        onClick={() => {
                            if (!folderId.trim()) return toast.error("Please enter Folder ID!");
                            refetchFolder();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Fetch Folder
                    </button>
                </div>

                {isFolderDetailLoading && <p className="text-blue-500">Loading...</p>}
                {isFolderDetailError && <p className="text-red-600">❌ {folderDetailError?.message}</p>}
                {!isFolderDetailLoading && folderDetail && (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-[450px] text-sm">
                        {JSON.stringify(folderDetail, null, 2)}
                    </pre>
                )}
            </CollapsibleSection>

            {/* 📝 Note Detail */}
            <CollapsibleSection title="📝 GET /api/v1/Note/{id}">
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter Note ID..."
                        value={noteId}
                        onChange={(e) => setNoteId(e.target.value)}
                        className="border border-gray-400 rounded-md px-3 py-2 w-96"
                    />
                    <button
                        onClick={() => {
                            if (!noteId.trim()) return toast.error("Please enter Note ID!");
                            refetchNote();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Fetch Note
                    </button>
                </div>

                {isNoteDetailLoading && <p className="text-blue-500">Loading...</p>}
                {isNoteDetailError && <p className="text-red-600">❌ {noteDetailError?.message}</p>}
                {!isNoteDetailLoading && noteDetail && (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-[450px] text-sm">
                        {JSON.stringify(noteDetail, null, 2)}
                    </pre>
                )}
            </CollapsibleSection>

            {/* 🏷️ Tag Detail */}
            <CollapsibleSection title="🏷️ GET /api/v1/Tag/{id}">
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter Tag ID..."
                        value={tagId}
                        onChange={(e) => setTagId(e.target.value)}
                        className="border border-gray-400 rounded-md px-3 py-2 w-96"
                    />
                    <button
                        onClick={() => {
                            if (!tagId.trim()) return toast.error("Please enter Tag ID!");
                            refetchTag();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Fetch Tag
                    </button>
                </div>

                {isTagDetailLoading && <p className="text-blue-500">Loading...</p>}
                {isTagDetailError && <p className="text-red-600">❌ {tagDetailError?.message}</p>}
                {!isTagDetailLoading && tagDetail && (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-[450px] text-sm">
                        {JSON.stringify(tagDetail, null, 2)}
                    </pre>
                )}
            </CollapsibleSection>

            {/* 🆕 Create Tag */}
            <CollapsibleSection title="🆕 POST /api/v1/Tag (Create Tag)">
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        className="border border-gray-400 rounded-md px-3 py-2 w-64"
                        placeholder="Enter tag name..."
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                    />
                    <button
                        onClick={async () => {
                            if (!tagName.trim()) {
                                toast.error("Please enter a tag name!");
                                return;
                            }
                            try {
                                const res = await createTagAsync({ name: tagName });
                                setResponse(res);
                            } catch {
                                setResponse(null);
                            }
                        }}
                        disabled={isTagCreating}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isTagCreating ? "Creating..." : "Create Tag"}
                    </button>
                </div>

                {response && (
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">📤 Response Body</h3>
                        <pre className="bg-gray-900 text-green-200 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}
            </CollapsibleSection>

            {/* 🗑️ Delete Tag */}
            <CollapsibleSection title="🗑️ DELETE /api/v1/Tag/{id}">
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        className="border border-gray-400 rounded-md px-3 py-2 w-96"
                        placeholder="Enter Tag ID to delete..."
                        value={deleteTagId}
                        onChange={(e) => setDeleteTagId(e.target.value)}
                    />
                    <button
                        onClick={async () => {
                            if (!deleteTagId.trim()) return toast.error("Please enter Tag ID!");
                            try {
                                await deleteTagAsync(deleteTagId);
                                toast.success("Tag deleted successfully");
                                setDeleteTagId("");
                            } catch (err) {
                                toast.error("Failed to delete tag");
                            }
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete Tag"}
                    </button>
                </div>
            </CollapsibleSection>

            {/* ✏️ Update Tag */}
            <CollapsibleSection title="✏️ PUT /api/v1/Tag (Update Tag)">
                <div className="flex flex-col gap-2 mb-4">
                    <input
                        type="text"
                        className="border border-gray-400 rounded-md px-3 py-2 w-96"
                        placeholder="Enter Tag ID..."
                        value={updateTagId}
                        onChange={(e) => setUpdateTagId(e.target.value)}
                    />
                    <input
                        type="text"
                        className="border border-gray-400 rounded-md px-3 py-2 w-96"
                        placeholder="Enter new tag name..."
                        value={updateTagName}
                        onChange={(e) => setUpdateTagName(e.target.value)}
                    />
                    <button
                        onClick={async () => {
                            if (!updateTagId.trim() || !updateTagName.trim()) {
                                toast.error("Please enter both Tag ID and new name!");
                                return;
                            }
                            try {
                                const res = await updateTagAsync({
                                    id: updateTagId,
                                    name: updateTagName,
                                });
                                setUpdateResponse(res);
                                toast.success("Tag updated successfully!");
                            } catch (err) {
                                toast.error("Failed to update tag");
                                setUpdateResponse(null);
                            }
                        }}
                        disabled={isUpdating}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition disabled:opacity-50"
                    >
                        {isUpdating ? "Updating..." : "Update Tag"}
                    </button>
                </div>

                {updateResponse && (
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">📤 Response Body</h3>
                        <pre className="bg-gray-900 text-green-200 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                            {JSON.stringify(updateResponse, null, 2)}
                        </pre>
                    </div>
                )}
            </CollapsibleSection>
        </div>
    );
};

export default TestIntegrateAPI;
