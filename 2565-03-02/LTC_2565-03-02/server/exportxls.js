import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { CM_REGISTER } from '../imports/db.js';
import { CG_REGISTER } from '../imports/db.js';
import { EVALUATE_DISTRICT } from '../imports/db.js';
import { USER_LOGIN } from '../imports/db.js';
import { tambons } from '../imports/db.js';
import { tambonAssessment } from '../imports/db.js';
import { provinces } from '../imports/db.js';


Meteor.startup(() => {
    /////////////////////////////HPC////////////////////////
    Router.route('/xlsdisevaluate/:province/:district', { // API 2
        where: 'server'
    }).get(function () {
        var ID = this.params.province
        var dis = this.params.district
        var data = EVALUATE_DISTRICT.aggregate([{
            $unwind: {
                path: "$Evaluate",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $match: {
                province_name: ID,
                district_name: dis
            }
        }, {
            $project: {
                _id: 0,
                fullcode: 1,
                subdistrict_name: 1,
                district_code: 1,
                district_name: 1,
                province_code: 1,
                province_name: 1,
                join: { $cond: { if: "$Evaluate.join", then: "เข้าร่วม", else: "ไม่เข้าร่วม" } },
                join_year: "$Evaluate.join_year",
                pass_year: "$Evaluate.pass_year",
                evaluate_year: "$Evaluate.evaluate_year",
                criterio: {
                    $cond: [{
                        $and: [
                            { $eq: ["$Evaluate.c1", true] },
                            { $eq: ["$Evaluate.c2", true] },
                            { $eq: ["$Evaluate.c3", true] },
                            { $eq: ["$Evaluate.c4", true] },

                        ]
                    },
                        "ผ่านเกณฑ์",
                        "ไม่ผ่านเกณฑ์"]
                },
                remark: "$remark",
                zone: "$zone",


            }
        }, { $sort: { fullcode: -1 } }]).toArray()
        var fields = [{ key: 'fullcode', title: 'รหัส' }, { key: 'subdistrict_name', title: 'ตำบล' }, { key: 'district_code', title: 'รหัสอำเภอ' }, { key: 'district_name', title: 'อำเภอ' }, { key: 'province_code', title: 'รหัสจังหวัด' }, { key: 'province_name', title: 'จังหวัด' }, { key: 'criterio', title: 'เกณฑ์' }, { key: 'join', title: 'สถานะการเข้าร่วม' }, { key: 'join_year', title: 'ปีที่เข้าร่วม' }, { key: 'pass_year', title: 'ปีที่ผ่านเกณฑ์' }, { key: 'evaluate_year', title: 'ปีที่ประเมิน' }, { key: 'remark', title: 'หมายเหตุ' }, { key: 'zone', title: 'เขต' }];
        var title = 'รายชื่อตำบลLTCในอำเภอ' + dis;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlsproevaluate/:province/', { // API 2
        where: 'server'
    }).get(function () {
        var ID = this.params.province;
        var data = EVALUATE_DISTRICT.aggregate([{
            $unwind: {
                path: "$Evaluate",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $match: {
                province_name: ID
            }
        }, {
            $project: {
                _id: 0,
                fullcode: 1,
                subdistrict_name: 1,
                district_code: 1,
                district_name: 1,
                province_code: 1,
                province_name: 1,
                join: { $cond: { if: "$Evaluate.join", then: "เข้าร่วม", else: "ไม่เข้าร่วม" } },
                join_year: "$Evaluate.join_year",
                pass_year: "$Evaluate.pass_year",
                evaluate_year: "$Evaluate.evaluate_year",
                criterio: {
                    $cond: [{
                        $and: [
                            { $eq: ["$Evaluate.c1", true] },
                            { $eq: ["$Evaluate.c2", true] },
                            { $eq: ["$Evaluate.c3", true] },
                            { $eq: ["$Evaluate.c4", true] },

                        ]
                    },
                        "ผ่านเกณฑ์",
                        "ไม่ผ่านเกณฑ์"]
                },
                remark: "$remark",
                zone: "$zone",


            }
        }, { $sort: { fullcode: -1 } }]).toArray()
        var fields = [{ key: 'fullcode', title: 'รหัส' }, { key: 'subdistrict_name', title: 'ตำบล' }, { key: 'district_code', title: 'รหัสอำเภอ' }, { key: 'district_name', title: 'อำเภอ' }, { key: 'province_code', title: 'รหัสจังหวัด' }, { key: 'province_name', title: 'จังหวัด' }, { key: 'criterio', title: 'เกณฑ์' }, { key: 'join', title: 'สถานะการเข้าร่วม' }, { key: 'join_year', title: 'ปีที่เข้าร่วม' }, { key: 'pass_year', title: 'ปีที่ผ่านเกณฑ์' }, { key: 'evaluate_year', title: 'ปีที่ประเมิน' }, { key: 'remark', title: 'หมายเหตุ' }, { key: 'zone', title: 'เขต' }];
        var title = 'รายชื่อตำบลLTCในจังหวัด' + ID;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlshpcevaluate/:province/', { // API 2
        where: 'server'
    }).get(function () {
        var ID = this.params.province;

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
        var data = EVALUATE_DISTRICT.aggregate([{
            $unwind: {
                path: "$Evaluate",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $match: {
                //province_name: { $in: provinceSet }
            }
        }, {
            $project: {
                _id: 0,
                fullcode: 1,
                subdistrict_name: 1,
                district_code: 1,
                district_name: 1,
                province_code: 1,
                province_name: 1,
                join: { $cond: { if: "$Evaluate.join", then: "เข้าร่วม", else: "ไม่เข้าร่วม" } },
                join_year: "$Evaluate.join_year",
                pass_year: "$Evaluate.pass_year",
                evaluate_year: "$Evaluate.evaluate_year",
                criterio: {
                    $cond: [{
                        $and: [
                            { $eq: ["$Evaluate.c1", true] },
                            { $eq: ["$Evaluate.c2", true] },
                            { $eq: ["$Evaluate.c3", true] },
                            { $eq: ["$Evaluate.c4", true] },

                        ]
                    },
                        "ผ่านเกณฑ์",
                        "ไม่ผ่านเกณฑ์"]
                },
                remark: "$remark",
                zone: "$zone",


            }
        }, { $sort: { fullcode: -1 } }]).toArray()
        var fields = [{ key: 'fullcode', title: 'รหัส' }, { key: 'subdistrict_name', title: 'ตำบล' }, { key: 'district_code', title: 'รหัสอำเภอ' }, { key: 'district_name', title: 'อำเภอ' }, { key: 'province_code', title: 'รหัสจังหวัด' }, { key: 'province_name', title: 'จังหวัด' }, { key: 'criterio', title: 'เกณฑ์' }, { key: 'join', title: 'สถานะการเข้าร่วม' }, { key: 'join_year', title: 'ปีที่เข้าร่วม' }, { key: 'pass_year', title: 'ปีที่ผ่านเกณฑ์' }, { key: 'evaluate_year', title: 'ปีที่ประเมิน' }, { key: 'remark', title: 'หมายเหตุ' }, { key: 'zone', title: 'เขต' }];
        var title = 'รายชื่อตำบลLTCเขต' + ID;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xls_unmatched_district/', { // by Kanut 2021-07-07
        where: 'server'
    }).get(function () {

        var data = EVALUATE_DISTRICT.aggregate([{
            $unwind: {
                path: "$Evaluate",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: false // optional
            }
        }, {
            $match: {
                //province_name: { $in: provinceSet }
            }
        }, {
            $project: {
                _id: 0,
                fullcode: 1,
                subdistrict_name: 1,
                district_code: 1,
                district_name: 1,
                province_code: 1,
                province_name: 1,
                join: { $cond: { if: "$Evaluate.join", then: "เข้าร่วม", else: "ไม่เข้าร่วม" } },
                join_year: "$Evaluate.join_year",
                pass_year: "$Evaluate.pass_year",
                evaluate_year: "$Evaluate.evaluate_year",
                remark: "$remark",
                zone: "$zone",


            }
        }, { $sort: { fullcode: -1 } }]).toArray();
        data = data.filter(item => item.district_code != item.fullcode.substring(0, 4));
        data = EVALUATE_DISTRICT.find().fetch();
        data = data.filter(item => item.district_code != item.fullcode.substring(0, 4));
        //console.log(datamismtached_districts);
        data.forEach((item, index, self) => {
            delete data[index].Evaluate;
            delete data[index]._id;
        });
        console.log(data);


        var fields = [{ key: 'fullcode', title: 'รหัส' }, { key: 'subdistrict_name', title: 'ตำบล' }, { key: 'district_code', title: 'รหัสอำเภอ' }, { key: 'district_name', title: 'อำเภอ' },
        { key: 'province_code', title: 'รหัสจังหวัด' }, { key: 'province_name', title: 'จังหวัด' }, { key: 'zone', title: 'เขต' }];
        var title = 'ตำบล_unmatched_code';
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');

    })

    Router.route('/xlshpccgall/:findxxx/:zone', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.zone;
        var find = {
            "zone": { $regex: a.toString() },
            "confirm": true
        };
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                "zone": { $regex: a.toString() },
                $or: [
                    { "CID": { '$regex': regex } },
                    { "PRENAME": { '$regex': regex } },
                    { "NAME": { '$regex': regex } },
                    { "LNAME": { '$regex': regex } },
                    { "SEX": { '$regex': regex } },
                    { "MOBILE": { '$regex': regex } },
                    { "HOSPCODE.CODE": { '$regex': regex } },
                    { "HOSPCODE.NAME": { '$regex': regex } },
                    { "HOSPCODE.DISTRICT": { '$regex': regex } },
                    { "HOSPCODE.AMPHOE": { '$regex': regex } },
                    { "HOSPCODE.PROVINCE": { '$regex': regex } },
                    { "DLACODE.CODE": { '$regex': regex } },
                    { "DLACODE.NAME": { '$regex': regex } },
                    { "DLACODE.DISTRICT": { '$regex': regex } },
                    { "DLACODE.PROVINCE": { '$regex': regex } },
                    { "DLACODE.AMPHOE": { '$regex': regex } },
                    { "LICENCE_NUMBER": { '$regex': regex } },
                    { "POSITIONCODE": { '$regex': regex } },
                ],
                "confirm": true
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CG_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                EDUCATION: "$EDUCATION",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "สำนักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "โรงพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "กศน.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "08"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] }] },
                THOUR: "$TRAININGHOUR",
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "ดูแลผู้สูงอายุตาม Care Plan", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "ยังไม่มีผู้สูงอายุในความดูแล", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "เสียชีวิต", ""] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'EDUCATION', title: 'ระดับการศึกษา' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'THOUR', title: 'หลักสูตร' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCGศูนย์เขตอนามัยที่_' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlshpccg/:findxxx/:zone/:status', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.zone;
        var status = this.params.status
        var find = {
            "zone": { $regex: a.toString() },
            "STATE_ACTIVE": status,
            "confirm": true
        };
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                "zone": { $regex: a.toString() },
                $or: [
                    { "CID": { '$regex': regex } },
                    { "PRENAME": { '$regex': regex } },
                    { "NAME": { '$regex': regex } },
                    { "LNAME": { '$regex': regex } },
                    { "SEX": { '$regex': regex } },
                    { "MOBILE": { '$regex': regex } },
                    { "HOSPCODE.CODE": { '$regex': regex } },
                    { "HOSPCODE.NAME": { '$regex': regex } },
                    { "HOSPCODE.DISTRICT": { '$regex': regex } },
                    { "HOSPCODE.AMPHOE": { '$regex': regex } },
                    { "HOSPCODE.PROVINCE": { '$regex': regex } },
                    { "DLACODE.CODE": { '$regex': regex } },
                    { "DLACODE.NAME": { '$regex': regex } },
                    { "DLACODE.DISTRICT": { '$regex': regex } },
                    { "DLACODE.PROVINCE": { '$regex': regex } },
                    { "DLACODE.AMPHOE": { '$regex': regex } },
                    { "LICENCE_NUMBER": { '$regex': regex } },
                    { "POSITIONCODE": { '$regex': regex } },
                ],
                "STATE_ACTIVE": status,
                "confirm": true
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CG_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                EDUCATION: "$EDUCATION",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "สำนักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "โรงพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "กศน.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "08"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] }] },
                THOUR: "$TRAININGHOUR",
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "ดูแลผู้สูงอายุตาม Care Plan", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "ยังไม่มีผู้สูงอายุในความดูแล", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "เสียชีวิต", ""] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var state = ""
        if (status == "01") {
            state = "ดูแลผู้สูงอายุตาม Care Plan"
        } else if (status == "02") {
            state = "ยังไม่มีผู้สูงอายุในความดูแล"
        } else if (status == "03") {
            state = "ต้องได้รับการฟื้นฟูศักยภาพ"
        } else if (status == "04") {
            state = "ลาออก"
        } else if (status == "05") {
            state = "เสียชีวิต"
        }
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'EDUCATION', title: 'ระดับการศึกษา' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'THOUR', title: 'หลักสูตร' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCGที่มีสถานะการปฎิบัติงาน' + state + 'ศูนย์เขตอนามัยที่_' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlshpccmall/:findxxx/:zone', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.zone;
        var find = {
            "zone": { $regex: a.toString() },
            "confirm": true
        };
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                "zone": { $regex: a.toString() },
                $or: [
                    { "CID": { '$regex': regex } },
                    { "PRENAME": { '$regex': regex } },
                    { "NAME": { '$regex': regex } },
                    { "LNAME": { '$regex': regex } },
                    { "SEX": { '$regex': regex } },
                    { "MOBILE": { '$regex': regex } },
                    { "HOSPCODE.CODE": { '$regex': regex } },
                    { "HOSPCODE.NAME": { '$regex': regex } },
                    { "HOSPCODE.DISTRICT": { '$regex': regex } },
                    { "HOSPCODE.AMPHOE": { '$regex': regex } },
                    { "HOSPCODE.PROVINCE": { '$regex': regex } },
                    { "DLACODE.CODE": { '$regex': regex } },
                    { "DLACODE.NAME": { '$regex': regex } },
                    { "DLACODE.DISTRICT": { '$regex': regex } },
                    { "DLACODE.PROVINCE": { '$regex': regex } },
                    { "DLACODE.AMPHOE": { '$regex': regex } },
                    { "LICENCE_NUMBER": { '$regex': regex } },
                    { "POSITIONCODE": { '$regex': regex } },
                ],
                "confirm": true
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CM_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                PROVIDERTYPE: { $cond: [{ $eq: ["$PROVIDERTYPE", "01"] }, "แพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "02"] }, "ทันตแพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "03"] }, "พยาบาลวิชาชีพ", { $cond: [{ $eq: ["$PROVIDERTYPE", "04"] }, "เจ้าพนักงานสาธารณสุขชุมชน", { $cond: [{ $eq: ["$PROVIDERTYPE", "05"] }, "นักวิชาการสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "06"] }, "เจ้าพนักงานทันตสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "07"] }, "อสม.(ผู้ให้บริการในชุมชน)", { $cond: [{ $eq: ["$PROVIDERTYPE", "08"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์ทางเลือก (ที่มีวุฒิการศึกษาหรือผ่าน การอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "09"] }, "อื่นๆ", { $cond: [{ $eq: ["$PROVIDERTYPE", "10"] }, "ผู้ดูแลผู้ป่วยที่บ้าน", { $cond: [{ $eq: ["$PROVIDERTYPE", "11"] }, "เภสัชกร", { $cond: [{ $eq: ["$PROVIDERTYPE", "081"] }, "แพทย์แผนไทย/แพทย์แผนไทยประยุกต์ :(ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "082"] }, "หมอพื้นบ้าน : (ที่มีใบประกอบวิชาชีพฯ หรือได้รับการรับรองตามระเบียบกรมการ แพทย์แผนไทยฯ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "083"] }, "แพทย์แผนจีน : (ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "084"] }, "ผู้ช่วยแพทย์แผนไทย : (ที่ผ่านการอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "085"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์แผนจีน แพทย์ทางเลือก : (ที่มีวุฒิ การศึกษาหรือผ่านการอบรมตามเกณฑ์)", ""] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] },
                LICENCE_NUMBER: "$LICENCE_NUMBER",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "กรมอนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "สํานักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] },
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "CM ปฏิบัติการ", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "CM บริหาร", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "เกษียณอายุการทำงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "06"] }, "เปลี่ยนงาน / ย้ายงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "07"] }, "เสียชีวิต", ""] }] }] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'PROVIDERTYPE', title: 'ประเภทบุคลากร' }, { key: 'LICENCE_NUMBER', title: 'รหัสใบประกอบวิชาชีพ' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCMศูนย์เขตอนามัยที่_' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlshpccm/:findxxx/:zone/:status', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.zone;
        var status = this.params.status;

        var find = {
            "zone": { $regex: a.toString() },
            "STATE_ACTIVE": status,
            "confirm": true
        };
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                "zone": { $regex: a.toString() },
                $or: [
                    { "CID": { '$regex': regex } },
                    { "PRENAME": { '$regex': regex } },
                    { "NAME": { '$regex': regex } },
                    { "LNAME": { '$regex': regex } },
                    { "SEX": { '$regex': regex } },
                    { "MOBILE": { '$regex': regex } },
                    { "HOSPCODE.CODE": { '$regex': regex } },
                    { "HOSPCODE.NAME": { '$regex': regex } },
                    { "HOSPCODE.DISTRICT": { '$regex': regex } },
                    { "HOSPCODE.AMPHOE": { '$regex': regex } },
                    { "HOSPCODE.PROVINCE": { '$regex': regex } },
                    { "DLACODE.CODE": { '$regex': regex } },
                    { "DLACODE.NAME": { '$regex': regex } },
                    { "DLACODE.DISTRICT": { '$regex': regex } },
                    { "DLACODE.PROVINCE": { '$regex': regex } },
                    { "DLACODE.AMPHOE": { '$regex': regex } },
                    { "LICENCE_NUMBER": { '$regex': regex } },
                    { "POSITIONCODE": { '$regex': regex } },
                ],
                "STATE_ACTIVE": status,
                "confirm": true
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CM_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                PROVIDERTYPE: { $cond: [{ $eq: ["$PROVIDERTYPE", "01"] }, "แพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "02"] }, "ทันตแพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "03"] }, "พยาบาลวิชาชีพ", { $cond: [{ $eq: ["$PROVIDERTYPE", "04"] }, "เจ้าพนักงานสาธารณสุขชุมชน", { $cond: [{ $eq: ["$PROVIDERTYPE", "05"] }, "นักวิชาการสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "06"] }, "เจ้าพนักงานทันตสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "07"] }, "อสม.(ผู้ให้บริการในชุมชน)", { $cond: [{ $eq: ["$PROVIDERTYPE", "08"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์ทางเลือก (ที่มีวุฒิการศึกษาหรือผ่าน การอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "09"] }, "อื่นๆ", { $cond: [{ $eq: ["$PROVIDERTYPE", "10"] }, "ผู้ดูแลผู้ป่วยที่บ้าน", { $cond: [{ $eq: ["$PROVIDERTYPE", "11"] }, "เภสัชกร", { $cond: [{ $eq: ["$PROVIDERTYPE", "081"] }, "แพทย์แผนไทย/แพทย์แผนไทยประยุกต์ :(ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "082"] }, "หมอพื้นบ้าน : (ที่มีใบประกอบวิชาชีพฯ หรือได้รับการรับรองตามระเบียบกรมการ แพทย์แผนไทยฯ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "083"] }, "แพทย์แผนจีน : (ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "084"] }, "ผู้ช่วยแพทย์แผนไทย : (ที่ผ่านการอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "085"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์แผนจีน แพทย์ทางเลือก : (ที่มีวุฒิ การศึกษาหรือผ่านการอบรมตามเกณฑ์)", ""] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] },
                LICENCE_NUMBER: "$LICENCE_NUMBER",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "กรมอนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "สํานักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] },
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "CM ปฏิบัติการ", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "CM บริหาร", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "เกษียณอายุการทำงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "06"] }, "เปลี่ยนงาน / ย้ายงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "07"] }, "เสียชีวิต", ""] }] }] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var stat = ""
        if (status == "01") {
            stat = "CM ปฏิบัติการ"
        } else if (status == "02") {
            stat = "CM บริหาร"
        } else if (status == "03") {
            stat = "ต้องได้รับการฟื้นฟูศักยภาพ"
        } else if (status == "04") {
            stat = "เกษียณอายุการทำงาน"
        } else if (status == "05") {
            stat = "ลาออก"
        } else if (status == "06") {
            stat = "เสียชีวิต"
        }
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'PROVIDERTYPE', title: 'ประเภทบุคลากร' }, { key: 'LICENCE_NUMBER', title: 'รหัสใบประกอบวิชาชีพ' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCMที่มีสถานะปฎิบัติงาน' + stat + 'ศูนย์เขตอนามัยที่_' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })
    ////////////////////////PROVINCE////////////////////////

    Router.route('/xlsprocgall/:findxxx/:zone/:pro', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.pro;
        var zone = this.params.zone
        var find = {
            $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }],
            "confirm": true,
            "zone": { $regex: zone.toString() },
        }
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                $and: [
                    { $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }] },
                    {
                        $or: [
                            { "CID": { '$regex': regex } },
                            { "PRENAME": { '$regex': regex } },
                            { "NAME": { '$regex': regex } },
                            { "LNAME": { '$regex': regex } },
                            { "SEX": { '$regex': regex } },
                            { "MOBILE": { '$regex': regex } },
                            { "HOSPCODE.CODE": { '$regex': regex } },
                            { "HOSPCODE.NAME": { '$regex': regex } },
                            { "HOSPCODE.DISTRICT": { '$regex': regex } },
                            { "HOSPCODE.AMPHOE": { '$regex': regex } },
                            { "DLACODE.CODE": { '$regex': regex } },
                            { "DLACODE.NAME": { '$regex': regex } },
                            { "DLACODE.DISTRICT": { '$regex': regex } },
                            { "DLACODE.AMPHOE": { '$regex': regex } },
                            { "PROVIDERTYPE": { '$regex': regex } },
                            { "LICENCE_NUMBER": { '$regex': regex } },
                            { "POSITIONCODE": { '$regex': regex } },
                        ]
                    },
                ],
                "confirm": true,
                "zone": { $regex: zone.toString() }
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CG_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                EDUCATION: "$EDUCATION",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "สำนักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "โรงพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "กศน.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "08"] }, "วิทยาลัยพยาบาล", "อื่นๆ"] }] }] }] }] }] }] }] },
                THOUR: "$TRAININGHOUR",
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "ดูแลผู้สูงอายุตาม Care Plan", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "ยังไม่มีผู้สูงอายุในความดูแล", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "เสียชีวิต", ""] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'EDUCATION', title: 'ระดับการศึกษา' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'THOUR', title: 'หลักสูตร' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCGจังหวัด' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlsprocg/:findxxx/:zone/:status/:pro', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.pro;
        var status = this.params.status;
        var zone = this.params.zone;

        var find = {
            $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }],
            "confirm": true,
            "STATE_ACTIVE": status,
            "zone": { $regex: zone.toString() },
        };
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                $and: [
                    { $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }] },
                    {
                        $or: [
                            { "CID": { '$regex': regex } },
                            { "PRENAME": { '$regex': regex } },
                            { "NAME": { '$regex': regex } },
                            { "LNAME": { '$regex': regex } },
                            { "SEX": { '$regex': regex } },
                            { "MOBILE": { '$regex': regex } },
                            { "HOSPCODE.CODE": { '$regex': regex } },
                            { "HOSPCODE.NAME": { '$regex': regex } },
                            { "HOSPCODE.DISTRICT": { '$regex': regex } },
                            { "HOSPCODE.AMPHOE": { '$regex': regex } },
                            { "DLACODE.CODE": { '$regex': regex } },
                            { "DLACODE.NAME": { '$regex': regex } },
                            { "DLACODE.DISTRICT": { '$regex': regex } },
                            { "DLACODE.AMPHOE": { '$regex': regex } },
                            { "PROVIDERTYPE": { '$regex': regex } },
                            { "LICENCE_NUMBER": { '$regex': regex } },
                            { "POSITIONCODE": { '$regex': regex } },
                        ]
                    },
                ],
                "STATE_ACTIVE": status,
                "zone": { $regex: zone.toString() },
                "confirm": true
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CG_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                EDUCATION: "$EDUCATION",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "สำนักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "โรงพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "กศน.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "08"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] }] },
                THOUR: "$TRAININGHOUR",
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "ดูแลผู้สูงอายุตาม Care Plan", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "ยังไม่มีผู้สูงอายุในความดูแล", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "เสียชีวิต", ""] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var state = ""
        if (status == "01") {
            state = "ดูแลผู้สูงอายุตาม Care Plan"
        } else if (status == "02") {
            state = "ยังไม่มีผู้สูงอายุในความดูแล"
        } else if (status == "03") {
            state = "ต้องได้รับการฟื้นฟูศักยภาพ"
        } else if (status == "04") {
            state = "ลาออก"
        } else if (status == "05") {
            state = "เสียชีวิต"
        }
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'EDUCATION', title: 'ระดับการศึกษา' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'THOUR', title: 'หลักสูตร' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCGที่มีสถานะการปฎิบัติงาน' + state + 'จังหวัด' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlsprocmall/:findxxx/:zone/:pro', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.pro;
        var zone = this.params.zone
        var find = {
            $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }],
            "confirm": true,
            "zone": { $regex: zone.toString() },
        }
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                $and: [
                    { $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }] },
                    {
                        $or: [
                            { "CID": { '$regex': regex } },
                            { "PRENAME": { '$regex': regex } },
                            { "NAME": { '$regex': regex } },
                            { "LNAME": { '$regex': regex } },
                            { "SEX": { '$regex': regex } },
                            { "MOBILE": { '$regex': regex } },
                            { "HOSPCODE.CODE": { '$regex': regex } },
                            { "HOSPCODE.NAME": { '$regex': regex } },
                            { "HOSPCODE.DISTRICT": { '$regex': regex } },
                            { "HOSPCODE.AMPHOE": { '$regex': regex } },
                            { "DLACODE.CODE": { '$regex': regex } },
                            { "DLACODE.NAME": { '$regex': regex } },
                            { "DLACODE.DISTRICT": { '$regex': regex } },
                            { "DLACODE.AMPHOE": { '$regex': regex } },
                            { "PROVIDERTYPE": { '$regex': regex } },
                            { "LICENCE_NUMBER": { '$regex': regex } },
                            { "POSITIONCODE": { '$regex': regex } },
                        ]
                    },
                ],
                "confirm": true,
                "zone": { $regex: zone.toString() }
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CM_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                PROVIDERTYPE: { $cond: [{ $eq: ["$PROVIDERTYPE", "01"] }, "แพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "02"] }, "ทันตแพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "03"] }, "พยาบาลวิชาชีพ", { $cond: [{ $eq: ["$PROVIDERTYPE", "04"] }, "เจ้าพนักงานสาธารณสุขชุมชน", { $cond: [{ $eq: ["$PROVIDERTYPE", "05"] }, "นักวิชาการสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "06"] }, "เจ้าพนักงานทันตสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "07"] }, "อสม.(ผู้ให้บริการในชุมชน)", { $cond: [{ $eq: ["$PROVIDERTYPE", "08"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์ทางเลือก (ที่มีวุฒิการศึกษาหรือผ่าน การอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "09"] }, "อื่นๆ", { $cond: [{ $eq: ["$PROVIDERTYPE", "10"] }, "ผู้ดูแลผู้ป่วยที่บ้าน", { $cond: [{ $eq: ["$PROVIDERTYPE", "11"] }, "เภสัชกร", { $cond: [{ $eq: ["$PROVIDERTYPE", "081"] }, "แพทย์แผนไทย/แพทย์แผนไทยประยุกต์ :(ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "082"] }, "หมอพื้นบ้าน : (ที่มีใบประกอบวิชาชีพฯ หรือได้รับการรับรองตามระเบียบกรมการ แพทย์แผนไทยฯ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "083"] }, "แพทย์แผนจีน : (ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "084"] }, "ผู้ช่วยแพทย์แผนไทย : (ที่ผ่านการอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "085"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์แผนจีน แพทย์ทางเลือก : (ที่มีวุฒิ การศึกษาหรือผ่านการอบรมตามเกณฑ์)", ""] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] },
                LICENCE_NUMBER: "$LICENCE_NUMBER",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "กรมอนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "สํานักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] },
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "CM ปฏิบัติการ", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "CM บริหาร", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "เกษียณอายุการทำงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "06"] }, "เปลี่ยนงาน / ย้ายงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "07"] }, "เสียชีวิต", ""] }] }] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'PROVIDERTYPE', title: 'ประเภทบุคลากร' }, { key: 'LICENCE_NUMBER', title: 'รหัสใบประกอบวิชาชีพ' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCMจังหวัด' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlsprocm/:findxxx/:zone/:status/:pro', { // API 2
        where: 'server'
    }).get(function () {
        var status = this.params.status;
        var str = this.params.findxxx;
        var a = this.params.pro;
        var zone = this.params.zone
        var find = {
            $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }],
            "confirm": true,
            "zone": { $regex: zone.toString() },
            "STATE_ACTIVE": status,
        }
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                $and: [
                    { $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }] },
                    {
                        $or: [
                            { "CID": { '$regex': regex } },
                            { "PRENAME": { '$regex': regex } },
                            { "NAME": { '$regex': regex } },
                            { "LNAME": { '$regex': regex } },
                            { "SEX": { '$regex': regex } },
                            { "MOBILE": { '$regex': regex } },
                            { "HOSPCODE.CODE": { '$regex': regex } },
                            { "HOSPCODE.NAME": { '$regex': regex } },
                            { "HOSPCODE.DISTRICT": { '$regex': regex } },
                            { "HOSPCODE.AMPHOE": { '$regex': regex } },
                            { "DLACODE.CODE": { '$regex': regex } },
                            { "DLACODE.NAME": { '$regex': regex } },
                            { "DLACODE.DISTRICT": { '$regex': regex } },
                            { "DLACODE.AMPHOE": { '$regex': regex } },
                            { "PROVIDERTYPE": { '$regex': regex } },
                            { "LICENCE_NUMBER": { '$regex': regex } },
                            { "POSITIONCODE": { '$regex': regex } },
                        ]
                    },
                ],
                "confirm": true,
                "zone": { $regex: zone.toString() },
                "STATE_ACTIVE": status,
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CM_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                PROVIDERTYPE: { $cond: [{ $eq: ["$PROVIDERTYPE", "01"] }, "แพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "02"] }, "ทันตแพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "03"] }, "พยาบาลวิชาชีพ", { $cond: [{ $eq: ["$PROVIDERTYPE", "04"] }, "เจ้าพนักงานสาธารณสุขชุมชน", { $cond: [{ $eq: ["$PROVIDERTYPE", "05"] }, "นักวิชาการสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "06"] }, "เจ้าพนักงานทันตสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "07"] }, "อสม.(ผู้ให้บริการในชุมชน)", { $cond: [{ $eq: ["$PROVIDERTYPE", "08"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์ทางเลือก (ที่มีวุฒิการศึกษาหรือผ่าน การอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "09"] }, "อื่นๆ", { $cond: [{ $eq: ["$PROVIDERTYPE", "10"] }, "ผู้ดูแลผู้ป่วยที่บ้าน", { $cond: [{ $eq: ["$PROVIDERTYPE", "11"] }, "เภสัชกร", { $cond: [{ $eq: ["$PROVIDERTYPE", "081"] }, "แพทย์แผนไทย/แพทย์แผนไทยประยุกต์ :(ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "082"] }, "หมอพื้นบ้าน : (ที่มีใบประกอบวิชาชีพฯ หรือได้รับการรับรองตามระเบียบกรมการ แพทย์แผนไทยฯ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "083"] }, "แพทย์แผนจีน : (ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "084"] }, "ผู้ช่วยแพทย์แผนไทย : (ที่ผ่านการอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "085"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์แผนจีน แพทย์ทางเลือก : (ที่มีวุฒิ การศึกษาหรือผ่านการอบรมตามเกณฑ์)", ""] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] },
                LICENCE_NUMBER: "$LICENCE_NUMBER",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "กรมอนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "สํานักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] },
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "CM ปฏิบัติการ", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "CM บริหาร", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "เกษียณอายุการทำงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "06"] }, "เปลี่ยนงาน / ย้ายงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "07"] }, "เสียชีวิต", ""] }] }] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray();
        var stat = ""
        if (status == "01") {
            stat = "CM ปฏิบัติการ"
        } else if (status == "02") {
            stat = "CM บริหาร"
        } else if (status == "03") {
            stat = "ต้องได้รับการฟื้นฟูศักยภาพ"
        } else if (status == "04") {
            stat = "เกษียณอายุการทำงาน"
        } else if (status == "05") {
            stat = "ลาออก"
        } else if (status == "06") {
            stat = "เสียชีวิต"
        }
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'PROVIDERTYPE', title: 'ประเภทบุคลากร' }, { key: 'LICENCE_NUMBER', title: 'รหัสใบประกอบวิชาชีพ' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCMที่มีสถานะปฎิบัติงาน' + stat + 'จังหวัด' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlsdiscmall/:findxxx/:zone/:pro', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.pro;
        var zone = this.params.zone
        var find = {
            $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }],
            "confirm": true,
            "zone": { $regex: zone.toString() },
        }
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                $and: [
                    { $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }] },
                    {
                        $or: [
                            { "CID": { '$regex': regex } },
                            { "PRENAME": { '$regex': regex } },
                            { "NAME": { '$regex': regex } },
                            { "LNAME": { '$regex': regex } },
                            { "SEX": { '$regex': regex } },
                            { "MOBILE": { '$regex': regex } },
                            { "HOSPCODE.CODE": { '$regex': regex } },
                            { "HOSPCODE.NAME": { '$regex': regex } },
                            { "HOSPCODE.DISTRICT": { '$regex': regex } },
                            { "HOSPCODE.AMPHOE": { '$regex': regex } },
                            { "DLACODE.CODE": { '$regex': regex } },
                            { "DLACODE.NAME": { '$regex': regex } },
                            { "DLACODE.DISTRICT": { '$regex': regex } },
                            { "DLACODE.AMPHOE": { '$regex': regex } },
                            { "PROVIDERTYPE": { '$regex': regex } },
                            { "LICENCE_NUMBER": { '$regex': regex } },
                            { "POSITIONCODE": { '$regex': regex } },
                        ]
                    },
                ],
                "confirm": true,
                "zone": { $regex: zone.toString() }
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CM_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                PROVIDERTYPE: { $cond: [{ $eq: ["$PROVIDERTYPE", "01"] }, "แพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "02"] }, "ทันตแพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "03"] }, "พยาบาลวิชาชีพ", { $cond: [{ $eq: ["$PROVIDERTYPE", "04"] }, "เจ้าพนักงานสาธารณสุขชุมชน", { $cond: [{ $eq: ["$PROVIDERTYPE", "05"] }, "นักวิชาการสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "06"] }, "เจ้าพนักงานทันตสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "07"] }, "อสม.(ผู้ให้บริการในชุมชน)", { $cond: [{ $eq: ["$PROVIDERTYPE", "08"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์ทางเลือก (ที่มีวุฒิการศึกษาหรือผ่าน การอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "09"] }, "อื่นๆ", { $cond: [{ $eq: ["$PROVIDERTYPE", "10"] }, "ผู้ดูแลผู้ป่วยที่บ้าน", { $cond: [{ $eq: ["$PROVIDERTYPE", "11"] }, "เภสัชกร", { $cond: [{ $eq: ["$PROVIDERTYPE", "081"] }, "แพทย์แผนไทย/แพทย์แผนไทยประยุกต์ :(ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "082"] }, "หมอพื้นบ้าน : (ที่มีใบประกอบวิชาชีพฯ หรือได้รับการรับรองตามระเบียบกรมการ แพทย์แผนไทยฯ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "083"] }, "แพทย์แผนจีน : (ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "084"] }, "ผู้ช่วยแพทย์แผนไทย : (ที่ผ่านการอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "085"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์แผนจีน แพทย์ทางเลือก : (ที่มีวุฒิ การศึกษาหรือผ่านการอบรมตามเกณฑ์)", ""] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] },
                LICENCE_NUMBER: "$LICENCE_NUMBER",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "กรมอนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "สํานักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] },
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "CM ปฏิบัติการ", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "CM บริหาร", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "เกษียณอายุการทำงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "06"] }, "เปลี่ยนงาน / ย้ายงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "07"] }, "เสียชีวิต", ""] }] }] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'PROVIDERTYPE', title: 'ประเภทบุคลากร' }, { key: 'LICENCE_NUMBER', title: 'รหัสใบประกอบวิชาชีพ' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCMจังหวัด' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlsdiscm/:findxxx/:zone/:status/:pro', { // API 2
        where: 'server'
    }).get(function () {
        var status = this.params.status;
        var str = this.params.findxxx;
        var a = this.params.pro;
        var zone = this.params.zone
        var find = {
            $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }],
            "confirm": true,
            "zone": { $regex: zone.toString() },
            "STATE_ACTIVE": status,
        }
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                $and: [
                    { $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }] },
                    {
                        $or: [
                            { "CID": { '$regex': regex } },
                            { "PRENAME": { '$regex': regex } },
                            { "NAME": { '$regex': regex } },
                            { "LNAME": { '$regex': regex } },
                            { "SEX": { '$regex': regex } },
                            { "MOBILE": { '$regex': regex } },
                            { "HOSPCODE.CODE": { '$regex': regex } },
                            { "HOSPCODE.NAME": { '$regex': regex } },
                            { "HOSPCODE.DISTRICT": { '$regex': regex } },
                            { "HOSPCODE.AMPHOE": { '$regex': regex } },
                            { "DLACODE.CODE": { '$regex': regex } },
                            { "DLACODE.NAME": { '$regex': regex } },
                            { "DLACODE.DISTRICT": { '$regex': regex } },
                            { "DLACODE.AMPHOE": { '$regex': regex } },
                            { "PROVIDERTYPE": { '$regex': regex } },
                            { "LICENCE_NUMBER": { '$regex': regex } },
                            { "POSITIONCODE": { '$regex': regex } },
                        ]
                    },
                ],
                "confirm": true,
                "zone": { $regex: zone.toString() },
                "STATE_ACTIVE": status,
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CM_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                PROVIDERTYPE: { $cond: [{ $eq: ["$PROVIDERTYPE", "01"] }, "แพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "02"] }, "ทันตแพทย์", { $cond: [{ $eq: ["$PROVIDERTYPE", "03"] }, "พยาบาลวิชาชีพ", { $cond: [{ $eq: ["$PROVIDERTYPE", "04"] }, "เจ้าพนักงานสาธารณสุขชุมชน", { $cond: [{ $eq: ["$PROVIDERTYPE", "05"] }, "นักวิชาการสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "06"] }, "เจ้าพนักงานทันตสาธารณสุข", { $cond: [{ $eq: ["$PROVIDERTYPE", "07"] }, "อสม.(ผู้ให้บริการในชุมชน)", { $cond: [{ $eq: ["$PROVIDERTYPE", "08"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์ทางเลือก (ที่มีวุฒิการศึกษาหรือผ่าน การอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "09"] }, "อื่นๆ", { $cond: [{ $eq: ["$PROVIDERTYPE", "10"] }, "ผู้ดูแลผู้ป่วยที่บ้าน", { $cond: [{ $eq: ["$PROVIDERTYPE", "11"] }, "เภสัชกร", { $cond: [{ $eq: ["$PROVIDERTYPE", "081"] }, "แพทย์แผนไทย/แพทย์แผนไทยประยุกต์ :(ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "082"] }, "หมอพื้นบ้าน : (ที่มีใบประกอบวิชาชีพฯ หรือได้รับการรับรองตามระเบียบกรมการ แพทย์แผนไทยฯ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "083"] }, "แพทย์แผนจีน : (ที่มีใบประกอบวิชาชีพ)", { $cond: [{ $eq: ["$PROVIDERTYPE", "084"] }, "ผู้ช่วยแพทย์แผนไทย : (ที่ผ่านการอบรมตามเกณฑ์)", { $cond: [{ $eq: ["$PROVIDERTYPE", "085"] }, "บุคลากรแพทย์แผนไทย แพทย์พื้นบ้าน แพทย์แผนจีน แพทย์ทางเลือก : (ที่มีวุฒิ การศึกษาหรือผ่านการอบรมตามเกณฑ์)", ""] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] },
                LICENCE_NUMBER: "$LICENCE_NUMBER",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "กรมอนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "สํานักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] },
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "CM ปฏิบัติการ", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "CM บริหาร", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "เกษียณอายุการทำงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "06"] }, "เปลี่ยนงาน / ย้ายงาน", { $cond: [{ $eq: ["$STATE_ACTIVE", "07"] }, "เสียชีวิต", ""] }] }] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray();
        var stat = ""
        if (status == "01") {
            stat = "CM ปฏิบัติการ"
        } else if (status == "02") {
            stat = "CM บริหาร"
        } else if (status == "03") {
            stat = "ต้องได้รับการฟื้นฟูศักยภาพ"
        } else if (status == "04") {
            stat = "เกษียณอายุการทำงาน"
        } else if (status == "05") {
            stat = "ลาออก"
        } else if (status == "06") {
            stat = "เสียชีวิต"
        }
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'PROVIDERTYPE', title: 'ประเภทบุคลากร' }, { key: 'LICENCE_NUMBER', title: 'รหัสใบประกอบวิชาชีพ' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCMที่มีสถานะปฎิบัติงาน' + stat + 'จังหวัด' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlsdiscgall/:findxxx/:zone/:pro', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.pro;
        var zone = this.params.zone
        var find = {
            $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }],
            "confirm": true,
            "zone": { $regex: zone.toString() },
        }
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                $and: [
                    { $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }] },
                    {
                        $or: [
                            { "CID": { '$regex': regex } },
                            { "PRENAME": { '$regex': regex } },
                            { "NAME": { '$regex': regex } },
                            { "LNAME": { '$regex': regex } },
                            { "SEX": { '$regex': regex } },
                            { "MOBILE": { '$regex': regex } },
                            { "HOSPCODE.CODE": { '$regex': regex } },
                            { "HOSPCODE.NAME": { '$regex': regex } },
                            { "HOSPCODE.DISTRICT": { '$regex': regex } },
                            { "HOSPCODE.AMPHOE": { '$regex': regex } },
                            { "DLACODE.CODE": { '$regex': regex } },
                            { "DLACODE.NAME": { '$regex': regex } },
                            { "DLACODE.DISTRICT": { '$regex': regex } },
                            { "DLACODE.AMPHOE": { '$regex': regex } },
                            { "PROVIDERTYPE": { '$regex': regex } },
                            { "LICENCE_NUMBER": { '$regex': regex } },
                            { "POSITIONCODE": { '$regex': regex } },
                        ]
                    },
                ],
                "confirm": true,
                "zone": { $regex: zone.toString() }
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CG_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                EDUCATION: "$EDUCATION",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "สำนักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "โรงพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "กศน.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "08"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] }] },
                THOUR: "$TRAININGHOUR",
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "ดูแลผู้สูงอายุตาม Care Plan", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "ยังไม่มีผู้สูงอายุในความดูแล", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "เสียชีวิต", ""] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'EDUCATION', title: 'ระดับการศึกษา' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'THOUR', title: 'หลักสูตร' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCGจังหวัด' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })

    Router.route('/xlsdiscg/:findxxx/:zone/:status/:pro', { // API 2
        where: 'server'
    }).get(function () {
        var str = this.params.findxxx;
        var a = this.params.pro;
        var status = this.params.status;
        var zone = this.params.zone;

        var find = {
            $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }],
            "confirm": true,
            "STATE_ACTIVE": status,
            "zone": { $regex: zone.toString() },
        };
        if (str && str !== "-") {
            var regex = new RegExp(str, 'i');
            find = {
                $and: [
                    { $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }] },
                    {
                        $or: [
                            { "CID": { '$regex': regex } },
                            { "PRENAME": { '$regex': regex } },
                            { "NAME": { '$regex': regex } },
                            { "LNAME": { '$regex': regex } },
                            { "SEX": { '$regex': regex } },
                            { "MOBILE": { '$regex': regex } },
                            { "HOSPCODE.CODE": { '$regex': regex } },
                            { "HOSPCODE.NAME": { '$regex': regex } },
                            { "HOSPCODE.DISTRICT": { '$regex': regex } },
                            { "HOSPCODE.AMPHOE": { '$regex': regex } },
                            { "DLACODE.CODE": { '$regex': regex } },
                            { "DLACODE.NAME": { '$regex': regex } },
                            { "DLACODE.DISTRICT": { '$regex': regex } },
                            { "DLACODE.AMPHOE": { '$regex': regex } },
                            { "PROVIDERTYPE": { '$regex': regex } },
                            { "LICENCE_NUMBER": { '$regex': regex } },
                            { "POSITIONCODE": { '$regex': regex } },
                        ]
                    },
                ],
                "STATE_ACTIVE": status,
                "zone": { $regex: zone.toString() },
                "confirm": true
            }
        }
        // var data = CG_REGISTER.find(find, {}).fetch();
        var data = CG_REGISTER.aggregate([{
            $match: find
        }, {
            $project: {
                _id: 0,
                CID: "$CID",
                PRENAME: "$PRENAME",
                NAME: "$NAME",
                LNAME: "$LNAME",
                SEX: { $cond: [{ $eq: ["$SEX", "1"] }, "ชาย", "หญิง"] },
                BIRTH: { $concat: [{ $toString: { $dayOfMonth: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } }, 543] } }] },
                AGE: { $toString: { $subtract: [new Date().getFullYear(), { $toInt: { $year: { date: "$BIRTH", timezone: "Asia/Bangkok" } } }] } },
                MOBILE: "$MOBILE",
                EMAIL: "$EMAIL",
                ADDRESS: "$ADDRESS",
                POSITIONCODE: "$POSITIONCODE",
                EDUCATION: "$EDUCATION",
                COMPANY: { $cond: [{ $ne: ["$HOSPCODE", null] }, "$HOSPCODE.NAME", "$DLACODE.NAME"] },
                COMP_DISTRICT: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.DISTRICT", 3, -1] }, "$DLACODE.DISTRICT"] },
                COMP_AMPHOE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.AMPHOE", 3, -1] }, "$DLACODE.AMPHOE"] },
                COMP_PROVINCE: { $cond: [{ $ne: ["$HOSPCODE", null] }, { $substr: ["$HOSPCODE.PROVINCE", 3, -1] }, "$DLACODE.PROVINCE"] },
                TAMBON: { $concat: ["ต.", "$TAMBON.DISTRICT", " อ.", "$TAMBON.AMPHOE", " จ.", "$TAMBON.PROVINCE"] },
                TDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$TRAINING_DATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                EDATE: { $concat: [{ $toString: { $dayOfMonth: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $month: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } } }, "/", { $toString: { $add: [{ $year: { date: "$EXPIREDATE", timezone: "Asia/Bangkok" } }, 543] } }] },
                TCENTER: { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "01"] }, "ศูนย์อนามัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "02"] }, "สำนักงานสาธารณสุขจังหวัด", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "03"] }, "สำนักงานสาธารณสุขอำเภอ/คปสอ.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "04"] }, "โรงพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "05"] }, "กศน.", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "06"] }, "มหาวิทยาลัย", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "07"] }, "วิทยาลัยพยาบาล", { $cond: [{ $eq: ["$TRAINING_CENTER_ID", "08"] }, "กรมอนามัยและศูนย์เขตอนามัย", "อื่นๆ"] }] }] }] }] }] }] }] },
                THOUR: "$TRAININGHOUR",
                STATUS: { $cond: [{ $eq: ["$STATE_ACTIVE", "01"] }, "ดูแลผู้สูงอายุตาม Care Plan", { $cond: [{ $eq: ["$STATE_ACTIVE", "02"] }, "ยังไม่มีผู้สูงอายุในความดูแล", { $cond: [{ $eq: ["$STATE_ACTIVE", "03"] }, "ต้องได้รับการฟื้นฟูศักยภาพ", { $cond: [{ $eq: ["$STATE_ACTIVE", "04"] }, "ลาออก", { $cond: [{ $eq: ["$STATE_ACTIVE", "05"] }, "เสียชีวิต", ""] }] }] }] }] },
                zone: "$zone",
                CREATEDATE: "$CREATEDATE"

            }
        }, { $sort: { CREATEDATE: -1 } }]).toArray()
        var state = ""
        if (status == "01") {
            state = "ดูแลผู้สูงอายุตาม Care Plan"
        } else if (status == "02") {
            state = "ยังไม่มีผู้สูงอายุในความดูแล"
        } else if (status == "03") {
            state = "ต้องได้รับการฟื้นฟูศักยภาพ"
        } else if (status == "04") {
            state = "ลาออก"
        } else if (status == "05") {
            state = "เสียชีวิต"
        }
        var fields = [{ key: 'CID', title: 'รหัสบัตรประชาชน' }, { key: 'PRENAME', title: 'คำนำหน้า' }, { key: 'NAME', title: 'ชื่อ' }, { key: 'LNAME', title: 'นามสกุล' }, { key: 'SEX', title: 'เพศ' }, { key: 'BIRTH', title: 'วันเดือนปีเกิด' }, { key: 'AGE', title: 'อายุ' }, { key: 'MOBILE', title: 'เบอร์โทรติดต่อ' }, { key: 'EMAIL', title: 'อีเมลล์' }, { key: 'ADDRESS', title: 'ที่อยู่' }, { key: 'POSITIONCODE', title: 'ตำแหน่งที่ปฎิบัติงาน' }, { key: 'EDUCATION', title: 'ระดับการศึกษา' }, { key: 'COMPANY', title: 'ชื่อหน่วยบริการ' }, { key: 'COMP_DISTRICT', title: 'ตำบลหน่วยบริการ' }, { key: 'COMP_AMPHOE', title: 'อำเภอหน่วยบริการ' }, { key: 'COMP_PROVINCE', title: 'จังหวัดหน่วยบริการ' }, { key: 'TAMBON', title: 'ตำบลที่ปฎิบัติงาน' }, { key: 'TDATE', title: 'วันที่อบรม' }, { key: 'EDATE', title: 'วันที่ต้องได้รับการฟื้นฟู' }, { key: 'TCENTER', title: 'สถานที่จัดอบรม' }, { key: 'THOUR', title: 'หลักสูตร' }, { key: 'STATUS', title: 'ลักษณะการปฏิบัติงาน' }, { key: 'zone', title: 'ศูนย์เขตอนามัย' }];
        var title = 'รายชื่อCGที่มีสถานะการปฎิบัติงาน' + state + 'จังหวัด' + a;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');
    })


    // kanut 
    Router.route('/xlstambonassessment/:username/:chosenProvinceID/:chosenAmphoeID', { // API 2
        where: 'server'
    }).get(function () {
        let username = this.params.username;
        let chosenProvinceID = parseInt(this.params.chosenProvinceID);
        let chosenAmphoeID = parseInt(this.params.chosenAmphoeID);
        console.log(`username= ${username}`);
        console.log(`chosenProvinceID= ${chosenProvinceID}`);
        console.log(`chosenAmphoeID= ${chosenAmphoeID}`);
        let user = USER_LOGIN.find({ USERNAME: username }).fetch().pop();

        userRole = user.RULE;
        console.log(user.USERNAME, userRole, user.PROVINCENUM);
        assessmentList = tambonAssessment.find().fetch().sort((a, b) => a.ID - b.ID);
        tambonList = tambons.find().fetch().sort((a, b) => a.ID - b.ID);
        //merge 2 collections
        let tambonAssessmentList = [];
        for (let i = 0, len = tambonList.length; i < len; i++) {
            if (tambonList[i].ID === assessmentList[i].ID) {
                tambonAssessmentList[i] = { ...tambonList[i], ...assessmentList[i] };
            } else {
                console.log(i, tambonList[i].ID, assessmentList[i].ID, " <== Not matched.");
            }
        }
        console.log(`tambonAssessmentList length = ${tambonAssessmentList.length}`)


        if (userRole === "HPC") {
            let zone = parseInt(user.ZONE);
            let provinceList = provinces.find({ zoneID: zone }).fetch();
            let provinceListIDs = provinceList.map((item) => item.ID);
            console.log('provinceList=', provinceList.length);
            tambonAssessmentList = tambonAssessmentList.filter((item) =>
                provinceListIDs.includes(parseInt(item.ID / 10000)));
            if (chosenProvinceID > 0) {
                tambonAssessmentList = tambonAssessmentList.filter((item) =>
                    chosenProvinceID === (parseInt(item.ID / 10000)));
            }
            if (chosenAmphoeID > 0) {
                tambonAssessmentList = tambonAssessmentList.filter((item) =>
                    chosenAmphoeID === (parseInt(item.ID / 100)));
            }


        } else if (userRole = "PROVINCE") {
            let provinceID = parseInt(user.PROVINCENUM);
            tambonAssessmentList = tambonAssessmentList.filter((item) => parseInt(item.ID / 10000) === provinceID);
            console.log(tambonAssessmentList.length);
            if (chosenAmphoeID != 0) {
                tambonAssessmentList = tambonAssessmentList.filter((item) => parseInt(item.ID / 100) === chosenAmphoeID);
            }

        }
        tambonAssessmentList.forEach((item, index, self) => {
            if (item.c1 !== true) { item.c1 = "false"; }
            if (item.c2 !== true) { item.c2 = "false"; }
            if (item.c3 !== true) { item.c3 = "false"; }
            if (item.c4 !== true) { item.c4 = "false"; }
            if (item.c5 !== true) { item.c5 = "false"; }
            if (item.c6 !== true) { item.c6 = "false"; }
            if (item.joinYear === -1) { item.joinYear = "ไม่เข้าร่วม"; }
            else if (item.joinYear === 0) { item.joinYear = "ไม่ระบุ"; }
            if (item.assessYear <= 0) { item.assessYear = "ไม่ระบุ"; }
        })
        data = tambonAssessmentList;
        console.log('data length= ', data.length);

        let date = new Date();
        let dateStr = `_${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;
        var fields = [{ key: 'ID', title: 'รหัสตำบล' },
        { key: 'name', title: 'ชื่อตำบล' },
        { key: 'joinYear', title: 'ปีเข้าร่วม' },
        { key: 'assessYear', title: 'ปีที่ประเมิน' },
        { key: 'c1', title: 'องค์ประกอบ 1' },
        { key: 'c2', title: 'องค์ประกอบ 2' },
        { key: 'c3', title: 'องค์ประกอบ 3' },
        { key: 'c4', title: 'องค์ประกอบ 4' },
        { key: 'c5', title: 'องค์ประกอบ 5' },
        { key: 'c6', title: 'องค์ประกอบ 6' },
        { key: 'verdict', title: "ผลการประเมิน" },
        { key: 'remark', title: "หมายเหตุ" }

        ];
        var title = 'assessment_' + username + dateStr;
        var newtitle = encodeURIComponent(title.replace(/(\r\n\t|\n|\r\t)/gm, ""));
        var file = Excel.export(newtitle, fields, data);
        var headers = {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Disposition': 'attachment; filename=' + newtitle + '.xlsx'
        };

        this.response.writeHead(200, headers);
        this.response.end(file, 'binary');

    })

});

