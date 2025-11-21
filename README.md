# PerformancePredictor

## Project Overview

**PerformancePredictor** is a student performance prediction system that leverages machine learning to predict student outcomes and identify at-risk students early. Built with React, TypeScript, and Vite, it provides educators with actionable insights to support student success.

## Features

- **Single Student Prediction** - Input individual student data for instant prediction with detailed insights
- **Bulk CSV Upload** - Process entire cohorts at once with batch predictions and downloadable results
- **Analytics Dashboard** - Visualize cohort insights with interactive charts and performance metrics
- **Risk Assessment** - Identify at-risk students and receive targeted intervention recommendations

## Technology Stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js & npm installed

### Installation

`sh
# Step 1: Navigate to the project directory.
cd edu-insight-ai

# Step 2: Install the necessary dependencies.
npm install

# Step 3: Start the development server with auto-reloading and an instant preview.
npm run dev
`

The development server will start on http://localhost:8080

## Available Scripts

- 
pm run dev - Start development server
- 
pm run build - Build for production
- 
pm run build:dev - Build for development with source maps
- 
pm run lint - Run ESLint
- 
pm run preview - Preview production build

## Project Structure

`
src/
 pages/              # Main page components
 components/         # Reusable React components
 lib/                # Utility functions and prediction logic
 integrations/       # External service integrations (Supabase)
 hooks/              # Custom React hooks
`

## Deployment

Build and deploy to your preferred hosting platform:

`sh
npm run build
`

The build output will be in the dist directory.

## Contributing

Feel free to fork, modify, and improve this project for your use case.

## License

This project is open source and available under the MIT License.
