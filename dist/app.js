"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const giftRoutes_1 = __importDefault(require("./routes/giftRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const inviteeRoutes_1 = __importDefault(require("./routes/inviteeRoutes"));
const contributionController_1 = require("./controllers/contributionController");
const authMiddleware_1 = require("./middlewares/authMiddleware");
require("./config/passport");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((req, res, next) => {
    const isListRoute = req.path.startsWith("/list") || req.path.startsWith("/list/");
    const isUsersRoute = req.path.startsWith("/users");
    if ((isListRoute && req.method !== "GET") || // Exige autenticação para métodos não-GET em /list
        isUsersRoute && req.method !== "GET" // Exige autenticação para todos os métodos não-GET em /users
    ) {
        (0, authMiddleware_1.isLoggedIn)(req, res, next);
    }
    else {
        next(); // Continua a execução normalmente se não for uma rota protegida
    }
});
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/lists', giftRoutes_1.default);
app.use('/payments', paymentRoutes_1.default);
app.use('/invitees', inviteeRoutes_1.default);
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
app.get('/', (_req, res) => {
    res.send('<a href="/auth/google">Autenticar com Google</a>');
});
app.get('/protected', (_req, res) => {
    res.send('Usuário autenticado');
});
exports.default = app;
