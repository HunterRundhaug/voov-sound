const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3000;

// Session middleware setup
app.use(session({
  secret: 'your-secret-key',             // 🔐 Change this to something secure
  resave: false,                         // Don't save session if unmodified
  saveUninitialized: false,             // Don't create session until something is stored
  cookie: {
    maxAge: 1000 * 60 * 60,             // 1 hour (optional)
    sameSite: true                      // Helps with security
    // secure: true, // Uncomment if using HTTPS
  }
}));

app.use(express.static('public_html'));
const clientRoute = require('./Routes/client');
const adminRoute = require('./Routes/admin');
app.use("/", clientRoute);
app.use("/secret", adminRoute);


// Start server
app.listen(PORT, '0.0.0.0', () => {
});
