import ExcelJS from 'exceljs';

export default async function updateExcelSheet(DBCode, newPrice) {
  const workbook = new ExcelJS.Workbook();

  try {
    // Load the Excel file
    await workbook.xlsx.readFile('../StockAPI/StockData.xlsx');

    // Assuming the data is in the first worksheet
    const worksheet = workbook.getWorksheet(1);

    // Find the row with the matching DBCode
    let rowToUpdate;
    worksheet.eachRow((row, rowNumber) => {
      if (row.getCell(8).value === DBCode) { // Assuming DB Code is in the 7th column
        rowToUpdate = row;
      }
    });

    if (rowToUpdate) {
      // Update the Current Price and Change columns
      const currentPriceCell = rowToUpdate.getCell(3); // Current Price is in the 3rd column
      const changeCell = rowToUpdate.getCell(7); // Change is in the 6th column

      const currentPrice = currentPriceCell.value;
      const change = newPrice - currentPrice;

      currentPriceCell.value = newPrice;
      changeCell.value = change;

      // Save the changes to the Excel file
      await workbook.xlsx.writeFile('../StockAPI/StockData.xlsx');
      console.log(`Updated DBCode ${DBCode} with new price ${newPrice}`);
    } else {
      console.log(`DBCode ${DBCode} not found in the Excel sheet.`);
    }
  } catch (error) {
    console.error('Error updating Excel sheet:', error);
  }
}