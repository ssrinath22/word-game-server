import express, { Express } from 'express';
import cors from 'cors';
import { router as gameRouter } from './routes/game-routes';
import cookieParser from 'cookie-parser';

const app: Express = express();
const port =  8000; //potentially also use: process.env.PORT - for security

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your client's origin
    credentials: true, // This is important to allow cookies to be shared across origins
};

app.use(cors(corsOptions)); //allow all cross-origin requests
app.use(cookieParser()) //middleware for parsing cookies
app.use(express.json()); // For parsing application/json

// Use custom routes
app.use('/', gameRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
