import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI || '';
export const TWILLIO_KEYS = {
	accountSID: process.env.TWILIO_ACCOUNT_SID || '',
	authToken: process.env.TWILIO_AUTH_TOKEN || '',
};
