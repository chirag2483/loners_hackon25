# MovieAI - Smart Movie Recommendation System

A modern, responsive movie recommendation frontend application that provides personalized movie suggestions based on user context, health status, social situation, and environmental factors.

## 🎬 Features

### Core Functionality
- **Dynamic Movie Grid**: Responsive grid layout displaying movie recommendations with hover effects
- **Voice Search**: Speech-to-text functionality for hands-free movie searching
- **Real-time Dashboard**: Live time, weather, and location information
- **Context-Aware Recommendations**: Personalized suggestions based on user state
- **Binge of the Day Banner**: Featured movie/show with stunning gradient design

### User Context Controls
- **Health Status Toggle**: Choose between "Healthy" (😊) and "Not feeling well" (🤒)
- **Social Context Selector**: Specify if watching alone (👤), with partner (💕), or friends (👥)
- **Weather Integration**: Recommendations adapt to current weather conditions

### Technical Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Orange & Black Theme**: Eye-catching gradient design with modern aesthetics
- **Smooth Animations**: Micro-interactions and hover effects throughout
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Performance**: Lazy loading, optimized images, and efficient rendering
- **Real API Integration**: TMDB for movies, OpenWeatherMap for weather data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### API Keys Setup

1. **TMDB API Key** (for movie data):
   - Visit [TMDB API](https://www.themoviedb.org/settings/api)
   - Create an account and request an API key
   - Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

2. **OpenWeatherMap API Key** (for weather data):
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free API key
   - Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here
   ```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackon-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Component Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles and animations
├── components/
│   ├── MovieCard.tsx       # Individual movie display component
│   ├── VoiceSearch.tsx     # Voice input functionality
│   ├── ContextControls.tsx # Health and social context controls
│   ├── RealTimeDashboard.tsx # Time, weather, location display
│   └── BingeOfTheDay.tsx   # Featured movie banner
├── lib/
│   └── api.ts              # TMDB and weather API utilities
└── types/
    └── index.ts            # TypeScript type definitions
```

### Key Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Web Speech API** - Voice recognition
- **Geolocation API** - Location services
- **TMDB API** - Movie database
- **OpenWeatherMap API** - Weather data

## 🎯 Usage

### Voice Search
1. Click the microphone button to start voice recognition
2. Speak your movie search query clearly
3. The app will transcribe and search for matching movies
4. Click the red button to stop listening

### Context Controls
1. **Health Status**: Select how you're feeling to get mood-appropriate recommendations
2. **Social Context**: Choose your viewing situation for group-appropriate suggestions

### Movie Browsing
- Hover over movie cards to see synopsis and "Add to Watchlist" button
- Click "Add to Watchlist" to save movies (mock functionality)
- Use the search bar for text-based filtering
- View the "Binge of the Day" banner for featured content

## 🎨 Design System

### Color Palette
- **Primary**: `#ff6b35` (Orange)
- **Secondary**: `#1a1a1a` (Dark Gray)
- **Accent**: `#ff8c42` (Light Orange)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)
- **Background**: `#0a0a0a` (Black)
- **Card Background**: `#1a1a1a` (Dark Gray)

### Gradients
- **Orange Gradient**: `linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%)`
- **Banner Gradient**: Animated shimmer effect with orange tones
- **Dark Gradient**: Subtle dark theme gradients

### Typography
- **Sans**: Geist Sans (Primary font)
- **Mono**: Geist Mono (Code elements)

### Animations
- **Fade In**: Staggered entrance animations for movie cards
- **Pulse Glow**: Voice recording indicator
- **Hover Effects**: Scale and overlay transitions
- **Loading Skeletons**: Smooth loading states
- **Float Animation**: Gentle floating effect for featured content
- **Shimmer**: Animated gradient effects

## 🔧 Customization

### Adding New Movies
The app automatically fetches trending movies from TMDB. To customize:

1. Modify the `fetchTrendingMovies` function in `src/lib/api.ts`
2. Add genre filtering or other criteria
3. Update the `convertTMDBMovie` function for custom data mapping

### Styling Modifications
- Global styles: `src/app/globals.css`
- Component styles: Tailwind classes in component files
- Color variables: CSS custom properties in `:root`

### API Integration
The app uses real APIs:
- **TMDB**: For movie data and search functionality
- **OpenWeatherMap**: For real-time weather information
- **Geolocation**: For user location detection

## 🌐 Browser Support

- **Chrome/Edge**: Full support including voice recognition
- **Firefox**: Full support (voice recognition may vary)
- **Safari**: Limited voice recognition support
- **Mobile**: Responsive design with touch-friendly interactions

## 📱 Mobile Experience

- Responsive grid layout adapts to screen size
- Touch-optimized buttons and interactions
- Voice search works on mobile devices
- Geolocation services for location-based features
- Optimized banner display for mobile screens

## 🔒 Privacy & Permissions

The app requests the following permissions:
- **Microphone**: For voice search functionality
- **Location**: For weather and location-based recommendations

All data is processed locally and not stored or transmitted.

## 🚧 Future Enhancements

- [ ] User authentication and profiles
- [ ] Advanced recommendation algorithms
- [ ] Movie streaming integration
- [ ] Social features (sharing, reviews)
- [ ] Offline support with service workers
- [ ] Progressive Web App (PWA) features
- [ ] Custom recommendation engine
- [ ] Watchlist persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Tailwind CSS for the utility-first styling
- Web Speech API for voice recognition capabilities
- TMDB for comprehensive movie database
- OpenWeatherMap for weather data
- Unsplash for placeholder images

---

<div align="center">
  <p>Made with ❤️ by the HackOn Team</p>
  <p>
    <a href="https://github.com/your-username/hackon-frontend">View on GitHub</a> •
    <a href="https://your-project-demo.com">Live Demo</a> •
    <a href="mailto:your-email@example.com">Contact Us</a>
  </p>
</div>
