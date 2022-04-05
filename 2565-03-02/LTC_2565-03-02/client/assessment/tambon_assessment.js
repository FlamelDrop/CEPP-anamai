// file location: client/assessment/tambon_assessment.js
// Version 2564.10.08
// 2564-10-08 แก้ไข joinYear, dropdown หาย
// toDos:
//      - #find     ==> under construction
//      - ทำรายงาน excel
// - when year change, verdict data must change automatically 


Template.tambon_assessment.onCreated(function () {
    console.log("Template.tambon_assessment.onCreated ===> oncreated");
    let userlogin = Session.get('user');
    userlogin.userRole = userlogin.RULE;
    // การแสดงผลข้อมูล user ที่ด้านบนขวาของหน้าจอ
    if (userlogin.userRole === "HPC") {
        userlogin.showName = userlogin.NAME;
    } else if (userlogin.userRole === "PROVINCE") {
        userlogin.showName = "จังหวัด" + userlogin.PROVINCENAME;
    } else {
        userlogin.showName = "No user";
    }
    Session.set('user', userlogin);
    //console.log(`username: ${userlogin.USERNAME}  role: ${userRole} ==> Province user`);
    
    Meteor.call('tambon_assessment_init', userlogin, function (error, result) {

        Session.set('provinces', result[0]);    // จังหวัดทั้งหมดใน scope ที่กำหนด
        Session.set('amphoes', result[1]);      // อำเภอทั้งหมดใน scope ที่กำหนด
        Session.set('tambons', result[2]);      // ตำบลทั้งหมดใน scope ที่กำหนด
        Session.set('assessment', result[3]);   // การประเมินแต่ละตำบล ขนาดเท่ากับ tambons

        initSelection();    // เลือก จังหวัด และ อำเภอ ทั้งหมด
        constructDropdownMenuProvince();
        constructTambonAssessment();        // tambonAssessment เก็บข้อมูล การประเมินทั้งหมดของ scope 
        constructCurrentData();             // สำหรับ แสดงข้อมูลในหน้า เพจ ปัจจุบัน


    });
    Meteor.call('serverDate', new Date(), function (error, result)  {
        //Session.set('serverDate',result);
        //console.log(Session.get('serverDate'));
        let todayYear = result.getFullYear() + 543;   // ปีพุทธศักราช พ.ศ.
        let todayMonth = new Date().getMonth() + 1;  // 0...11 ==> 1..12
        if (todayMonth >= 10) { todayYear++; }
        Session.set('todayYear', todayYear);
    });

})


Template.tambon_assessment.onRendered(function () {
    console.log("Template.tambon_assessment.onRendered ===> onRendered");
    //constructTambonAssessment();        
})

Template.tambon_assessment.helpers({
    link2firstPage() {
        return  (Session.get('user').RULE === "HPC");
    },
    user() {
        //return Session.get('user').NAME || "No user";
        return Session.get('user').showName || "No user";
    },
    zone1() {
        if (Session.get('user').RULE === "HPC")
            return "ศูนย์อนามัยที่ " + Session.get('user').ZONE || "No zone";
        if (Session.get('user').RULE === "PROVINCE")
            return Session.get('user').showName;
    },
    zone() {
        return Session.get('user').ZONE + '123' || "No zone";
    },
    totalPages() {
        return Math.ceil((Session.get('currentData')).length / 10);
    },
    currentPage() {
        return Session.get('currentPage');
    },

    focusedTambons() {
        return (Session.get('currentData')).length || 0; //จำนวนตำบล
    },
    tambonInZone() {
        return (Session.get('tambonAssessment')).length || 0; //จำนวนตำบล
    },
    currentPageData() {
        return Session.get('currentPageData');
    },
    verdictStyle(verdict) {
        if (verdict == "ไม่ผ่านเกณฑ์") {
            return "color:red;";
        } else if (verdict == "ผ่านเกณฑ์") {
            return "color:green;";
        } else {
            return "color:orange";
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
        if (yearScope<6) { yearScope=6;}   // minimum year scope    
        // array of numbers
        let yearRange = Array.from({ length: yearScope }, (item, index) => yearStart + index); 
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
                yearOptions += " selected ";
                flag = true;
            }
            yearOptions += ` >${item}</option>`;
            //$('#joinyear_'+ID).append(yearOption);
        });
        if (selectedYear === 0) {
            yearOptions += "<option selected value=0>ไม่ระบุ</option>";
        } else {
            yearOptions += "<option value=0>ไม่ระบุ</option>";
        }
        if (selectedYear === -1) {
            yearOptions = "<option selected value=-1>ไม่เข้าร่วม</option>" + yearOptions;
        } else {
            yearOptions = "<option value=-1>ไม่เข้าร่วม</option>" + yearOptions;
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
        if (yearScope<6) { yearScope=6;}   // minimum year scope      
        
        // array of numbers
        let yearRange = Array.from({ length: yearScope }, (item, index) => yearStart + index); 
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
                yearOptions += " selected ";
                flag = true;
            }
            yearOptions += ` >${item}</option>`;
        });
        if (flag === true) {
            yearOptions += "<option  value=0>ไม่ระบุ</option>";
        } else {
            yearOptions += "<option selected value=0>ไม่ระบุ</option>";
        }
        return yearOptions;
    },

    attendedTambons() {
        return Session.get('tambonAssessment').filter((item) => item.joinYear > 0).length || -1;
    },
    verdictPass() {
        return Session.get('tambonAssessment').filter((item) => item.verdict === 'ผ่านเกณฑ์').length || -1;
    },
    attendedPercentage() {
        return ((Session.get('tambonAssessment').filter((item) => item.joinYear > 0).length * 100) / Session.get('tambonAssessment').length).toFixed(2) || -1;
    },
    verdictPassPercentage() {
        return ((Session.get('tambonAssessment').filter((item) => item.verdict === 'ผ่านเกณฑ์').length * 100) / Session.get('tambonAssessment').length).toFixed(2) || -1;
    },


    c1Check() {
        return Session.get('todayYear') - this.assessYear > 3 ? "disabled" : "";
    },
    c2Check() {
        return Session.get('todayYear') - this.assessYear > 3 ? "disabled" : "";
    },
    c3Check() {
        return Session.get('todayYear') - this.assessYear > 3 ? "disabled" : "";
    },
    c4Check() {
        return Session.get('todayYear') - this.assessYear > 3 ? "disabled" : "";
    },
    c5Check() {
        return Session.get('todayYear') - this.assessYear > 3 ? "disabled" : "";
    },
    c6Check() {
        return Session.get('todayYear') - this.assessYear > 3 ? "disabled" : "";
    },
    remarkCheck() {
        return "";
    },

})

Template.tambon_assessment.events({
    'click #download'() {
        let username = Session.get('user').USERNAME;
        let chosenProvinceID = Session.get('selection').chosenProvinceID;
        let chosenAmphoeID = Session.get('selection').chosenAmphoeID;
        window.location.assign(window.location.origin + '/xlstambonassessment/' + username + '/' + chosenProvinceID + '/' + chosenAmphoeID);
    },

    "change #chooseProvince"() {
        // console.log(arguments);
        // $('#find').val('');
        let chosenProvinceID = parseInt($('#chooseProvince').val());
        let selection = Session.get('selection');
        selection.chosenProvinceID = chosenProvinceID;
        Session.set('selection', selection);
        console.log(`chosenProvinceID = ${typeof (chosenProvinceID)}  -> ${chosenProvinceID}`);
        updateOnProvinceChange();
    },
    "change #chooseAmphoe"() {
        //console.log(arguments);
        let chosenAmphoeID = parseInt($('#chooseAmphoe').val());
        let selection = Session.get('selection');
        selection.chosenAmphoeID = chosenAmphoeID;
        Session.set('selection', selection);
        updateOnAmphoeChange();
    },
    'click #next': function () {

        let currentPage = Session.get('currentPage');
        let maxPage = Math.ceil((Session.get('currentData')).length / 10);
        let nextPage = currentPage + 1;
        //console.log(currentPage, maxPage, nextPage);
        if (nextPage <= maxPage) {
            $('#page').val(nextPage);
            Session.set('currentPage', nextPage);
            //console.log(Session.get('currentPage'))
            currentTambons = Session.get('currentData');
            let fieldStart = ((Session.get('currentPage')) - 1) * 10;
            Session.set('currentPageData', currentTambons.slice(fieldStart, fieldStart + 10)); //ข้อมูลแสดงผลหน้าปัจจุบัน ไม่เกิน 10 ตำบล
        }
    },
    'click #prev': function () {
        let currentPage = Session.get('currentPage');
        let previousPage = currentPage - 1;
        if (previousPage >= 1) {
            $('#page').val(previousPage);
            Session.set('currentPage', previousPage);
            //console.log(Session.get('currentPage'))
            currentTambons = Session.get('currentData');
            let fieldStart = ((Session.get('currentPage')) - 1) * 10;
            Session.set('currentPageData', currentTambons.slice(fieldStart, fieldStart + 10)); //ข้อมูลแสดงผลหน้าปัจจุบัน ไม่เกิน 10 ตำบล
        }
    },
    'click #first': function () {
        $('#page').val(1);
        Session.set('currentPage', 1);
        let currentTambons = Session.get('currentData');
        let fieldStart = ((Session.get('currentPage')) - 1) * 10;
        Session.set('currentPageData', currentTambons.slice(fieldStart, fieldStart + 10));
    },
    'click #last': function () {
        let maxPage = Math.ceil((Session.get('currentData')).length / 10);
        $('#page').val(maxPage);
        Session.set('currentPage', maxPage);
        let currentTambons = Session.get('currentData');
        let fieldStart = ((Session.get('currentPage')) - 1) * 10;
        Session.set('currentPageData', currentTambons.slice(fieldStart, fieldStart + 10));
    },
    'change #page': function () {
        let maxPage = Math.ceil((Session.get('currentData')).length / 10);
        let pageChange = parseInt($('#page').val());
        let currentPage = Session.get('currentPage');
        console.log(maxPage, pageChange);
        if (pageChange === NaN || pageChange < 1 || pageChange > maxPage) {
            $('#page').val(currentPage);
            return;
        }

        Session.set('currentPage', pageChange);
        let currentTambons = Session.get('currentData');
        let fieldStart = ((Session.get('currentPage')) - 1) * 10;
        Session.set('currentPageData', currentTambons.slice(fieldStart, fieldStart + 10));
    },

    'change #find'() {
        alert("Under Constuction");

        // var ID = Session.get('user').ZONE;
        // Session.set('skip_eva', 0);
        // var search = $('#find').val()
        // var provinceSet = hpcprovince(ID)
        // Session.set('isHpcEvaSearchTxtBox', search)
        // Meteor.call('hpcSearchEvaLTC', provinceSet, Session.set('skip_eva'), 10, search, function (err, result) {
        //     Session.set('HpcDistData', result);
        //     Session.set('skip_eva', 0)
        // })
        // Meteor.call('hpcSearchEvaLTC_COUNT', provinceSet, search, function (err, result) {
        //     Session.set('getDISTRICT_COUNT', result)
        // })
    },

    "change .update_tambol_data"() {
        console.log("update_tambol_data-------------++++++++++");
        showRowData(this);
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        // console.log(arguments);
        // let dataCurrentRow = getRowData(this.ID);
        var rowData = [];
        let ID = this.ID;
        rowData.ID = this.ID;
        rowData.joinYear = parseInt($("#joinyear_" + ID).val());
        rowData.assessYear = parseInt($("#assessyear_" + ID).val());
        rowData.c1 = $("#c1_" + ID).prop('checked');
        rowData.c2 = $("#c2_" + ID).prop('checked');
        rowData.c3 = $("#c3_" + ID).prop('checked');
        rowData.c4 = $("#c4_" + ID).prop('checked');
        rowData.c5 = $("#c5_" + ID).prop('checked');
        rowData.c6 = $("#c6_" + ID).prop('checked');
        rowData.verdict = $("#verdict_" + ID).text().trim();
        rowData.remark = $("#remark_" + ID).val().trim();
        console.log("rowData.... before calculation"); showRowData(rowData);
        // calculate verdict บรรทัดฐานการตัดสิน
        // 1. ถ้า assessYear เป็น 0 (ไม่ระบุ) ==> c1-c6 เป็น false && verdict = "ไม่ผ่านเกณฑ์"
        // 2. ถ้ามีการปรับเปลี่ยน ปีงบประมาณที่ประเมิน ==> c1-c6 เป็น false และ verdict = "ไม่ผ่านเกณฑ์"
        // 2. assessYear เกิน 3 ปี ==> c1-c6 เป็น false && verdict = "ประเมินซ้ำ"
        // 3. assessYear ไม่เกิน 3 ปี && c1-c6 เป็น true ==> verdict ="ผ่านเกณฑ์"
        let todayYear = Session.get('todayYear');
        if (rowData.assessYear === 0) {
            rowData.verdict = "ไม่ผ่านเกณฑ์";
            rowData.c1 = false; rowData.c2 = false; rowData.c3 = false; rowData.c4 = false; rowData.c5 = false; rowData.c6 = false;
        } else if ((todayYear - rowData.assessYear) > 3) {
            rowData.c1 = false; rowData.c2 = false; rowData.c3 = false; rowData.c4 = false; rowData.c5 = false; rowData.c6 = false;
            rowData.verdict = "ประเมินซ้ำ"
        } else if (rowData.c1 && rowData.c2 && rowData.c3 && rowData.c4 && rowData.c5 && rowData.c6) {
            rowData.verdict = "ผ่านเกณฑ์";
        } else {
            rowData.verdict = "ไม่ผ่านเกณฑ์";
        }
        console.log("calculateVerdict   -------------------------------------");
        showRowData(rowData);


        Meteor.call('updateTambonAssessment', Session.get('user'), { ...rowData }, function (error, result) {
            //Meteor.call('updateTambonAssessment', rowData, function (error, result) {
            //Meteor.call('updateTambonAssessment',{rowData}, function (error, result) {

            delete result._id;
            console.log("Finishing update from server ! ! !          result ==========>");
            console.log(result);
            // retrieve tambon from tambons
            let tambons = Session.get('tambons');
            let tambon = tambons.filter((item) => item.ID === result.ID)[0];
            console.log(`tambon =================`);
            console.log(tambon);
            result.name = tambon.name;
            result.amphoeID = tambon.amphoeID;
            //update reactive data in 
            //  1. tambonAssessment
            //  2. currentData
            //  3. currentPageData
            let tambonAssessment = Session.get('tambonAssessment');
            tambonAssessment.forEach((item, index, self) => {
                if (tambonAssessment[index].ID === result.ID) {
                    console.log("updating . . .tambonAssessment");
                    console.log(tambonAssessment[index]);
                    tambonAssessment[index] = result;
                    console.log(tambonAssessment[index]);
                };
            });
            Session.set('tambonAssessment', tambonAssessment);
            let currentData = Session.get('currentData');
            currentData.forEach((item, index, self) => {
                if (currentData[index].ID === result.ID) {
                    console.log("updating . . .currentData");
                    console.log(currentData[index]);
                    currentData[index] = result;
                    console.log(currentData[index]);
                }
            });
            Session.set('currentData', currentData);
            let startRow = (Session.get('currentPage') - 1) * 10;
            Session.set('currentPageData', currentData.slice(startRow, startRow + 10));
            $('body').removeClass('waitMe_body');
            //alert("Finish resetting ... please logout", test);
            //location.reload();

        })
    },
    "click #k_test"() {
        /*
        console.log("Calling ... k_test");
        console.time('reset1');
        Meteor.call('resetTambonAssessment', function (error, result) {
            console.timeEnd('reset1');
            alert("Finished ...")

        });
        */
    },
    "click #resetTambonAssessment"() {
        
        /*console.log("Resetting TambonAssessment ....");
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        console.time("resetTambonAssessment")
        Meteor.call('resetTambonAssessment', function (error, result) {
            let test = console.timeEnd('resetTambonAssessment');
            console.log(test);
            $('body').removeClass('waitMe_body');
            alert("Finish resetting ... back to home automatically.", test);
            location.reload();

        });
        */

    },
    "click #transferTambonAssessment"() {
        /*
        console.log("Transfering....");
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        console.time("transfer");
        Meteor.call('transferTambonAssessment', function (error, result) {
            console.timeEnd("transfer");
            $('body').removeClass('waitMe_body');
            alert("Finish transfering data ... please logout");
            location.reload();
        });
        */
    },
    "click #transferTambonAssessmentV2"() {
        /*
        console.log("Transfering.... v2");
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        console.time("transfer");
        Meteor.call('transferTambonAssessmentV2', function (error, result) {
            console.timeEnd("transfer");
            $('body').removeClass('waitMe_body');
            alert("Finish transfering data ... <br/> Back to index automatically");
            location.reload();
        });
        */
    },
    "click #transferTambonAssessmentV3"() {
        /*
        console.log("Transfering.... v3");
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        console.time("transfer");
        Meteor.call('transferTambonAssessmentV3', function (error, result) {
            console.timeEnd("transfer");
            $('body').removeClass('waitMe_body');
            alert("Finish transfering data ... \n Back to index automatically");
            location.reload();
        });
        */
    },

})

const constructDropdownMenuProvince = () => {
    let chosenProvinceID = Session.get('selection').chosenProvinceID;
    let provinces = Session.get('provinces');
    if (chosenProvinceID === 0) {
        //สร้าง dropdown สำหรับ จังหวัดในโซน
        provinces.forEach((item) => {
            $('#chooseProvince').append(
                `<option value=${parseInt(item.ID)}>${item.name}</option>`);
        });
    } else {
        $('#chooseProvince').empty();
        let provinceName = provinces.filter((item) => { return chosenProvinceID === item.ID; })[0].name;
        $('#chooseProvince').append(`<option value=${chosenProvinceID}>${provinceName}</option>`);
    }
}


const constructTambonAssessment = () => {

    //merge tambons and assessment
    let tambons = Session.get('tambons');
    let amphoes = Session.get('amphoes');
    let assessment = Session.get('assessment');
    let tambonAssessment = [];
    for (let i = 0, len = tambons.length; i < len; i++) {
        if (tambons[i].ID === assessment[i].ID) {
            tambonAssessment[i] = { ...tambons[i], ...assessment[i] };
        } else {
            console.log(i, tambons[i].ID, assessment[i].ID, " <== Not matched.");
        }

    }

    let userlogin = Session.get('user');
    if (userlogin.userRole === "PROVINCE") {
        let chosenProvinceID = Session.get('selection').chosenProvinceID;
        tambonAssessment = tambonAssessment.filter((item) => { //console.log(item.ID);
            return parseInt(item.ID / 10000) === chosenProvinceID;
        });
    }
    // การประเมินตำบลทั้งหมดใน scope ไว้คำนวณ ตำบลทั้งหมด ด้านบนซ้าย
    Session.set('tambonAssessment', tambonAssessment);
}

const constructCurrentData = () => {
    console.log("contructCurrentData . . .");
    let tambonAssessment = Session.get('tambonAssessment');
    let chosenProvinceID = Session.get('selection').chosenProvinceID;
    let currentData = tambonAssessment;
    if (chosenProvinceID != 0) {
        updateOnProvinceChange();
    }
    Session.set('currentData', currentData);
    Session.set('totalPages', Math.ceil(currentData.length / 10)); // คำนวณจำนวนหน้าทั้งหมด
    Session.set('currentPage', 1);                  // เริ่มต้นหน้าแรก คือ 1
    Session.set('currentPageData', currentData.slice(((Session.get('currentPage')) - 1) * 10, 10));
}


const updateOnProvinceChange = () => {
    // establish Amphoe dropdown menu

    let chosenProvinceID = parseInt(Session.get('selection').chosenProvinceID);
    console.log("updateOnProvinceChange --> ", chosenProvinceID);
    $('#find').val('');
    if (chosenProvinceID === 0) {
        $('#chooseAmphoe').attr("disabled", true);
        initSelection();
        $('#chooseAmphoe').empty();
        $('#chooseAmphoe').append("<option value='0'>[เลือกทุกอำเภอ]</option>");
        // นำข้อมูลทั้งหมด จาก tambonAssessment ไปเก็บที่ currentData
        tambonAssessment = Session.get('tambonAssessment');
        Session.set('currentData', tambonAssessment);
    } else {
        $('#chooseAmphoe').attr("disabled", false);
        let amphoeInZone = Session.get('amphoes');
        let amphoeInProvince = amphoeInZone.filter((item) => { return parseInt(item.provinceID) === chosenProvinceID; });
        $('#chooseAmphoe').empty();
        $('#chooseAmphoe').append("<option value='0'>[เลือกทุกอำเภอ]</option>");
        amphoeInProvince.sort((a, b) => { return a.ID - b.ID; });
        amphoeInProvince.forEach((item) => {
            $('#chooseAmphoe').append(`<option value=${item.ID}>${item.name}</option>`);
        });
        $('#chooseAmphoe').removeAttr('disabled');
        //console.log(amphoeInProvince);
        let amphoeIDs = amphoeInProvince.map((item) => { return item.ID; });
        //console.log(amphoeIDs);
        let tambonAssessment = Session.get('tambonAssessment');
        currentTambons = tambonAssessment.filter((item) => { return amphoeIDs.includes(item.amphoeID); });
        Session.set('currentData', currentTambons);
    }
    //ข้อมูลแสดงผลหน้าปัจจุบัน ไม่เกิน 10 ตำบล
    $('#page').val(1);
    Session.set('currentPage', 1);
    Session.set('currentPageData', (Session.get('currentData')).slice(((Session.get('currentPage')) - 1) * 10, 10));
}

const updateOnAmphoeChange = () => {
    $('#find').val('');
    let chosenProvinceID = Session.get('selection').chosenProvinceID;
    let chosenAmphoeID = Session.get('selection').chosenAmphoeID;
    let tambonAssessment = Session.get('tambonAssessment');
    let currentData = Session.get('currentData');
    if (chosenProvinceID === 0) {
        currentData = tambonAssessment;
    } else {
        let amphoeInZone = Session.get('amphoes');
        let amphoeInProvince = amphoeInZone.filter((item) => { return parseInt(item.provinceID) === chosenProvinceID; });
        let amphoeIDs = amphoeInProvince.map((item) => { return item.ID; });
        if (chosenAmphoeID === 0) {
            currentData = tambonAssessment.filter((item) => { return amphoeIDs.includes(item.amphoeID); });
        } else {
            currentData = tambonAssessment.filter((item) => { return parseInt(item.ID / 100) === chosenAmphoeID });
        }
    }
    Session.set('currentData', currentData);
    Session.set('currentPageData', currentData.slice((Session.get('currentPage') - 1) * 10, 10));
    Session.set('currentPage', 1);
    Session.set('totalPages', Math.ceil(currentData.length / 10))
}

const initSelection = () => {
    console.log('initSelection . . .')
    let chosenProvinceID = 0;   // เลือกทุกจังหวัด
    let chosenAmphoeID = 0;     // เลือกทุกอำเภอ
    let userlogin = Session.get('user');
    if (userlogin.PROVINCENUM) {
        chosenProvinceID = parseInt(userlogin.PROVINCENUM);
        $('#chooseProvince').attr('disabled', true);
        // ซ่อนปุ่ม #resetTambonAssessment #
        $('#transferTambonAssessment').hide();
        $('#resetTambonAssessment').hide();
        $('#transferTambonAssessmentV2').hide();
        $('#transferTambonAssessmentV3').hide();


    } else if (userlogin.userRole === "HPC") {
        $('#chooseProvince').attr('disabled', false);
    }
    Session.set('selection', { chosenProvinceID: chosenProvinceID, chosenAmphoeID: chosenAmphoeID });
}

const getRowData = (ID) => {
    console.log("getRowData -----------------------------------");
    console.log("ID= " + ID);
    let rowData = [];
    rowData.ID = ID;
    rowData.attend = $("#attend_" + ID).prop('checked');
    rowData.joinYear = parseInt($("#joinyear_" + ID).val());
    rowData.assessYear = parseInt($("#assessyear_" + ID).val());
    rowData.c1 = $("#c1_" + ID).prop('checked');
    rowData.c2 = $("#c2_" + ID).prop('checked');
    rowData.c3 = $("#c3_" + ID).prop('checked');
    rowData.c4 = $("#c4_" + ID).prop('checked');
    rowData.c5 = $("#c5_" + ID).prop('checked');
    rowData.c6 = $("#c6_" + ID).prop('checked');
    rowData.verdict = $("#verdict_" + ID).text().trim();
    rowData.remark = $("#remark_" + ID).val().trim();
    console.log("rowData...."); console.log(rowData);
    return rowData;
}

const calculateVerdict = (data) => {
    console.log("calculateVerdict   -------------------------------------");
    console.log(data);
    console.log(data.ID);

    // calculate verdict
    // บรรทัดฐานการตัดสิน
    // 1. ถ้า ไม่เข้าร่วม ==> joinYear, assessYear เป็น 0 && c1-c6 เป็น false && verdict = "ไม่ผ่านเกณฑ์"
    // 2. เข้าร่วม assessYear เกิน 3 ปี ==> c1-c6 เป็น false && verdict = "ประเมินซ้ำ"
    // 3. เข้าร่วม assessYear ไม่เกิน 3 ปี && c1-c6 เป็น true ==> verdict ="ผ่านเกณฑ์"
    let todayYear = new Date().getFullYear() + 543;   // ปีพุทธศักราช พ.ศ.
    if (data.attend) {
        data.verdict = "ไม่ผ่านเกณฑ์";
        data.c1 = false; data.c2 = false; data.c3 = false; data.c4 = false; data.c5 = false; data.c6 = false;
        data.joinYear = 0;
        data.assessYear = 0;
    } else if ((todayYear - data.assessYear) > 3) {
        data.c1 = false; data.c2 = false; data.c3 = false; data.c4 = false; data.c5 = false; data.c6 = false;
        data.verdict = "ประเมินซ้ำ"
    } else if (data.c1 && data.c2 && data.c3 && data.c4 && data.c5 && data.c6 &&
        (todayYear - data.assessYear) <= 3) {
        tambon_verdict = "ผ่านเกณฑ์";
    } else {
        tambon_verdict = "ไม่ผ่านเกณฑ์";
    }
    console.log("calculateVerdict   -------------------------------------");
    return data;
}

const verifyChange = (data) => {


    console.log(`attend=${data.attend} joinyear=${data.joinYear} assessyear=${data.assessYear}`)
    console.log(`c1=${data.c1} c2=${data.c2} c3=${data.c3} c4=${data.c4} c5=${data.c5} c6=${data.c6} `)
    console.log(`verdict=${data.verdict} remark=${data.remark}`);


    //console.log(JSON.stringify(tambol_evaluate));
    if (this.c1 !== data.c1) console.log("c1 " + this.c1, " ==> ", data.c1);
    if (this.c2 !== data.c2) console.log("c2 " + this.c2, " ==> ", data.c2);
    if (this.c3 !== data.c3) console.log("c3 " + this.c3, " ==> ", data.c3);
    if (this.c4 !== data.c4) console.log("c4 " + this.c4, " ==> ", data.c4);
    if (this.c5 !== data.c5) console.log("c5 " + this.c5, " ==> ", data.c5);
    if (this.c6 !== data.c6) console.log("c6 " + this.c6, " ==> ", data.c6);
    if (this.attend !== data.attend) console.log("attend " + this.attend, " ==> ", data.attend);
    if (this.joinYear !== data.joinYear) console.log("joinYear " + this.joinYear, " ==> ", data.joinYear);
    if (this.assessYear !== data.assessYear) console.log("assessYear " + this.assessYear, " ==> ", data.assessYear);
    if (this.verdict !== data.verdict) console.log("verdict " + this.verdict, " ==> ", data.verdict);
    if (this.remark !== data.remark) console.log("remark " + this.remark, " ==> ", data.remark);
}

const showRowData = (row) => {
    console.log(`${row.ID} ${row.joinYear} ${row.assessYear} ${row.c1} ${row.c2} ${row.c3} ${row.c4} ${row.c5} ${row.c6} ${row.verdict}`);
}