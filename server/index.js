// index.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import modularized components
import configurePassport from './middleware/passportConfig.js';
import { createSessionConfig } from './config/sessionConfig.js';
import authRoutes from './routes/authRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Call the new configurePassport function to set up Passport
const passport = configurePassport();

// Call the new createSessionConfig function to get the config object
const sessionConfig = createSessionConfig();

// --- CORS Middleware Configuration ---
if (process.env.NODE_ENV === 'production') {
  // In production, we explicitly allow our Vercel and Render URLs.
  // We're now using a regular expression for a more robust match.
  // This will handle variations like trailing slashes automatically.
  const allowedOriginsRegex = /^(https:\/\/test-genius-hosting\.vercel\.app|https:\/\/testgenius-hosting\.onrender\.com)/;

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like a cURL request or a same-origin request).
      // Check if the origin matches our regular expression.
      if (!origin || allowedOriginsRegex.test(origin)) {
        callback(null, true);
      } else {
        // Log the exact origin that was blocked for easier debugging.
        console.error(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
} else {
  // In development, we allow all origins for easy testing.
  // This is safe for local development, but not for production.
  app.use(cors({
    origin: '*',
    credentials: true,
  }));
}

// --- Other Middlewares ---
app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// --- API Routes ---
// It is CRITICAL that all API routes are defined BEFORE the static file serving.
// This ensures that requests to `/api/*` are handled by your server, not by the React app.
app.use('/api', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

// --- Serve React Frontend in Production ---
// This block must be placed AFTER all API routes.
// It serves the static files and handles client-side routing.
if (process.env.NODE_ENV === 'production') {
  // This middleware tells Express to serve static files from the 'dist' folder.
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // This catch-all route is for client-side routing. It sends the `index.html` file
  // for any request that doesn't match an API route or a static file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// --- Start the Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});








// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import session from 'express-session';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Import modularized components
// import configurePassport from './middleware/passportConfig.js';
// import { createSessionConfig } from './config/sessionConfig.js';
// import authRoutes from './routes/authRoutes.js';
// import githubRoutes from './routes/githubRoutes.js';
// import aiRoutes from './routes/aiRoutes.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Call the new configurePassport function to set up Passport
// const passport = configurePassport();

// // Call the new createSessionConfig function to get the config object
// const sessionConfig = createSessionConfig();

// // --- Middlewares ---
// const allowedOrigins = [
//   'https://test-genius-hosting.vercel.app/', // Your frontend on Vercel
//   'http://localhost:3000' // Optional: for local development
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // If the origin of the request is in our allowed list, permit it.
//     // Also, allow requests with no origin, like mobile apps or tools like Postman.
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       // Otherwise, reject the request.
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // Allow cookies and authentication headers
// };

// // Use the configured CORS middleware globally.
// app.use(cors(corsOptions));





// app.use(express.json());
// app.use(session(sessionConfig));
// app.use(passport.initialize());
// app.use(passport.session());

// // --- API Routes ---
// app.use('/api', authRoutes);
// app.use('/api/github', githubRoutes);
// app.use('/api/ai', aiRoutes);

// // // --- Serve React Frontend in Production ---
// // if (process.env.NODE_ENV === 'production') {
// //   app.use(express.static(path.join(__dirname, '../client/build')));
// //   app.get('*', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// //   });
// // }


// app.get("/" ,async(req,res)=>{
//   res.send("Welcome to TestGenius 🚀😊")
// })
// // --- Start the Server ---
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


