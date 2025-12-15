# pNode Analytics Dashboard

A modern, responsive analytics dashboard for monitoring and managing pNode (peer node) performance, status, and metrics. Built with React, TypeScript, and Chakra UI v3.

## Overview

The pNode Analytics Dashboard provides real-time monitoring and analytics for peer nodes in a distributed network. It displays key metrics including node status, uptime, performance, reputation, storage usage, and slot production statistics. The dashboard features a clean, intuitive interface with dark/light mode support, advanced filtering, sorting, and search capabilities.

## Features

- **Real-time Monitoring**: Auto-refreshing dashboard with 60-second countdown
- **Visual Analytics**: Interactive charts for Network Status, Network Averages, and Refresh Timer
- **Comprehensive Metrics**: Track status, uptime, performance, reputation, storage, and slot production
- **Filtering**: Toggle between Active and Inactive nodes
- **Search Functionality**: Search nodes by identity or peer ID
- **Sortable Table**: Sort by key columns (status, uptime, performance, reputation)
- **Detailed View**: Click on any node to view comprehensive details in a modal
- **Dark Mode UI**: Professional dark-themed interface
- **Responsive Design**: Optimized for desktop and tablet viewing
- **Performance Optimized**: Smoother loading states with skeleton screens

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chakra UI v3** - Component library and theming
- **Recharts** - Data visualization and charting
- **Fontsource** - Self-hosted Inter font
- **React Icons** - Icon library

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/              # UI primitives
│   ├── Header.tsx       # Minimal dashboard header
│   ├── AnalyticsCharts.tsx # Visual charts (Pie, Radial, Gauge)
│   ├── SearchBar.tsx    # Search input component
│   ├── FilterTabs.tsx   # Status filter buttons
│   ├── PNodeTable.tsx   # Main data table
│   ├── PNodeModal.tsx   # Detailed node view modal
│   ├── Pagination.tsx   # Pagination controls
│   └── SkeletonLoader.tsx # Loading skeleton
├── data/              # Static data files
│   └── mockPNodes.json # Sample pNode data
├── services/          # API/service layer
│   └── pNodeService.ts # Data fetching service
├── store/             # State management
│   └── pNodeStore.ts  # Global state store
├── theme/             # Chakra UI theme configuration
│   └── index.ts       # Custom theme definitions (Dark mode enforced)
├── types/             # TypeScript type definitions
│   └── index.ts       # PNode interfaces and types
├── utils/             # Utility functions
│   ├── badges.ts      # Badge color logic
│   ├── filters.ts     # Filtering and sorting utilities
│   └── format.ts      # Data formatting utilities
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
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

- The dashboard displays pNodes in a sortable table
- Click on any row to view detailed information in a modal
- Use the search bar to filter nodes by identity or peer ID
- Use the filter tabs to toggle between **Active** and **Inactive** views

### Sorting

- Click on column headers (Status, Uptime, etc.) to sort by that column
- Click again to reverse the sort order
- _Note: Identity sorting is disabled by default_

### Filtering

- **Active**: Shows only active nodes (Default)
- **Inactive**: Shows only inactive nodes

### Copying Peer ID

- In the detailed modal view, click the copy icon next to the Peer ID or Public Key
- A toast notification will confirm the copy action

### Auto-refresh

- The dashboard automatically refreshes every 60 seconds
- A **Visual Gauge Chart** displays the countdown to the next refresh
- You can manually trigger a refresh using the refresh button on the gauge chart card

## Data

Currently, the application uses mock data from `src/data/mockPNodes.json`. To connect to a real API:

1. Update `src/services/pNodeService.ts` to fetch from your API endpoint
2. Modify the `mockFetchPNodes` function or create a new `fetchPNodes` function
3. Update the data mapping if your API response structure differs

## Customization

### Theme

Customize the theme by editing `src/theme/index.ts`. The dashboard is configured to enforce a Dark Mode aesthetic.

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
