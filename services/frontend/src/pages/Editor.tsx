import React from "react";
import { Button, ButtonGroup, Paper, TextareaAutosize } from "@mui/material";


interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: number;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, height = 200 }) => {
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const raw = e.target.value;
        onChange(raw);
    };

    // Formatting buttons for textarea (insert markdown syntax)
    const insertAtCursor = (before: string, after: string = "") => {
        const textarea = document.getElementById("editor-textarea") as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);
        const newText = text.substring(0, start) + before + selected + after + text.substring(end);
        onChange(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + before.length + selected.length + after.length;
        }, 0);
    };

    return (
        <Paper sx={{ p: 2 }}>
            <ButtonGroup variant="outlined" size="small" sx={{ mb: 1 }}>
                <Button onClick={() => insertAtCursor("# ", "")}>H1</Button>
                <Button onClick={() => insertAtCursor("## ", "")}>H2</Button>
                <Button onClick={() => insertAtCursor("**", "**")}>Bold</Button>
                <Button onClick={() => insertAtCursor("_", "_")}>Italic</Button>
                <Button onClick={() => insertAtCursor("- ", "")}>• List</Button>
                <Button onClick={() => insertAtCursor("1. ", "")}>1. List</Button>
            </ButtonGroup>
            <TextareaAutosize
                id="editor-textarea"
                style={{
                    width: "100%",
                    height: height,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: 12,
                    fontSize: 16,
                    fontFamily: "inherit",
                    background: "#fff",
                    overflowY: "scroll"
                }}
                value={value}
                onChange={handleInput}
                spellCheck={true}
            />
        </Paper>
    );
};

export default Editor;