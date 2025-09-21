import mongoose from 'mongoose';
import config from './config';
async function connectDB () : Promise<void> {
    try {
        const conn = await mongoose.connect(config.dbConnectionString);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error: any) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});


export default connectDB;