# pNode Analytics Dashboard

A modern, responsive analytics dashboard for monitoring and managing pNode (peer node) performance, status, and metrics. Built with React, TypeScript, and Chakra UI v3.

## Overview

The pNode Analytics Dashboard provides real-time monitoring and analytics for peer nodes in a distributed network. It displays key metrics including node status, uptime, performance, reputation, storage usage, and slot production statistics. The dashboard features a clean, intuitive interface with dark/light mode support, advanced filtering, sorting, and search capabilities.

## Features

- **Real-time Monitoring**: Auto-refreshing dashboard with 60-second countdown timer
- **Comprehensive Metrics**: Track status, uptime, performance, reputation, storage, and slot production
- **Advanced Filtering**: Filter nodes by status (All, Active, Syncing, Inactive)
- **Search Functionality**: Search nodes by identity or peer ID
- **Sortable Table**: Sort by any column (identity, status, uptime, performance, reputation, etc.)
- **Detailed View**: Click on any node to view comprehensive details in a modal
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Optimized for desktop and tablet viewing
- **Color-coded Badges**: Visual indicators for status, uptime, performance, and reputation
- **Gradient Progress Bars**: Visual representation of performance and uptime metrics
- **Pagination**: Navigate through large datasets efficiently
- **Toast Notifications**: User feedback for actions like copying peer IDs

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chakra UI v3** - Component library and theming
- **Fontsource** - Self-hosted Inter font
- **next-themes** - Theme management
- **React Icons** - Icon library

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # UI primitives (provider, color-mode, toaster)
│   ├── Header.tsx     # Dashboard header with title and theme toggle
│   ├── StatsCards.tsx # Statistics overview cards
│   ├── SearchBar.tsx  # Search input component
│   ├── FilterTabs.tsx # Status filter buttons
│   ├── PNodeTable.tsx # Main data table
│   ├── PNodeModal.tsx # Detailed node view modal
│   ├── Pagination.tsx # Pagination controls
│   └── SkeletonLoader.tsx # Loading skeleton
├── data/              # Static data files
│   └── mockPNodes.json # Sample pNode data
├── services/          # API/service layer
│   └── pNodeService.ts # Data fetching service
├── store/             # State management
│   └── pNodeStore.ts  # Global state store
├── theme/             # Chakra UI theme configuration
│   └── index.ts       # Custom theme definitions
├── types/             # TypeScript type definitions
│   └── index.ts       # PNode interfaces and types
├── utils/             # Utility functions
│   ├── badges.ts      # Badge color logic
│   ├── filters.ts     # Filtering and sorting utilities
│   └── format.ts      # Data formatting utilities
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles (minimal, mostly theme-based)
```

## Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, or **pnpm** package manager

## Installation

1. **Clone the repository** (or navigate to the project directory):

   ```bash
   cd "pNode Analytics dashboard"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
   or
   ```bash
   pnpm install
   ```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

or

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` (or the next available port).

The dev server includes:

- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- TypeScript type checking

### Build for Production

Create an optimized production build:

```bash
npm run build
```

or

```bash
yarn build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

or

```bash
yarn preview
```

## Usage

### Viewing Nodes

- The dashboard displays all pNodes in a sortable table
- Click on any row to view detailed information in a modal
- Use the search bar to filter nodes by identity or peer ID
- Use the filter tabs to show only nodes with specific statuses

### Sorting

- Click on any column header to sort by that column
- Click again to reverse the sort order
- The current sort column and direction are indicated by arrows

### Filtering

- **All**: Shows all nodes regardless of status
- **Active**: Shows only active nodes
- **Syncing**: Shows only syncing nodes
- **Inactive**: Shows only inactive nodes

### Dark/Light Mode

- Click the theme toggle button in the header to switch between dark and light modes
- Your preference is automatically saved

### Copying Peer ID

- In the detailed modal view, click the copy icon next to the Peer ID
- A toast notification will confirm the copy action

### Auto-refresh

- The dashboard automatically refreshes every 60 seconds
- A countdown timer and progress bar show when the next refresh will occur
- The timer counts down from 59 seconds to 0, then refreshes and resets

## Data

Currently, the application uses mock data from `src/data/mockPNodes.json`. To connect to a real API:

1. Update `src/services/pNodeService.ts` to fetch from your API endpoint
2. Modify the `mockFetchPNodes` function or create a new `fetchPNodes` function
3. Update the data mapping if your API response structure differs

## Customization

### Theme

Customize the theme by editing `src/theme/index.ts`:

- Colors and semantic tokens
- Typography (fonts, sizes, weights)
- Spacing and radii
- Shadows

### Badge Colors

Modify badge color logic in `src/utils/badges.ts`:

- Status badge colors
- Uptime thresholds and colors
- Performance thresholds and colors
- Reputation thresholds and colors

## TypeScript

The project uses strict TypeScript configuration. All components, utilities, and data structures are fully typed. Type definitions are in `src/types/index.ts`.

## Linting

Run the linter:

```bash
npm run lint
```

or

```bash
yarn lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Contributing

This is a private project. For questions or issues, please contact the project maintainer.
