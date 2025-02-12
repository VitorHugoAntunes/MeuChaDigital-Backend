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
    if (req.path === '/' || req.path.startsWith('/auth') || req.path.startsWith('/payment/webhook') || req.path.startsWith('/test-webhook')) {
        return next();
    }
    (0, authMiddleware_1.isLoggedIn)(req, res, next);
});
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/list', giftRoutes_1.default);
app.use('/payment', paymentRoutes_1.default);
app.post('/test-webhook(/pix)?', (req, res) => {
    console.log(req.body);
    console.log(req.headers);
    res.send('Webhook recebido');
    res.status(200);
});
app.get('/', (_req, res) => {
    res.send('<a href="/auth/google">Autenticar com Google</a>');
});
app.get('/protected', (_req, res) => {
    res.send('Usuário autenticado');
});
exports.default = app;
