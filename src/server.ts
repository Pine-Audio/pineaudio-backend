import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from 'mongoose';
import { NotFoundHandler } from "./middleware/404.middleware";
import { ErrorHandler } from "./middleware/error.middleware"

if (!process.env.DATABASE_URL) {
    process.exit(1);
}

const DATBASE_URL: string = process.env.DATABASE_URL;
mongoose.connect(DATBASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT, 10);
const DEBUG: boolean = process.env.NODE_ENV !== 'production';
const app = express();

app.use(helmet());
app.use(cors());

if (!DEBUG) {
    app.use(compression())
    app.enable('view cache')
}

app.use(NotFoundHandler); // handles 404
app.use(ErrorHandler); // handles all errors

app.listen(PORT, () => {
    console.log(`🌲 Server started. Listening on ${PORT}`);
});