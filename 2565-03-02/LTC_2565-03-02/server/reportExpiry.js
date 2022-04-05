import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { CM_REGISTER } from '../imports/db.js';
import { SERVICE_CENTER } from '../imports/db.js';
import { CG_REGISTER } from '../imports/db.js';


Meteor.methods({
    getAllProvinceByZoneReport(zone) {
        return SERVICE_CENTER.aggregate([{
            $project: {
                province: { $substr: ["$province", 3, -3] },
                zone: "$zone",
            }
        }, {
            $match: { zone: zone }

        }, {
            $group: { _id: { province: "$province" } }

        }])
    },
    getAllAmphoeByProvinceReport(province) {
        // console.log(province)
        return SERVICE_CENTER.aggregate([{
            $project: {
                amphoe: { $substr: ["$amphoe", 3, -3] },
                province: { $substr: ["$province", 3, -3] },
            }
        }, {
            $match: { province: province }

        }, {
            $group: { _id: { amphoe: "$amphoe" } }

        }])
    },
    getAllDistrictByAmphoeReport(amphoe) {
        // console.log(province)
        return SERVICE_CENTER.aggregate([{
            $project: {
                amphoe: { $substr: ["$amphoe", 3, -3] },
                district: { $substr: ["$district", 3, -3] },
            }
        }, {
            $match: { amphoe: amphoe }

        }, {
            $group: { _id: { district: "$district" } }

        }])
    },
    getAllDistrictByAmphoeProvinceReport(amphoe, province) {
        // console.log(province)
        return SERVICE_CENTER.aggregate([{
            $project: {
                amphoe: { $substr: ["$amphoe", 3, -3] },
                district: { $substr: ["$district", 3, -3] },
                province: { $substr: ["$province", 3, -3] },
            }
        }, {
            $match: {
                amphoe: amphoe,
                province: province
            }

        }, {
            $group: { _id: { district: "$district" } }
        }])
    },
    getAllDistrictByProvinceReport(province) {
        console.log(province)
        return SERVICE_CENTER.aggregate([{
            $project: {
                district: { $substr: ["$district", 3, -3] },
                province: { $substr: ["$province", 3, -3] },
            }
        }, {
            $match: {
                province: province
            }

        }, {
            $group: { _id: { district: "$district" } }
        }])
    },
    cmExpiryChart(year, zone, province, amphoe, tambon) {
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
        var match = {
            "EXPIREDATE": {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        if (zone != "all") {
            match.zone = zone
        }
        if (province != "all") {
            match["HOSPCODE.PROVINCE"] = { $regex: province }
            if (amphoe != "all") {
                match["HOSPCODE.AMPHOE"] = { $regex: amphoe }
                if (tambon != "all") {
                    match["HOSPCODE.DISTRICT"] = { $regex: tambon }
                }
            }
        }
        return CM_REGISTER.aggregate([{
            "$match": match
        },
        {
            "$project": {
                "CID": "$CID",
                "PROVINCE": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.PROVINCE",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.PROVINCE"
                    ]
                },
                "AMPHOE": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.AMPHOE",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.DISTRICT"
                    ]
                },
                "DISTRICT": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.DISTRICT",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.TAMBON"
                    ]
                },
                "EXPIREDATE": "$EXPIREDATE",
                "ZONE": "$zone",
                "monthex": {
                    "$month": {
                        "date": "$EXPIREDATE",
                        "timezone": "Asia\/Bangkok"
                    }
                },
                "yearex": {
                    "$year": {
                        "date": "$EXPIREDATE",
                        "timezone": "Asia\/Bangkok"
                    }
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "monthex": "$monthex"
                },
                "count": {
                    "$sum": 1.0
                },
                "PROVINCE": { $addToSet: { PROVINCE: "$PROVINCE", AMPHOE: "$AMPHOE", DISTRICT: "$DISTRICT" } },
            }
        }
        ])
    },
    cmExpiryTable(year, zone, province, amphoe, tambon) {
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
        var match = {
            "EXPIREDATE": {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        var group = {
            "_id": {
                "ZONE": "$ZONE",
                // "AMPHOE": "$AMPHOE",
                // "DISTRICT": "$DISTRICT",
                "monthex": "$monthex"
            },
            "count": {
                "$sum": 1.0
            }
        }

        if (zone != "all") {
            match.zone = zone
            group._id["PROVINCE"] = "$PROVINCE"
        }
        if (province != "all") {
            match["HOSPCODE.PROVINCE"] = { $regex: province }
            group._id["AMPHOE"] = "$AMPHOE"
            if (amphoe != "all") {
                match["HOSPCODE.AMPHOE"] = { $regex: amphoe }
                group._id["DISTRICT"] = "$DISTRICT"
                if (tambon != "all") {
                    match["HOSPCODE.DISTRICT"] = { $regex: tambon }
                }
            }
        }
        return CM_REGISTER.aggregate([{
            "$sort": {
                zone: -1
            }
        }, {
            "$match": match
        },
        {
            "$project": {
                "CID": "$CID",
                "PROVINCE": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.PROVINCE",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.PROVINCE"
                    ]
                },
                "AMPHOE": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.AMPHOE",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.DISTRICT"
                    ]
                },
                "DISTRICT": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.DISTRICT",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.TAMBON"
                    ]
                },
                "EXPIREDATE": "$EXPIREDATE",
                "ZONE": "$zone",
                "monthex": {
                    "$month": {
                        "date": "$EXPIREDATE",
                        "timezone": "Asia\/Bangkok"
                    }
                },
                "yearex": {
                    "$year": {
                        "date": "$EXPIREDATE",
                        "timezone": "Asia\/Bangkok"
                    }
                }
            }
        },
        {
            "$group": group
        }
        ])
    },
    cgExpiryChart(year, zone, province, amphoe, tambon) {
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
        var match = {
            "EXPIREDATE": {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        if (zone != "all") {
            match.zone = zone
        }
        if (province != "all") {
            match["HOSPCODE.PROVINCE"] = { $regex: province }
            if (amphoe != "all") {
                match["HOSPCODE.AMPHOE"] = { $regex: amphoe }
                if (tambon != "all") {
                    match["HOSPCODE.DISTRICT"] = { $regex: tambon }
                }
            }
        }
        return CG_REGISTER.aggregate([{
            "$match": match
        },
        {
            "$project": {
                "CID": "$CID",
                "PROVINCE": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.PROVINCE",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.PROVINCE"
                    ]
                },
                "AMPHOE": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.AMPHOE",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.DISTRICT"
                    ]
                },
                "DISTRICT": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.DISTRICT",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.TAMBON"
                    ]
                },
                "EXPIREDATE": "$EXPIREDATE",
                "ZONE": "$zone",
                "monthex": {
                    "$month": {
                        "date": "$EXPIREDATE",
                        "timezone": "Asia\/Bangkok"
                    }
                },
                "yearex": {
                    "$year": {
                        "date": "$EXPIREDATE",
                        "timezone": "Asia\/Bangkok"
                    }
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "monthex": "$monthex"
                },
                "count": {
                    "$sum": 1.0
                },
                "PROVINCE": { $addToSet: { PROVINCE: "$PROVINCE", AMPHOE: "$AMPHOE", DISTRICT: "$DISTRICT" } },
            }
        }
        ])
    },
    cgExpiryTable(year, zone, province, amphoe, tambon) {
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
        var match = {
            "EXPIREDATE": {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        var group = {
            "_id": {
                "ZONE": "$ZONE",
                // "AMPHOE": "$AMPHOE",
                // "DISTRICT": "$DISTRICT",
                "monthex": "$monthex"
            },
            "count": {
                "$sum": 1.0
            }
        }

        if (zone != "all") {
            match.zone = zone
            group._id["PROVINCE"] = "$PROVINCE"
        }
        if (province != "all") {
            match["HOSPCODE.PROVINCE"] = { $regex: province }
            group._id["AMPHOE"] = "$AMPHOE"
            if (amphoe != "all") {
                match["HOSPCODE.AMPHOE"] = { $regex: amphoe }
                group._id["DISTRICT"] = "$DISTRICT"
                if (tambon != "all") {
                    match["HOSPCODE.DISTRICT"] = { $regex: tambon }
                }
            }
        }
        return CG_REGISTER.aggregate([{
            "$sort": {
                zone: -1
            }
        }, {
            "$match": match
        },
        {
            "$project": {
                "CID": "$CID",
                "PROVINCE": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.PROVINCE",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.PROVINCE"
                    ]
                },
                "AMPHOE": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.AMPHOE",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.DISTRICT"
                    ]
                },
                "DISTRICT": {
                    "$cond": [{
                        "$eq": [
                            "$DLACODE",
                            null
                        ]
                    },
                    {
                        "$substr": [
                            "$HOSPCODE.DISTRICT",
                            3.0, -1.0
                        ]
                    },
                        "$DLACODE.TAMBON"
                    ]
                },
                "EXPIREDATE": "$EXPIREDATE",
                "ZONE": "$zone",
                "monthex": {
                    "$month": {
                        "date": "$EXPIREDATE",
                        "timezone": "Asia\/Bangkok"
                    }
                },
                "yearex": {
                    "$year": {
                        "date": "$EXPIREDATE",
                        "timezone": "Asia\/Bangkok"
                    }
                }
            }
        },
        {
            "$group": group
        }
        ])
    }
});