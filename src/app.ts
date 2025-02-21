import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import giftRoutes from './routes/giftRoutes';
import paymentRoutes from './routes/paymentRoutes';
import inviteeRoutes from './routes/inviteeRoutes';
import { createContribution } from './controllers/contributionController'
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
  const isListRoute = req.path.startsWith("/list") || req.path.startsWith("/list/");
  const isUsersRoute = req.path.startsWith("/users");

  if (
    (isListRoute && req.method !== "GET") || // Exige autenticação para métodos não-GET em /list
    isUsersRoute && req.method !== "GET" // Exige autenticação para todos os métodos não-GET em /users
  ) {
    isLoggedIn(req, res, next);
  } else {
    next(); // Continua a execução normalmente se não for uma rota protegida
  }
});

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/lists', giftRoutes);
app.use('/payments', paymentRoutes);
app.use('/invitees', inviteeRoutes);

app.post('/test-webhook(/pix)?', async (req: Request, res: Response) => {
  try {
    console.log('Webhook de pagamento recebido');
    console.log(req.body);

    await createContribution(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar o webhook: ' + (error as Error).message });
  }
});

app.get('/', (_req, res) => {
  res.send('<a href="/auth/google">Autenticar com Google</a>');
});
app.get('/protected', (_req, res) => {
  res.send('Usuário autenticado');
});

export default app;

