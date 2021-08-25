import mongoose from 'mongoose';
import { MONGO_URI } from './index';

const options: any = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const connectDatabase = async () => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const conn: any = mongoose.connect(MONGO_URI, options);
		console.log(`MongoDB connected: ${(await conn).connection.host}`);

		return;
	} catch (error) {
		console.log(`Unable to connect to MongoDB. Error: ${error}`);
		process.exit(1);
	}
};

const disconnectDatabase = async (): Promise<void> => {
	await mongoose.disconnect();
};

export { connectDatabase, disconnectDatabase };
