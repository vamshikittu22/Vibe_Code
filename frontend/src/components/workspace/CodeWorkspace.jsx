import React, { useState } from 'react';
import CodeEditor from '../editor/CodeEditor';

const CodeWorkspace = () => {
  const [code, setCode] = useState('// Welcome to AI Coding Platform\n// This is a Monaco Editor powered workspace\n\nfunction welcome() {\n  console.log("Hello, AI Coding Platform!");\n}\n\nwelcome();');

  return (
    <div style={{ 
      height: '500px', 
      width: '100%',
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '8px 16px',
        backgroundColor: '#2d2d30',
        borderBottom: '1px solid #333',
        fontSize: '14px'
      }}>
        <span>main.js</span>
      </div>
      <CodeEditor
        code={code}
        language="javascript"
        height="460px"
        width="100%"
        onChange={setCode}
      />
    </div>
  );
};

export default CodeWorkspace;