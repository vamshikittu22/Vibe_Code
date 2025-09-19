const { generateWithGemini } = require('../services/geminiService');
const fs = require('fs');
const path = require('path');

/**
 * Generate code based on user prompt and context
 * @param {string} prompt - User's code generation prompt
 * @param {string} context - Additional context for the AI
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generated code and metadata
 */
async function generateCode(prompt, context = '', options = {}) {
  try {
    // Add system context if needed
    const systemContext = await getSystemContext();
    const fullContext = `${systemContext}\n\n${context}`.trim();
    
    // Call Gemini service
    const result = await generateWithGemini(prompt, fullContext, {
      temperature: 0.7,
      maxOutputTokens: 2048,
      ...options
    });

    return {
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in generateCode:', error);
    throw new Error('Failed to generate code');
  }
}

/**
 * Get system context from master context file
 * @returns {Promise<string>} - System context as string
 */
async function getSystemContext() {
  try {
    const contextPath = path.join(__dirname, '../../context/master_context.md');
    return await fs.promises.readFile(contextPath, 'utf-8');
  } catch (error) {
    console.warn('Could not load master context file');
    return '';
  }
}

/**
 * Format code according to language-specific formatting rules
 * @param {string} code - Raw code to format
 * @param {string} language - Programming language
 * @returns {Promise<string>} - Formatted code
 */
async function formatCode(code, language = 'javascript') {
  // TODO: Implement language-specific formatting
  return code;
}

module.exports = {
  generateCode,
  formatCode
};
