# Master Context – AI Coding Platform

This file contains the core context and knowledge base for the AI coding platform. It serves as the primary source of truth for system behavior, patterns, and architectural decisions.

## System Overview
- **Purpose**: AI-powered code generation and assistance platform
- **Core Technology Stack**:
  - Frontend: React with Vite
  - Backend: Node.js/Express
  - AI: Google Gemini Pro API
  - State Management: React Context API
  - Code Editing: Monaco Editor

## Key Features
1. Context-aware code generation
2. Real-time code suggestions
3. Project scaffolding
4. Code refactoring assistance
5. Component generation

## Architecture Guidelines
- Follows clean architecture principles
- Modular and extensible design
- Secure by default
- Performance-conscious implementation

## Development Guidelines
- Write clean, maintainable code
- Document all public APIs
- Follow consistent naming conventions
- Include appropriate error handling
- Write unit tests for critical paths

## Security Considerations
- Never expose API keys in client-side code
- Validate all user inputs
- Implement proper authentication and authorization
- Use environment variables for sensitive configuration

## Performance Considerations
- Implement code splitting
- Use memoization where appropriate
- Optimize API calls
- Implement proper caching strategies

## Future Enhancements
- Support for multiple AI models
- Plugin architecture for extending functionality
- Collaborative editing features
- Integration with version control systems
- Advanced code analysis capabilities
