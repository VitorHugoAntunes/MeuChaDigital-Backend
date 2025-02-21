"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
console.log(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.error("Variáveis de ambiente não configuradas para a estratégia Google OAuth2");
    process.exit(1); // Encerra a execução do script
}
// Configuração do Passport para usar a estratégia Google OAuth2
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, async (_req, _accessToken, _refreshToken, profile, done) => {
    try {
        const userParams = {
            name: profile.displayName,
            email: profile.email,
            googleId: profile.id,
            photo: profile.picture,
        };
        if (_req.res) {
            console.log("Criando usuario pelo google", userParams);
            const user = await (0, userController_1.createUser)(userParams);
            return done(null, user);
        }
        else {
            throw new Error("Response object is undefined");
        }
    }
    catch (error) {
        console.error("Erro ao criar o usuário:", error);
        return done(error, null); // Passa o erro para o Passport
    }
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    done(null, { id });
});
