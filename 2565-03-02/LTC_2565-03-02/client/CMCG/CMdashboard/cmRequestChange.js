Template.select_company_addhosp.onRendered(function init() {
    $('#companyName').selectize();
    if (Session.get('getProfileCM')) {
        var z = Session.get('getProfileCM')[0].zone
        Meteor.call('getAllServiceCenterByZone', z, function (error, result) {
            $('#companyName')[0].selectize.destroy()
            $('#companyName').selectize({ options: result, create: false });
        });
    }

});

Template.select_dla_addhosp.onRendered(function init() {
    $('#dla').selectize();
    if (Session.get('getProfileCM')) {
        var z = Session.get('getProfileCM')[0].zone
        var pro = hpcprovince(z)
        Meteor.call('getAllDLA_CODEByZone', pro, function (error, result) {
            $('#dla')[0].selectize.destroy()
            $('#dla').selectize({ options: result, create: false });
        });
    }
});
Template.cmRequestChange.onRendered(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    $("#radio_company").prop("checked", true);
    Session.set('switchCompany', true)
    var myArr = []
    //console.log(Session.get('getProfileCM'));
    //console.log(Session.get('getProfileCM')[0].HISTORY_COMP);
    //console.log(typeof Session.get('getProfileCM')[0].HISTORY_COMP);
    
    if (Session.get('getProfileCM')) {
        //console.log('AAA');
        if (typeof Session.get('getProfileCM')[0].HISTORY_COMP == 'undefined') {
            //console.log('111');
            Session.set('arrAddHosp', myArr)
        } else {
            if(Session.get('getProfileCM')[0].HISTORY_COMP.length > 0){
                //console.log('222');
                Session.set('arrAddHosp', Session.get('getProfileCM')[0].HISTORY_COMP)
            }else{
                //console.log('333');
                Session.set('arrAddHosp', myArr)
            }
          
        }
    }else{
        //console.log('BBB');
    }

})
Template.cmRequestChange.helpers({
    switchCompany() {
        if (Session.get('switchCompany')) {
            return true
        } else {
            return false
        }
    },
    listCompany() {
        return Session.get('arrAddHosp')
    },
    haveData() {

        return Session.get('arrAddHosp').length > 0 ? Session.get('arrAddHosp').length > 0 : Session.get('getProfileCM')[0].SECONDARY_COMP.length > 0

    },
    // showimg(){
    //     return Session.get('arrAddHosp')
    // }

});

Template.cmRequestChange.events({
    "click  #radio_company"() {
        Session.set('switchCompany', true)
    },
    "click  #radio_dla"() {
        Session.set('switchCompany', false)
    },
    "click  #add"() {
        var arr = Session.get('arrAddHosp')
        //console.log(Session.get('arrAddHosp'));
        //console.log(arr);
        data = []

        for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if(e.approve == 0){
                data.push(e)
            }
        }
        //console.log(data);
        
        if ($('#companyName').val() || $('#dla').val()) {
            var maimComp = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
            var selectedComp = $('#companyName').val() ? $('#companyName').val().split('-')[0] : $('#dla').val().split('-')[0]
            var comp = { CODE: $('#companyName').val() ? $('#companyName').val().split('-')[0] : $('#dla').val().split('-')[0], NAME: $('#companyName').val() ? $('#companyName').val().split('-')[1] : $('#dla').val().split('-')[1], approve: "0", requetAt: new Date(), approveAt: "", remark: "" }
            //console.log(maimComp);
            //console.log(selectedComp);
            if (maimComp != selectedComp) {
               
                //console.log(arr.length);
                //console.log(data.length);
                if (data.length < 1) {
                    // arr.push(comp)
                    arr.insert(arr.length, comp)
                    var unique = _.uniqBy(arr, 'CODE');
                    //console.log(unique);
                    Session.set('arrAddHosp', unique)
                } else {
                    toastr.error('ไม่สามารถเลือกหน่วยบริการได้เกิน 1 หน่วย')
                }
            } else {
                toastr.error('ไม่สามารถเลือกหน่วยบริการซ้ำกันได้')
            }
        } else {
            toastr.error('กรุณาเลือกหน่วยบริการ')
        }


    },
    "click #save"() {
        if (Session.get('getProfileCM')) {
            var idcm = Session.get('getProfileCM')[0]._id
            var comp = Session.get('arrAddHosp')

            Meteor.call('moveHospCM', idcm, comp, function (err, res) {
                if (err) throw err;
                toastr.success("บันทึกสำเร็จ");
            })

        } else {
            toastr.error('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
        }
    },
    'click #remove'() {
        var hospcode = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        
        if (hospcode == this.CODE) {
            alert('ไม่สามารถยกเลิกหน่วยบริการที่ใช้งานอยู่ได้')
        } else {

            var arr = Session.get('arrAddHosp')
            var r = confirm("ต้องการยกเลิกหน่วยบริการ " + this.NAME + " หรือไม่");

            if (r) {
                for (var i = 0; i < arr.length; i++) {
                    if (JSON.stringify(this) == JSON.stringify(arr[i])) {
                        arr.splice(i, 1);
                    }
                }
                //console.log(arr);
                Session.set('arrAddHosp', arr)
            }
        }

    }
});

function hpcprovince(ID) {
    var provinceSet;
    if (ID == "01") {
        provinceSet = ['เชียงราย', 'เชียงใหม่', 'น่าน', 'พะเยา', 'แพร่', 'แม่ฮ่องสอน', 'ลำปาง', 'ลำพูน'];
    } else if (ID == "02") {
        provinceSet = ['ตาก', 'พิษณุโลก', 'เพชรบูรณ์', 'สุโขทัย', 'อุตรดิตถ์'];
    } else if (ID == "03") {
        provinceSet = ['กำแพงเพชร', 'ชัยนาท', 'นครสวรรค์', 'พิจิตร', 'อุทัยธานี'];
    } else if (ID == "04") {
        provinceSet = ['นนทบุรี', 'นครนายก', 'ปทุมธานี', 'พระนครศรีอยุธยา', 'ลพบุรี', 'สระบุรี', 'สิงห์บุรี', 'อ่างทอง'];
    } else if (ID == "05") {
        provinceSet = ['กาญจนบุรี', 'นครปฐม', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'ราชบุรี', 'สมุทรสาคร', 'สมุทรสงคราม', 'สุพรรณบุรี'];
    } else if (ID == "06") {
        provinceSet = ['จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ตราด', 'ปราจีนบุรี', 'ระยอง', 'สระแก้ว', 'สมุทรปราการ'];
    } else if (ID == "07") {
        provinceSet = ['กาฬสินธุ์', 'ขอนแก่น', 'มหาสารคาม', 'ร้อยเอ็ด'];
    } else if (ID == "08") {
        provinceSet = ['นครพนม', 'บึงกาฬ', 'เลย', 'สกลนคร', 'หนองคาย', 'หนองบัวลำภู', 'อุดรธานี'];
    } else if (ID == "09") {
        provinceSet = ['ชัยภูมิ', 'นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์'];
    } else if (ID == "10") {
        provinceSet = ['มุกดาหาร', 'ยโสธร', 'ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ'];
    } else if (ID == "11") {
        provinceSet = ['กระบี่', 'ชุมพร', 'นครศรีธรรมราช', 'พังงา', 'ภูเก็ต', 'ระนอง', 'สุราษฎร์ธานี'];
    } else if (ID == "12") {
        provinceSet = ['ตรัง', 'นราธิวาส', 'ปัตตานี', 'พัทลุง', 'ยะลา', 'สงขลา', 'สตูล'];
    }

    return provinceSet
}

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};