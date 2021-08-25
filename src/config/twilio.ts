import twilio from 'twilio';
import { TWILLIO_KEYS } from './index';
const { accountSID, authToken } = TWILLIO_KEYS;

const client = twilio(accountSID, authToken);

export default client;
