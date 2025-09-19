# AI Coding Platform – Starter Project

A context-driven, Gemini Pro-powered code generation system. This structure is suitable for rapid MVP prototyping and team expansion.

## Project Structure

```
/context
    master_context.md
/backend
    app.js
    .env
    package.json
    /routes
        ai.js
    /services
        geminiService.js
    /controllers
        codeController.js
    /middleware
        auth.js
    /models
        User.js
        Project.js
/frontend
    package.json
    vite.config.js
    .env
    /src
        main.jsx
        App.jsx
        /api
            api.js
        /components
            CodeEditor.jsx
            PromptInput.jsx
            FileExplorer.jsx
            Header.jsx
        /context
            master_context.md
        /prompts
            scaffold_component.template
            refactor_code.template
            feature_request.template
        /styles
            app.css
```

## Getting Started

1. Clone the repository
2. Set up backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Update with your credentials
   ```
3. Set up frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```
4. Start the development servers:
   - Backend: `npm run dev` (from /backend)
   - Frontend: `npm run dev` (from /frontend)

## Environment Variables

Create `.env` files in both `/backend` and `/frontend` directories with appropriate configuration.

## License

MIT
