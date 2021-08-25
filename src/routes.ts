import express from 'express';
import { SendVerificationCode } from './controller';
import { validate } from './helpers';
import Validation from './validation';

const router = express.Router();

router.post('/register', validate(Validation.SendVerificationCode), SendVerificationCode);

export default router;
