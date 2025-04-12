# LLM Instructions

**Project Name**: Invincible Title Card Generator  
**Build Tool**: [Vite](https://vitejs.dev/)  
**Runtime**: [Bun](https://bun.sh/)  
**Language**: TypeScript  
**UI Library**: [React](https://react.dev/)  
**Styling**: [Tailwind CSS](https://tailwindcss.com/)  
**Directory Structure**: All code is located in `src/`

---

## Overview

This project generates title cards for the animated television series _Invincible_. It compiles with Vite on Bun, using TypeScript for type-safe development, React for the user interface, and Tailwind CSS for styling.

The repository structure is organized to promote clarity and maintainability. Even though we use React, we aim to keep the code as clear and modular as possible, leveraging React’s component model with type-safe patterns.

---

## Key Goals

1. **Generate Invincible Title Cards**  
   Create a user-friendly React interface that allows customization of title cards matching the style of the _Invincible_ TV series.

2. **Maintain Simplicity**

   - Use React for components and UI state, with minimal overhead.
   - Keep business logic modular and easy to maintain.

3. **Keep the Code Modular**
   - Organize functionality into well-defined React components and reusable utilities.
   - Structure files under `src/` so that logic is discoverable and components are easy to reuse or update.

---

## Guidelines for Contributions

1. **React Usage**

   - Use **functional components** (`function ComponentName()`) whenever possible.
   - Type component props and state with TypeScript.
   - Use React Hooks (e.g., `useState`, `useEffect`, `useCallback`) for state management and side effects.
   - Keep components small and focused—avoid “god components.”

2. **TypeScript Best Practices**

   - All code in `src/` should be written in TypeScript (`.tsx` / `.ts`).
   - Ensure `"strict": true` in `tsconfig.json` and avoid `any` unless strictly necessary.
   - Use clear and explicit interfaces/types for component props and utility functions.

3. **Tailwind CSS**

   - Prefer Tailwind utility classes for styling.
   - Keep custom CSS minimal—only if Tailwind does not provide a suitable utility.
   - For styling logic that must live in code, create small helper classes/components rather than large monolithic styles.

4. **File and Folder Structure**

   - **`src/`**: All source code. Potential subfolders:
     - `src/components/`: Reusable React components (e.g., `TitleCard.tsx`).
     - `src/core/`: Core logic (e.g., data manipulation, utility functions).
     - `src/assets/`: Fonts, images, or other static assets.
     - `src/App.tsx` or `src/main.tsx`: Entry points for your React app.
   - **`index.html`**: Main HTML file (usually at the project root or in a `public/` folder, depending on Vite config).
   - **`vite.config.ts`**: Vite configuration.
   - **`tsconfig.json`**: TypeScript configuration.
   - **`tailwind.config.js`**: Tailwind configuration.

5. **Code Organization**

   - Keep React components small and single-purpose.
   - If a file becomes too large or complex, split it into smaller components.
   - Use descriptive filenames that match the component or function they export.

6. **Development Flow**

   - Use Bun for local development:
     ```bash
     bun install
     bun run dev
     ```
   - Use the Vite dev server for hot module reloading.
   - Test the UI to ensure title card generation (fonts, images, text positioning) works properly.

7. **Pull Request and Review Guidelines**

   - Provide a clear description of changes (new components, bug fixes, etc.) in your PR.
   - Include screenshots or GIFs if you modify any visual elements.
   - Explain any design decisions if they diverge from existing patterns or significantly affect the codebase.

8. **Security and Licensing**

   - Confirm that all _Invincible_ assets (images, fonts, references) comply with licensing.
   - Keep dependencies updated to avoid security vulnerabilities.

9. **Testing and Linting**

   - Write tests for critical components or utilities (using a minimal testing library like Vitest, if desired).
   - Lint and format code (e.g., ESLint + Prettier) before committing to maintain code consistency.

10. **Questions**

- LLMs can generate clarifying questions as needed.
- Human contributors can open an Issue or consult any additional docs (like a `docs/` folder, if available).

---

### Example File Structure

```
├─ src
│  ├─ components
│  │  ├─ TitleCard.tsx
│  │  └─ …
│  ├─ core
│  │  ├─ types.ts
│  │  └─ utils.ts
│  ├─ assets
│  │  └─ …
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ …
├─ index.html
├─ vite.config.ts
├─ tailwind.config.js
├─ tsconfig.json
├─ package.json (or Bun equivalents)
└─ …
```

---

## Final Reminders

- **Use React** responsibly for the UI, keeping components well-typed and small.
- **Keep TypeScript strict** and rely on React Hooks to manage state and side effects.
- **Use Tailwind** for styling wherever possible to maintain a consistent look and feel.
- **Keep it simple** to ensure the project remains approachable for all contributors—human or LLM.
