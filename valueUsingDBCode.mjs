export default async function fetchDBCODEValues(DBCode){
    let promise = await fetch(`http://localhost:80/${DBCode}`);
    let data = await promise.json();
    let sendData = {}
    sendData.Symbol = `${data['Symbol']}`;
    sendData.CompanyNameOnly = `${data['Company']}`;
    sendData.CompanyName = `${data['Company']}(${data['Symbol']})`;
    sendData.CurrentPrice = `${data['Current Price']}`;
    sendData.weekHigh = `${data['52-Week High ']}`
    sendData.weekLow = `${data['52-Week Low']}`;
    return sendData;
}