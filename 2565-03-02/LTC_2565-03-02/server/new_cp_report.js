import {
    Meteor
} from 'meteor/meteor';
import '../imports/db.js';

import {
    ELDERLYREGISTER
} from '../imports/db.js';

import {
    CAREPLAN_DETAIL
} from '../imports/db.js';

import {
    EVALUATE_DISTRICT
} from '../imports/db.js';

import {
    SERVICE_CENTER
} from '../imports/db.js';

// db.getCollection("ELDERLYREGISTER").aggregate([
//     {
//      $project: {
//          HOSPCODE: "$HOSPCODE",
//          BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
//      }
//     },
//     {
//         $match: {
//             BUDGETYEAR: {$regex: ''},
//             HOSPCODE: "05811"
//         }
//     }
// ]);

function getProvince(province) {
    let _province = province.split('-')
    return _province[1]
}

function getDistrict(district) {
    let _district = district.split('-')
    return _district[1]
}

function getYearForCarePlan(year) {
    if (year.length != 4) {
        return ''
    } else {
        return year[2] + year[3]
    }
}

function LoopFindHospcode(json) {
    if (json.length <= 0) {
        return []
    } else {
        let data = []
        for (let i = 0; i < json.length; i++) {
            data.push(json[i].hospcode)
            if (i == (json.length - 1)) {
                // console.log(data)
                return data
            }
        }
    }
}

function LoopFindElder(json) {
    if (json.length <= 0) {
        return []
    } else {
        let data = []
        for (let i = 0; i < json.length; i++) {
            data.push(json[i].CID)
            if (i == (json.length - 1)) {
                // console.log(data)
                return data
            }
        }
    }
}

function findCarePlane(hospcode, year, loop) {
    return new Promise((resolve, reject) => {
        var data = CAREPLAN_DETAIL.aggregate([
            {
                $match: {
                    HOSPCODE: hospcode,
                    CID: { $in: loop }
                }
            },
            {
                $group: {
                    _id: {
                        CID: '$CID'
                    }
                }
            }
        ]);
        resolve(data);
    });
}

function findCarePlaneFromAllZone(hospcode, year, loop) {
    return new Promise((resolve, reject) => {
        var data = CAREPLAN_DETAIL.aggregate([
            {
                $match: {
                    HOSPCODE: { $in: hospcode },
                    CID: { $in: loop }
                }
            },
            {
                $group: {
                    _id: {
                        CID: '$CID'
                    }
                }
            }
        ]);
        resolve(data);
    });
}

function findElderyRegister(hospcode, year, db, permission, type, sex) {
    return new Promise((resolve, reject) => {
        var data = ELDERLYREGISTER.aggregate([
            {
                $project: {
                    HOSPCODE: "$HOSPCODE",
                    CID: "$CID",
                    NHSO:
                    {
                        $cond: { if: { $eq: ["$NHSO", true] }, then: "true", else: "false" }
                    },
                    MAINSCLCODE:
                    {
                        $cond: { if: { $eq: ["$MAINSCLCODE", "WEL"] }, then: "WEL", else: "ETC" }
                    },
                    STATUS: "$STATUS",
                    PRENAME:
                    {
                        $cond: { if: { $or: [{ $eq: ["$PRENAME", "เด็กชาย"] }, { $eq: ["$PRENAME", "นาย"] }] }, then: "ชาย", else: "หญิง" }
                    },
                    BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                }
            },
            {
                $match: {
                    HOSPCODE: hospcode,
                    NHSO: { $regex: db },
                    MAINSCLCODE: { $regex: permission },
                    STATUS: { $in: type },
                    BUDGETYEAR: { $regex: year },
                    PRENAME: { $regex: sex }
                }
            },
        ]);
        resolve(data);
    });
}

function findElderFromAllZone(hospcode, year, db, permission, type, sex) {
    return new Promise((resolve, reject) => {
        var data = ELDERLYREGISTER.aggregate([
            {
                $project: {
                    HOSPCODE: "$HOSPCODE",
                    CID: "$CID",
                    ZONE: "$ZONE",
                    NHSO:
                    {
                        $cond: { if: { $eq: ["$NHSO", true] }, then: "true", else: "false" }
                    },
                    MAINSCLCODE:
                    {
                        $cond: { if: { $eq: ["$MAINSCLCODE", "WEL"] }, then: "WEL", else: "ETC" }
                    },
                    STATUS: "$STATUS",
                    PRENAME:
                    {
                        $cond: { if: { $or: [{ $eq: ["$PRENAME", "เด็กชาย"] }, { $eq: ["$PRENAME", "นาย"] }] }, then: "ชาย", else: "หญิง" }
                    },
                    BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                }
            },
            {
                $match: {
                    HOSPCODE: { $in: hospcode },
                    NHSO: { $regex: db },
                    MAINSCLCODE: { $regex: permission },
                    STATUS: { $in: type },
                    BUDGETYEAR: { $regex: year },
                    PRENAME: { $regex: sex }
                }
            },
        ]);
        resolve(data);
    });
}

function findHospCodeFromAllZone(zone) {
    return new Promise((resolve, reject) => {
        var data = SERVICE_CENTER.aggregate([
            {
                $project: {
                    zone: "$zone",
                    hospcode: "$hospcode",
                    name: "$name"
                }
            },
            {
                $match: {
                    zone: { $regex: zone }
                }
            },
        ]);
        resolve(data);
    });
}

function findElderRegisterGroupFromAllZone(hospcode, year, db, permission, type, sex, group) {
    return new Promise((resolve, reject) => {
        var data = ELDERLYREGISTER.aggregate([
            {
                $project: {
                    HOSPCODE: "$HOSPCODE",
                    CID: "$CID",
                    ZONE: "$ZONE",
                    GROUPID: "$GROUPID",
                    NHSO:
                    {
                        $cond: { if: { $eq: ["$NHSO", true] }, then: "true", else: "false" }
                    },
                    MAINSCLCODE:
                    {
                        $cond: { if: { $eq: ["$MAINSCLCODE", "WEL"] }, then: "WEL", else: "ETC" }
                    },
                    STATUS: "$STATUS",
                    PRENAME:
                    {
                        $cond: { if: { $or: [{ $eq: ["$PRENAME", "เด็กชาย"] }, { $eq: ["$PRENAME", "นาย"] }] }, then: "ชาย", else: "หญิง" }
                    },
                    BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                }
            },
            {
                $match: {
                    HOSPCODE: { $in: hospcode },
                    GROUPID: { $regex: group },
                    NHSO: { $regex: db },
                    MAINSCLCODE: { $regex: permission },
                    STATUS: { $in: type },
                    BUDGETYEAR: { $regex: year },
                    PRENAME: { $regex: sex }
                }
            },
        ]);
        resolve(data.length);
    });
}

function findHospCodeFromAllProvince(province) {
    return new Promise((resolve, reject) => {
        var data = SERVICE_CENTER.aggregate([
            {
                $project: {
                    province: "$province",
                    hospcode: "$hospcode",
                    name: "$name"
                }
            },
            {
                $match: {
                    province: { $regex: province }
                }
            },
        ]);
        resolve(data);
    });
}

function findHospCodeFromAllDistrict(province, district) {
    // console.log(province)
    return new Promise((resolve, reject) => {
        var data = SERVICE_CENTER.aggregate([
            {
                $project: {
                    province: "$province",
                    hospcode: "$hospcode",
                    amphoe: "$amphoe",
                    name: "$name"
                }
            },
            {
                $match: {
                    province: { $regex: province },
                    amphoe: { $regex: district }
                }
            },
        ]);
        resolve(data);
    });
}

Meteor.startup(() => {

    Meteor.methods({

        //Coding by Poom
        findDistrict(province) {
            var data = EVALUATE_DISTRICT.aggregate([
                { $match: { province_name: { $in: [province] } } },
                { $group: { _id: "$district_name" } }
            ]);
            // console.log(data)
            return data
        },

        findCarePlane(hospcode) {
            var data = CAREPLAN_DETAIL.find({
                "HOSPCODE": { $regex: hospcode }
            }).count();
            console.log(data)
            return data
        },

        findDataAll(year, zone, province, district, db, permission, type, sex, search) {
            var data = SERVICE_CENTER.find({
                "zone": { $regex: zone },
                "province": { $regex: province },
                "amphoe": { $regex: district },
                $or: [
                    { "hospcode": { $regex: search } },
                    { "name": { $regex: search } },
                    { "province": { $regex: search } },
                    { "amphoe": { $regex: search } },
                    { "district": { $regex: search } },
                    { "zipcode": { $regex: search } },
                ]
            }).count();
            return data
        },

        async findElderyRegister(year, zone, province, district, db, permission, type, sex, search) {
            let result = []
            // console.log(zone)
            // console.log(province)
            // console.log(district)
            
            var data = SERVICE_CENTER.aggregate([{
                $match: {
                    "zone": { $regex: zone },
                    "province": { $regex: province },
                    "amphoe": { $regex: district },
                    $or: [
                        { "hospcode": { $regex: search } },
                        { "name": { $regex: search } },
                        { "province": { $regex: search } },
                        { "amphoe": { $regex: search } },
                        { "district": { $regex: search } },
                        { "zipcode": { $regex: search } },
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        HOSPCODE: "$hospcode",
                        NAME: "$name"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
            ]);

            for (i = 0; i < data.length; i++) {
                let loop
                let elder = await findElderyRegister(data[i]._id.HOSPCODE, year, db, permission, type, sex)

                if (elder.length > 0) {
                    loop = LoopFindElder(elder)
                } else {
                    loop = []
                }

                let careplan = await findCarePlane(data[i]._id.HOSPCODE, year, loop)
                result.push({
                    NAME: "[" + data[i]._id.HOSPCODE + "] " + data[i]._id.NAME,
                    ELDER: elder.length,
                    CAREPLAN: careplan.length
                })
                if (i == (data.length - 1)) {
                    return result
                }
            }

        },

        async findElderyRegisterByAllZone(year, zone, province, district, db, permission, type, sex, search) {
            let result = []

            var data = SERVICE_CENTER.aggregate([
                {
                    $group: {
                        _id: {
                            ZONE: "$zone"
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }

            ]);

            for (i = 0; i < data.length; i++) {
                let hospcode = await findHospCodeFromAllZone(data[i]._id.ZONE)

                let hospcode_loop
                // let hospcode = await findHospCodeFromAllZone(data[i]._id.ZONE)

                if (hospcode.length > 0) {
                    hospcode_loop = LoopFindHospcode(hospcode)
                } else {
                    hospcode_loop = []
                }

                let elder = await findElderFromAllZone(hospcode_loop, year, db, permission, type, sex)

                // console.log(data[i]._id.ZONE + " : " + elder.length)

                let elder_loop
                if (elder.length > 0) {
                    elder_loop = LoopFindElder(elder)
                } else {
                    elder_loop = []
                }

                let careplan = await findCarePlaneFromAllZone(hospcode_loop, year, elder_loop)

                // let careplan = await findCarePlane(data[i]._id.HOSPCODE, year, loop)
                result.push({
                    NAME: "[เขตสุขภาพที่ " + data[i]._id.ZONE + "]",
                    ELDER: elder.length,
                    CAREPLAN: careplan.length
                })
                if (i == (data.length - 1)) {
                    return result
                }
            }
            return data

        },

        async findElderyRegisterByAllProvince(year, zone, province, district, db, permission, type, sex, search) {
            let result = []

            var data = SERVICE_CENTER.aggregate([
                {
                    $match: {
                        zone: {$regex: zone}
                    }
                },
                {
                    $group: {
                        _id: {
                            province: "$province",

                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }

            ]);

            for (i = 0; i < data.length; i++) {
                let hospcode = await findHospCodeFromAllProvince(getProvince(data[i]._id.province))

                let hospcode_loop
                // let hospcode = await findHospCodeFromAllZone(data[i]._id.ZONE)

                if (hospcode.length > 0) {
                    hospcode_loop = LoopFindHospcode(hospcode)
                } else {
                    hospcode_loop = []
                }

                let elder = await findElderFromAllZone(hospcode_loop, year, db, permission, type, sex)

                // console.log(data[i]._id.province + " : " + elder.length)

                let elder_loop
                if (elder.length > 0) {
                    elder_loop = LoopFindElder(elder)
                } else {
                    elder_loop = []
                }

                let careplan = await findCarePlaneFromAllZone(hospcode_loop, year, elder_loop)

                // let careplan = await findCarePlane(data[i]._id.HOSPCODE, year, loop)
                result.push({
                    NAME: "จังหวัด" + getProvince(data[i]._id.province),
                    ELDER: elder.length,
                    CAREPLAN: careplan.length
                })
                if (i == (data.length - 1)) {
                    return result
                }
            }
            return data

        },

        async findElderyRegisterByAllDistrict(year, zone, province, district, db, permission, type, sex, search) {
            let result = []

            var data = SERVICE_CENTER.aggregate([
                {
                    $match: {
                        zone: {$regex: zone},
                        province: {$regex: province}
                    }
                },
                {
                    $group: {
                        _id: {
                            amphoe: "$amphoe",

                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }

            ]);

            for (i = 0; i < data.length; i++) {
                let hospcode = await findHospCodeFromAllDistrict(province ,getDistrict(data[i]._id.amphoe))

                let hospcode_loop
                // let hospcode = await findHospCodeFromAllZone(data[i]._id.ZONE)

                if (hospcode.length > 0) {
                    hospcode_loop = LoopFindHospcode(hospcode)
                } else {
                    hospcode_loop = []
                }

                let elder = await findElderFromAllZone(hospcode_loop, year, db, permission, type, sex)

                // console.log(data[i]._id.province + " : " + elder.length)

                let elder_loop
                if (elder.length > 0) {
                    elder_loop = LoopFindElder(elder)
                } else {
                    elder_loop = []
                }

                let careplan = await findCarePlaneFromAllZone(hospcode_loop, year, elder_loop)

                // let careplan = await findCarePlane(data[i]._id.HOSPCODE, year, loop)
                result.push({
                    NAME: "อำเภอ" + getDistrict(data[i]._id.amphoe),
                    ELDER: elder.length,
                    CAREPLAN: careplan.length
                })
                if (i == (data.length - 1)) {
                    return result
                }
            }
            return data

        },

        async findElderyRegisterGroupByAllZone(year, zone, province, district, db, permission, type, sex, search) {
            let result = []

            var data = SERVICE_CENTER.aggregate([
                {
                    $group: {
                        _id: {
                            ZONE: "$zone"
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }

            ]);

            for (i = 0; i < data.length; i++) {
                let hospcode = await findHospCodeFromAllZone(data[i]._id.ZONE)

                let hospcode_loop
                // let hospcode = await findHospCodeFromAllZone(data[i]._id.ZONE)

                if (hospcode.length > 0) {
                    hospcode_loop = LoopFindHospcode(hospcode)
                } else {
                    hospcode_loop = []
                }

                let elder_group1 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '1')
                let elder_group2 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '2')
                let elder_group3 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '3')
                let elder_group4 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '4')

                result.push({
                    NAME: "[เขตสุขภาพที่ " + data[i]._id.ZONE + "]",
                    GROUP1: elder_group1,
                    GROUP2: elder_group2,
                    GROUP3: elder_group3,
                    GROUP4: elder_group4
                })
                
                if (i == (data.length - 1)) {
                    return result
                }
            }
            return data

        },

        async findElderyRegisterGroupByAllProvince(year, zone, province, district, db, permission, type, sex, search) {
            let result = []

            var data = SERVICE_CENTER.aggregate([
                {
                    $match: {
                        zone: {$regex: zone}
                    }
                },
                {
                    $group: {
                        _id: {
                            province: "$province",

                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }

            ]);

            for (i = 0; i < data.length; i++) {
                let hospcode = await findHospCodeFromAllProvince(getProvince(data[i]._id.province))

                let hospcode_loop
                // let hospcode = await findHospCodeFromAllZone(data[i]._id.ZONE)

                if (hospcode.length > 0) {
                    hospcode_loop = LoopFindHospcode(hospcode)
                } else {
                    hospcode_loop = []
                }

                let elder_group1 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '1')
                let elder_group2 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '2')
                let elder_group3 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '3')
                let elder_group4 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '4')

                result.push({
                    NAME: "จังหวัด" + getProvince(data[i]._id.province),
                    GROUP1: elder_group1,
                    GROUP2: elder_group2,
                    GROUP3: elder_group3,
                    GROUP4: elder_group4
                })
                
                if (i == (data.length - 1)) {
                    return result
                }
            }
            return data

        },

        async findElderyRegisterGroupByAllDistrict(year, zone, province, district, db, permission, type, sex, search) {
            let result = []

            var data = SERVICE_CENTER.aggregate([
                {
                    $match: {
                        zone: {$regex: zone},
                        province: {$regex: province}
                    }
                },
                {
                    $group: {
                        _id: {
                            amphoe: "$amphoe",

                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }

            ]);

            for (i = 0; i < data.length; i++) {
                let hospcode = await findHospCodeFromAllDistrict(getDistrict(data[i]._id.amphoe))

                let hospcode_loop
                // let hospcode = await findHospCodeFromAllZone(data[i]._id.ZONE)

                if (hospcode.length > 0) {
                    hospcode_loop = LoopFindHospcode(hospcode)
                } else {
                    hospcode_loop = []
                }

                let elder_group1 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '1')
                let elder_group2 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '2')
                let elder_group3 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '3')
                let elder_group4 = await findElderRegisterGroupFromAllZone(hospcode_loop, year, db, permission, type, sex, '4')

                // let careplan = await findCarePlane(data[i]._id.HOSPCODE, year, loop)
                result.push({
                    NAME: "อำเภอ" + getDistrict(data[i]._id.amphoe),
                    GROUP1: elder_group1,
                    GROUP2: elder_group2,
                    GROUP3: elder_group3,
                    GROUP4: elder_group4
                })
                if (i == (data.length - 1)) {
                    return result
                }
            }
            return data

        },

        async findElderyRegisterGroup(year, zone, province, district, db, permission, type, sex, search) {
            let result = []

            var data = SERVICE_CENTER.aggregate([{
                $match: {
                    "zone": { $regex: zone },
                    "province": { $regex: province },
                    "amphoe": { $regex: district },
                    $or: [
                        { "hospcode": { $regex: search } },
                        { "name": { $regex: search } },
                        { "province": { $regex: search } },
                        { "amphoe": { $regex: search } },
                        { "district": { $regex: search } },
                        { "zipcode": { $regex: search } },
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        HOSPCODE: "$hospcode",
                        NAME: "$name"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
            ]);

            for (i = 0; i < data.length; i++) {

                let elder_group1 = await findElderRegisterGroupFromAllZone([data[i]._id.HOSPCODE], year, db, permission, type, sex, '1')
                let elder_group2 = await findElderRegisterGroupFromAllZone([data[i]._id.HOSPCODE], year, db, permission, type, sex, '2')
                let elder_group3 = await findElderRegisterGroupFromAllZone([data[i]._id.HOSPCODE], year, db, permission, type, sex, '3')
                let elder_group4 = await findElderRegisterGroupFromAllZone([data[i]._id.HOSPCODE], year, db, permission, type, sex, '4')

                // let careplan = await findCarePlane(data[i]._id.HOSPCODE, year, loop)
                result.push({
                    NAME: "[" + data[i]._id.HOSPCODE + "] " + data[i]._id.NAME,
                    GROUP1: elder_group1,
                    GROUP2: elder_group2,
                    GROUP3: elder_group3,
                    GROUP4: elder_group4
                })
                if (i == (data.length - 1)) {
                    return result
                }
            }

        },

    })

})

const searchProvince = function (zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
    let match_elder
    //console.log("searchProvince");

    if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S3") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S1") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S3") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S1") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S3") {
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T2" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $gt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R1" && typeOf == "T3" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T1" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T2" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R2" && typeOf == "T3" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S3") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S1") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                AGE: { $lt: 60 }
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S3") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S1") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D1' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S3") {
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
        match_elder = {
            $match: {
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S3") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ',  'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง','ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุมากกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'อายุน้อยกว่า 60', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: { $exists: true },
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S1") {
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S3") {
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S1") {
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $in: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S3") {
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
        match_elder = {
            $match: {
                NHSO: null,
                STATUS: { $in: ["01", "02", "03"] },
                PRENAME: { $nin: ["นาย"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S2") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T2" && sex == "S2") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $or: [{ PRIVILEGE: { $in: ["บัตรทอง"] } }, { MAINSCLCODE: "WEL" }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T3" && sex == "S2") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S2") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T2" && sex == "S2") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
        match_elder = {
            $match: {
                NHSO: null,
                $and: [{ PRIVILEGE: { $nin: ["บัตรทอง"] } }, { MAINSCLCODE: { $ne: "WEL" } }],
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
            }
        }
    } else if (database == 'D3' && healty == "H3" && retire == "R3" && typeOf == "T3" && sex == "S2") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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
        delete match_elder['$match'].BUDGETYEAR
    }

    ////console.log(match_elder)
    return match_elder
}

// หาจังหวัด !
const searchNotProvince = function (zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
    let match_elder
    //console.log("searchNotProvince");

    if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        // ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": { $in: fpro }
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
    } else if (database == 'D2' && healty == "H3" && retire == "R3" && typeOf == "T1" && sex == "S1") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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

    // ////console.log(match_elder)
    return match_elder
}

//หาอำเภอ 
const searchAmphoe = function (zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {

    let match_elder
    //console.log("searchAmphoe");

    if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T2" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
        match_elder = {
            $match: {
                STATUS: { $in: ["01", "02", "03"] },
                BUDGETYEAR: year.toString(),
                ZONE: zone,
                "SERVICE_CENTER.PROVINCE": pro
            }
        }
    } else if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T3" && sex == "S2") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
        ////console.log(zone)
        ////console.log(year.toString())
        ////console.log(pro)
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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

    ////console.log(match_elder)
    return match_elder
}

//หาตำบล
const searchDistrict = function (zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {

    let match_elder
    //console.log("searchDistrict");

    if (database == 'D1' && healty == "H1" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ทั้งหมด', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ทั้งหมด', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
    } else if (database == 'D2' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ข้อมูลจาก สปสช', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'ทั้งหมด', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
    } else if (database == 'D3' && healty == "H2" && retire == null && typeOf == "T1" && sex == "S1") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'ผู้ที่มีภาวะพึ่งพิง', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมเสียชีวิต', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ UC', 'รวมการเปลี่ยนแปลงดีขึ้น', 'หญิง');
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
    } else if (database == 'D3' && healty == "H3" && retire == "R1" && typeOf == "T1" && sex == "S1") {
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุมากกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'อายุน้อยกว่า 60', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'ผู้ที่มีภาวะพึ่งพิง', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมเสียชีวิต', 'ทั้งหมด', 'หญิง');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ทั้งหมด');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'ชาย');
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
        ////console.log('ลงทะเบียนเอง', 'สิทธิ อื่นๆ', 'รวมการเปลี่ยนแปลงดีขึ้น', 'ทั้งหมด', 'หญิง');
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

    ////console.log(match_elder)
    return match_elder
}

const searchCP = function (zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
    let match_elder, group_elder
    // ////console.log('zone: ', zone);
    // ////console.log('จังหวัด: ', pro);
    // ////console.log('ตำบล: ', amp);
    // ////console.log('ปี: ', year);
    // ////console.log('จังหวัดทั้งหมด: ', fpro);
    // ////console.log('--------------------');

    if (zone == 'ทั้งหมด' && pro == '' && amp == '') { //หาจังหวัด
        // ////console.log(zone, pro, amp)
        // ////console.log('IF- 1');
        match_elder = searchProvince(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        group_elder = {
            $group: {
                _id: "$ZONE",
                totalcp: { $sum: 1 }
            }
        }

    } else if (zone != 'ทั้งหมด' && pro == '' && amp == '') { //หาจังหวัด
        // ////console.log(zone, pro, amp)
        // ////console.log('IF- 2');
        match_elder = searchNotProvince(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        group_elder = {
            $group: {
                _id: "$SERVICE_CENTER_DETAIL.PROVINCE",
                totalcp: { $sum: 1 }
            }
        }

    } else if (zone && pro && amp == '') { //หาอำเภอ
        // ////console.log(zone, pro, amp)
        // ////console.log('IF- 3');
        match_elder = searchAmphoe(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        group_elder = {
            $group: {
                _id: "$SERVICE_CENTER_DETAIL.AMPHOE",
                totalcp: { $sum: 1 }
            }
        }

    } else if (zone && pro && amp == 'ทั้งหมด') { //หาอำเภอ
        // ////console.log(zone, pro, amp)
        // ////console.log('IF- 4');
        match_elder = searchAmphoe(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        group_elder = {
            $group: {
                _id: "$SERVICE_CENTER_DETAIL.CODE",
                totalcp: { $sum: 1 }
            }
        }
    } else if (zone && pro && amp) { //หาตำบล
        ////console.log(year, zone, pro, amp);
        ////console.log('IF- 5');
        match_elder = searchDistrict(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        group_elder = {
            $group: {
                _id: "$SERVICE_CENTER_DETAIL.CODE",
                totalcp: { $sum: 1 }
            }
        }
    }


    if (year == 'ทั้งหมด') {
        ////console.log('IF- 6');
        ////console.log(year);
        ////console.log("---------------------");
        delete match_elder['$match'].BUDGETYEAR
    }

    ////console.log('match: ', match_elder);
    return { match: match_elder, group: group_elder }
}

const searchElderCP = function (zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
    let match_elder, group_elder
    // ////console.log('zone2: ', zone);
    // ////console.log('ปี2: ', year);
    // ////console.log('จังหวัด2: ', pro);
    // ////console.log('ตำบล2: ', amp);
    // ////console.log('จังหวัดทั้งหมด2: ', fpro);
    // ////console.log('--------------------');

    if (zone == 'ทั้งหมด' && pro == '' && amp == '') { //หาจังหวัด
        match_elder = searchProvince(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         STATUS: { $in: ["01", "02"] },
        //         BUDGETYEAR: year.toString(),
        //     }
        // }
        group_elder = {
            $group: {
                _id: "$ZONE",
                totalelder: { $sum: 1 }
            }
        }
    } else if (zone != 'ทั้งหมด' && pro == '' && amp == '') { //หาจังหวัด
        match_elder = searchNotProvince(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //         ZONE: zone,
        //         STATUS: { $in: ["01", "02"] },
        //         "SERVICE_CENTER.PROVINCE": { $in: fpro }
        //     }
        // }
        group_elder = {
            $group: {
                _id: "$SERVICE_CENTER.PROVINCE",
                totalelder: { $sum: 1 }
            }
        }
    } else if (zone && pro && amp == '') { //หาอำเภอ
        match_elder = searchAmphoe(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //         ZONE: zone,
        //         STATUS: { $in: ["01", "02"] },
        //         "SERVICE_CENTER.PROVINCE": pro
        //     }
        // }
        group_elder = {
            $group: {
                _id: "$SERVICE_CENTER.AMPHOE",
                totalelder: { $sum: 1 }
            }
        }

    } else if (zone && pro && amp == 'ทั้งหมด') { //หาอำเภอ
        match_elder = searchAmphoe(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //         ZONE: zone,
        //         STATUS: { $in: ["01", "02"] },
        //         "SERVICE_CENTER.PROVINCE": pro
        //     }
        // }
        group_elder = {
            $group: {
                _id: "$SERVICE_CENTER.CODE",
                totalelder: { $sum: 1 }
            }
        }
    } else if (zone && pro && amp) { //หาตำบล
        match_elder = searchDistrict(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex)

        // match_elder = {
        //     $match: {
        //         BUDGETYEAR: year.toString(),
        //         ZONE: zone,
        //         STATUS: { $in: ["01", "02"] },
        //         "SERVICE_CENTER.PROVINCE": pro,
        //         "SERVICE_CENTER.AMPHOE": amp
        //     }
        // }
        group_elder = {
            $group: {
                _id: "$SERVICE_CENTER.CODE",
                totalelder: { $sum: 1 }
            }
        }
    }

    if (year == 'ทั้งหมด') {

        // ////console.log(year);
        delete match_elder['$match'].BUDGETYEAR
    }

    ////console.log('match2: ', match_elder);

    return { match: match_elder, group: group_elder }
}


