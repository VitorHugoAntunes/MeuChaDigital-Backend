import { createUser } from "../controllers/userController";
import passport from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth2';
import { Request } from 'express';
import { Profile } from 'passport';

import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

console.log(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);

interface GoogleProfile extends Profile {
  email: string;
  picture: string;
}

interface CreateUserParams {
  name: string;
  email: string;
  googleId: string;
  photo: string;
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  console.error("Variáveis de ambiente não configuradas para a estratégia Google OAuth2");
  process.exit(1); // Encerra a execução do script
}

// Configuração do Passport para usar a estratégia Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (
      _req: Request,
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback
    ) => {
      try {
        const userParams: CreateUserParams = {
          name: profile.displayName,
          email: profile.email,
          googleId: profile.id,
          photo: profile.picture,
        };

        if (_req.res) {
          const user = await createUser(userParams);
          return done(null, user);
        } else {
          throw new Error("Response object is undefined");
        }
      } catch (error) {
        console.error("Erro ao criar o usuário:", error);
        return done(error, null); // Passa o erro para o Passport
      }
    }
  )
);

passport.serializeUser(function (user: any, done: (err: any, id?: any) => void) {
  done(null, user.id);
});

passport.deserializeUser(function (id: string, done: (err: any, user?: any) => void) {
  done(null, { id });
});
