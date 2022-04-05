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

Meteor.startup(() => {

    Meteor.methods({
        countCPbyZone(year) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }

            var elder = ELDERLYREGISTER.aggregate([{
                $match: {
                    NHSO: true,
                    BUDGETYEAR: year.toString()
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
                },


            ], {
                allowDiskUse: true,
            });

            return data
        },
        countElderCPbyZone(year) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var data = ELDERLYREGISTER.aggregate([{
                    $project: {
                        // budgetYear: { $concat: [{ $dateToString: { format: "%m", date: "$CREATEDATE", timezone: "Asia/Bangkok" } }, "-", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                        BUDGETYEAR: 1,
                        NHSO: 1
                    }
                },

                {
                    $match: {
                        BUDGETYEAR: year.toString(),
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

            ], {
                allowDiskUse: true,
            });

            return data
        },

        countCPbyProvince(year, zone) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var elder = ELDERLYREGISTER.aggregate([{
                $match: {
                    NHSO: true,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone
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
                        _id: "$SERVICE_CENTER_DETAIL.PROVINCE",
                        totalcp: { $sum: 1 },

                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countElderCPbyProvince(year, zone) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var data = ELDERLYREGISTER.aggregate([{
                    $project: {
                        //  budgetYear: { $concat: [{ $dateToString: { format: "%m", date: "$CREATEDATE", timezone: "Asia/Bangkok" } }, "-", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                        BUDGETYEAR: 1,
                        NHSO: 1
                    }
                },

                {
                    $match: {
                        // budgetYear: { $in: byear },
                        BUDGETYEAR: year.toString(),
                        ZONE: zone.toString(),
                        NHSO: true
                    }
                },
                {
                    $group: {
                        _id: "$SERVICE_CENTER.PROVINCE",
                        totalelder: { $sum: 1 },

                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },

        countCPbyAmphoe(year, province) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var elder = ELDERLYREGISTER.aggregate([{
                $match: {
                    NHSO: true,
                    BUDGETYEAR: year.toString(),
                    "SERVICE_CENTER.PROVINCE": province

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
                        //budgetYear: { $in: byear },
                        _id: { $in: finalArray }
                        // "SERVICE_CENTER_DETAIL.PROVINCE": province
                    }
                },
                {
                    $group: {
                        _id: "$SERVICE_CENTER_DETAIL.AMPHOE",
                        totalcp: { $sum: 1 },

                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countElderCPbyAmphoe(year, province) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var data = ELDERLYREGISTER.aggregate([{
                    $project: {
                        //budgetYear: { $concat: [{ $dateToString: { format: "%m", date: "$CREATEDATE", timezone: "Asia/Bangkok" } }, "-", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                        BUDGETYEAR: 1,
                        NHSO: 1
                    }
                },

                {
                    $match: {
                        // budgetYear: { $in: byear },
                        BUDGETYEAR: year.toString(),
                        "SERVICE_CENTER.PROVINCE": province,
                        NHSO: true
                    }
                },
                {
                    $group: {
                        _id: "$SERVICE_CENTER.AMPHOE",
                        totalelder: { $sum: 1 },
                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },

        countCPbyTambon(year, amphoe) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var elder = ELDERLYREGISTER.aggregate([{
                $match: {
                    NHSO: true,
                    BUDGETYEAR: year.toString(),
                    "SERVICE_CENTER.AMPHOE": amphoe

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
                        // budgetYear: { $in: byear },
                        //"SERVICE_CENTER_DETAIL.AMPHOE": amphoe
                    }
                },
                {
                    $group: {
                        _id: "$SERVICE_CENTER_DETAIL.DISTRICT",
                        totalcp: { $sum: 1 },

                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countElderCPbyTambon(year, amphoe) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var data = ELDERLYREGISTER.aggregate([{
                    $project: {
                        //  budgetYear: { $concat: [{ $dateToString: { format: "%m", date: "$CREATEDATE", timezone: "Asia/Bangkok" } }, "-", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                        BUDGETYEAR: 1,
                        NHSO: 1
                    }
                },

                {
                    $match: {
                        //budgetYear: { $in: byear },
                        BUDGETYEAR: year.toString(),
                        "SERVICE_CENTER.AMPHOE": amphoe,
                        NHSO: true
                    }
                },
                {
                    $group: {
                        _id: "$SERVICE_CENTER.DISTRICT",
                        totalelder: { $sum: 1 },

                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countCPbyHosp(year, amphoe, tambon) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var elder = ELDERLYREGISTER.aggregate([{
                $match: {
                    NHSO: true,
                    BUDGETYEAR: year.toString(),
                    "SERVICE_CENTER.AMPHOE": amphoe,
                    "SERVICE_CENTER.DISTRICT": tambon

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
                        // budgetYear: { $in: byear },
                        //"SERVICE_CENTER_DETAIL.AMPHOE": amphoe
                    }
                },
                {
                    $group: {
                        _id: "$SERVICE_CENTER_DETAIL.CODE",
                        totalcp: { $sum: 1 },

                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countElderCPbyHosp(year, amphoe, tambon) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }
            var data = ELDERLYREGISTER.aggregate([{
                    $project: {
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                        BUDGETYEAR: 1,
                        NHSO: 1
                    }
                },

                {
                    $match: {
                        //budgetYear: { $in: byear },
                        BUDGETYEAR: year.toString(),
                        "SERVICE_CENTER.AMPHOE": amphoe,
                        "SERVICE_CENTER.DISTRICT": tambon,
                        NHSO: true
                    }
                },
                {
                    $group: {
                        _id: "$SERVICE_CENTER.CODE",
                        totalelder: { $sum: 1 },

                    }
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countCPNonUc(year, zone, pro, amp, tam) {

            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            var match_elder_agg = {}
            var group_cp_agg = {}

            if (zone && !pro && !amp && !tam) { //หาจังหวัด
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone
                }
                group_cp_agg = {
                    _id: "$SERVICE_CENTER_DETAIL.PROVINCE",
                    totalcp: { $sum: 1 },

                }
            } else if (zone && pro && !amp && !tam) { //หาอำเภอ
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone,
                    "SERVICE_CENTER.PROVINCE": pro
                }
                group_cp_agg = {
                    _id: "$SERVICE_CENTER_DETAIL.AMPHOE",
                    totalcp: { $sum: 1 },

                }
            } else if (zone && pro && amp && !tam) { //หาตำบล
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone,
                    "SERVICE_CENTER.PROVINCE": pro,
                    "SERVICE_CENTER.AMPHOE": amp
                }
                group_cp_agg = {
                    _id: "$SERVICE_CENTER_DETAIL.DISTRICT",
                    totalcp: { $sum: 1 },

                }
            } else if (zone && pro && amp && tam) { //หารพสต
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone,
                    "SERVICE_CENTER.PROVINCE": pro,
                    "SERVICE_CENTER.AMPHOE": amp,
                    "SERVICE_CENTER.DISTRICT": tam
                }
                group_cp_agg = {
                    _id: "$SERVICE_CENTER_DETAIL.CODE",
                    totalcp: { $sum: 1 },

                }
            } else {
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString()
                }
                group_cp_agg = {
                    _id: "$ZONE",
                    totalcp: { $sum: 1 },

                }
            }
            //  ////console.log(match_elder_agg,group_cp_agg)
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }

            var elder = ELDERLYREGISTER.aggregate([{
                $project: {
                    BUDGETYEAR: { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } },
                    ZONE: 1,
                    SERVICE_CENTER: 1,
                    PRIVILEGE: 1,
                    NHSO: 1,
                    CID: 1
                }
            }, {
                $match: match_elder_agg
            }, {
                $project: {
                    CID: "$CID"
                }
            }], {
                allowDiskUse: true,
            })
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
                    $match: { _id: { $in: finalArray } }
                },
                {
                    $group: group_cp_agg
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countElderNonUc(year, zone, pro, amp, tam) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }

            var match_elder_agg = {}
            var group_elder_agg = {}

            if (zone && !pro && !amp && !tam) { //หาจังหวัด
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone.toString(),
                }
                group_elder_agg = {
                    _id: "$SERVICE_CENTER.PROVINCE",
                    totalelder: { $sum: 1 },

                }
            } else if (zone && pro && !amp && !tam) { //หาอำเภอ
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone.toString(),
                    "SERVICE_CENTER.PROVINCE": pro
                }
                group_elder_agg = {
                    _id: "$SERVICE_CENTER.AMPHOE",
                    totalelder: { $sum: 1 },

                }
            } else if (zone && pro && amp && !tam) { //หาตำบล
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone.toString(),
                    "SERVICE_CENTER.PROVINCE": pro,
                    "SERVICE_CENTER.AMPHOE": amp
                }
                group_elder_agg = {
                    _id: "$SERVICE_CENTER.DISTRICT",
                    totalelder: { $sum: 1 },

                }
            } else if (zone && pro && amp && tam) { //หารพสต
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString(),
                    ZONE: zone.toString(),
                    "SERVICE_CENTER.PROVINCE": pro,
                    "SERVICE_CENTER.AMPHOE": amp,
                    "SERVICE_CENTER.DISTRICT": tam
                }
                group_elder_agg = {
                    _id: "$SERVICE_CENTER.CODE",
                    totalelder: { $sum: 1 },

                }
            } else {
                match_elder_agg = {
                    PRIVILEGE: { $nin: ["บัตรทอง"] },
                    NHSO: null,
                    BUDGETYEAR: year.toString()
                }
                group_elder_agg = {
                    _id: "$ZONE",
                    totalelder: { $sum: 1 },

                }
            }

            var data = ELDERLYREGISTER.aggregate([{
                    $project: {
                        BUDGETYEAR: { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } },
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                        PRIVILEGE: 1,
                        NHSO: 1
                    }
                },

                {
                    $match: match_elder_agg
                },
                {
                    $group: group_elder_agg
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },

        countAllReportCP(year, zone, pro, amp, tam) {

            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            var match_elder_agg = {}
            var group_cp_agg = {}

            if (zone && !pro && !amp && !tam) { //หาจังหวัด
                match_elder_agg = {
                    BUDGETYEAR: year.toString(),
                    ZONE: zone
                }
                group_cp_agg = {
                    _id: "$SERVICE_CENTER_DETAIL.PROVINCE",
                    totalcp: { $sum: 1 },

                }
            } else if (zone && pro && !amp && !tam) { //หาอำเภอ
                match_elder_agg = {
                    BUDGETYEAR: year.toString(),
                    ZONE: zone,
                    "SERVICE_CENTER.PROVINCE": pro
                }
                group_cp_agg = {
                    _id: "$SERVICE_CENTER_DETAIL.AMPHOE",
                    totalcp: { $sum: 1 },

                }
            } else if (zone && pro && amp && !tam) { //หาตำบล
                match_elder_agg = {
                    BUDGETYEAR: year.toString(),
                    ZONE: zone,
                    "SERVICE_CENTER.PROVINCE": pro,
                    "SERVICE_CENTER.AMPHOE": amp
                }
                group_cp_agg = {
                    _id: "$SERVICE_CENTER_DETAIL.DISTRICT",
                    totalcp: { $sum: 1 },

                }
            } else if (zone && pro && amp && tam) { //หารพสต
                match_elder_agg = {
                    BUDGETYEAR: year.toString(),
                    ZONE: zone,
                    "SERVICE_CENTER.PROVINCE": pro,
                    "SERVICE_CENTER.AMPHOE": amp,
                    "SERVICE_CENTER.DISTRICT": tam,
                }
                group_cp_agg = {
                    _id: "$SERVICE_CENTER_DETAIL.CODE",
                    totalcp: { $sum: 1 },

                }
            } else {
                match_elder_agg = {
                    BUDGETYEAR: year.toString()
                }
                group_cp_agg = {
                    _id: "$ZONE",
                    totalcp: { $sum: 1 },

                }
            }
            //  ////console.log(match_elder_agg,group_cp_agg)
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }

            var elder = ELDERLYREGISTER.aggregate([{
                $project: {
                    BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                    ZONE: 1,
                    SERVICE_CENTER: 1,
                    CID: 1
                }
            }, {
                $match: match_elder_agg
            }, {
                $project: {
                    CID: "$CID"
                }
            }], {
                allowDiskUse: true,
            })
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
                    $match: { _id: { $in: finalArray } }
                },
                {
                    $group: group_cp_agg
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countAllElderCP(year, zone, pro, amp, tam) {
            var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]
            for (var i = 0; i < byear.length; i++) {
                if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
                    byear[i] = byear[i] + "-" + (parseInt(year) - 1)
                else
                    byear[i] = byear[i] + "-" + year
            }

            var match_elder_agg = {}
            var group_elder_agg = {}

            if (zone && !pro && !amp && !tam) { //หาจังหวัด
                match_elder_agg = {

                    BUDGETYEAR: year.toString(),
                    ZONE: zone.toString(),
                }
                group_elder_agg = {
                    _id: "$SERVICE_CENTER.PROVINCE",
                    totalelder: { $sum: 1 },

                }
            } else if (zone && pro && !amp && !tam) { //หาอำเภอ
                match_elder_agg = {

                    BUDGETYEAR: year.toString(),
                    ZONE: zone.toString(),
                    "SERVICE_CENTER.PROVINCE": pro
                }
                group_elder_agg = {
                    _id: "$SERVICE_CENTER.AMPHOE",
                    totalelder: { $sum: 1 },

                }
            } else if (zone && pro && amp && !tam) { //หาตำบล
                match_elder_agg = {

                    BUDGETYEAR: year.toString(),
                    ZONE: zone.toString(),
                    "SERVICE_CENTER.PROVINCE": pro,
                    "SERVICE_CENTER.AMPHOE": amp
                }
                group_elder_agg = {
                    _id: "$SERVICE_CENTER.DISTRICT",
                    totalelder: { $sum: 1 },

                }
            } else if (zone && pro && amp && tam) { //หารพสต
                match_elder_agg = {

                    BUDGETYEAR: year.toString(),
                    ZONE: zone.toString(),
                    "SERVICE_CENTER.PROVINCE": pro,
                    "SERVICE_CENTER.AMPHOE": amp,
                    "SERVICE_CENTER.DISTRICT": tam,

                }
                group_elder_agg = {
                    _id: "$SERVICE_CENTER.CODE",
                    totalelder: { $sum: 1 },

                }
            } else {
                match_elder_agg = {
                    BUDGETYEAR: year.toString()
                }
                group_elder_agg = {
                    _id: "$ZONE",
                    totalelder: { $sum: 1 },

                }
            }

            var data = ELDERLYREGISTER.aggregate([{
                    $project: {
                        BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                    }
                },

                {
                    $match: match_elder_agg
                },
                {
                    $group: group_elder_agg
                },

                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });

            return data
        },
        countAllCP_Hosp(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
            // var byear = ["10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08", "09"]

            let match_elder_agg = searchCP(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex).match
            let group_cp_agg = searchCP(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex).group

            // for (var i = 0; i < byear.length; i++) {
            //     if (parseInt(byear[i]) >= 10 && parseInt(byear[i]) <= 12)
            //         byear[i] = byear[i] + "-" + (parseInt(year) - 1)
            //     else
            //         byear[i] = byear[i] + "-" + year
            // }

            var elder = ELDERLYREGISTER.aggregate([{
                    $project: {
                        BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                        AGE: { $floor: { "$divide": [{ "$subtract": [new Date(), "$BIRTHDATE"] }, (365 * 24 * 60 * 60 * 1000)] } },
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                        CID: 1,
                        STATUS: 1,
                        PRENAME: 1,
                        NHSO: 1,
                        PRIVILEGE: 1,
                        MAINSCLCODE: 1
                    }
                },
                match_elder_agg,
                {
                    $project: {
                        CID: "$CID"
                    }
                }
            ], {
                allowDiskUse: true,
            })
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
                    $match: { _id: { $in: finalArray } }
                },
                group_cp_agg,
                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });
            //console.log(group_cp_agg);
            //console.log(match_elder_agg);
            //console.log(match_elder_agg["$match"].STATUS);
            //console.log(match_elder_agg["$match"]["SERVICE_CENTER.PROVINCE"]);
            //console.log('111111111111111111111111111111111111111111111111');
            return data
        },
        countAllElderCP_Hosp(zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex) {

            let match_elder_agg = searchElderCP(zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex).match
            let group_elder_agg = searchElderCP(zone, pro, amp, fpro, year, database, healty, retire, typeOf, sex).group

            // ////console.log(match_elder_agg)
            var data = ELDERLYREGISTER.aggregate([{
                    $project: {
                        BUDGETYEAR: { $ifNull: ["$BUDGETYEAR", { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } }] },
                        AGE: { $floor: { "$divide": [{ "$subtract": [new Date(), "$BIRTHDATE"] }, (365 * 24 * 60 * 60 * 1000)] } },
                        ZONE: 1,
                        SERVICE_CENTER: 1,
                        CID: 1,
                        STATUS: 1,
                        PRENAME: 1,
                        NHSO: 1,
                        PRIVILEGE: 1,
                        MAINSCLCODE: 1
                    }
                },
                match_elder_agg,
                group_elder_agg,
                {
                    $sort: {
                        _id: 1
                    }
                }

            ], {
                allowDiskUse: true,
            });
            //console.log(group_elder_agg);
            //console.log(match_elder_agg);
            //console.log(match_elder_agg["$match"].STATUS);
            //console.log(match_elder_agg["$match"]["SERVICE_CENTER.PROVINCE"]);
            //console.log('222222222222222222222222222222222');
            return data
        },
    })
});

// หาจังหวัด
const searchProvince = function(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
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
const searchNotProvince = function(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
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
const searchAmphoe = function(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {

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
const searchDistrict = function(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {

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

const searchCP = function(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
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

const searchElderCP = function(zone, pro, amp, year, fpro, database, healty, retire, typeOf, sex) {
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

// var cron = require('cron');
// var cronJob = cron.job("15 14 * * *", function () {
//     var elder = ELDERLYREGISTER.aggregate([{
//         $match: {
//             NHSO: true,
//             BUDGETYEAR: year.toString()
//         }
//     }, {
//         $project: {
//             CID: "$CID"
//         }
//     }])
//     var finalArray = elder.map(function (obj) {
//         return obj.CID;
//     });
//     CAREPLAN_DETAIL.aggregate([
//         {
//             $project: {
//                 budgetYear: { $toString: { $add: [{ $toInt: { $dateToString: { format: "%Y", date: "$CREATEDATE", timezone: "Asia/Bangkok" } } }, 543] } },
//                 ZONE: 1,
//                 SERVICE_CENTER_DETAIL: 1,
//                 CID: 1
//             }
//         },
//         {
//             $group: {
//                 _id: "$CID",
//                 budgetYear: { $last: "$budgetYear" },
//                 ZONE: { $last: "$ZONE" },
//                 SERVICE_CENTER_DETAIL: { $last: "$SERVICE_CENTER_DETAIL" }
//             }
//         },
//         {
//             $match: {
//                 _id: { $in: finalArray }
//             }
//         },
//         {
//             $group: {
//                 _id: "$ZONE",
//                 totalcp: { $sum: 1 },

//             }
//         },

//         {
//             $sort: {
//                 _id: 1
//             }
//         }, {
//             $out: "REP_CP"
//         }

//     ]);
// });

// cronJob.start();