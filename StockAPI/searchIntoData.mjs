import exportValues from "./convertToJSON.mjs";

export default async function searchData(DBCode){
    try{
        let data = await exportValues();
        for (let i=0; i<data.length; i++){
            if (data[i]['DB Code'] == DBCode){
                return data[i];
            }
        }
    }catch (error){
        console.log(error);
    }
}