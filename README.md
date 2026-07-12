# AgriSmart AI

AgriSmart AI is an intelligent, highly localized platform built for modern farmers. It leverages artificial intelligence to provide hyper-localized crop recommendations, disease detection, market prices, government schemes, and a smart conversational farming assistant.

## Features

- **Global Multilingual Support**: Fully localized in English, Hindi, and Marathi (extensible to 10+ Indian languages) across the entire application interface.
- **Smart Farmer Guidance (AI Assistant)**: A context-aware chatbot powered by Google Gemini that factors in the farmer's current location, language, and primary crops to deliver highly relevant farming advice.
- **Crop Disease Detection**: Upload an image of a diseased crop and receive instant AI analysis, including symptoms and actionable treatment plans.
- **Smart Irrigation Dashboard**: A complete water-management dashboard displaying simulated real-time soil moisture with an interactive motor pump toggle.
- **AI Crop Recommendation**: Input NPK (Nitrogen, Phosphorous, Potassium), Soil pH, and Rainfall values to receive the highest-yielding crop recommendations.
- **Live Market Prices (Mandi Bhav)**: Stay updated with real-time crop prices across local markets.
- **Government Schemes**: Browse, bookmark, and apply for government subsidies and agricultural loans.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **AI Integration**: Google Gemini SDK (`@google/generative-ai`)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Visualization**: Recharts

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agrismart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory (you can use `.env.example` as a template):
   ```bash
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

This repository is pre-configured and fully compatible with Vercel deployment.

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section.
5. Add the following environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: `<your-api-key>`
6. Click **Deploy**. Vercel will automatically detect the Next.js framework, build the optimized static and serverless assets, and deploy the application globally.
