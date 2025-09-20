import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({
  code = '',
  language = 'javascript',
  onChange = () => {},
  height = '100%',
  width = '100%',
}) => {
  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div style={{ height, width }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;