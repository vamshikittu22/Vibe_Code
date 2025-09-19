import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';
import * as monaco from 'monaco-editor';
import { debounce } from 'lodash';
import { useThemeContext } from '../../context/ThemeContext';

// Register language-specific configurations
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
});

monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2020,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  jsx: monaco.languages.typescript.JsxEmit.React,
  allowJs: true,
  checkJs: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  strict: true,
});

const CodeEditor = ({
  code = '',
  language = 'javascript',
  onChange = () => {},
  onSave = () => {},
  readOnly = false,
  fileName = 'untitled.js',
  height = '100%',
  width = '100%',
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const subscriptionRef = useRef(null);
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Set up editor options
  const options = {
    automaticLayout: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    readOnly,
    renderWhitespace: 'selection',
    tabSize: 2,
    wordWrap: 'on',
    wordBasedSuggestions: true,
    suggestOnTriggerCharacters: true,
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    suggest: {
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showModules: true,
    },
  };

  // Initialize editor
  const initEditor = useCallback(() => {
    if (!editorRef.current) return;

    // Clean up previous editor instance if it exists
    if (monacoRef.current) {
      monacoRef.current.dispose();
    }

    // Create editor instance
    monacoRef.current = monaco.editor.create(editorRef.current, {
      value: code,
      language,
      theme: themeMode === 'dark' ? 'vs-dark' : 'vs',
      ...options,
    });

    // Set up model markers
    const model = monacoRef.current.getModel();
    if (model) {
      monaco.editor.setModelMarkers(model, 'owner', []);
    }

    // Set up content change listener with debounce
    subscriptionRef.current = monacoRef.current.onDidChangeModelContent(
      debounce(() => {
        const value = monacoRef.current?.getValue();
        if (value !== undefined) {
          onChange(value);
        }
      }, 500)
    );

    // Set up save shortcut (Cmd/Ctrl + S)
    monacoRef.current.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        const value = monacoRef.current?.getValue();
        if (value !== undefined) {
          onSave(value);
        }
      }
    );

    // Set up resize observer for the container
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === editorRef.current) {
          monacoRef.current?.layout();
        }
      }
    });

    resizeObserver.observe(editorRef.current);

    // Clean up function
    return () => {
      subscriptionRef.current?.dispose();
      resizeObserver.disconnect();
      monacoRef.current?.dispose();
    };
  }, [language, themeMode]);

  // Initialize editor on mount and when dependencies change
  useEffect(() => {
    if (editorRef.current) {
      const cleanup = initEditor();
      setIsEditorReady(true);
      return cleanup;
    }
  }, [initEditor]);

  // Update editor value when code prop changes
  useEffect(() => {
    if (isEditorReady && monacoRef.current && monacoRef.current.getValue() !== code) {
      monacoRef.current.setValue(code);
    }
  }, [code, isEditorReady]);

  // Update editor theme when theme changes
  useEffect(() => {
    if (monacoRef.current) {
      monaco.editor.setTheme(themeMode === 'dark' ? 'vs-dark' : 'vs');
    }
  }, [themeMode]);

  // Update editor language when language prop changes
  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      monacoRef.current?.layout();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box
      ref={editorRef}
      sx={{
        width,
        height,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        '& .monaco-editor .margin': {
          backgroundColor: theme.palette.background.paper,
        },
        '& .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input': {
          backgroundColor: theme.palette.background.paper,
        },
        '& .monaco-editor .margin-view-overlays .line-numbers': {
          color: theme.palette.text.secondary,
        },
      }}
    />
  );
};

export default CodeEditor;
