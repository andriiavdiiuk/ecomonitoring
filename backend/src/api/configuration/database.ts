import mongoose from 'mongoose';
import Config from 'backend/api/configuration/config';

async function connectDB(config: Config): Promise<void> {
    try {
        const conn = await mongoose.connect(config.dbConnectionString);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error: unknown) {
        console.error('MongoDB connection error:', (error as Error).message);
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

process.on('SIGINT', () => {
    mongoose.connection.close()
        .then(() => {
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        })
        .catch((err: unknown) => {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
        });
});


export default connectDB;