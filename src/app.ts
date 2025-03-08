import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import session from 'cookie-session';
import passport from 'passport';
import routes from './routes/routes';

import { createContribution } from './controllers/contributionController';
import { isLoggedIn } from './middlewares/authMiddleware';
import './config/passport';
import getSubdomainMiddleware, { CustomRequest } from './middlewares/getSubdomainMiddleware'; // Importe o middleware
import checkSubdomainMiddleware from './middlewares/checkSubdomainMiddleware';

const app = express();

app.use(session({
  name: 'session',
  secret: 'cats',
  maxAge: 24 * 60 * 60 * 1000,
  secure: false,
  httpOnly: true,
  sameSite: 'lax',
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^https?:\/\/(.*\.)?localhost:3000$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite cookies e autenticação
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(getSubdomainMiddleware);
app.use(checkSubdomainMiddleware);

app.use('/api/v1', routes);

// app.use((req, res, next) => {
//   const isListRoute = req.path.startsWith("/list") || req.path.startsWith("/list/");
//   const isUsersRoute = req.path.startsWith("/users");

//   if (
//     (isListRoute && req.method !== "GET") || // Exige autenticação para métodos não-GET em /list
//     isUsersRoute && req.method !== "GET" // Exige autenticação para todos os métodos não-GET em /users
//   ) {
//     isLoggedIn(req, res, next);
//   } else {
//     next(); // Continua a execução normalmente se não for uma rota protegida
//   }
// });

app.use(express.json());



// Rota de teste para webhook
app.post('/test-webhook(/pix)?', async (req: Request, res: Response) => {
  try {
    console.log('Webhook de pagamento recebido');
    console.log(req.body);

    await createContribution(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar o webhook: ' + (error as Error).message });
  }
});

// Rota pública (sem subdomínio)
app.get('/', (_req, res) => {
  res.send('<a href="/auth/google">Autenticar com Google</a>');
});

app.get('/protected', (_req, res) => {
  res.send('Usuário autenticado');
});

export default app;