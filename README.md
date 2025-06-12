# Neptune Service Search

A modern web application for searching and comparing pet grooming services, built with Next.js, React, and TailwindCSS. This project demonstrates best practices in full-stack development, API integration, and clean UI/UX design. It is designed for interview demonstration purposes.

## Features
- **Service Search:** Search for pet grooming services and get consolidated results from multiple sources.
- **LLM-Powered Synthesis:** Uses OpenRouter API (LLM) to merge, deduplicate, and score services based on provided data.
- **Neptune Score:** Each service is ranked using a custom formula:  
  `(rating / 5) * 70 + (numberOfReviews / 200) * 30` (max 100, rounded to nearest integer).
- **Responsive UI:** Clean, mobile-friendly interface built with TailwindCSS.
- **Error Handling:** User-friendly error and loading states.

## Tech Stack
- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TailwindCSS 4](https://tailwindcss.com/)
- [OpenRouter API](https://openrouter.ai/) (for LLM synthesis)
- [Axios](https://axios-http.com/) (for API requests)

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd submissions_task
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your OpenRouter API credentials:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_preferred_model # e.g. openrouter/auto
```

### 4. Run the Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Enter a search query (e.g., "dog grooming") in the search bar.
- The app will fetch and display synthesized results, including name, rating, price, booking info, and Neptune Score for each service.

## Project Structure
- `src/app/page.js` — Main frontend page (React + TailwindCSS)
- `src/app/api/search/route.js` — API route for LLM-powered search
- `src/lib/mockData.js` — Mock data sources for demonstration
- `src/app/globals.css` — TailwindCSS and global styles

## Best Practices
- **Separation of Concerns:** API logic, UI, and data are modularized.
- **Environment Variables:** Sensitive keys are not hardcoded.
- **Responsive & Accessible:** UI is mobile-friendly and accessible.
- **Error Handling:** All API and UI errors are gracefully managed.
- **Modern Tooling:** Uses latest Next.js, React, and TailwindCSS features.

## Customization
- To use real data, replace the mock data in `src/lib/mockData.js` with your own sources or connect to a database.
- Adjust the Neptune Score formula in the API route as needed.

## License
This project is for demonstration and interview purposes only.
