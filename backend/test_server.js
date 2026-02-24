try {
    console.log('1. Loading dotenv...');
    require('dotenv').config();
    console.log('2. Loading express...');
    const express = require('express');
    console.log('3. Loading other deps...');
    const cors = require('cors');
    const helmet = require('helmet');

    console.log('4. Loading routes...');
    // This is where it likely fails
    const adminRoutes = require('./src/routes/admin');
    const authRoutes = require('./src/routes/auth');

    console.log('5. Creating app...');
    const app = express();
    app.use('/api/admin', adminRoutes);
    app.use('/api/auth', authRoutes);

    console.log('6. Starting server...');
    app.listen(5001, () => {
        console.log('7. Success on 5001!');
        process.exit(0);
    });
} catch (e) {
    console.error('FATAL ERROR:', e);
    process.exit(1);
}
