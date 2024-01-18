export var stockSymbolVar = [];
export var stockChangePerList = [];
export var stockPriceListVar = [];
export var stockChangeVar = [];
export var stockDBCode = [];

export default async function fetchValues(){
    let promise = await fetch('http://localhost:80/');
    let data = await promise.json();
    for (let i=0; i<12; i++){
        stockSymbolVar[i] = `${data[i]["Company"]} (${data[i]["Symbol"]})`;
        stockPriceListVar[i] = data[i]["Current Price"];
        stockChangeVar[i] = data[i]["Change "];
        stockChangePerList[i] = data[i]["Change Per"];
        stockDBCode[i] = data[i]["DB Code"];
    }
    return data,stockSymbolVar,stockPriceListVar,stockChangeVar,stockChangePerList,stockDBCode;
};
fetchValues();