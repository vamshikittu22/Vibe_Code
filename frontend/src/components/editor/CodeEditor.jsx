import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({
  code = '',
  language = 'javascript',
  onChange = () => {},
  onSelectionChange = () => {},
  fileName = '',
  height = '100%',
  width = '100%',
}) => {
  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Listen for selection changes
    editor.onDidChangeCursorSelection((e) => {
      const model = editor.getModel();
      if (model && onSelectionChange) {
        const selectedText = model.getValueInRange(e.selection);
        onSelectionChange(selectedText);
      }
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save shortcut
      console.log('Save triggered for:', fileName);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA, () => {
      // Select all
      const model = editor.getModel();
      if (model) {
        editor.setSelection(model.getFullModelRange());
      }
    });
  };

  return (
    <div style={{ height, width }}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          fontSize: 14,
          fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Menlo, "Ubuntu Mono", monospace',
          lineNumbers: 'on',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          folding: true,
          renderWhitespace: 'selection',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            bracketPairsHorizontal: true,
            highlightActiveBracketPair: true,
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;