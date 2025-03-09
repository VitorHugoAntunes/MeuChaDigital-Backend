"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("./routes/routes"));
const contributionController_1 = require("./controllers/contributionController");
require("./config/passport");
const getSubdomainMiddleware_1 = __importDefault(require("./middlewares/getSubdomainMiddleware")); // Importe o middleware
const checkSubdomainMiddleware_1 = __importDefault(require("./middlewares/checkSubdomainMiddleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_session_1.default)({
    name: 'session',
    secret: 'cats',
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || /^https?:\/\/(.*\.)?localhost:3000$/.test(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Permite cookies e autenticação
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(getSubdomainMiddleware_1.default);
app.use(checkSubdomainMiddleware_1.default);
app.use('/api/v1', routes_1.default);
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
// Rota de teste para webhook
app.post('/test-webhook(/pix)?', async (req, res) => {
    try {
        console.log('Webhook de pagamento recebido');
        console.log(req.body);
        await (0, contributionController_1.createContribution)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao processar o webhook: ' + error.message });
    }
});
// Rota pública (sem subdomínio)
app.get('/', (_req, res) => {
    res.send('<a href="/auth/google">Autenticar com Google</a>');
});
app.get('/protected', (_req, res) => {
    res.send('Usuário autenticado');
});
exports.default = app;
