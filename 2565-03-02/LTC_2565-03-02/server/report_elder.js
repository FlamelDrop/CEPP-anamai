import {
    Meteor
} from 'meteor/meteor';
import '../imports/db.js';

import {
    ELDERLYREGISTER
} from '../imports/db.js';

Meteor.startup(() => {

    Meteor.methods({
        countElderByZone(isNhso) {
            var data = ELDERLYREGISTER.aggregate([
                // Stage 5
                {
                    $match: {
                        NHSO: { $exists: isNhso }
                    }
                },
                {
                    $group: {
                        _id: { zone: "$ZONE", group: "$GROUPID" },
                        count: { $sum: 1 }

                    }
                },

                {
                    $sort: {
                        "_id.zone": 1,
                        "_id.group": 1
                    }
                }

            ]);

            return data
        },
        countElderOnlyZone() {
            var data = ELDERLYREGISTER.aggregate([{
                $match: {
                    NHSO: true
                }
            },
            // Stage 5
            {
                $group: {
                    _id: "$ZONE",
                    count: { $sum: 1 }

                }
            },

            {
                $sort: {
                    "_id": 1,
                }
            }

            ]);

            return data
        },
        countElderByProvince(zone, isNhso) {
            var data = ELDERLYREGISTER.aggregate([{
                $match: {
                    ZONE: zone,
                    NHSO: { $exists: isNhso }
                }
            },
            // Stage 5
            {
                $group: {
                    _id: { province: "$SERVICE_CENTER.PROVINCE", group: "$GROUPID" },
                    count: { $sum: 1 }

                }
            },

            {
                $sort: {
                    "_id.province": 1,
                    "_id.group": 1
                }
            }

            ]);

            return data
        },
        countElderByAmphoe(province, isNhso) {
            var data = ELDERLYREGISTER.aggregate([{
                $match: {
                    "SERVICE_CENTER.PROVINCE": province,
                    NHSO: { $exists: isNhso }
                }
            },
            // Stage 5
            {
                $group: {
                    _id: { amphoe: "$SERVICE_CENTER.AMPHOE", group: "$GROUPID" },
                    count: { $sum: 1 }

                }
            },

            {
                $sort: {
                    "_id.amphoe": 1,
                    "_id.group": 1
                }
            }

            ]);

            return data
        },
        countElderByTambon(amphoe, isNhso) {
            var data = ELDERLYREGISTER.aggregate([{
                $match: {
                    "SERVICE_CENTER.AMPHOE": amphoe,
                    NHSO: { $exists: isNhso }
                }
            },
            // Stage 5
            {
                $group: {
                    _id: { tambon: "$SERVICE_CENTER.DISTRICT", group: "$GROUPID" },
                    count: { $sum: 1 }

                }
            },

            {
                $sort: {
                    "_id.tambon": 1,
                    "_id.group": 1
                }
            }

            ]);

            return data
        },
        countElderByHosp(amphoe, isNhso, tambon) {
            var data = ELDERLYREGISTER.aggregate([{
                $match: {
                    "SERVICE_CENTER.AMPHOE": amphoe,
                    "SERVICE_CENTER.DISTRICT": tambon,
                    NHSO: { $exists: isNhso }
                }
            },
            // Stage 5
            {
                $group: {
                    _id: { hospname: "$SERVICE_CENTER.NAME", group: "$GROUPID" },
                    count: { $sum: 1 }

                }
            },

            {
                $sort: {
                    "_id.hospname": 1,
                    "_id.group": 1
                }
            }

            ]);

            return data
        },
        countElderByHosp_full(zone, province, amphoe, fpro, year, database, healty, retire, typeOf, sex) {
            //console.log('zone: ', zone);
            //console.log('province: ', province);
            //console.log('amphoe: ', amphoe);
            //console.log('fpro: ', fpro);
            //console.log('year: ', year);
            //console.log('database: ', database);
            //console.log('healty: ', healty);
            //console.log('retire: ', retire);
            //console.log('typeOf: ', typeOf);
            //console.log('sex: ', sex);

            let project_obj = searchElder(zone, province, amphoe, fpro, year, database, healty, retire, typeOf, sex).project
            let match_obj = searchElder(zone, province, amphoe, fpro, year, database, healty, retire, typeOf, sex).match
            let group_obj = searchElder(zone, province, amphoe, fpro, year, database, healty, retire, typeOf, sex).group

            var data = ELDERLYREGISTER.aggregate([
                project_obj,
                match_obj,
                group_obj,
                {
                    $sort: {
                        "_id.hospname": 1,
                        "_id.group": 1
                    }
                }

            ]);

            //console.log(group_obj);
            //console.log(project_obj);
            //console.log(match_obj);
            //console.log(match_obj["$match"].STATUS);
            //console.log(match_obj["$match"]["SERVICE_CENTER.PROVINCE"]);
            //console.log('111111111111111111111111111111111111111111111111');

            return data
        },
    })
});

const searchElder = function (zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex) {
    let match_elder, group_elder, project_obj
    //console.log('zone: ', zone);
    //console.log('ปี: ', year);
    //console.log('จังหวัด: ', pro);
    //console.log('ตำบล: ', amp);
    //console.log('จังหวัดทั้งหมด: ', fpro);
    //console.log('--------------------');

    if (zone == 'ทั้งหมด' && pro == '' && amp == '') { //หาจังหวัด
        //console.log(zone, pro, amp)
        match_elder = searchProvince(zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //     }
        // }
        group_elder = {
            $group: {
                _id: { hospname: "$ZONE", group: "$GROUPID" },
                count: { $sum: 1 }
            }
        }
    } else if (zone != 'ทั้งหมด' && pro == '' && amp == '') { //หาจังหวัด
        //console.log(zone, pro, amp)
        match_elder = searchNotProvince(zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //         ZONE: zone
        //     }
        // }
        group_elder = {
            $group: {
                _id: { hospname: "$SERVICE_CENTER.PROVINCE", group: "$GROUPID" },
                count: { $sum: 1 }
            }
        }
    } else if (zone && pro && amp == '') { //หาอำเภอ
        //console.log(zone, pro, amp)
        match_elder = searchAmphoe(zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //         ZONE: zone,
        //         "SERVICE_CENTER.PROVINCE": pro
        //     }
        // }
        group_elder = {
            $group: {
                _id: { hospname: "$SERVICE_CENTER.AMPHOE", group: "$GROUPID" },
                count: { $sum: 1 }
            }
        }

    } else if (zone && pro && amp == 'ทั้งหมด') { //หาอำเภอ
        //console.log(zone, pro, amp)
        match_elder = searchAmphoe(zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //         ZONE: zone,
        //         "SERVICE_CENTER.PROVINCE": pro
        //     }
        // }
        group_elder = {
            $group: {
                _id: { hospname: "$SERVICE_CENTER.CODE", group: "$GROUPID" },
                count: { $sum: 1 }
            }
        }
    } else if (zone && pro && amp) { //หาตำบล
        //console.log(year, zone, pro, amp);
        match_elder = searchDistrict(zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //         ZONE: zone,
        //         "SERVICE_CENTER.PROVINCE": pro,
        //         "SERVICE_CENTER.AMPHOE": amp
        //     }
        // }
        group_elder = {
            $group: {
                _id: { hospname: "$SERVICE_CENTER.CODE", group: "$GROUPID" },
                count: { $sum: 1 }
            }
        }
    }

    if (year == 'ทั้งหมด') {
        project_obj = {
            $project: {
                AGE: { $floor:{ "$divide": [ { "$subtract": [ new Date(), "$BIRTHDATE" ] }, (365*24*60*60*1000) ]}},
                NHSO: 1,
                ZONE: 1,
                SERVICE_CENTER: 1,
                GROUPID: 1,
                CID: 1,
                STATUS: 1,
                PRENAME:1,
                PRIVILEGE: 1,
                MAINSCLCODE: 1
            }
        }
        delete match_elder['$match'].BUDGETYEAR
    } else {
        project_obj = {
            $project: {
                BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                ZONE: 1,
                SERVICE_CENTER: 1,
                NHSO: 1,
                GROUPID: 1,
                CID: 1,
                STATUS: 1,
                PRENAME:1,
                PRIVILEGE: 1,
                MAINSCLCODE: 1,
                AGE: { $floor:{ "$divide": [ { "$subtract": [ new Date(), "$BIRTHDATE" ] }, (365*24*60*60*1000) ]}},
            }

        }

    }

    return { match: match_elder, group: group_elder, project: project_obj }
}

// หาจังหวัด
const searchProvince = function (zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex) {
    let match_elder
    //console.log("searchProvince");
    //console.log(year);

    if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ',  'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง','ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    }

    if (year == 'ทั้งหมด') {
        //console.log('99999999999999');
        delete match_elder['$match'].BUDGETYEAR
    }

    // //console.log(match_elder)
    return match_elder
}

// หาจังหวัด !
const searchNotProvince = function (zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex) {
    let match_elder
    //console.log("searchNotProvince");
    
    if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    }  else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro },
            }
        }
    }

    if (year == 'ทั้งหมด') {
        delete match_elder['$match'].BUDGETYEAR
    }

    // // //console.log(match_elder)
    return match_elder
}

//หาอำเภอ 
const searchAmphoe = function (zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex) {

    let match_elder
    //console.log("searchAmphoe");

    if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        // //console.log(zone)
        // //console.log(year.toString())
        // //console.log(pro)
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    }

    else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    }
    
    

    else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
            }
        }
    }

    if (year == 'ทั้งหมด') {
        delete match_elder['$match'].BUDGETYEAR
    }

    // //console.log(match_elder)
    return match_elder
}

//หาตำบล
const searchDistrict = function (zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex) {

    let match_elder
    //console.log("searchDistrict");

    if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    }
    else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp
            }
        }
    }
    
    
    
    
    
    
    else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    }
    else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        // //console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro,
                "SERVICE_CENTER.AMPHOE": amp,
            }
        }
    }

    if (year == 'ทั้งหมด') {
        delete match_elder['$match'].BUDGETYEAR
    }

    // //console.log(match_elder)
    return match_elder
}