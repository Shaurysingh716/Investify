import express  from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from "uuid";
import generateRandomSequence from "./generateRandomSessionId.mjs";

const app = express();
const port = 8000;

app.use('/static',express.static('static'));
app.set('view engine', 'pug');
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));
const oneDay = 60*60*24*1000;

function genid(req) {
    return uuidv4();
}

app.use(session({
    genid: genid,
    secret: 'dGhpc2lzdGhlc2VjcmV0a2V5ZG9udHNoYXJld2l0aGFueW9uZQo=',
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));

import mongoose from "mongoose";
let serverName = "stockdb";
let UserInfoData = "UserInfoData";
let StockBuyData = "stockBuyData";
mongoose.connect(`mongodb://127.0.0.1:27017/${serverName}`,{
    useNewUrlParser:true, 
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection Succeded");
}).catch((err)=>{
    console.log(err);
});

const userInfoSchema = new mongoose.Schema({
    PhoneNo: String,
    sessionId: String
});
const Userinfo = new mongoose.model(`${UserInfoData}`,userInfoSchema);

const stockBuyDataSchema = new mongoose.Schema({
    CompanyName: String,
    PhoneNo: Number,
    Quantity: Number,
    Price: Number
});
const stockBuyData = new mongoose.model(`${StockBuyData}`,stockBuyDataSchema);

app.get('/',async(req,res)=>{
    req.session.sessionId = await generateRandomSequence(16);
    res.status(200).render('loginpage.pug');
    // console.log(req.session);
    // const sessionId = req.sessionID;
    // console.log(sessionId);
});

import genrateRandomNumber from "./generateOTP.mjs";
import sendSMS from "./sendMsg.mjs";
app.post('/',async (req,res)=>{
    // console.log(req.session);
    // console.log(req.body.PhoneNo);
    req.session.PhoneNo = req.body.PhoneNo;
    let userDataObject = {
        PhoneNo: req.body.PhoneNo,
        sessionId: req.session.sessionId
    }
    const database = mongoose.connection;
    const collection = database.collection('UserInfoData');
    const query = {
        "PhoneNo": req.session.PhoneNo
    }
    const document = await collection.findOne({"PhoneNo": req.session.PhoneNo});
    if (document){
        console.log(document);
        req.session.sessionId = document.sessionId;
        req.session.otp = await genrateRandomNumber(10000,99999);
        req.session.SMSMsg = `Welcome To Investify!\nYour One Time Password (OTP) For Verification At Investify is ${req.session.otp}\nPlease Do Not Share This OTP With ANYONE, Even-if the said person Claims To Be Related With Investify\nDon't Just Invest, Investify`;
        console.log(req.session.otp);
        await sendSMS(`+91 ${req.session.PhoneNo}`,req.session.SMSMsg);
        res.status(200).redirect(`${req.session.sessionId}-verify`);
    } else{
        // console.log(userDataObject);
        let body = new Userinfo(userDataObject);
        body.save().then(async ()=>{
            console.log("Item Save To Database");
            req.session.otp = await genrateRandomNumber(10000,99999);
            console.log(req.session.otp);
            req.session.SMSMsg = `Welcome To Investify!\nYour One Time Password (OTP) For Verification At Investify is ${req.session.otp}\nPlease Do Not Share This OTP With ANYONE, Even-if the said person Claims To Be Related With Investify\nDon't Just Invest, Investify`;
            await sendSMS(`+91 ${req.session.PhoneNo}`,req.session.SMSMsg);
            // console.log(req.session);
            res.status(200).redirect(`${req.session.sessionId}-verify`);
        });
    }
});

app.get('/:sessionId-verify',(req,res)=>{
    res.status(200).render('otpPage.pug');
});

app.post('/:sessionId-verify',async (req,res)=>{
    const database = mongoose.connection;
    const collection = database.collection(UserInfoData);
    try{
        const query = {
            PhoneNo: req.session.PhoneNo,
            sessionId: req.session.sessionId
        }
        const document = collection.find(query);
        if (document){
            // console.log(req.body);
            req.session.checkOtp = req.body.OTPinput1 + req.body.OTPinput2 + req.body.OTPinput3 + req.body.OTPinput4 + req.body.OTPinput5;
            // console.log(req.session.checkOtp);
            if (req.session.otp == parseInt(req.session.checkOtp)){
                res.status(200).redirect(`/${req.session.sessionId}-verify/Home`);
            }else{
                res.status(401).send("Wrong OTP");
            }
        }else{
            res.status(404).send("Not Found");
        }
    }catch(err){
        console.log("Some Error Occured");
    }
});

import fetchValues from "./Static/JS/Landing Page/frontStockData.mjs";
import { stockSymbolVar } from "./Static/JS/Landing Page/frontStockData.mjs";
import { stockChangePerList } from "./Static/JS/Landing Page/frontStockData.mjs";
import { stockChangeVar } from "./Static/JS/Landing Page/frontStockData.mjs";
import { stockPriceListVar } from "./Static/JS/Landing Page/frontStockData.mjs";
import { stockDBCode } from "./Static/JS/Landing Page/frontStockData.mjs";
import fetchDBCODEValues from "./valueUsingDBCode.mjs";
import updateExcelSheet from "./updateValues.mjs";
app.get('/:sessionId-verify/Home',async (req,res)=>{
    let data = await fetchValues();
    // let maindata = [];
    // for (let i=0; stockDBCode.length; i++){
    //     maindata[i] = `${req.session.sessionId}-verify/Home/${stockDBCode[i]}`
    // }
    res.status(200).render('landingpage.pug',{stockSymbolVar:stockSymbolVar, stockChangePerList:stockChangePerList, stockChangeVar:stockChangeVar, stockPriceListVar:stockPriceListVar,stockDBCode:stockDBCode});
});

app.get('/:sessionId-verify/:DBCode',async (req,res)=>{
    let DBCode = req.params.DBCode;
    let data = await fetchDBCODEValues(DBCode);
    let CompanyName = data['CompanyName'];
    let CurrentPrice = data['CurrentPrice'];
    let weekHigh = data['weekHigh'];
    let weekLow = data['weekLow'];
    let CompanyNameOnly = data['CompanyNameOnly'];
    let Symbol = data['Symbol'];
    res.status(200).render('buyPage.pug',{CompanyName:CompanyName, CurrentPrice:CurrentPrice, weekHigh:weekHigh, weekLow:weekLow, CompanyNameOnly:CompanyNameOnly, Symbol:Symbol});
});

app.post('/:sessionId-verify/:DBCode',async (req,res)=>{
    let DBCode = req.params.DBCode;
    let sessionId = req.params.sessionId;
    let data = await fetchDBCODEValues(DBCode);
    let CompanyName = data['CompanyNameOnly'];
    let CSName = data['CompanyName'];
    let query = {
        CompanyName: CompanyName,
        PhoneNo: req.session.PhoneNo,
        Quantity: req.body.Quantity,
        Price: req.body.Price
    }
    const body = new stockBuyData(query);
    body.save().then(async ()=>{
        updateExcelSheet(DBCode,req.body.Price);
        console.log("Saved To DataBase");
        req.session.buyMsg = `This is to inform you that you have brought ${req.body.Quantity} shares of ${CSName} at Price of ${req.body.Price} which makes a total of Rs.${req.body.Price}*${req.body.Quantity}`;
        await sendSMS(`+91 ${req.session.PhoneNo}`,req.session.buyMsg);
        res.status(200).redirect(`/${req.session.sessionId}-verify/Home`);
    });
});

app.listen(port, ()=>{
    console.log(`Application Started At Port ${port} on the Local Server at LocalHost`);
});