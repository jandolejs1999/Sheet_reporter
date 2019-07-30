/* HomeLED

https://script.google.com/macros/s/AKfycbzZJqzfHHpzittJzD1cldv_hNi8MjEVtUOplIXUWumCO2kKvd91/exec
https://script.google.com/macros/s/AKfycbzZJqzfHHpzittJzD1cldv_hNi8MjEVtUOplIXUWumCO2kKvd91/exec?type=1&note=ping&proj=homeled
https://script.google.com/macros/s/AKfycbzZJqzfHHpzittJzD1cldv_hNi8MjEVtUOplIXUWumCO2kKvd91/exec?type=-1&proj=browser&note=test,%20zkouška&

 */

var Sheet_ID = "1aEbCdOxYq2LalEMmNKb_MugKUkqUBYi9fSOhFC0cofM"
var ss = SpreadsheetApp.openById(Sheet_ID);

function doGet(e) {

    console.info(e);

    if (e == undefined) {e = {}; e.parameters = {proj:"editor", type:"-1", note:"TEST"}; }
    if (!e.parameters.proj) return ContentService.createTextOutput("0 - unauthorized - use some device name (?proj=name)");

    var saved = save(e);

    if (e.parameter.proj == "GardenJ") {return ContentService.createTextOutput(SpreadsheetApp.openById(Sheet_ID).getSheetByName("GardenJ").getRange("I3").getValue()); }
    if (e.parameter.proj ==  "HomeR" ) {return ContentService.createTextOutput(SpreadsheetApp.openById(Sheet_ID).getSheetByName( "HomeR" ).getRange("I3").getValue()); }

    return ContentService.createTextOutput(saved);
}

function save(e) {

    var _proj = e.parameter.proj;
    var _type = e.parameter.type;
    var _note = e.parameter.note;
    var _temp = e.parameter.temp;
    var _humi = e.parameter.humi;

    var Sheet_name = _proj;
    var Loger_name = "Log";
    var Archive_name = "Archive";
    var _time = new Date();
    var sh = ss.getSheetByName(Sheet_name); // sheet
    var sl = ss.getSheetByName(Loger_name);      // log
    var sa = ss.getSheetByName(Archive_name); // sheet

    if (!sh) {sh = newSheet( Sheet_name ); }
    if (!sl) {sl = newSheet( Loger_name ); }
    if (!sa) {sa = newSheet(Archive_name); }

    var row = 4; // číslo nového řádku

    sl.insertRowBefore(row);
    sl.getRange("A"+row).setValue(_time);
    sl.getRange("B"+row).setValue(e.queryString);

    if (_type == "init") return;
    if (_note == "ping" && sh.getRange("J3").getValue() != "Yes") return;

    var _interval = sh.getRange("I3").getValue();
    deleteOld(sh, _interval);

    sh.insertRowBefore(row); sa.insertRowBefore(row);
    sh.getRange("D1").setValue(_time); sa.getRange("D1").setValue(_time);

    sh.getRange("A"+row).setValue(_time);       sa.getRange("A"+row).setValue(_time);
    sh.getRange("B"+row).setValue(_type);       sa.getRange("B"+row).setValue(_type);
    sh.getRange("C"+row).setValue(_note);       sa.getRange("C"+row).setValue(_note);
    sh.getRange("D"+row).setValue(_proj);       sa.getRange("D"+row).setValue(_proj);
    sh.getRange("E"+row).setValue("=(A4-A5)");
    sh.getRange("F"+row).setValue(_humi);       sa.getRange("F"+row).setValue(_humi);
    sh.getRange("G"+row).setValue(_temp);       sa.getRange("G"+row).setValue(_temp);

    return true;
}

function newSheet(Sheet_name) {

    _newSheet = ss.insertSheet();
    _newSheet.setName(Sheet_name);

    _newSheet.getRange("A1").setValue("Device name:");
    _newSheet.getRange("B1").setValue(  Sheet_name  );
    _newSheet.getRange("C1").setValue("Last entry:" );

    _newSheet.getRange("A2").setValue("Since last seen:");
    _newSheet.getRange("B2").setValue( "=((NOW())-D1)"  );

    _newSheet.getRange("A3").setValue("Time");
    _newSheet.getRange("B3").setValue("Type");
    _newSheet.getRange("C3").setValue( "Message" );
    _newSheet.getRange("D3").setValue("Device ID");
    _newSheet.getRange("E3").setValue( "Delayed" );
    _newSheet.getRange("F3").setValue("Humi");
    _newSheet.getRange("G3").setValue("Temp");

    _newSheet.getRange("I1").setValue("Setting");
        _newSheet.getRange("I2").setValue("Interval [sec]");
        _newSheet.getRange("I3").setValue("60");
    _newSheet.getRange("J1").setValue("Setting");
        _newSheet.getRange("J2").setValue("Log ping");
        _newSheet.getRange("J3").setValue("1");

    return _newSheet;
}

function deleteOld(sheet, interval) {
    try{
        if (sheet.getMaxRows() < 14) return;
        var count = sheet.getMaxRows();
        lastRow = (1440/(interval/60));
        sheet.deleteRows(lastRow, count - lastRow);
    } catch (err){}
}
