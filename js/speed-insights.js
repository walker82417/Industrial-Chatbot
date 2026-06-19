/**
 * Vercel Speed Insights initialization
 * This script injects Vercel Speed Insights to track web vitals and performance metrics
 */

// Import and initialize Speed Insights using the inject function
import { injectSpeedInsights } from 'https://cdn.jsdelivr.net/npm/@vercel/speed-insights@latest/dist/index.mjs';

// Initialize Speed Insights
// Configuration can be customized here if needed
injectSpeedInsights({
  // Optional: debug mode (automatically enabled in development)
  // debug: false,
  
  // Optional: sample rate (1.0 = 100% of events)
  // sampleRate: 1.0,
  
  // Optional: beforeSend callback to filter/modify events
  // beforeSend: (event) => event,
});
