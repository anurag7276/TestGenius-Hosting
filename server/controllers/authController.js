
// import passport from 'passport';

// export const githubLogin = passport.authenticate('github', { scope: ['repo', 'read:user'] });

// export const githubCallback = passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login` });

// export const redirectToClient = (req, res) => {
//   res.redirect(process.env.FRONTEND_URL);
// };

// export const getUser = (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({
//       user: req.user.profile,
//       isAuthenticated: true
//     });
//   } else {
//     res.json({
//       user: null,
//       isAuthenticated: false
//     });
//   }
// };



// // New function to handle user logout
// export const logout = (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error('Logout error:', err);
//       return res.status(500).json({ success: false, message: 'Failed to log out.' });
//     }
//     // After logging out, destroy the session
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Session destroy error:', err);
//             return res.status(500).json({ success: false, message: 'Failed to destroy session.' });
//         }
//         res.json({ success: true, message: 'Logged out successfully.' });
//     });
//   });
// };





// TestGenius/server/controllers/authController.js
import passport from 'passport';

export const githubLogin = passport.authenticate('github', { scope: ['repo', 'read:user'] });

export const githubCallback = passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login` });

export const redirectToClient = (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
};

export const getUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: req.user.profile,
      isAuthenticated: true
    });
  } else {
    res.json({
      user: null,
      isAuthenticated: false
    });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      // Even on failure, we proceed to destroy the session
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ success: false, message: 'Failed to destroy session.' });
      }
      // Send a success message back to the client
      res.json({ success: true, message: 'Logged out successfully.' });
    });
  });
};
