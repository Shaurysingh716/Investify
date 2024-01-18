// import XLSX from 'xlsx';

// var workbook = XLSX.readFile("StockData.xlsx");
// var sheet_name_list = workbook.SheetNames;

// export default function exportValues(){
//     return new Promise((resolve, reject) => {
//         let data = [];
//         sheet_name_list.forEach(function(y) {
//             var worksheet = workbook.Sheets[y];
//             var headers = {};
//             for(let z in worksheet){
//                 if(z[0] === "!") continue;
//                 var col = z.substring(0, 1);
//                 var row = parseInt(z.substring(1));
//                 var value = worksheet[z].v;
//                 if (row == 1){
//                     headers[col] = value;
//                     continue;
//                 }
//                 if (!data[row]) data[row] = {};
//                 data[row][headers[col]] = value;
//             }
//             data.shift();
//             data.shift();
//         });
//         resolve(data);
//     });
// }

import XLSX from 'xlsx';

export default function exportValues() {
    var workbook = XLSX.readFile("StockData.xlsx");
    var sheet_name_list = workbook.SheetNames;

    return new Promise((resolve, reject) => {
        let data = [];
        sheet_name_list.forEach(function(y) {
            var worksheet = workbook.Sheets[y];
            var headers = {};
            for(let z in worksheet){
                if(z[0] === "!") continue;
                var col = z.substring(0, 1);
                var row = parseInt(z.substring(1));
                var value = worksheet[z].v;
                if (row == 1){
                    headers[col] = value;
                    continue;
                }
                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            data.shift();
            data.shift();
        });
        resolve(data);
    });
}

// Set an interval to call the function every 3 seconds
setInterval(() => {
    exportValues().then((data) => {
        // Use the data here as needed
        // console.log(data);
    }).catch((error) => {
        console.error("An error occurred:", error);
    });
}, 3000); // 3000 milliseconds = 3 seconds
