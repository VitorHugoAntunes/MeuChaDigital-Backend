import { createUser } from "../controllers/userController";
import passport from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth2';
import { Request } from 'express';
import { Profile } from 'passport';

import dotenv from 'dotenv';
import { findUserById } from "../repositories/userRepository";
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
// const GOOGLE_CALLBACK_URL = 'http://localhost:8000/auth/google/callback';

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
      passReqToCallback: true, // Ainda útil se quiser acesso ao req
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

        const user = await createUser(userParams);
        return done(null, user);
      } catch (error) {
        console.error("Erro ao criar o usuário:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
