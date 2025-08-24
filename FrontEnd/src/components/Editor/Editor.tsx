import { useCreateEditor } from "../../hooks/editorHook/useCreateEditor";

const Editor = () => {
    // Initialize the editor and bind it to the DOM element with id="editorjs"
    useCreateEditor({ holderElementId: 'editorjs' });

    return (
        <>
            <div id="editorjs" className="editor-output"></div>
        </>
    );
};

export default Editor;
