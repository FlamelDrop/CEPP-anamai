// client\assessment\tambonAssessementCM.js
Template.tambonAssessmentCM.onCreated(function init() {
    // console.log('clientassessment\tambonAssessementCM.js ====> onCreated.');
    $('body').addClass('waitMe_body');
    var elem = $(
        '<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>'
    );
    $('body').prepend(elem);
    Meteor.call('serverDate', new Date(), function (error, result) {
        // Session.set('serverDate',result);
        //console.log(Session.get('serverDate'));
        let todayYear = result.getFullYear() + 543; // ปีพุทธศักราช พ.ศ.
        let todayMonth = new Date().getMonth() + 1; // 0...11 ==> 1..12
        if (todayMonth >= 10) {
            todayYear++;
        }
        Session.set('todayYear', todayYear);
    });
});

Template.tambonAssessmentCM.onRendered(function () {
    // console.log('clientassessment\tambonAssessementCM.js ====> onRendered.');
    let cmid = Session.get('cmid');
    // console.log(cmid);
    Meteor.call(
        'tambonAssessmentCM',
        Session.get('cmid'),
        function (error, result) {
            // console.table(result);
            //Session.set('centerID', result[0]);
            Session.set('currentData', result);
        }
    );
    let todayYear = new Date().getFullYear() + 543; // ปีพุทธศักราช พ.ศ.
    let todayMonth = new Date().getMonth() + 1; // 0...11 ==> 1..12
    if (todayMonth >= 10) {
        todayYear++;
    }
    Session.set('todayYear', todayYear);
    $('#kkk').hide();
    $('body').removeClass('waitMe_body');
});

Template.tambonAssessmentCM.helpers({
    currentData() {
        return Session.get('currentData');
    },
    verdictStyle(verdict) {
        if (verdict == 'ไม่ผ่านเกณฑ์') {
            return 'color:red;';
        } else if (verdict == 'ผ่านเกณฑ์') {
            return 'color:green;';
        } else {
            return 'color:orange';
        }
    },
    joinYearOptions() {
        //console.log(this);
        // console.log(arguments);
        // joinYear === 0 ไม่ระบุ
        // joinYear === -1 ไม่เข้าร่วม
        //console.log(this);
        // console.log(arguments);
        let ID = this.ID;
        let assessYear = this.assessYear;
        let yearStart = 2559; //
        let todayYear = Session.get('todayYear');
        let yearScope = todayYear - yearStart + 1;
        if (yearScope < 6) {
            yearScope = 6;
        } // minimum year scope
        // array of numbers
        let yearRange = Array.from(
            { length: yearScope },
            (item, index) => yearStart + index
        );
        //$('#joinyear_'+ID).append( "<option value=0>ไม่ระบุ</option>");
        // console.log(`yearStart=${yearStart} yearScope=${yearScope}`);
        // console.log("yearRange ------------ ");
        // console.log(yearRange);
        let yearOptions = '';

        selectedYear = parseInt(this.joinYear) || 0;
        //console.log(`ID=${ID} selectedYear = ${typeof(selectedYear)} -> ${selectedYear}`)
        let flag = false;
        yearRange.forEach((item, index) => {
            yearOptions += `<option value=${item} `;
            //console.log(`item = ${typeof(item)} ==> ${item}`);
            if (item === selectedYear) {
                yearOptions += ' selected ';
                flag = true;
            }
            yearOptions += ` >${item}</option>`;
            //$('#joinyear_'+ID).append(yearOption);
        });
        if (selectedYear === 0) {
            yearOptions += '<option selected value=0>ไม่ระบุ</option>';
        } else {
            yearOptions += '<option value=0>ไม่ระบุ</option>';
        }
        if (selectedYear === -1) {
            yearOptions =
                '<option selected value=-1>ไม่เข้าร่วม</option>' + yearOptions;
        } else {
            yearOptions = '<option value=-1>ไม่เข้าร่วม</option>' + yearOptions;
        }

        return yearOptions;
    },
    assessYearOptions() {
        //console.log(this);
        // console.log(arguments);
        let ID = this.ID;
        let assessYear = this.assessYear;
        let yearStart = 2559; //
        let todayYear = Session.get('todayYear');
        let yearScope = todayYear - yearStart + 1;
        if (yearScope < 6) {
            yearScope = 6;
        } // minimum year scope
        // array of numbers
        let yearRange = Array.from(
            { length: yearScope },
            (item, index) => yearStart + index
        );
        //$('#joinyear_'+ID).append( "<option value=0>ไม่ระบุ</option>");
        // console.log(`yearStart=${yearStart} yearScope=${yearScope}`);
        // console.log("yearRange ------------ ");
        // console.log(yearRange);
        let yearOptions = '';
        let selectedYear = parseInt(assessYear) || 0;
        //console.log(`ID=${ID} selectedYear = ${typeof(selectedYear)} -> ${selectedYear}`)

        let flag = false;
        yearRange.forEach((item, index) => {
            yearOptions += `<option value=${item} `;
            //console.log(`item = ${typeof(item)} ==> ${item}`);
            if (item === selectedYear) {
                yearOptions += ' selected ';
                flag = true;
            }
            yearOptions += ` >${item}</option>`;
        });
        if (flag === true) {
            yearOptions += '<option  value=0>ไม่ระบุ</option>';
        } else {
            yearOptions += '<option selected value=0>ไม่ระบุ</option>';
        }
        return yearOptions;
    },
});

Template.tambonAssessmentCM.events({
    'change .update_tambol_data'() {
        // console.log("update_tambol_data-------------++++++++++");
        // showRowData(this);
        $('body').addClass('waitMe_body');
        var elem = $(
            '<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>'
        );
        $('body').prepend(elem);
        // console.log(arguments);
        // let dataCurrentRow = getRowData(this.ID);
        var rowData = [];
        let ID = this.ID;
        rowData.ID = this.ID;
        rowData.joinYear = parseInt($('#joinyear_' + ID).val());
        rowData.assessYear = parseInt($('#assessyear_' + ID).val());
        rowData.c1 = $('#c1_' + ID).prop('checked');
        rowData.c2 = $('#c2_' + ID).prop('checked');
        rowData.c3 = $('#c3_' + ID).prop('checked');
        rowData.c4 = $('#c4_' + ID).prop('checked');
        rowData.c5 = $('#c5_' + ID).prop('checked');
        rowData.c6 = $('#c6_' + ID).prop('checked');
        rowData.verdict = $('#verdict_' + ID)
            .text()
            .trim();
        rowData.remark = $('#remark_' + ID)
            .val()
            .trim();
        //console.log("rowData.... before calculation"); showRowData(rowData);
        // calculate verdict บรรทัดฐานการตัดสิน
        // 1. ถ้า assessYear เป็น 0 (ไม่ระบุ) ==> c1-c6 เป็น false && verdict = "ไม่ผ่านเกณฑ์"
        // 2. ถ้ามีการปรับเปลี่ยน ปีงบประมาณที่ประเมิน ==> c1-c6 เป็น false และ verdict = "ไม่ผ่านเกณฑ์"
        // 2. assessYear เกิน 3 ปี ==> c1-c6 เป็น false && verdict = "ประเมินซ้ำ"
        // 3. assessYear ไม่เกิน 3 ปี && c1-c6 เป็น true ==> verdict ="ผ่านเกณฑ์"
        let todayYear = Session.get('todayYear');
        if (rowData.assessYear === 0) {
            rowData.verdict = 'ไม่ผ่านเกณฑ์';
            rowData.c1 = false;
            rowData.c2 = false;
            rowData.c3 = false;
            rowData.c4 = false;
            rowData.c5 = false;
            rowData.c6 = false;
        } else if (todayYear - rowData.assessYear > 3) {
            rowData.c1 = false;
            rowData.c2 = false;
            rowData.c3 = false;
            rowData.c4 = false;
            rowData.c5 = false;
            rowData.c6 = false;
            rowData.verdict = 'ประเมินซ้ำ';
        } else if (
            rowData.c1 &&
            rowData.c2 &&
            rowData.c3 &&
            rowData.c4 &&
            rowData.c5 &&
            rowData.c6
        ) {
            rowData.verdict = 'ผ่านเกณฑ์';
        } else {
            rowData.verdict = 'ไม่ผ่านเกณฑ์';
        }
        // console.log("calculateVerdict   -------------------------------------");
        // showRowData(rowData);

        Meteor.call(
            'updateTambonAssessmentCM',
            Session.get('cmid'),
            { ...rowData },
            function (error, result) {
                delete result._id;
                // console.log("Finishing update from server ! ! !          result ==========>");
                // console.table(result);

                let currentData = Session.get('currentData');
                currentData.forEach((item, index, self) => {
                    if (currentData[index].ID === result.ID) {
                        // console.log("updating . . .currentData");
                        // console.log(currentData[index]);
                        result.name = item.name;
                        currentData[index] = result;
                        //console.log(currentData[index]);
                    }
                });
                Session.set('currentData', currentData);
                $('body').removeClass('waitMe_body');
                //alert("Finish resetting ... please logout", test);
                //location.reload();
            }
        );
    },
});

const showRowData = (row) => {
    console.log(
        `${row.ID} ${row.joinYear} ${row.assessYear} ${row.c1} ${row.c2} ${row.c3} ${row.c4} ${row.c5} ${row.c6} ${row.verdict}`
    );
};
