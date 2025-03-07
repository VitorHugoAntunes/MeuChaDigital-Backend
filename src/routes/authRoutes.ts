import { Router } from 'express';
import { Request, Response } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
  if (req.user) {
    res.cookie("user", req.user, { httpOnly: true, secure: false });
  }
}
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/lists',
    failureRedirect: '/auth/failure',
    passReqToCallback: true,
    authInfo: true,
  })
);

router.get("/user", (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Usuário não autenticado" });
  }
  res.json(req.user);
});

router.get('/auth/failure', (_req, res) => {
  res.send('Authentication failed');
});

router.get('/logout', (req: Request, res: Response) => {
  // Define req.session como null usando uma afirmação de tipo
  (req as any).session = null;

  res.clearCookie('session');
  res.clearCookie('session.sig');

  res.send("Logout efetuado com sucesso!");
});

export default router;
