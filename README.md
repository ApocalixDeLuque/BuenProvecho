# 🍽️ BuenProvecho

Welcome to BuenProvecho, a FullStack web application developed for the sustainability track at HackAI DMF 2024. Our project leverages cutting-edge AI technology from OpenAI's GPT-4 vision to promote sustainability and reduce food waste by helping you manage your pantry more efficiently.

## 🚀 Project Overview

BuenProvecho is designed to make your kitchen smarter. By scanning the food items you purchase or those you already have at home, our app uses GPT-4 vision to identify the exact list of ingredients, their quantities, classifications (fruits, vegetables, beverages, etc.), and estimated expiration dates. All this information is stored in a local database, where you can easily view and manage your food inventory.

### 🌟 Features

- **🔍 Food Scanner**: Scan your food items using a camera and get detailed insights about ingredients and their expiration dates.
- **👨‍🍳 Chefsito - Your AI Kitchen Assistant**: Based on the items you have, Chefsito provides personalized cooking recipes, prioritizing ingredients that are about to expire to help you reduce food waste.
- **📊 Local Database**: All scanned items are saved in a local database, allowing you to track and manage your pantry inventory effectively.
- **💻 Responsive Design**: Built with React, Next.js 14, and Tailwind CSS for a seamless and responsive user experience.

## 🛠️ Technology Stack

- **Frontend**: React, Tailwind CSS, Next.js 14 (using App Router)
- **Backend**: Local JSON storage, Global State Context for state management
- **AI and Image Recognition**: OpenAI GPT-4 Vision for ingredient identification and Chefsito's recipe suggestions

## 📦 Installation

Before installation, ensure you create a `.env` file in the project root and add the following variables:

```plaintext
OPENAI_API_KEY=your_openai_api_key_here
PROMPT="En la siguiente imágen, identifica los ingredientes y alimentos que existan y proporciona información detallada sobre cada..."
CHEFSITO_PROMPT="Eres BuenProvecho, un asistente de IA que está especializado en recetas de cocina..."
```

Keep `OPENAI_API_KEY` server-side. Never prefix it with `NEXT_PUBLIC_` or commit the `.env` file.

> [!IMPORTANT]
> To test the BuenProvecho app effectively, you'll need access to the original prompts that drive the system. If you wish to obtain these prompts for testing purposes, please reach out via the following methods:
>
> - **LinkedIn**: Send a message request via [LinkedIn](linkedin.com/in/apocalix)
> - **Email**: Contact me at [contact@apocalix.dev](mailto:contact@apocalix.dev) with the subject line "BuenProvecho Prompts Request"


Then, ensure you have Bun installed on your machine. Run the following commands:

```bash
bun install

bun run dev
```

## 🔧 Usage
After launching the app, give the site permission to use your camera and simply take an image of your food items through the web interface. The system will analyze the image, identify the ingredients, and provide you with a detailed breakdown, including their estimated expiration dates. The app keeps track of all recorded items during the session.

## 👨‍🍳 Chefsito - Your AI Chef
Chefsito, our AI-powered assistant, helps you discover recipes based on the ingredients you have. It suggests recipes that utilize ingredients nearing their expiration, ensuring you get the most out of your groceries while minimizing waste.
