import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI || '';
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_ACCESS_EXPIRATION_MINUTES = process.env.JWT_ACCESS_EXPIRATION_MINUTES;
export const TWILLIO_KEYS = {
	accountSID: process.env.TWILLIO_ACCOUNT_SSID || '',
	authToken: process.env.TWILLIO_AUTH_TOKEN || '',
};
