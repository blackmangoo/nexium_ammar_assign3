# 🍽️ AI Recipe Generator

&#x20;  &#x20;

A modern, full-stack AI-powered web application that generates **unique and personalized recipes** from a list of ingredients. Built with a sleek frontend, serverless backend, and an automated workflow engine, this project demonstrates a full development lifecycle from user experience to AI integration.

🔗 **Live Demo:** [https://YOUR\_VERCEL\_URL\_HERE](https://YOUR_VERCEL_URL_HERE)

&#x20;*Tip: Upload a high-quality screenshot to *[*imgur*](https://imgur.com)* and paste the URL above.*

---

## ✨ Features

- 🔐 **Passwordless Authentication** – Magic link login via Supabase Auth.
- 💎 **Elegant UI/UX** – Glassmorphism design with video backgrounds, smooth animations, and modern components using ShadCN/UI and Framer Motion.
- 🤖 **AI-Generated Recipes** – Connects to Google Gemini via n8n to craft creative, tailored recipes.
- 🔄 **Real-Time Feedback** – Instantly shows the generated recipe using Supabase Realtime.
- ⚙️ **Automated Backend** – Uses n8n for handling AI prompts, formatting responses, and updating the database.
- 🧩 **Modular Architecture** – Next.js for frontend/API, Supabase for database/auth, and n8n for workflow automation.

---

## 🛠 Tech Stack

| Layer              | Technologies                                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN/UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend**        | Next.js API Routes, [n8n.cloud](https://n8n.io/)                                                                                                               |
| **Database**       | [Supabase](https://supabase.com/) (PostgreSQL), MongoDB (optional logging)                                                                                     |
| **Authentication** | Supabase Auth (Magic Link)                                                                                                                                     |
| **AI**             | [Google Gemini](https://deepmind.google/technologies/gemini/)                                                                                                  |
| **Deployment**     | [Vercel](https://vercel.com/)                                                                                                                                  |

---

## ⚙️ How It Works

1. **Login** – Users sign in via a magic link sent to their email.
2. **Input** – Users enter a list of ingredients in the dashboard form.
3. **API Trigger** – Frontend sends a `POST` request to a Next.js API route.
4. **Workflow Start** – API route saves a `processing` state to Supabase and triggers an `n8n` webhook.
5. **AI Generation** – n8n sends the ingredients to Gemini AI, parses the response, and updates Supabase with the generated recipe.
6. **Real-Time Update** – Supabase Realtime notifies the frontend, which automatically displays the completed recipe.

---

## 📦 Getting Started (Local Setup)

```bash
# Clone the repo
git clone https://github.com/your-username/ai-recipe-generator.git
cd ai-recipe-generator

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Fill in the required keys:
# - NEXT_PUBLIC_SUPABASE_URL=
# - NEXT_PUBLIC_SUPABASE_ANON_KEY=
# - GEMINI_API_KEY=
# - N8N_WEBHOOK_URL=

# Run the app locally
npm run dev
```

---

## 🧪 Example Prompt to Gemini AI

```text
You are a professional chef AI. Generate a recipe using the following ingredients:
- Tomatoes
- Pasta
- Garlic

Respond in the following JSON format:
{
  "title": "Tomato Garlic Pasta",
  "ingredients": ["Tomatoes", "Pasta", "Garlic", ...],
  "instructions": "Step-by-step cooking instructions here..."
}
```

---

## 📸 Screenshots

> Replace this with screenshots of your dashboard, recipe generation flow, and final result.

---

## 📬 Contact

Want to contribute or have questions?\
Open an issue or connect with me on [LinkedIn](https://linkedin.com/in/your-profile).

---

> Made with ❤️ using Next.js, Supabase, n8n, and Gemini AI.

