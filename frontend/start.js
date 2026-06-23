const path = require('path');

// Ensure we are in production mode
process.env.NODE_ENV = 'production';

// Strict port binding for Zoho AppSail
process.env.PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || '3000';
process.env.HOSTNAME = '0.0.0.0';

console.log(`[AppSail] Booting Next.js standalone on port ${process.env.PORT}`);

// Start the standalone Next.js server
require(path.join(__dirname, '.next', 'standalone', 'server.js'));
