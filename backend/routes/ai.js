const express = require('express');
const router = express.Router();
const { generateCode } = require('../controllers/codeController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/ai/generate
 * @desc    Generate code based on user prompt and context
 * @access  Private (protected by auth middleware)
 */
router.post('/generate', authenticate, async (req, res, next) => {
  try {
    const { prompt, context, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await generateCode(prompt, context, options);
    res.json(result);
  } catch (error) {
    console.error('Error in generate endpoint:', error);
    next(error);
  }
});

// Add more AI-related routes here as needed

module.exports = router;
