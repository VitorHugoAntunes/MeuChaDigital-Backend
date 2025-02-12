import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import giftRoutes from './routes/giftRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { isLoggedIn } from './middlewares/authMiddleware';
import './config/passport';

const app = express();

app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.path === '/' || req.path.startsWith('/auth') || req.path.startsWith('/payment/webhook') || req.path.startsWith('/test-webhook')) {
    return next();
  }
  isLoggedIn(req, res, next);
});

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/list', giftRoutes);
app.use('/payment', paymentRoutes);

app.post('/test-webhook(/pix)?', (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.headers);
  res.send('Webhook recebido');
  res.status(200);
});

app.get('/', (_req, res) => {
  res.send('<a href="/auth/google">Autenticar com Google</a>');
});
app.get('/protected', (_req, res) => {
  res.send('Usuário autenticado');
});

export default app;
