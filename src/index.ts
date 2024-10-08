import mongoose from "mongoose";
import dotenv from "dotenv";
import express, {Application, Request, Response} from "express" ;
import {authenticateKey} from "./middleware/auth.middleware";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
require('dotenv').config();

app.get("/ping/:name", async (req : Request, res: Response) => {
    res.send({
        message: "Hello " + req.params.name,
    });
});

app.get('/bananas', authenticateKey, async (req : Request, res: Response)=> {
    res.send('hello world, this is bananas');
});

app.use("/api/v1/users", require("./routes/routes"));

// MongoDB Connection
mongoose.connect(process.env.DB_CONN_STRING || "" + process.env.DB_NAME)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
