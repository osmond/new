# Smart Plant Dashboard

This is a React Native project scaffold for the Smart Plant Dashboard widget.

## Setup

1. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```
2. Start the Metro bundler:
   ```
   npm start
   ```
3. Run on simulator:
   ```
   npm run ios
   # or
   npm run android
   ```

## Project Structure

```
smart-plant-dashboard/
├── package.json
├── babel.config.js
├── index.js
├── App.js
├── README.md
└── src/
    ├── components/
    │   ├── EmptyState.jsx
    │   ├── EnhancedEmptyState.jsx
    │   ├── IntelligentPlantCard.jsx
    │   ├── PlantCard.jsx
    │   ├── QuickStats.jsx
    │   ├── SmartCareOverview.jsx
    │   ├── SmartInsights.jsx
    │   ├── TodaysCareTasks.jsx
    │   └── component.jsx
    ├── styles.js
    └── widget.jsx
```

## Running Tests

Run Jest tests with:

```bash
npm test
```
