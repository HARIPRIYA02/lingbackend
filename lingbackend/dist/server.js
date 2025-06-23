"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL
});
app.get('/', (req, res) => {
    res.send('API is running');
});
app.get('/questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM questions');
    res.json(result.rows);
}));
app.post('/leaderboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, score } = req.body;
    const result = yield pool.query('INSERT INTO leaderboard (name, score) VALUES ($1, $2) RETURNING *', [name, score]);
    res.json(result.rows[0]);
}));
app.get('/leaderboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10');
    res.json(result.rows);
}));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
