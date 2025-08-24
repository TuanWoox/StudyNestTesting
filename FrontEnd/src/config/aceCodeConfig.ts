import { AceCodeConfig } from "ace-code-editorjs";
import "ace-builds/esm-resolver";

// Manually import modes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-dart";

const popularModes = [
    "javascript", "typescript", "python", "java", "c_cpp", "csharp", "rust", "php", "swift",
    "kotlin", "sql", "html", "css", "json", "yaml", "markdown", "xml", "dart",
];

const aceConfig: AceCodeConfig = {
    languages: popularModes.reduce((acc, m) => {
        acc[m] = {
            label: m.charAt(0).toUpperCase() + m.slice(1).replace(/_/g, " "),
            mode: `ace/mode/${m}`,
        };
        return acc;
    }, {} as Record<string, { label: string; mode: string }>),
    options: {
        fontSize: 16,
        minLines: 5,
        maxLines: 10,
        autoScrollEditorIntoView: true,
        theme: "ace/theme/dracula",
    },
};

export default aceConfig;
