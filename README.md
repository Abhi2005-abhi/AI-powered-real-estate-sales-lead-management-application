# AI LeadPilot

A modern, AI-powered real-estate sales lead management application designed to help real estate professionals efficiently capture, analyze, and engage with prospective buyers.

## 1. Problem Statement

Real estate sales teams deal with a massive, continuous influx of leads across various channels. Identifying which leads are serious buyers, following up promptly, and tailoring communication to specific client needs—such as budget, location preference, and timeline—can be overwhelming. The delay or lack of personalized outreach often results in lost opportunities, while salespeople waste valuable time trying to qualify low-intent prospects.

## 2. Solution

AI LeadPilot addresses this friction by providing an intelligent layer over the lead management process. It helps agents:
* **Capture leads:** Centralized intake of prospect data and inquiries.
* **Analyze leads:** Automatically extracts key criteria such as budget, location, timeline, and readiness.
* **Prioritize leads:** Assigns actionable ratings and scores based on AI-driven criteria.
* **Answer lead-specific questions:** Provides conversational AI assistance to the agent, grounded strictly in a specific lead's data.
* **Prepare follow-ups:** Drafts outbound communication, saving time and ensuring professional, personalized messaging.

## 3. Features

* **Lead intake:** Form-based ingestion of new prospective clients.
* **AI analysis:** Automated extraction of core buying signals.
* **Lead scoring:** Quantitative evaluation of lead quality.
* **Hot/Warm/Cold prioritization:** Instant visual categorization for the sales pipeline.
* **Lead-specific AI chat:** Context-aware assistant to quickly query details about a prospect.
* **AI Follow-up Assistant:** One-click drafting of engagement messages.
* **Suggested customer response:** AI-generated replies to inbound questions.
* **Dashboard:** Centralized UI to view and manage the prioritized pipeline.

## 4. Architecture

The application is structured as a decoupled full-stack architecture:

React Frontend
↓
Express REST API
↓
Lead Service
↓
Gemini Service
↓
Gemini API

**Data Storage:** To reduce MVP complexity, lead data is stored using a simple storage approach (in-memory/simple files) on the backend layer.

## 5. AI Integration

* **Model/API:** Google Gemini API is utilized for all natural language generation, comprehension, and structured data extraction.
* **Backend Integration:** The Express backend acts as the secure intermediary, utilizing Google AI SDKs or REST calls to communicate with Gemini.
* **Security:** The Gemini API key remains strictly server-side. This ensures the key is never exposed to the client browser and allows the backend to govern usage.
* **Prompt Structure:** System instructions enforce a strict real estate context. The backend dynamically injects the lead’s raw information directly into the prompt before transmission.
* **Expected JSON Response:** For analytical tasks (scoring and analysis), the backend forces Gemini to return specific JSON schemas. 
* **Validation:** The AI's JSON output is parsed and validated server-side to guarantee fields (like score and priority) exist before the data is saved or returned to the UI.

## 6. Lead Analysis Flow

1. **Lead submitted** via the frontend interface.
2. Lead is **saved** to the backend storage.
3. An **AI analysis requested** event is triggered.
4. The **backend retrieves the lead** details.
5. A **prompt is constructed**, incorporating the lead's specific data.
6. The **Gemini API is called** to perform an evaluation.
7. Output **JSON is parsed** and validated.
8. The structured **analysis is saved** alongside the lead.
9. The **UI is updated** to reflect the new scores and insights.

## 7. Conversational AI

The application features an agent-facing chat interface that remains strictly grounded in the selected lead. This is achieved by systematically injecting the active lead's profile, history, and analysis into the hidden system prompt of the conversational chain. The LLM is explicitly isolated from generalizing; it focuses purely on exploring and extracting information based exclusively on that specific client profile.

## 8. Prioritization

* **Lead Score:** A numeric value reflecting the lead's estimated conversion quality.
* **Categories:** 
  * **HOT:** Ready to buy, pre-approved, immediate timeline.
  * **WARM:** Browsing, flexible timeline, missing some core criteria.
  * **COLD:** Low budget, far-out timeline, or non-responsive.
* **Urgency:** The system identifies timeline constraints to prioritize immediate outreach tasks.
* **Signals Used:** Budget alignment accuracy, purchase intent signals, timing, and available information completeness.

> **Note:** The AI scoring is designed strictly as an assistance signal to help prioritize human effort, and is not a guaranteed prediction of conversion.

## 9. Unique Feature: AI Follow-up Assistant

* **Problem:** Crafting personalized, professional follow-up messages takes immense time and mental effort for sales agents attempting to reach dozens of leads daily.
* **Reasoning:** Since the backend AI already possesses the lead's context, sentiment, and analysis, it is perfectly positioned to generate a highly tailored message instantly.
* **How it works:** With a single click on the dashboard, the backend prompts Gemini with the lead's specific profile and analysis, instructing it to draft a personalized email or message.
* **Why it helps:** It dramatically accelerates the sales cycle, ensures consistent follow-up quality, and saves salespeople hours of repetitive typing.

## 10. Technical Decisions

* **React:** Selected for building a high-performance, component-driven, and dynamic user interface.
* **Express:** Chosen as a lightweight, flexible backend capable of serving APIs and efficiently orchestrating AI requests.
* **Gemini:** Leveraged for state-of-the-art LLM capabilities, excelling in structured JSON generation and fast response inference.
* **REST APIs:** Utilized for standardized, stateless, and predictable communication between the client and server.
* **Simple Storage Approach:** Implemented to minimize infrastructure complexity, allowing total development focus on refining the AI integration logic during the initial phase.
* **Server-side AI Calls:** Ensures API keys remain secure, keeps complex and proprietary prompt structures hidden from the client, and seamlessly enforces business logic.

## 11. Local Setup

Run the following commands in separate terminal windows from the project root:

**Terminal 1: Backend**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 12. Environment Variables

Below is the required `.env.example` file configuration for the `backend/` directory:

```env
# backend/.env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## 13. Deployment

* **Frontend:** Standard React deployment. Build the application using `npm run build` and deploy the output directory (e.g., Vercel, Netlify, or Azure Static Web Apps).
* **Backend:** Deploy the Node.js Express server to a web hosting provider (e.g., Render, Railway, or Heroku). Ensure that the Node environment is correctly set up and securely inject the `GEMINI_API_KEY` into the provider's environment/secrets configuration.

## 14. Known Limitations

* **AI Reliability:** AI models can sometimes hallucinate or make mistakes during analysis/extraction.
* **Scoring Constraints:** The lead score is deterministic based on prompt behavior and is not guaranteed.
* **Data Persistence:** Uses simple storage—data is prone to loss upon server restart or redeployment unless manually backed up.
* **Security:** Open access; currently lacks authentication mechanisms.
* **Platform Integrations:** No direct CRM synchronization (e.g., Salesforce, Hubspot) currently available.
* **Scheduling:** No calendar integration for actively booking exact meeting times.

## 15. Future Improvements

* CRM integration for seamless pipeline sync
* WhatsApp/SMS APIs for direct outbound capability
* Persistent relational database integration (PostgreSQL)
* Secure authentication and Role-Based Access Control (RBAC)
* Deep analytics on conversion rates and tracking
* Salesperson performance and activity tracking

## 16. AI Usage Disclosure

AI tools were deliberately and transparently used to accelerate development and design in this project:

* **ChatGPT** — Architecture discussion, debugging, and prompt design
* **Antigravity** — Implementation assistance
* **Gemini API** — Application AI functionality
