// Loading environment var from .env
require('dotenv').config();

// Import Express app
const app = require('./app');

// Get port from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
