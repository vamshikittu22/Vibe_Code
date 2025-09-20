import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Alert,
  IconButton,
  Divider,
  Card,
  CardContent,
  Grid,
  Link,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  OpenInNew as OpenInNewIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// AI Provider configurations
const aiProviders = {
  openai: {
    name: 'OpenAI',
    description: 'GPT-4, GPT-4o, GPT-4o mini',
    freeCredits: '$5 (3 months)',
    pricing: 'GPT-4o: $5/$20 per 1M tokens',
    setupUrl: 'https://platform.openai.com/api-keys',
    icon: '🤖',
    integration: 'blueprint:javascript_openai',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  anthropic: {
    name: 'Anthropic Claude',
    description: 'Claude 3.5, Claude 4 Opus',
    freeCredits: 'No free tier',
    pricing: 'Claude 3.5: $6 per 1M tokens',
    setupUrl: 'https://console.anthropic.com/',
    icon: '🧠',
    integration: 'blueprint:javascript_anthropic',
    models: ['claude-3-5-haiku', 'claude-3-5-sonnet', 'claude-3-opus'],
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Gemini 2.5 Pro, Gemini Flash',
    freeCredits: 'Free with rate limits',
    pricing: 'Flash: $0.17 per 1M tokens',
    setupUrl: 'https://ai.google.dev/',
    icon: '💎',
    integration: 'blueprint:javascript_gemini',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-1.5-pro'],
  },
  xai: {
    name: 'xAI Grok',
    description: 'Grok reasoning models',
    freeCredits: 'Limited free tier',
    pricing: 'Variable pricing',
    setupUrl: 'https://console.x.ai/',
    icon: '🚀',
    integration: 'blueprint:javascript_xai',
    models: ['grok-beta', 'grok-vision-beta'],
  },
  perplexity: {
    name: 'Perplexity',
    description: 'Research and web-connected AI',
    freeCredits: 'Limited queries',
    pricing: 'Usage-based',
    setupUrl: 'https://www.perplexity.ai/settings/api',
    icon: '🔍',
    integration: 'blueprint:perplexity_v0',
    models: ['llama-3.1-sonar-large', 'llama-3.1-sonar-small'],
  },
  huggingface: {
    name: 'Hugging Face',
    description: '200+ open source models',
    freeCredits: 'Monthly credits included',
    pricing: 'From $0.10 per 1M tokens',
    setupUrl: 'https://huggingface.co/settings/tokens',
    icon: '🤗',
    integration: null, // Custom implementation
    models: ['meta-llama/Llama-3.2-3B', 'microsoft/DialoGPT-medium', 'google/flan-t5-large'],
  },
};

const freeOptions = [
  {
    provider: 'gemini',
    name: 'Google Gemini Free',
    description: 'Free with rate limits: 5 RPM, 250K TPM',
    monthlyTokens: '7.5M tokens/month',
    rateLimit: '5 requests/min',
  },
  {
    provider: 'huggingface',
    name: 'Hugging Face Free',
    description: 'Open source models with monthly credits',
    monthlyTokens: 'Variable by model',
    rateLimit: 'Few hundred/hour',
  },
  {
    provider: 'openai',
    name: 'OpenAI Trial',
    description: '$5 free credits for new users',
    monthlyTokens: '~250K tokens (GPT-4o)',
    rateLimit: 'Standard limits',
  },
];

const APIKeyManager = ({ open, onClose, onSave }) => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [useIntegration, setUseIntegration] = useState(true);
  const [savedConfigs, setSavedConfigs] = useState([]);

  useEffect(() => {
    // Load saved configurations
    const saved = localStorage.getItem('ai_provider_configs');
    if (saved) {
      setSavedConfigs(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    if (!selectedProvider) return;

    const config = {
      provider: selectedProvider,
      model: selectedModel,
      apiKey: useIntegration ? null : apiKey,
      useIntegration,
      timestamp: new Date().toISOString(),
    };

    const updatedConfigs = [...savedConfigs.filter(c => c.provider !== selectedProvider), config];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem('ai_provider_configs', JSON.stringify(updatedConfigs));

    onSave(config);
    handleClose();
  };

  const handleClose = () => {
    setSelectedProvider('');
    setApiKey('');
    setSelectedModel('');
    setUseIntegration(true);
    onClose();
  };

  const handleUseIntegration = (provider) => {
    const integration = aiProviders[provider]?.integration;
    if (integration) {
      // This would trigger the Replit integration setup
      window.open(`/integrations/${integration}`, '_blank');
    }
  };

  const renderProviderCard = (providerId, provider) => (
    <Card 
      key={providerId}
      sx={{ 
        cursor: 'pointer',
        border: selectedProvider === providerId ? 2 : 1,
        borderColor: selectedProvider === providerId ? 'primary.main' : 'divider',
        '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' },
        transition: 'all 0.2s ease',
      }}
      onClick={() => {
        setSelectedProvider(providerId);
        setSelectedModel(provider.models[0]);
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="h6" component="span">{provider.icon}</Typography>
          <Typography variant="h6">{provider.name}</Typography>
          <Chip 
            label={provider.freeCredits !== 'No free tier' ? 'FREE' : 'PAID'} 
            size="small" 
            color={provider.freeCredits !== 'No free tier' ? 'success' : 'default'}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {provider.description}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Free: {provider.freeCredits}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Pricing: {provider.pricing}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Configure AI Provider
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Free Options Section */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
            <CheckIcon color="success" />
            Free Options Available
          </Typography>
          <Grid container spacing={2}>
            {freeOptions.map((option, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card variant="outlined" sx={{ bgcolor: 'success.light', opacity: 0.9 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {option.name}
                    </Typography>
                    <Typography variant="caption" display="block" mb={1}>
                      {option.description}
                    </Typography>
                    <Chip label={option.monthlyTokens} size="small" variant="outlined" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Provider Selection */}
        <Typography variant="h6" gutterBottom>
          Choose AI Provider
        </Typography>
        <Grid container spacing={2} mb={3}>
          {Object.entries(aiProviders).map(([providerId, provider]) => (
            <Grid item xs={12} sm={6} md={4} key={providerId}>
              {renderProviderCard(providerId, provider)}
            </Grid>
          ))}
        </Grid>

        {/* Configuration Form */}
        {selectedProvider && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Configure {aiProviders[selectedProvider].name}
            </Typography>

            {/* Model Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Model</InputLabel>
              <Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                label="Select Model"
              >
                {aiProviders[selectedProvider].models.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Integration vs Manual Setup */}
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Setup Method
              </Typography>
              
              {aiProviders[selectedProvider].integration && (
                <Alert 
                  severity="info" 
                  sx={{ mb: 2 }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small"
                      onClick={() => handleUseIntegration(selectedProvider)}
                      endIcon={<OpenInNewIcon />}
                    >
                      Use Integration
                    </Button>
                  }
                >
                  Recommended: Use Replit's secure integration for automatic key management
                </Alert>
              )}

              <TextField
                fullWidth
                label="API Key (Manual Setup)"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key manually"
                helperText={
                  <Box component="span">
                    Get your API key from{' '}
                    <Link 
                      href={aiProviders[selectedProvider].setupUrl} 
                      target="_blank" 
                      rel="noopener"
                    >
                      {aiProviders[selectedProvider].name} Dashboard
                    </Link>
                  </Box>
                }
              />
            </Box>

            {/* Token Limits Warning */}
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Free Tier Limits:</strong> {aiProviders[selectedProvider].freeCredits}
                <br />
                Monitor your usage to avoid unexpected charges.
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Saved Configurations */}
        {savedConfigs.length > 0 && (
          <Box mt={3}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Saved Configurations
            </Typography>
            {savedConfigs.map((config, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2">
                        {aiProviders[config.provider]?.name} - {config.model}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {config.useIntegration ? 'Replit Integration' : 'Manual API Key'}
                      </Typography>
                    </Box>
                    <Chip 
                      label={config.useIntegration ? 'Secure' : 'Manual'} 
                      size="small"
                      color={config.useIntegration ? 'success' : 'default'}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!selectedProvider || (!apiKey && !useIntegration)}
        >
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default APIKeyManager;