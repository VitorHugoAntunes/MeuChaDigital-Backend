import express from 'express';
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
  if (req.path === '/' || req.path.startsWith('/auth')) {
    return next();
  }
  isLoggedIn(req, res, next);
});

app.use(express.json());

app.post("/webhook(/pix)?", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("Requisição autorizada:", req.body);
    res.status(200).send("OK");
  } else {
    console.log("Requisição não autorizada!");
    res.status(401).send("Unauthorized");
  }
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/list', giftRoutes);
app.use('/payment', paymentRoutes);

app.get('/', (_req, res) => {
  res.send('<a href="/auth/google">Autenticar com Google</a>');
});
app.get('/protected', (_req, res) => {
  res.send('Usuário autenticado');
});

export default app;
