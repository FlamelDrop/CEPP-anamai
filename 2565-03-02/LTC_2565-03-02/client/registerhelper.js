Template.registerHelper('showTAMBON', function (data) {
    if (data) {
        const a = '';
        Meteor.call('getDistrictName', data, function (error, result) {
            try {
                Session.set('a', "ต." + result.subdistrict_name + " อ." + result.district_name + " จ." + result.province_name);
            } catch (e) { }
        });
        a = Session.get('a')
        return a;
    } else {
        return data
    }
});

Number.prototype.numberFormat = function (decimals, dec_point, thousands_sep) {
    dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

    var parts = this.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return parts.join(dec_point);
}


Template.registerHelper('splitTambon', function (data) {
    if (data) {
        var res = data.toString();
        if (res.includes("-")) {
            var result = res.split("-");
            return result[1]
        } else {
            return res
        }
    }
});

Template.registerHelper('splitAmphoe', function (data) {
    if (data) {
        var res = data.toString();
        if (res.includes("-")) {
            var result = res.split("-");
            return result[1]
        } else if (res.includes(".")) {
            var result2 = res.split(".");
            return result2[1]
        } else {
            return res
        }
    }
});

Template.registerHelper('splitProvince', function (data) {
    if (data) {
        var res = data.toString();
        if (res.includes("-")) {
            var result = res.split("-");
            return result[1]
        } else {
            return res
        }
    }
});

Template.registerHelper('dataded', function (data) {
    if (data) {
        return parseInt(data).numberFormat(0)
    } else {
        return "0"
    }
});

Template.registerHelper('lengthArray', function (data) {
    if (data) {
        return data.length
    } else {
        return "0"
    }
});

Template.registerHelper('formatdate', function (data) {

    if (data) {
        var dm = moment(data).format('DD/MM/');
        var y = (parseInt(moment(data).format('YYYY')) + 543) - 2500;
        var date = dm + y;
        return date
    } else {
        return "-"
    }
});

Template.registerHelper('formatdatetime', function (data) {
    if (data) {
        var dm = moment(data).format('DD/MM/');
        var time = moment(data).format('HH:mm:ss');
        var y = (parseInt(moment(data).format('YYYY')) + 543) - 2500;
        var date = dm + y + " " + time;
        return date
    } else {
        return "-"
    }
});

Template.registerHelper('lformatdate', function (data) {
    if (data) {
        var dm = moment(data).format('DD/MM/');
        var y = (parseInt(moment(data).format('YYYY')) + 543);
        var date = dm + y;
        return date
    } else {
        return "-"
    }
});

Template.registerHelper('langsex', function (data) {
    // console.log(data)
    // console.log(data == "1")
    if (data == "1") {
        return "ชาย"
    } else {
        return "หญิง"
    }
});

Template.registerHelper('RTRAINING_CENTER_ID', function (data) {
    if (data == "01") {
        return "กรมอนามัย"
    } else if (data == "02") {
        return "ศูนย์อนามัย"
    } else if (data == "03") {
        return "สำนักงานสาธารณสุขอำเภอ/คปสอ."
    } else if (data == "04") {
        return "สํานักงานสาธารณสุขจังหวัด"
    } else if (data == "05") {
        return "มหาวิทยาลัย"
    } else if (data == "06") {
        return "วิทยาลัยพยาบาล"
    } else if (data == "07") {
        return "กรมอนามัยและศูนย์เขตอนามัย"
    } else if (data == "08") {
        return "อืนๆ"
    }
});

Template.registerHelper('RTRAINING_CENTER_ID_CG', function (data) {
    if (data == "01") {
        return "ศูนย์อนามัย"
    } else if (data == "02") {
        return "สำนักงานสาธารณสุขจังหวัด"
    } else if (data == "03") {
        return "สำนักงานสาธารณสุขอำเภอ/คปสอ."
    } else if (data == "04") {
        return "โรงพยาบาล"
    } else if (data == "05") {
        return "กศน."
    } else if (data == "06") {
        return "มหาวิทยาลัย"
    } else if (data == "07") {
        return "วิทยาลัยพยาบาล"
    } else if (data == "08") {
        return "กรมอนามัยและศูนย์เขตอนามัย"
    } else if (data == "09") {
        return "อื่นๆ"
    }
});

Template.registerHelper('CGSTATE_ACTIVE', function (data) {

    if (data == "01") {
        return "ดูแลผู้สูงอายุตาม Care Plan"
    } else if (data == "02") {
        return "ยังไม่มีผู้สูงอายุในความดูแล"
    } else if (data == "03") {
        return "ต้องได้รับการฟื้นฟูศักยภาพ"
    } else if (data == "04") {
        return "ลาออก"
    } else if (data == "05") {
        return "เสียชีวิต"
    }

});

Template.registerHelper('RSTATE_ACTIVE', function (data) {
    // if (data == "01") {
    //     return "ปฏิบัติงาน"
    // } else if (data == "02") {
    //     return "ไม่ปฏิบัติงาน"
    // } else if (data == "03") {
    //     return "ต้องได้รับการฟื้นฟูศักยภาพ"
    // } else if (data == "04") {
    //     return "เสียชีวิต"
    // }
    if (data == "01") {
        return "CM ปฏิบัติการ"
    } else if (data == "02") {
        return "CM บริหาร"
    } else if (data == "03") {
        return "ต้องได้รับการฟื้นฟูศักยภาพ"
    } else if (data == "04") {
        return "เกษียณอายุการทำงาน"
    } else if (data == "05") {
        return "ลาออก"
    } else if (data == "06") {
        return "เสียชีวิต"
    } else if (data == "07") {
        return "เปลี่ยนงาน / ย้ายงาน"
    }

});



Template.registerHelper('_PROVIDERTYPE', function (data) {
    if (data == "01") {
        return "แพทย์"
    } else if (data == "02") {
        return "ทันตแพทย์"
    } else if (data == "03") {
        return "พยาบาลวิชาชีพ"
    } else if (data == "04") {
        return "เจ้าพนักงานสาธารณสุขชุมชน"
    } else if (data == "05") {
        return "นักวิชาการสาธารณสุข"
    } else if (data == "06") {
        return "เจ้าพนักงานทันตสาธารณสุข"
    } else if (data == "07") {
        return "อสม.(ผู้ให้บริการในชุมชน)"
    } else if (data == "08") {
        return "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์ทางเลือก (ที่มีวุฒิการศึกษาหรือผ่าน การอบรมตามเกณฑ์)"
    } else if (data == "09") {
        return "อื่นๆ"
    } else if (data == "10") {
        return "ผู้ดูแลผู้ป่วยที่บ้าน"
    } else if (data == "11") {
        return "เภสัชกร"
    } else if (data == "081") {
        return "แพทย์แผนไทย/แพทย์แผนไทยประยุกต์ :(ที่มีใบประกอบวิชาชีพ)"
    } else if (data == "082") {
        return "หมอพื้นบ้าน : (ที่มีใบประกอบวิชาชีพฯ หรือได้รับการรับรองตามระเบียบกรมการ แพทย์แผนไทยฯ)"
    } else if (data == "083") {
        return "แพทย์แผนจีน : (ที่มีใบประกอบวิชาชีพ)"
    } else if (data == "084") {
        return "ผู้ช่วยแพทย์แผนไทย : (ที่ผ่านการอบรมตามเกณฑ์)"
    } else if (data == "085") {
        return "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์แผนจีน แพทย์ทางเลือก : (ที่มีวุฒิ การศึกษาหรือผ่านการอบรมตามเกณฑ์)"
    }
});

Template.registerHelper('listbr', function (data) {
    var re_arr = data.reverse()
    if (re_arr) {
        var text = '';
        for (var i = re_arr.length - 1; i >= 0; i--) {
            text += '&nbsp;&nbsp;&nbsp;-&nbsp;' + re_arr[i] + '<br />'
        }
        return Spacebars.SafeString(text)
    } else {
        return "-"
    }
});


Template.registerHelper('SHOTTERMNEEDlist', function (data) {
    if (data) {
        var arrlist = "";
        for (var i = data.length - 1; i >= 0; i--) {
            arrlist += "&nbsp; - " + data[i].SHOTTERMNEED + " ภายใน " + data[i].SHOTTERMNEEDNUM + " " + data[i].SHOTTERMNEEDDATE + "<br>"
        }
        return Spacebars.SafeString(arrlist)
    } else {
        return "-"
    }
});


Template.registerHelper('explusone', function (data) {
    if (data) {
        return parseInt(data) + 1
    } else {
        return 1
    }
});

Template.registerHelper('listcomma', function (data) {
    if (data) {
        return Spacebars.SafeString(data.toString())
    } else {
        return "-"
    }
});

Template.registerHelper('newline', function (data) {
    if (data) {
        var text = data.replace(/\r?\n/g, '<br />');
        return Spacebars.SafeString(text)
    } else {
        return "-"
    }
});

Template.registerHelper('num', function (data) {
    return parseInt(data) + 1;
})

Template.registerHelper('getage', function (data) {
    var today = new Date();
    var birthDate = new Date(data);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())); {
        age--;
    }
    return age;
})

Template.registerHelper('comma', function (data) {
    return parseFloat(data).toLocaleString()

})

Template.registerHelper('Intcomma', function (data) {
    if (data) {
        return parseInt(data).toLocaleString()
    } else {
        return 0
    }


})
Template.registerHelper('formatdate', function (data) {
    if (!isNaN(moment(data)._i)) {
        var dm = moment(data).format('DD/MM/');
        var y = (parseInt(moment(data).format('YYYY')) + 543) - 2500;
        var date = dm + y;
        return date
    } else {
        return ""
    }
});

Template.registerHelper('subminThYear', function (data) {
    if (data) {
        return parseInt(data) - 1
    } else {
        return ""
    }
});
Template.registerHelper('longformatdate', function (data) {
    if (!isNaN(moment(data)._i)) {
        var dm = moment(data).format('DD/MM/');
        var y = (parseInt(moment(data).format('YYYY')) + 543);
        var date = dm + y;
        return date
    } else {
        return ""
    }
});

Template.registerHelper('briddate', function (data) {
    if (data) {

        var date = new Date(moment(data), 'YYYYMMDD')
        var d = moment(data).format('DD');
        // console.log(data)
        var m = moment(data).format('MM');
        var y = ((parseInt(moment(data).format('YYYY'))) + 543);
        if (m == '01') {
            m = "มกราคม"
        } else if (m == '02') {
            m = "กุมภาพันธ์ "
        } else if (m == '03') {
            m = "มีนาคม"
        } else if (m == '04') {
            m = "เมษายน"
        } else if (m == '05') {
            m = "พฤษภาคม"
        } else if (m == '06') {
            m = "มิถุนายน"
        } else if (m == '07') {
            m = "กรกฎาคม"
        } else if (m == '08') {
            m = "สิงหาคม"
        } else if (m == '09') {
            m = "กันยายน"
        } else if (m == '10') {
            m = "ตุลาคม"
        } else if (m == '11') {
            m = "พฤศจิกายน"
        } else if (m == '12') {
            m = "ธันวาคม"
        }
        return " " + d + " เดือน " + m + " พ.ศ. " + y
    } else {
        return "-"
    }
});

Template.registerHelper('mdate', function (data) {
    if (data) {

        var date = new Date(moment(data), 'YYYYMMDD')
        var d = moment(data).format('DD');
        // console.log(data)
        var m = moment(data).format('MM');
        var y = ((parseInt(moment(data).format('YYYY'))) + 543);
        if (m == '01') {
            m = "มกราคม"
        } else if (m == '02') {
            m = "กุมภาพันธ์ "
        } else if (m == '03') {
            m = "มีนาคม"
        } else if (m == '04') {
            m = "เมษายน"
        } else if (m == '05') {
            m = "พฤษภาคม"
        } else if (m == '06') {
            m = "มิถุนายน"
        } else if (m == '07') {
            m = "กรกฎาคม"
        } else if (m == '08') {
            m = "สิงหาคม"
        } else if (m == '09') {
            m = "กันยายน"
        } else if (m == '10') {
            m = "ตุลาคม"
        } else if (m == '11') {
            m = "พฤศจิกายน"
        } else if (m == '12') {
            m = "ธันวาคม"
        }
        return " " + d + " " + m + " " + y
    } else {
        return "-"
    }
});

thaiYear = function (ct) {
    var leap = 3;
    var dayWeek = ["พฤ.", "ศ.", "ส.", "อา.", "จ.", "อ.", "พ."];
    if (ct) {
        var yearL = new Date(ct).getFullYear() - 543;
        leap = (((yearL % 4 == 0) && (yearL % 100 != 0)) || (yearL % 400 == 0)) ? 2 : 3;
        if (leap == 2) {
            dayWeek = ["ศ.", "ส.", "อา.", "จ.", "อ.", "พ.", "พฤ."];
        }
    }
    this.setOptions({
        i18n: { th: { dayOfWeek: dayWeek } },
        dayOfWeekStart: leap,
    })
};

Template.registerHelper('CMCGRATIO', function (a, b) {
    var result = parseInt(a) / parseInt(b);
    if (!isFinite(result)) {

        return "-"
    } else if (isNaN(result)) {

        return "-"
    } else {

        return result == 0 ? "1:0" : "1:" + (result).toFixed(1)
    }

});

Template.registerHelper('CMCGRATIO_PROVINCE', function (a, b, c, d) {
    var allcm = parseInt(a) + parseInt(b)
    var allcg = parseInt(c) + parseInt(d)
    var result = parseInt(allcg) / parseInt(allcm);
    if (!isFinite(result)) {

        return "-"
    } else if (isNaN(result)) {

        return "-"
    } else {

        return result == 0 ? "1:0" : "1:" + (result).toFixed(1)
    }

});

Template.registerHelper('sumElderReport', function (a, b, c, d, e) {
    var sum = parseInt(a) + parseInt(b) + parseInt(c) + parseInt(d) + parseInt(e)
    return sum.numberFormat(0)

});

Template.registerHelper('Exceed100', function (cp, el) {
    var percent = ((parseInt(cp) / parseInt(el)) * 100)
    return isFinite(percent)

});

Template.registerHelper('filterCpRep', function (cp, el) {
    var percent = ((parseInt(cp) / parseInt(el)) * 100)
    console.log(percent)
    if (percent > 100) {
        return false
    } else if (isFinite(percent)) {
        return false
    } else {
        return true
    }


});

Template.registerHelper('percentCpElder', function (cp, el) {
    var percent = ((parseInt(cp) / parseInt(el)) * 100)
    return percent.toFixed(2)

});

Template.registerHelper('nhsoElderIndex', function (a) {
    return parseInt(a) + 1

});


Template.registerHelper('colorDashboard', function (a) {
    if(a){
        return 'btn btn-success'
    }else{
        return 'btn btn-primary'
    }
});

Template.registerHelper('REG_HISTORY_COMP', function (data) {
    return data[data.length-1].NAME
});

