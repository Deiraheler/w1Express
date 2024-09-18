import express, {Application, Request, Response} from "express" ;
import morgan from "morgan";
import {stringify} from "querystring";

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(morgan("tiny"));
app.get("/ping/:name", async (req : Request, res: Response) => {
    res.send({
        message: "Hello " + req.params.name,
    });
});

app.get('/bananas', async (req : Request, res: Response)=> {
    res.send('hello world, this is bananas');
});


app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
});
