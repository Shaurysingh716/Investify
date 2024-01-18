import express from "express";
import exportValues from "./convertToJSON.mjs";
import searchData from "./searchIntoData.mjs";
const app = express();
const port = 80;

app.get('/', async (req,res) => {
    try{
        let data = await exportValues();
        // console.log(data);
        res.status(200).send(data);
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/:DBCode',async (req,res)=>{
    let DBCode = req.params.DBCode;
    let data = await searchData(DBCode);
    res.status(200).send(data);
})

app.listen(port,()=>{
    console.log("Application Started");
});