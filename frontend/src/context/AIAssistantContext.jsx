import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProject } from './ProjectContext';

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  CODE: 'code',
  ERROR: 'error',
  LOADING: 'loading',
};

// Message roles
export const ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
};

// Default system message
const SYSTEM_MESSAGE = {
  id: 'system-1',
  content: 'You are a helpful AI coding assistant. Help the user with their coding tasks, provide explanations, and suggest improvements.',
  role: ROLES.SYSTEM,
  type: MESSAGE_TYPES.TEXT,
  timestamp: new Date(),
};

// Create context
const AIAssistantContext = createContext({
  messages: [],
  isProcessing: false,
  isPanelOpen: false,
  unreadCount: 0,
  togglePanel: () => {},
  sendMessage: async () => {},
  clearConversation: () => {},
  generateCode: async () => {},
  explainCode: async () => {},
  refactorCode: async () => {},
  findBugs: async () => {},
  cancelOperation: () => {},
});

// Custom hook to use AI Assistant context
export const useAIAssistant = () => useContext(AIAssistantContext);

// AI Assistant Provider
const AIAssistantProvider = ({ children }) => {
  const [messages, setMessages] = useState([SYSTEM_MESSAGE]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const abortControllerRef = useRef(null);
  const { selectedFile } = useProject();
  const prevMessagesLengthRef = useRef(0);

  // Track unread messages when panel is closed
  useEffect(() => {
    if (isPanelOpen) {
      // Reset unread count when panel is opened
      setUnreadCount(0);
    } else if (messages.length > prevMessagesLengthRef.current) {
      // Increment unread count when new messages arrive while panel is closed
      setUnreadCount(prev => prev + (messages.length - prevMessagesLengthRef.current));
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, isPanelOpen]);

  // Toggle panel visibility
  const togglePanel = useCallback(() => {
    setIsPanelOpen(prev => !prev);
  }, []);

  // Add a new message to the conversation
  const addMessage = useCallback((message) => {
    setMessages(prev => {
      const newMessages = [...prev, {
        id: uuidv4(),
        content: message.content,
        role: message.role || ROLES.ASSISTANT,
        type: message.type || MESSAGE_TYPES.TEXT,
        timestamp: new Date(),
        ...(message.metadata && { metadata: message.metadata }),
      }];
      return newMessages;
    });
  }, []);

  // Clear the conversation
  const clearConversation = useCallback(() => {
    setMessages([SYSTEM_MESSAGE]);
  }, []);

  // Generate a response from the AI
  const generateResponse = useCallback(async (userInput, context = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      setIsProcessing(true);
      
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate a response
      const response = await simulateAIResponse(userInput, context, signal);
      
      if (!signal.aborted) {
        addMessage({
          content: response.content,
          role: ROLES.ASSISTANT,
          type: response.type,
          metadata: response.metadata,
        });
      }
      
      return response;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error generating AI response:', error);
        addMessage({
          content: 'Sorry, I encountered an error. Please try again.',
          role: ROLES.ASSISTANT,
          type: MESSAGE_TYPES.ERROR,
        });
      }
      return null;
    } finally {
      if (!signal.aborted) {
        setIsProcessing(false);
      }
    }
  }, [addMessage]);

  // Send a message to the AI assistant
  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage = {
      content,
      role: ROLES.USER,
      type: MESSAGE_TYPES.TEXT,
    };
    
    addMessage(userMessage);
    
    // Generate AI response with context
    const context = {
      fileContent: selectedFile?.content || '',
      fileName: selectedFile?.name || '',
      language: selectedFile?.language || '',
    };
    
    return generateResponse(content, context);
  }, [addMessage, generateResponse, selectedFile]);

  // Generate code based on a prompt
  const generateCode = useCallback(async (prompt, language = 'javascript') => {
    const context = {
      fileContent: selectedFile?.content || '',
      fileName: selectedFile?.name || '',
      language,
      action: 'generate',
    };
    
    return generateResponse(prompt, context);
  }, [generateResponse, selectedFile]);

  // Explain the selected code
  const explainCode = useCallback(async (code, language = 'javascript') => {
    const prompt = `Explain the following ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;
    
    const context = {
      fileContent: selectedFile?.content || '',
      fileName: selectedFile?.name || '',
      language,
      action: 'explain',
    };
    
    return generateResponse(prompt, context);
  }, [generateResponse, selectedFile]);

  // Refactor the selected code
  const refactorCode = useCallback(async (code, language = 'javascript') => {
    const prompt = `Refactor the following ${language} code to be more efficient and maintainable:\n\`\`\`${language}\n${code}\n\`\`\``;
    
    const context = {
      fileContent: selectedFile?.content || '',
      fileName: selectedFile?.name || '',
      language,
      action: 'refactor',
    };
    
    return generateResponse(prompt, context);
  }, [generateResponse, selectedFile]);

  // Find bugs in the selected code
  const findBugs = useCallback(async (code, language = 'javascript') => {
    const prompt = `Find and fix any bugs in the following ${language} code. Explain the issues and provide a corrected version:\n\`\`\`${language}\n${code}\n\`\`\``;
    
    const context = {
      fileContent: selectedFile?.content || '',
      fileName: selectedFile?.name || '',
      language,
      action: 'findBugs',
    };
    
    return generateResponse(prompt, context);
  }, [generateResponse, selectedFile]);

  // Cancel the current AI operation
  const cancelOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsProcessing(false);
    }
  }, []);

  // Simulate AI response (replace with actual API call in production)
  const simulateAIResponse = async (prompt, context, signal) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    
    // Simple response based on the action
    const { action, language = 'javascript' } = context;
    
    switch (action) {
      case 'explain':
        return {
          content: `Here's an explanation of the ${language} code you provided...`,
          type: MESSAGE_TYPES.TEXT,
          metadata: {
            action: 'explain',
            language,
          },
        };
      
      case 'refactor':
        return {
          content: '// Refactored code\nfunction optimized() {\n  // Improved implementation\n  return "Optimized!";\n}',
          type: MESSAGE_TYPES.CODE,
          metadata: {
            action: 'refactor',
            language,
            explanation: 'I\'ve optimized the code for better performance and readability.'
          },
        };
      
      case 'findBugs':
        return {
          content: '// Fixed code\nfunction fixed() {\n  // Fixed implementation\n  return "Fixed!";\n}',
          type: MESSAGE_TYPES.CODE,
          metadata: {
            action: 'findBugs',
            language,
            explanation: 'I found and fixed a few issues in the code...'
          },
        };
      
      case 'generate':
      default:
        return {
          content: '// Generated code\nfunction generated() {\n  // Implementation\n  return "Generated!";\n}',
          type: MESSAGE_TYPES.CODE,
          metadata: {
            action: 'generate',
            language,
            explanation: 'Here\'s the code you requested.'
          },
        };
    }
  };

  // Context value
  const contextValue = {
    messages: messages.filter(m => m.role !== ROLES.SYSTEM), // Don't expose system messages
    isProcessing,
    isPanelOpen,
    unreadCount,
    togglePanel,
    sendMessage,
    clearConversation,
    generateCode,
    explainCode,
    refactorCode,
    findBugs,
    cancelOperation,
  };

  return (
    <AIAssistantContext.Provider value={contextValue}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export default AIAssistantProvider;
