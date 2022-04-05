import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { ELDERLYREGISTER } from '../imports/db.js';
import { CAREPLAN_DETAIL } from '../imports/db.js';
import { CM_REGISTER } from '../imports/db.js';
import { DISTRICT } from '../imports/db.js';
import { CG_REGISTER } from '../imports/db.js';



Meteor.methods({
    countAllElder() {
        return ELDERLYREGISTER.find({ NHSO: true }).count()
    },
    countAllCp() {
        var elder = ELDERLYREGISTER.aggregate([{
            $match: {
                NHSO: true,
            }
        }, {
            $project: {
                CID: "$CID"
            }
        }])
        var finalArray = elder.map(function(obj) {
            return obj.CID;
        });
        return CAREPLAN_DETAIL.aggregate([{
            $group: {
                _id: "$CID",
            }
        }, {
            $match: {
                _id: { $in: finalArray }
            }
        }], { allowDiskUse: true }).length
    },
    countAllCM() {
        return CM_REGISTER.find({ STATE_ACTIVE: { $in: ["01", "02", "03"] } }).count()
    },
    countAllCG() {
        return CG_REGISTER.find({ STATE_ACTIVE: { $in: ["01", "02", "03"] } }).count()
    },
    countExpireCM() {
        var year = new Date().getFullYear()
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
        var match = {
            "EXPIREDATE": {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        return CM_REGISTER.aggregate([{
                "$match": match
            },
            {
                "$group": {
                    "_id": "$zone",
                    "excm": { "$sum": 1 },
                }
            }, {
                $sort: {
                    _id: 1
                }
            }
        ], { allowDiskUse: true })
    },
    countExpireCG() {
        var year = new Date().getFullYear()
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
        var match = {
            "EXPIREDATE": {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        return CG_REGISTER.aggregate([{
                "$match": match
            },
            {
                "$group": {
                    "_id": "$zone",
                    "excg": { "$sum": 1 },
                }
            }, {
                $sort: {
                    _id: 1
                }
            }
        ], { allowDiskUse: true })
    },
    countCPIndexbyZone() {
        var elder = ELDERLYREGISTER.aggregate([{
            $match: {
                NHSO: true,
            }
        }, {
            $project: {
                CID: "$CID"
            }
        }])
        var finalArray = elder.map(function(obj) {
            return obj.CID;
        });
        var data = CAREPLAN_DETAIL.aggregate([{
                $project: {
                    budgetYear: { $concat: [{ $dateToString: { format: "%m", date: "$CREATEDATE", timezone: "Asia/Bangkok" } }, "-", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                    ZONE: 1,
                    SERVICE_CENTER_DETAIL: 1,
                    CID: 1
                }
            },
            {
                $group: {
                    _id: "$CID",
                    budgetYear: { $last: "$budgetYear" },
                    ZONE: { $last: "$ZONE" },
                    SERVICE_CENTER_DETAIL: { $last: "$SERVICE_CENTER_DETAIL" }
                }
            },
            {
                $match: {
                    _id: { $in: finalArray }
                }
            },
            {
                $group: {
                    _id: "$ZONE",
                    totalcp: { $sum: 1 },

                }
            },
            {
                $sort: {
                    _id: 1
                }
            }

        ], { allowDiskUse: true });
        return data
    },
    countElderCPIndexbyZone(year) {
        var data = ELDERLYREGISTER.aggregate([{
                $project: {
                    budgetYear: { $concat: [{ $dateToString: { format: "%m", date: "$CREATEDATE", timezone: "Asia/Bangkok" } }, "-", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                    ZONE: 1,
                    SERVICE_CENTER: 1,
                    NHSO: 1
                }
            },

            {
                $match: {
                    NHSO: true
                }
            },
            {
                $group: {
                    _id: "$ZONE",
                    totalelder: { $sum: 1 },

                }
            },

            {
                $sort: {
                    _id: 1
                }
            }

        ], { allowDiskUse: true });
        return data
    },
});