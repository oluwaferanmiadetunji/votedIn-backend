import express from 'express';
import { SendVerificationCode, VerifyAccount, Login, Verify } from './controller';
import { validate } from './helpers';
import Validation from './validation';

const router = express.Router();

router.post('/register', validate(Validation.SendVerificationCode), SendVerificationCode);
router.post('/verify-account', validate(Validation.VerifyAccount), VerifyAccount);
router.post('/login', validate(Validation.LoginAccount), Login);
router.post('/verify', validate(Validation.Verify), Verify);

export default router;
