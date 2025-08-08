






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















// index.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

// Import all modularized components
import { createSessionConfig } from './config/sessionConfig.js';
import authRoutes from './routes/authRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- Configure Passport and GitHub Strategy ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // The callbackURL must be the production URL for Render
    callbackURL: "https://testgenius-hosting.onrender.com/api/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Create session configuration, checking for the required secret
if (!process.env.SESSION_SECRET) {
  console.error("FATAL ERROR: SESSION_SECRET is not defined. Please set it in your environment variables.");
  process.exit(1);
}
const sessionConfig = createSessionConfig();

// --- CORS Middleware Configuration ---
// This robust regex handles Render's URL, all Vercel dynamic subdomains,
// and localhost for local development.
const allowedOriginsRegex = /^(https:\/\/testgenius-hosting\.onrender\.com|https:\/\/.*\.vercel\.app|http:\/\/localhost:3000)$/;

const corsOptions = {
  origin: (origin, callback) => {
    // If the origin is allowed by our regex, permit the request.
    if (!origin || allowedOriginsRegex.test(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// --- Other Middlewares ---
app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// --- API Routes ---

// All other modular routes are added here.
app.use('/api', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

// --- Serve React Frontend in Production ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

app.get("/" ,async(req,res)=>{
  res.send("Welcome to TestGenius 🚀😊")
})

// --- Start the Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
