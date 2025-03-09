import { Router } from 'express';
import { Request, Response } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    passReqToCallback: true,
    authInfo: true,
  }),
  (req, res) => {
    if (req.user) {
      res.cookie('user', JSON.stringify(req.user), {
        domain: '.localhost',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
    }

    res.redirect('http://localhost:3000/lists');
  }
);

router.get('/user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' }) as any;
  }
  res.json(req.user);
});

router.get('/auth/failure', (_req, res) => {
  res.send('Authentication failed');
});

router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('session', { domain: 'localhost', path: '/' });
  res.clearCookie('session.sig', { domain: 'localhost', path: '/' });
  res.clearCookie('user', { domain: 'localhost', path: '/' });

  req.session = {} as any;
  res.status(200).send({ message: "Logout realizado com sucesso" });
});


export default router;