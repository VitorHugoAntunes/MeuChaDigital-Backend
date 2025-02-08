import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);

router.get('/auth/failure', (_req, res) => {
  res.send('Authentication failed');
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.send(`
        <h1>Logout efetuado</h1>
        <a href="/">Voltar para o inicio</a>
        `);
    });
  });
});

export default router;
