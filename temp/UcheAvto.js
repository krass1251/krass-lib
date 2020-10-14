let ss = SpreadsheetApp.getActiveSpreadsheet();

//geting Sheets
let formSheet    = ss.getSheetByName('Форма');
let avtoSheet    = ss.getSheetByName('Авто');
let uchetSheet   = ss.getSheetByName("Учет Авто");
let workSheet    = ss.getSheetByName('Виды работ');

// geting cells
let nomerCell        = formSheet.getRange('A2');
let vinCell          = formSheet.getRange('A4');
let makerCell        = formSheet.getRange('A6');
let modelCell        = formSheet.getRange('A8');
let probegCell       = formSheet.getRange('A10');
let yearCell         = formSheet.getRange('A12');
let workVidCell      = formSheet.getRange('A14');
let workTypeCell     = formSheet.getRange('A16');
let ownerCell        = formSheet.getRange('A18');
let phoneCell        = formSheet.getRange('A20');
let summCell         = formSheet.getRange('A22');
let addToListCell    = formSheet.getRange('A24');
let sendResponseCell = formSheet.getRange('B1');

async function onEdit(e){
    let previousValue = PropertiesService.getScriptProperties().getProperty('previousValue');
    let cell = e.range;
    let cellValue = cell.getValue();

    if(previousValue === cellValue) {return;}

    PropertiesService.getScriptProperties().setProperty('previousValue', cellValue);
    if (cell.getA1Notation() == makerCell.getA1Notation() && cell.getSheet().getName() == 'Форма'){ // валидация для модели
        createValidationForModel();
        let arr = ["Lamborghini","Koenigsegg","Bentley","Bugatti","Ferrari","Maserati"];
        if (arr.indexOf(makerCell.getValue()) != -1){
            modelCell.setValue("Ой, не пизди");
        } else {
            modelCell.setValue("");
        }
        modelCell.activateAsCurrentCell();
    } else if (cell.getA1Notation() == nomerCell.getA1Notation() && cell.getSheet().getName() == 'Форма'){ // отослать запрос
        if (String(cell.getValue()).length == 8){
            sendResponseCell.check();
            analizeCarNumber();
            analizeVin();
            await GetRespone();
        }
    } else if (cell.getA1Notation() == addToListCell.getA1Notation() && cell.getSheet().getName() == 'Форма'){ // перенести в список учета автом
        if (cell.isChecked()===true){
            clearFilter();
            clearSubTotalFormulas();
            addWorkTypeToList();
            addToList();
            cell.uncheck();
        }
    } else if (cell.getA1Notation() == workVidCell.getA1Notation() && workVidCell.getSheet().getName() == cell.getSheet().getName()){ // валидация для типов работ
        createValidationForWorkType(workVidCell.getValue(), workTypeCell);
        workTypeCell.clearContent();
        workTypeCell.activate();
    } else if(cell.getRow() > 1 && cell.getColumn() == 10 && cell.getSheet().getName() == uchetSheet.getName()){ // валидация на общем списке машин
        createValidationForWorkType(cell.getValue(), cell.offset(0,1));
        cell.offset(0,1).clearContent();
        cell.offset(0,1).activate();
    } else if (cell.getA1Notation() == vinCell.getA1Notation() && vinCell.getSheet().getName() == cell.getSheet().getName()){ // обработка VIN
        if (String(vinCell.getValue()).length === 17){
            analizeVin();
        }
    } else if (cell.getA1Notation() == 'A2' && cell.getSheet().getName() == 'Выписка'){ // выписка по владельцу
        if (cell.getValue() != ''){
            if (cell.getDataValidation().getCriteriaValues()[0].getValues().toString().split(',').indexOf(cell.getValue()) != -1){
                clearFilter();
                clearSubTotalFormulas();
                createForOwner();
                cell.offset(0,1).clearContent();
                cell.offset(0,2).clearContent();
            }
        }
    } else if (cell.getA1Notation() == 'B2' && cell.getSheet().getName() == 'Выписка'){ // выписка по номеру авто
        if (cell.getValue() != ''){
            if (cell.getDataValidation().getCriteriaValues()[0].getValues().toString().split(',').indexOf(cell.getValue()) != -1){
                clearFilter();
                clearSubTotalFormulas();
                createForNomer();
                cell.offset(0,-1).clearContent();
                cell.offset(0,1).clearContent();
            }
        }
    } else if (cell.getA1Notation() == 'C2' && cell.getSheet().getName() == 'Выписка'){ // выписка по VIN
        if (cell.getValue() != ''){
            if (cell.getDataValidation().getCriteriaValues()[0].getValues().toString().split(',').indexOf(cell.getValue()) != -1){
                clearFilter();
                clearSubTotalFormulas();
                createForVin();
                cell.offset(0,-1).clearContent();
                cell.offset(0,-2).clearContent();
            }
        }
    }
}

function addToList(){
    let ui = SpreadsheetApp.getUi();
    let phon = String(phoneCell.getValue());
    let indicate = 0;
    clearFilter();
    clearSubTotalFormulas();
    if (phon.length === 0 || phon.length === 9){
        let checkArr = [makerCell,modelCell,nomerCell,vinCell];
        for (let i = 0; i < checkArr.length; i++){if (checkArr[i].getValue() != ''){indicate = 1}}
        if (indicate === 1){
            let arr = uchetSheet.getRange(1, 1, 1, uchetSheet.getLastColumn()).getValues()[0];
            let id = uchetSheet.getRange(2,1).getValue() + 1;
            let dat = new Date();
            dat = dat.getDate() + '.' + (dat.getMonth()+1) + '.' + dat.getFullYear();
            let num = replaceEngSymb(String(nomerCell.getValue()).toUpperCase());
            let vin = String(vinCell.getValue()).toUpperCase();
            let searchArr = [/*записи*/, "Марка", "Модель", "Гос номер", "VIN", /Пробег*/, "Год", "Дата ТО", "Сумма", "Вид работы", "Тип работы", "Владелец", "Телефон"]
            let addArr = [id, makerCell.getValue(), modelCell.getValue(), num, vin, probegCell.getValue(), yearCell.getValue(), dat, summCell.getValue(),
                workVidCell.getValue(), workTypeCell.getValue(), ownerCell.getValue(), phoneCell.getValue()]
            let whatAddArr = [[1,2,3,4,5,6,7,8,9,10,11,12]];
            for (let i = 0; i < searchArr.length; i++){
                let z = find(searchArr[i],arr);
                whatAddArr[0][z] = addArr[i];
            }
            let x = uchetSheet.getLastRow() + 1;
            uchetSheet.getRange(x, 1, 1, searchArr.length).setValues(whatAddArr);
            for (let i = 0; i < searchArr; i++){
                let y = find(searchArr[i], arr);
                ui.alert(y);
                y++;
                if (i === 0 || i === 5 || i === 6){
                    uchetSheet.getRange(x, y).setNumberFormat('0');
                } else if (i == 1 || i == 2 || i == 3 || i == 4 || i == 9 || i == 10 || i == 11 || i == 13){
                    uchetSheet.getRange(x, y).setNumberFormat('@');
                } else if (i == 7){
                    ui.alert(uchetSheet.getRange(2, y).getA1Notation());
                    uchetSheet.getRange(x, y).setNumberFormat('dd mmmm yyyy');
                } else if (i == 8){
                    uchetSheet.getRange(x, y).setNumberFormat('#,##0');
                } else if (i == 12){
                    uchetSheet.getRange(x, y).setNumberFormat('"0"0');
                };
            }
            uchetSheet.getRange(x,1, 1, 14).setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
            uchetSheet.getRange(2, 1, x, uchetSheet.getLastColumn()).sort({column: 1, ascending: false});
            phoneCell.setBackground(null);
            //claerMainCells();
            nomerCell.offset(0, 1).clearContent();
            nomerCell.offset(2, 1).clearContent()

        } else {
            ui.alert("Указано слишком мало данных");
        }
    } else {
        ui.alert("Неправильный формат номера телефона");
        phoneCell.setBackground('#ff0000');
    }
}

function GetRespone(){
    if (sendResponseCell.isChecked()===true){
        if (String(nomerCell.getValue()).length == 8){
            clearFilter();
            clearSubTotalFormulas();
            let url = "https://baza-gai.com.ua/nomer/" + replaceEngSymb(String(nomerCell.getValue()).toUpperCase());
            let response = UrlFetchApp.fetch(url, {headers: {"Accept": "application/json"}, muteHttpExceptions: true});
            if (response.getResponseCode() == 200){
                let json = JSON.parse(response);
                makerCell.setBackground(null);
                makerCell.setValue(json.vendor);
                modelCell.setValue(firstLetterUpper(json.model))
                yearCell.setValue(json.year);
                createValidationForModel();
                addModelToList();
                analizeCarNumber();
            } else {
                makerCell.setValue("Не найдено в базе");
                makerCell.setBackground('#ff0000');
                modelCell.setValue('');
                yearCell.setValue('');
            }
        }
        let arr = [workVidCell,workTypeCell,ownerCell,phoneCell,summCell]
        for (let i = 0; i < arr.length; i++){
            arr[i].clearContent();
        }
        sendResponseCell.uncheck();
        createStyleForMainFromCell();
    }
}


function addModelToList(){
    let x =  modelCell.getDataValidation().getCriteriaValues()[0].getValues().toString().split(',').indexOf(modelCell.getValue());
    if (x === -1){
        let findCell = avtoSheet.getRange(1, 1, 1, avtoSheet.getLastColumn()).getValues()[0].indexOf(makerCell.getValue());
        if (findCell != - 1){
            findCell++;
            avtoSheet.getRange(2, findCell).getNextDataCell(SpreadsheetApp.Direction.DOWN).offset(1, 0).setValue(modelCell.getValue());
        }
    }
}

function addWorkTypeToList(){
    let x =  workTypeCell.getDataValidation().getCriteriaValues()[0].getValues().toString().split(',').indexOf(workTypeCell.getValue());
    if (x === -1){
        let findCell = workSheet.getRange(1, 1, 1, workSheet.getLastColumn()).getValues()[0].indexOf(workVidCell.getValue());

        if (findCell != - 1){
            findCell++;
            if (workSheet.getRange(2, findCell).getValue() == ''){
                workSheet.getRange(2, findCell).setValue(workTypeCell.getValue());
            } else {
                workSheet.getRange(1, findCell).getNextDataCell(SpreadsheetApp.Direction.DOWN).offset(1, 0).setValue(workTypeCell.getValue());
            }
        }
    }
}

function createValidationForModel(){
    let findCell = avtoSheet.getRange(1, 1, 1, avtoSheet.getLastColumn()).getValues()[0].indexOf(makerCell.getValue());
    if (findCell != -1){
        findCell++;
        modelCell.clearDataValidations();
        modelCell.setDataValidation(SpreadsheetApp.newDataValidation()
            .requireValueInRange(avtoSheet.getRange(2, findCell, avtoSheet.getRange(1, findCell).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow() + 1, 1), true)
            .build());
    }
}

function createValidationForWorkType(findValue,cellRange){
    let findCell = workSheet.getRange(1, 1, 1, workSheet.getLastColumn()).getValues()[0].indexOf(findValue);
    if (findCell != -1){
        findCell++;
        cellRange.clearDataValidations();
        cellRange.setDataValidation(SpreadsheetApp.newDataValidation()
            .requireValueInRange(workSheet.getRange(2, findCell, avtoSheet.getRange(1, findCell).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow() + 1, 1), true)
            .build());
    }
}

function analizeCarNumber(){
    let num = replaceEngSymb(String(nomerCell.getValue()).toUpperCase());
    let i = count(num, uchetSheet.getRange(2, 4, uchetSheet.getLastRow()).getValues());
    if (i != 0){
        nomerCell.offset(0, 1).setValue('Количество записей с таким номером: ' + i);
    } else {
        nomerCell.offset(0, 1).clearContent();
    }
}

function analizeVin(){
    if (vinCell.getValue() != ''){
        let vin = String(vinCell.getValue()).toUpperCase();
        let i = count(vin, uchetSheet.getRange(2, 5, uchetSheet.getLastRow()).getValues());
        if (i != 0){
            vinCell.offset(0, 1).setValue('Количество записей с таким VIN: ' + i);
        } else {
            vinCell.offset(0, 1).clearContent();
        }
    }
}


function createForOwner(){

    let vitagSheet = ss.getSheetByName('Выписка');
    let ownerName = vitagSheet.getRange(2, 1).getValue();
    let z = 5;
    vitagSheet.getRange(5, 1, vitagSheet.getLastRow(), vitagSheet.getLastColumn()).clear();
    let ownerArr = uchetSheet.getRange(2, 12,uchetSheet.getLastRow()).getValues();
    for (i=0;i<ownerArr.length;i++){
        if (ownerArr[i] == ownerName){
            uchetSheet.getRange(i + 2, 1, 1, 14).copyTo(vitagSheet.getRange(z++, 1));
        }
    }
    vitagSheet.getRange(5, 1, z, 14).sort({column: 8, ascending: false});
    vitagSheet.getRange(5, 1, vitagSheet.getLastRow(), vitagSheet.getLastColumn()).clearDataValidations();
    addSumToVitag();

    autoFitAllColumns(vitagSheet);

}

function createForNomer(){

    let vitagSheet = ss.getSheetByName('Выписка');
    let nomerAvto = vitagSheet.getRange(2, 2).getValue();
    let z = 5;
    vitagSheet.getRange(5, 1, vitagSheet.getLastRow(), vitagSheet.getLastColumn()).clear();
    let nomerArr = uchetSheet.getRange(2, 4,uchetSheet.getLastRow()).getValues();
    for (i=0;i<nomerArr.length;i++){
        if (nomerArr[i] == nomerAvto){
            uchetSheet.getRange(i + 2, 1, 1, 14).copyTo(vitagSheet.getRange(z++, 1));
        }
    }
    vitagSheet.getRange(5, 1, z, 14).sort({column: 8, ascending: false});
    vitagSheet.getRange(5, 1, vitagSheet.getLastRow(), vitagSheet.getLastColumn()).clearDataValidations();
    autoFitAllColumns(vitagSheet);
    addSumToVitag();

}

function createForVin(){

    let vitagSheet = ss.getSheetByName('Выписка');
    let vin = vitagSheet.getRange(2, 3).getValue();
    let z = 5;
    vitagSheet.getRange(5, 1, vitagSheet.getLastRow(), vitagSheet.getLastColumn()).clear();
    let vinArr = uchetSheet.getRange(2, 5,uchetSheet.getLastRow()).getValues();
    for (i=0;i<vinArr.length;i++){
        if (vinArr[i] == vin){
            uchetSheet.getRange(i + 2, 1, 1, 14).copyTo(vitagSheet.getRange(z++, 1));
        }
    }
    vitagSheet.getRange(5, 1, z, 14).sort({column: 8, ascending: false});
    vitagSheet.getRange(5, 1, vitagSheet.getLastRow(), vitagSheet.getLastColumn()).clearDataValidations();
    autoFitAllColumns(vitagSheet);
    addSumToVitag();
}

function searchOilChange(){
    let arr = uchetSheet.getRange(2, 11,uchetSheet.getLastRow() -2, 1).getValues();
    let date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    let str = 'Более года наза было заменено масло:<br>';
    for (i=0;i<arr.length;i++){
        if (arr[i] == 'Замена масла'){
            if (new Date(uchetSheet.getRange(i + 2, 8).getValue()) < date && uchetSheet.getRange(i+2, 18).getValue() == ''){
                str = str + ' <br>' + uchetSheet.getRange(i + 2, 12).getValue() + ' ' + uchetSheet.getRange(i + 2, 2).getValue() +
                    ' ' + uchetSheet.getRange(i + 2, 3).getValue() + '. Номер телефона: <a href="tel:0' + uchetSheet.getRange(i + 2, 13).getValue() +
                    '">0' + uchetSheet.getRange(i + 2, 13).getValue() + "</a>";
                uchetSheet.getRange(i + 2, 18).setValue('sended');
            }
        }
    }
    if (str != 'Более года наза было заменено масло:<br>'){
        sendMail(str);
    }
}

function sendMail(message){
    let dt = new Date();
    dt = dt.getDate() + '.' + (dt.getMonth() + 1) + '.' + dt.getFullYear();
    MailApp.sendEmail({
        to: 'maximbirukov77@gmail.com',
        subject: 'Оповещение о замене масла на ' + dt,
        htmlBody: 'Добрый день! <br><br>' + message + '<br><br>' +
            'Набери им!'
    })
}

function twsr(){
    let ui = SpreadsheetApp.getUi();
    let phon = String(phoneCell.getValue());
    let indicate = 0;
    clearFilter();
    clearSubTotalFormulas();
    if (phon.length === 0 || phon.length === 9){
        let checkArr = [makerCell,modelCell,nomerCell,vinCell];
        for (i = 0; i < checkArr.length; i++){if (checkArr[i].getValue() != ''){indicate = 1}}
        if (indicate === 1){
            let arr = uchetSheet.getRange(1, 1, 1, uchetSheet.getLastColumn()).getValues()[0];
            let id = uchetSheet.getRange(2,1).getValue() + 1;
            let dat = new Date();
            dat = dat.getDate() + '.' + (dat.getMonth()+1) + '.' + dat.getFullYear();
            let num = replaceEngSymb(String(nomerCell.getValue()).toUpperCase());
            let vin = String(vinCell.getValue()).toUpperCase();
            let searchArr = [/*записи*/, "Марка", "Модель", "Гос номер", "VIN", /Пробег*/, "Год", "Дата ТО", "Сумма", "Вид работы", "Тип работы", "Владелец", "Телефон"]
            let addArr = [id, makerCell.getValue(), modelCell.getValue(), num, vin, probegCell.getValue(), yearCell.getValue(), dat, summCell.getValue(),
                workVidCell.getValue(), workTypeCell.getValue(), ownerCell.getValue(), phoneCell.getValue()]
            let whatAddArr = [[1,2,3,4,5,6,7,8,9,10,11,12]];
            for (i = 0; i < searchArr.length; i++){
                let x = find(searchArr[i],arr);
                whatAddArr[0][x] = addArr[i]
            }
            let x = uchetSheet.getLastRow();
            uchetSheet.getRange(x,1, 1, 14).setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
            uchetSheet.getRange(x,1, 1, 1).setNumberFormat('0');
            uchetSheet.getRange(x,2, 1, 4).setNumberFormat('@');
            uchetSheet.getRange(x,6, 1, 2).setNumberFormat('0');
            uchetSheet.getRange(x,8, 1, 1).setNumberFormat('dd mmmm yyyy');
            uchetSheet.getRange(x,9, 1, 1).setNumberFormat('#,##0');
            uchetSheet.getRange(x,10, 1, 3).setNumberFormat('@');
            uchetSheet.getRange(x,13, 1, 1).setNumberFormat('"0"0');
            uchetSheet.getRange(x,14, 1, 1).setNumberFormat('@');
            uchetSheet.getRange(uchetSheet.getLastRow() + 1, 1, 1, searchArr.length).setValues(whatAddArr);
            phoneCell.setBackground(null);
            claerMainCells();
            nomerCell.offset(0, 1).clearContent();
            nomerCell.offset(2, 1).clearContent()
            uchetSheet.getRange(2, 1, x, uchetSheet.getLastColumn()).sort({column: 1, ascending: false});
        } else {
            ui.alert("Указано слишком мало данных");
        }
    } else {
        ui.alert("Неправильный формат номера телефона");
        phoneCell.setBackground('#ff0000');
    }
}
