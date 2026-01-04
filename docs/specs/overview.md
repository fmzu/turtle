# Umi Game Web App Spec (Draft)

## Goal
- Build a browser-based "Umi Game" (lateral thinking puzzle) chat game.
- The AI is the quiz master and players ask yes/no questions to solve the puzzle.
 - Start with text chat; voice interaction is a future extension.

## Target Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

## Core User Flow
1. User opens the app and starts a new game.
2. AI presents a mystery scenario (the "soup").
3. User asks yes/no questions.
4. AI answers with "Yes / No / Irrelevant".
5. User submits a final guess.
6. AI judges correctness and reveals the full explanation.

## Key Screens
- Home
  - Start new game button
  - Short description and example
- Game
  - Scenario card
  - Chat thread (Q/A)
  - Input bar (question / guess toggle)
  - Progress indicator (optional)
- Result
  - Verdict and explanation
  - Play again

## Game Rules
- User can ask any natural language question.
- AI responds with:
  - "Yes" if the fact is essential and true.
  - "No" if the fact is essential and false.
  - "Irrelevant" if it does not affect the solution.
- The game ends when:
  - User submits a correct guess, or
  - User gives up.
- Puzzles are fixed (curated), not generated each time.

## Data Model (Minimal)
- Game
  - id
  - scenario
  - solution
  - keywords (required)
  - createdAt
- Message
  - id
  - gameId
  - role: "user" | "ai"
  - content
  - createdAt

## AI Behavior
- Must act as quiz master.
- Should not reveal the solution early.
- Should keep answers short (Yes/No/Irrelevant + short hint if needed).
- Should track consistency of facts within a single game.
- For final guesses, use a keyword checklist to judge "mostly correct".

## API (Draft)
- POST /api/game/new
  - returns scenario + gameId
- POST /api/game/ask
  - input: gameId, question
  - output: answer (Yes/No/Irrelevant)
- POST /api/game/guess
  - input: gameId, guess
  - output: correct? + explanation

## UI Notes
- Use shadcn/ui components for cards, buttons, input, and chat layout.
- Keep the chat area scrollable with a sticky input bar.
- Mobile-first layout.

## Non-Functional
- Fast first load, minimal assets.
- Clear loading states for AI responses.
- Preserve a single game session in memory only; refresh resets the game.

## Fixed Puzzle (Initial)
- Title: "The Man Who Drank Turtle Soup"
- Scenario: A man orders turtle soup at a restaurant. After one spoonful he suddenly leaves and later dies.
- Solution (hidden to user): He once survived a shipwreck and was told he ate turtle soup. At the restaurant he realizes the soup tastes different and understands he was fed human flesh, so he kills himself.
- Required keywords (final guess): "shipwreck", "human flesh" (or "cannibalism"), "realized the soup was different".
- Notes:
  - Only one puzzle at launch.
  - Add more puzzles later if the flow works.

## Open Questions
- Should we support multiplayer (same room)?
- When we add voice later, what input/output service should we target?
