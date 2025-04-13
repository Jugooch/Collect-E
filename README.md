# Card Binder App

A React Native application for managing trading card collections, built with Expo.

## Architecture Overview

The application follows a modular architecture with clear separation of concerns:

### Core Components

- **Types**: Shared type definitions (`/types`)
- **Services**: API and business logic (`/services`)
- **Hooks**: Reusable React hooks (`/hooks`)
- **Components**: Reusable UI components (`/components`)

### Features

- Card collection management
- Card search and organization
- Binder-style card display
- Edit mode for organizing cards
- Card detail view with animations

### Key Technologies

- React Native
- Expo Router
- React Native Reanimated
- React Native Gesture Handler

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── app/                 # Application routes
│   ├── (tabs)/         # Tab-based navigation
│   └── _layout.tsx     # Root layout configuration
├── components/         # Reusable components
├── hooks/             # Custom React hooks
├── services/          # API and business logic
├── types/             # TypeScript type definitions
└── README.md         # Project documentation
```

## Contributing

1. Follow the established architecture
2. Document new components and functions
3. Maintain type safety
4. Test across web and native platforms