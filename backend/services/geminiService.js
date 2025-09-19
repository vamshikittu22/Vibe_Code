const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini Pro API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate code using Gemini Pro
 * @param {string} prompt - User's code generation prompt
 * @param {string} context - Additional context for the AI
 * @param {Object} options - Generation options (temperature, maxTokens, etc.)
 * @returns {Promise<Object>} - Generated code and metadata
 */
async function generateWithGemini(prompt, context = '', options = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      ...options
    });

    // Construct the full prompt with context
    const fullPrompt = `Context: ${context}\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      code: text,
      model: 'gemini-pro',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    throw new Error('Failed to generate code with Gemini API');
  }
}

/**
 * Validate if the API key is valid
 * @returns {Promise<boolean>} - True if API key is valid
 */
async function validateApiKey() {
  try {
    await generateWithGemini('Test connection', 'This is a test prompt to validate the API key');
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  generateWithGemini,
  validateApiKey
};
