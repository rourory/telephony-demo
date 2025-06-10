import { Workbook } from 'exceljs';

export const formatCallReport = (
  workbook: Workbook,
  startDate: Date,
  finishDate: Date,
) => {
  const worksheet = workbook.worksheets[0];
  //Add a new column in the start of the document
  worksheet.spliceColumns(1, 0, []);
  //Do some formatting things
  worksheet.columns[0].width = 7;
  worksheet.columns[1].width = 25;
  worksheet.columns[2].width = 30;
  worksheet.columns[3].width = 26;
  worksheet.columns[4].width = 33;
  worksheet.columns[5].width = 18;
  worksheet.columns[6].width = 18;
  worksheet.columns[7].width = 10;
  worksheet.columns[8].width = 14;

  //Define header and values for 1st column
  worksheet.columns[0].eachCell?.((cell, rowNumber) => {
    if (rowNumber == 1) {
      cell.font = { bold: true, name: 'Times New Roman' };
    }
    cell.border = {
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      top: { style: 'thin' },
    };
    cell.value = rowNumber == 1 ? '№ п/п' : rowNumber - 1;
  });
  worksheet.spliceColumns(worksheet.columnCount, 1);

  //Set borders
  for (let index = 1; index <= 8; index++) {
    worksheet.columns[index].eachCell?.((cell, rowNumber) => {
      cell.border = {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
      };
      cell.font = { name: 'Times New Roman' };
    });
  }

  worksheet.insertRow(1, []);
  worksheet.insertRow(1, []);
  worksheet.insertRow(1, []);
  worksheet.insertRow(1, []);
  worksheet.mergeCells(`A1:I1`);
  worksheet.mergeCells(`A2:I2`);
  worksheet.mergeCells(`A3:I3`);

  const firstRowHeader = worksheet.getCell(1, 1);
  firstRowHeader.alignment = { horizontal: 'center' };
  firstRowHeader.font = { bold: true, size: 14, name: 'Times New Roman' };
  firstRowHeader.value = 'СПИСОК';

  const secondRowHeader = worksheet.getCell(2, 1);
  secondRowHeader.alignment = { horizontal: 'center' };
  secondRowHeader.font = { size: 14, name: 'Times New Roman' };
  secondRowHeader.value = 'осужденных ИУ «ИК №3», предоставляемых на звонок';

  let thirdRowHeaderValue = `посредством аудио- /видеосвязи`;

  if (startDate.getTime() > 0) {
    thirdRowHeaderValue += ` с ${startDate.toLocaleDateString()} ${startDate.getHours()}:${startDate.getMinutes()}`;
  }
  if (finishDate.getTime() > 0) {
    thirdRowHeaderValue += ` по ${finishDate.toLocaleDateString()} ${finishDate.getHours()}:${finishDate.getMinutes()}`;
  }

  const thirdRowHeader = worksheet.getCell(3, 1);
  thirdRowHeader.alignment = { horizontal: 'center' };
  thirdRowHeader.font = { size: 14, name: 'Times New Roman' };
  thirdRowHeader.value = thirdRowHeaderValue;

  worksheet.insertRow(worksheet.rowCount + 1, []);
  worksheet.insertRow(worksheet.rowCount, []);
  worksheet.insertRow(worksheet.rowCount, []);
  worksheet.insertRow(worksheet.rowCount, []);

  worksheet.mergeCells(`A${worksheet.rowCount - 2}:I${worksheet.rowCount - 2}`);
  const firstLastRow = worksheet.getCell(worksheet.rowCount - 2, 1);
  firstLastRow.font = { size: 14, name: 'Times New Roman' };
  firstLastRow.value = 'СОСТАВИЛ';
  firstLastRow.border = {
    bottom: undefined,
    top: undefined,
    right: undefined,
    left: undefined,
  };

  worksheet.mergeCells(`A${worksheet.rowCount - 1}:I${worksheet.rowCount - 1}`);
  const secondLastRow = worksheet.getCell(worksheet.rowCount - 1, 1);
  secondLastRow.font = { size: 14, name: 'Times New Roman' };
  secondLastRow.value = '________________ внутренней службы';
  secondLastRow.border = {
    bottom: undefined,
    top: undefined,
    right: undefined,
    left: undefined,
  };

  worksheet.mergeCells(`A${worksheet.rowCount}:I${worksheet.rowCount}`);
  const thirdLastRow = worksheet.getCell(worksheet.rowCount, 1);
  thirdLastRow.font = { size: 14, name: 'Times New Roman' };
  thirdLastRow.value = '«___»________ 20__г.';
  thirdLastRow.border = {
    bottom: undefined,
    top: undefined,
    right: undefined,
    left: undefined,
  };

  worksheet.model.pageSetup.printArea = `A1:I${worksheet.rowCount}`;
  worksheet.model.pageSetup.orientation = 'landscape';
  worksheet.model.pageSetup.horizontalCentered = true;
  worksheet.model.pageSetup.scale = 73;
  worksheet.model.pageSetup.margins = {
    bottom: 0.25,
    left: 0.25,
    right: 0.25,
    top: 0.45,
    header: 0.1,
    footer: 0.1,
  };

  return workbook;
};
