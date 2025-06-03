# EasyBite - Food Discovery & Delivery App

EasyBite is a modern food discovery and delivery application that helps users find and order meals from local restaurants. The app features an intuitive interface with multiple ways to discover food, including a food matcher game, cuisine adventure map, and trend bites section.

## Features

- **Food Matcher Game**: Swipe through food options to get personalized meal recommendations
- **Cuisine Adventure Map**: Explore global cuisines and discover authentic dishes near you
- **Trend Bites**: Stay updated with the latest food trends and popular dishes in your area
- **Quiz Flow**: Answer a few questions to get personalized meal recommendations
- **Unified Meal Display**: Consistent and visually appealing meal cards across all sections
- **Shopping Cart**: Add multiple items to your cart and check out seamlessly

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database & Authentication)
- **Deployment**: Vercel/Netlify (Frontend), Supabase (Backend)
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API

## How It Works

1. **User Experience**:
   - Browse meals through different discovery methods (Game, Map, Trends, Quiz)
   - View detailed meal information including price, delivery time, and restaurant
   - Add items to cart and complete the checkout process

2. **Key Components**:
   - `MealCard`: Reusable component for displaying meal information consistently
   - `FoodMatcher`: Interactive game for discovering meals
   - `CuisineAdventureMap`: Visual map interface for exploring cuisines
   - `TrendBites`: Showcases trending dishes
   - `QuizFlow`: Interactive quiz for personalized recommendations

3. **Data Flow**:
   - Meal data is stored in Supabase
   - Client-side filtering and sorting for optimal performance
   - Real-time updates for availability and pricing

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later) or yarn
- Supabase account (for backend services)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd easybite-fun-finds
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Project Structure

```
src/
├── components/        # Reusable UI components
├── lib/               # Utility functions and hooks
├── pages/             # Page components
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/easybite-fun-finds](https://github.com/yourusername/easybite-fun-finds)

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/91b8a96a-d04b-4a1b-8ac7-d31654874133) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
