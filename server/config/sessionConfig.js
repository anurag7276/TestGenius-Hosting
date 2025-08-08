
// // export const sessionConfig = {
// //   secret: process.env.SESSION_SECRET,
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: {
// //     secure: process.env.NODE_ENV === 'production',
// //     httpOnly: true,
// //     maxAge: 24 * 60 * 60 * 1000
// //   }
// // };



// // TestGenius/server/config/sessionConfig.js

// // We export a function that returns the config object.
// // This ensures that process.env.SESSION_SECRET is read
// // only when the function is explicitly called.
// export function createSessionConfig() {
//   return {
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === 'production',
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 24 // 24 hours
//     }
//   };
// }






// TestGenius/server/config/sessionConfig.js

import session from 'express-session';
import MongoStore from 'connect-mongo';

// This function creates the session configuration for production and development
export function createSessionConfigWithMongo() {
  if (!process.env.SESSION_SECRET) {
    console.error("FATAL ERROR: SESSION_SECRET is not defined. Please set it in your environment variables.");
    // This will stop the server from running if the secret is missing.
    process.exit(1); 
  }

  // Use a persistent store for sessions. MemoryStore is not for production.
  // We'll use MongoDB to store sessions.
  const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Connection string to your MongoDB database
    collectionName: 'sessions',      // The name of the collection to store sessions
    ttl: 24 * 60 * 60,               // Session expiration in seconds (24 hours)
    autoRemove: 'interval',
    autoRemoveInterval: 10,          // Removes expired sessions every 10 minutes
  });

  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration in milliseconds (24 hours)
    },
    store: sessionStore,
  };
}
