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

    // Redireciona para a URL correta com base no host da requisição
    const redirectUrl = `${req.protocol}://${req.get('host')}/lists`;
    res.redirect(redirectUrl);
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
  res.clearCookie('session', { domain: '.localhost', path: '/' });
  res.clearCookie('session.sig', { domain: '.localhost', path: '/' });
  res.clearCookie('user', { domain: '.localhost', path: '/' });

  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir a sessão:', err);
      return res.status(500).send('Erro ao efetuar logout');
    }

    res.send('Logout efetuado com sucesso!');
  });
});

export default router;