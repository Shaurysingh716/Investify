import mongoose from "mongoose";
mongoose.connect('mongodb://127.0.0.1:27017/stockdb',{
    useNewUrlParser:true, 
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection Succeded");
}).catch((err)=>{
    console.log(err);
});

export default async function searchBuyData(){
    let StockBuyData = "stockBuyData";
    const database = mongoose.connection;
    const collection = database.collection(StockBuyData);
    let phoneno = 7678292204;
    const query = {
        PhoneNo: 9304650646
    }
    const document = await Promise(collection.find({PhoneNo:7678292204}));
    let data = await document;
    console.log(document);
    // console.log(document);
}

searchBuyData();