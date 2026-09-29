# AI LeadPilot - Interview Guide

This guide is designed to help you prepare for the Masal AI FDE interview. It synthesizes the technical implementation, architectural decisions, and product vision of the project into clear, highly communicable formats.

## 1. 30-Second Project Explanation

"AI LeadPilot is a full-stack real estate CRM tool that uses Google's Gemini AI to instantly analyze, score, and prioritize incoming sales leads. Instead of agents manually reviewing forms, the system automatically detects budget alignment, timeline urgency, and purchase intent, giving each lead a Hot/Warm/Cold rating while providing an AI assistant that can instantly draft personalized follow-up emails."

## 2. 1-Minute Project Explanation

"AI LeadPilot solves the core problem of lead triage in real estate. When a prospect submits an inquiry, an Express backend captures the data and routes it to the Gemini API. The AI parses the unstructured input to extract key constraints and assigns a conversion probability score. This is surfaced on a React frontend dashboard. Beyond just scoring, we built two conversational tools: a Lead Chat that allows agents to 'interview' the context of a specific lead (like asking 'what objections might this buyer have?'), and a Follow-Up Assistant that instantly generates a customized email strategy based on the lead's strict parameters. The architecture is decoupled, with the frontend on Vercel and the Express API designed for deployment on Render, keeping API keys strictly server-side for security."

## 3. 3-Minute Demo Script

1. **The Dashboard (0:00 - 0:45):** 
   * "Welcome to the AI LeadPilot dashboard. As you can see, our leads are ingested and sorted immediately. Notice the 'Priority Badges' — these aren't static inputs, they are generated dynamically by our AI."
2. **Adding & Analyzing a Lead (0:45 - 1:30):**
   * "Let's simulate a new lead coming in. I'll enter some messy, unstructured constraints: 'I want a condo downtown for under 800k but not right now, maybe in 6 months.'
   * "I hit 'Analyze'. The Express server is now communicating with Gemini. Let's look at the result. It perfectly extracted the $800k budget, marked the timeline as 'medium-term', and assigned it a 'Warm' priority rather than 'Hot'."
3. **Conversational AI & Follow-up (1:30 - 3:00):**
   * "Now, as an agent, I want to pursue this. I can jump into the Chat tab and ask the AI, 'How should I approach this person?' Because the prompt is strictly grounded to this specific lead, it knows I'm talking about the downtown condo buyer.
   * "Finally, I don't want to type an email from scratch. I click the Follow-Up tab, and the AI generates a multi-channel strategy and writes the exact email for me, acknowledging the 6-month timeline. This saves minutes of work per lead, compounding into hours saved per week."

## 4. Architecture Explanation

The application follows a decoupled two-tier architecture:
* **Frontend:** A React Single Page Application (Vite framework) interacting with backend endpoints via REST APIs.
* **Backend:** A Node.js/Express server that acts as a secure intermediary layer.
* **Data Storage:** Uses simple, in-memory array storage for `leads` (`backend/src/controllers/leadController.js`) to focus exclusively on AI integration speed for the MVP.
* **AI Service:** The backend securely holds the `GEMINI_API_KEY` and communicates with the Google Generative AI servers via the `@google/generative-ai` SDK.

## 5. Gemini API Explanation

The backend imports `GoogleGenerativeAI`, initializes it with the server-side API Key, and gets an instance of the `"gemini-1.5-flash"` model. We use `generateContent(promptText)` to get the response. For analysis and follow-up, the system strictly parses the `response.text()` as JSON, cleaning off markdown tags, and throwing validation errors if the AI omits required keys (like `leadScore` or `intent`).

## 6. Prompt Engineering Explanation

Prompts are stored dynamically in `backend/src/prompts/`. We use template literals to inject specific lead fields into standard system instructions. We enforce constraints, such as telling the AI exactly what JSON schema to output or telling the Chat system to only answer context based on the current Lead JSON. This grounds the AI in reality and prevents hallucinations.

## 7. Lead Scoring Explanation

Lead scoring is handled entirely by the Gemini AI based on instructions inside the prompt. We tell the AI to weigh specific signals (budget realism, timeline immediacy, clarity of location). It returns a 0-100 `leadScore` and categorizes it as HOT, WARM, or COLD. We clearly treat this metric as a human-assist tool, not an absolute truth.

## 8. Conversational AI Explanation

The Agent Chat feature is contextualized. While the frontend presents a simple chat box, the backend `buildChatPrompt` injects the whole `targetLead` object into the conversational prompt every time a question is asked. This ensures Gemini answers questions specifically regarding the buyer's budget, objections, or property requirements, acting as a sparring partner for the sales agent.

## 9. Follow-up Assistant Explanation

The Follow-Up Assistant eliminates the time spent drafting communications. When triggered, the backend sends the lead's entire profile to Gemini with instructions to formulate an outreach plan. It returns a strict JSON containing `timing`, `channel` (email/sms), `talkingPoints`, and a `suggestedMessage`. The agent just copy-pastes or clicks to engage, vastly speeding up outbound sales.

## 10. Why React?

React provides a component-driven architecture that is perfect for dashboards. We can strictly manage state UI logic (like Loading vs Error vs Display) cleanly. Vite provides lightning-fast HMR for development speed.

## 11. Why Express?

Express is lightweight and un-opinionated. We didn't need the heavy boilerplate of a framework like NestJS for this MVP. Express allows us to quickly expose REST endpoints and handle the asynchronous Gemini SDK calls with standard `try/catch` error handling cleanly via separate controllers and routes.

## 12. Why Gemini?

Gemini (specifically `1.5-flash`) provides an exceptional balance of speed and cost. Crucially, its instruction-following capability for structured JSON output is incredibly reliable, which was mandatory for saving data back into our JavaScript objects.

## 13. Why Server-Side API Call?

We *must* call Gemini from the server to protect our API keys. If we called it from the React client, our keys would be exposed in the browser's network tab, leading to quota theft and massive bills. Furthermore, doing it server-side allows us to hide our proprietary prompt engineering logic from the end user.

## 14. Biggest Technical Challenge

**Enforcing JSON Schemas with LLMs:** LLMs want to output conversational dialogue. For lead analysis, we needed strict backend integration. We had to heavily engineer the prompts to only return JSON, and write a robust backend parser (`text.split('```json')`) that validates keys before saving to the database to prevent the app from crashing on malformed data.

## 15. Biggest Product Decision

**Decoupling Analysis from Creation:** Instead of running the AI analysis synchronously while creating the lead (which would make the UI feel slow and blocking), we built the UI to let leads be added instantly in an 'Unanalyzed' state. Agents actively trigger the analysis when ready, ensuring the system feels snappy.

## 16. Known Limitations

* **Transient Data:** The backend currently uses in-memory variables. If the server restarts, lead data is wiped.
* **AI Hallucinations:** While mitigated by strict prompts, the AI has a non-zero chance of inferring incorrect data.
* **No Authentication:** The dashboard is open; there's no RBAC (Role-Based Access Control) yet.

## 17. Future Improvements

* Integrate **PostgreSQL** configured via Prisma for persistent, relational storage.
* Integrate **HubSpot/Salesforce APIs** to push analyzed results out of our pipeline into standard CRMs.
* Add **Twilio/SendGrid** to immediately dispatch the AI follow-up texts and emails from the app directly.

## 18. 20 Likely Interviewer Questions

1. How do you prevent Gemini from lying about the lead?
2. What happens if the Gemini API goes down?
3. Where is the data saved?
4. How did you structure your components in React?
5. Why didn't you use Next.js?
6. How do you handle CORS?
7. What is the difference between Hot, Warm, and Cold logic?
8. How do you handle malformed JSON from Gemini?
9. Is React Context or Redux used?
10. Can you show me where the Prompt lives?
11. How do you inject lead data into the prompt?
12. Why `1.5-flash` instead of `1.5-pro`?
13. How did you test this?
14. How would you scale the backend?
15. What happens if a lead inputs 10,000 words? 
16. Are there environment variables? How are they managed?
17. Do you have error boundaries in React?
18. How easy is it to change the AI provider to OpenAI?
19. How did AI tools help you build this?
20. What would you do differently?

## 19. Short, Easy-to-Understand Answers

1. **Preventing lying:** We inject strict prompts telling it to *only* use provided variables and never invent constraints.
2. **API Downtime:** The backend catches the timeout/error and returns a `503 Service Unavailable`, which the frontend renders as a graceful error message without crashing.
3. **Data Storage:** Currently, it's an in-memory mapped Javascript array (`let leads = []`) in the controller for speed of MVP delivery.
4. **React Structure:** Organized by concern: `/components` (reusable UI), `/pages` (route wrappers), and `/services` (API wrappers).
5. **Why not Next.js:** We wanted clean separation of concerns (Standalone React SPA + Dedicated Express API) instead of a monolithic meta-framework to demonstrate full-stack routing comprehension.
6. **CORS:** Handled via the Express `cors` middleware, passing a dynamic origin array from `.env.ALLOWED_ORIGINS` to allow only Vercel and local requests.
7. **Hot/Warm/Cold:** It's determined by the LLM based on prompt criteria: Budget availability, timeline proximity, and intent strength.
8. **Malformed JSON:** The `geminiService.js` attempts to strip markdown wrappers. If `JSON.parse` fails or missing required keys, it `throws`, and the controller catches to send a safe 503 instead of persisting garbage.
9. **State Management:** Local component state (Hooks like `useState`, `useEffect`) was sufficient; no need to overcomplicate with Redux for this scope.
10. **Prompt Location:** Stored in `backend/src/prompts/` as pure Javascript functions exporting template string builders.
11. **Injecting Data:** We pass the `targetLead` object into the Builder function, which injects `lead.budget`, `lead.timeline` into the text string sent to Google.
12. **Why Flash:** `flash` is significantly faster and cheaper than `pro`, making it perfect for rapid, sub-second JSON inference on small context windows.
13. **Testing:** Mostly manual E2E flow testing through the UI.
14. **Scaling:** First, swap in-memory storage for Postgres. Second, implement a Redis queue to handle AI analysis asynchronously instead of waiting on the HTTP thread.
15. **10k Words:** Assuming within token limits, Gemini processes it. Our backend doesn't explicitly chunk it right now, which is a future improvement.
16. **Environment Variables:** Managed via `.env` locally or injected in Render/Vercel dashboards on deployment (e.g., `GEMINI_API_KEY`).
17. **Error Boundaries:** Standard `try/catch` in data-fetching hooks manage localized UI error states cleanly.
18. **Swapping AI:** Extremely easy. Since all AI logic is isolated inside `src/services/geminiService.js`, we'd only rewrite that one file.
19. **AI Building Tools:** AI was used as a sparring partner for architecture, brainstorming prompt design, and generating boilerplate faster.
20. **Differently:** I'd add WebSockets to push AI analysis results back to the client silently in the background instead of a manual "Analyze" refresh pattern.
