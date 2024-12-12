const mongoose = require('mongoose');
const app = require('./src/app'); // Import the Express app
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017/exam?authSource=admin';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to DB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
