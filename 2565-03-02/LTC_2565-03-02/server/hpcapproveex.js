import {
    Meteor
} from 'meteor/meteor';
import '../imports/db.js';

import {
    CM_REGISTER
} from '../imports/db.js';

import {
    CG_REGISTER
} from '../imports/db.js';


Meteor.methods({
    getZonelistApproveCMex: function(year, zone, province, amphoe, tambon) {
        // console.log(year, zone, province, amphoe, tambon);
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
            // console.log(dstart, dend, a)
            // var data = CM_REGISTER.find({ "zone": { $regex: a.toString() }, "confirm": true, "EXPIREDATE": { "$gte": moment(dstart).toDate(), "$lt": moment(dend).toDate() } }, { sort: { CREATEDATE: -1 } }).fetch()
        var match = {
            "EXPIREDATE": {
                "$lte": moment(parseInt(new Date().getFullYear()) + "-10-01 07:00:00.000+07:00").toDate()
            },
            "confirm": true
        }
        if (year) {
            match.EXPIREDATE = {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }


        if (zone != "all") {
            match.zone = zone
        }
        if (province) {
            if (province != "all") {
                match["HOSPCODE.PROVINCE"] = { $regex: province }
                if (amphoe != "all") {
                    match["HOSPCODE.AMPHOE"] = { $regex: amphoe }
                    if (tambon != "all") {
                        match["HOSPCODE.DISTRICT"] = { $regex: tambon }
                    }
                }
            }
        }
        return CM_REGISTER.aggregate([{
            "$match": match
        }, {
            "$sort": { "EXPIREDATE": -1 }
        }]);
    },
    getZonelistApproveCGex: function(year, zone, province, amphoe, tambon) {
        // console.log(year, zone, province, amphoe, tambon);
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
            // console.log(dstart, dend, a)
            // var data = CM_REGISTER.find({ "zone": { $regex: a.toString() }, "confirm": true, "EXPIREDATE": { "$gte": moment(dstart).toDate(), "$lt": moment(dend).toDate() } }, { sort: { CREATEDATE: -1 } }).fetch()
        var match = {
            "EXPIREDATE": {
                "$lte": moment(parseInt(new Date().getFullYear()) + "-10-01 07:00:00.000+07:00").toDate()
            },
            "confirm": true
        }
        if (year) {
            match.EXPIREDATE = {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        if (zone != "all") {
            match.zone = zone
        }
        if (province) {
            if (province != "all") {
                match["HOSPCODE.PROVINCE"] = { $regex: province }
                if (amphoe != "all") {
                    match["HOSPCODE.AMPHOE"] = { $regex: amphoe }
                    if (tambon != "all") {
                        match["HOSPCODE.DISTRICT"] = { $regex: tambon }
                    }
                }
            }
        }


        return CG_REGISTER.aggregate([{
            "$match": match
        }, {
            "$sort": { "EXPIREDATE": -1 }
        }]);
    },
    getZoneDistrictApproveCGex: function(year, zone, province, amphoe) {
        console.log(year, zone, province, amphoe);
        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
            // console.log(dstart, dend, a)
            // var data = CM_REGISTER.find({ "zone": { $regex: a.toString() }, "confirm": true, "EXPIREDATE": { "$gte": moment(dstart).toDate(), "$lt": moment(dend).toDate() } }, { sort: { CREATEDATE: -1 } }).fetch()
        var match = {
            "EXPIREDATE": {
                "$lte": moment(parseInt(new Date().getFullYear()) + "-10-01 07:00:00.000+07:00").toDate()
            },
            "confirm": true
        }
        if (year) {
            match.EXPIREDATE = {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        if (zone != "all") {
            match.zone = zone
        }
        if (province) {
            if (province != "all") {
                match["HOSPCODE.PROVINCE"] = { $regex: province }
                if (amphoe != "all") {
                    match["HOSPCODE.AMPHOE"] = { $regex: amphoe }
                }
            }
        }

        return CG_REGISTER.aggregate([{
            "$match": match
        }, {
            "$sort": { "EXPIREDATE": -1 }
        }]);
    },
    getZoneProvinceApproveCGex: function(year, zone, province) {
        // console.log(year, zone, province);

        var dstart = parseInt(year - 1) + "-10-01 07:00:00.000+07:00";
        var dend = year + "-09-30 07:00:00.000+07:00"
            // console.log(dstart, dend, a)
            // var data = CM_REGISTER.find({ "zone": { $regex: a.toString() }, "confirm": true, "EXPIREDATE": { "$gte": moment(dstart).toDate(), "$lt": moment(dend).toDate() } }, { sort: { CREATEDATE: -1 } }).fetch()
        var match = {
            "EXPIREDATE": {
                "$lte": moment(parseInt(new Date().getFullYear()) + "-10-01 07:00:00.000+07:00").toDate()
            },
            "confirm": true
        }
        if (year) {
            match.EXPIREDATE = {
                "$gte": moment(dstart).toDate(),
                "$lt": moment(dend).toDate()
            }
        }
        if (zone != "all") {
            match.zone = zone
        }
        if (province) {
            if (province != "all") {
                match["HOSPCODE.PROVINCE"] = { $regex: province }
            }
        }

        return CG_REGISTER.aggregate([{
            "$match": match
        }, {
            "$sort": { "EXPIREDATE": -1 }
        }]);
    },
});