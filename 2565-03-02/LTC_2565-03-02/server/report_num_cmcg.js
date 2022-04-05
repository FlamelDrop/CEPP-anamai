import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { CM_REGISTER } from '../imports/db.js';
import { CG_REGISTER } from '../imports/db.js';


Meteor.startup(() => {

    Meteor.methods({
        getCMProvinceByZone_HOSP(zone) {
            return CM_REGISTER.aggregate([{
                $match: { STATE_ACTIVE: { $in: ["01", "02", "03"] }, zone: zone, confirm: true, HOSPCODE: { $ne: null } }

            }, {
                $project: {
                    _id: 1,
                    // province: { $substr: ["$HOSPCODE.PROVINCE", 3, -1] },
                    province: {
                        $arrayElemAt: [{ $split: ["$HOSPCODE.PROVINCE", '-'] }, -1]
                    }
                }

            }, {
                $group: {
                    _id: { province: "$province" },
                    cm_hosp: { "$addToSet": "$_id" },
                    num_cm_hosp: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCMProvinceByZone_DLA(zone) {
            return CM_REGISTER.aggregate([{
                $match: { STATE_ACTIVE: { $in: ["01", "02", "03"] }, zone: zone, confirm: true, DLACODE: { $ne: null } }

            }, {
                $project: {
                    _id: 1,
                    // province: "$DLACODE.PROVINCE",
                    province: {
                        $arrayElemAt: [{ $split: ["$DLACODE.PROVINCE", '-'] }, -1]
                    }
                }


            }, {
                $group: {
                    _id: { province: "$province" },
                    cm_dla: { "$addToSet": "$_id" },
                    num_cm_dla: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCGProvinceByZone_HOSP(zone) {
            return CG_REGISTER.aggregate([{
                $match: { STATE_ACTIVE: { $in: ["01", "02", "03"] }, zone: zone, confirm: true, HOSPCODE: { $ne: null } }

            }, {
                $project: {
                    _id: 1,
                    // province: { $substr: ["$HOSPCODE.PROVINCE", 3, -1] },
                    province: {
                        $arrayElemAt: [{ $split: ["$HOSPCODE.PROVINCE", '-'] }, -1]
                    }
                }

            }, {
                $group: {
                    _id: { province: "$province" },
                    cg_hosp: { "$addToSet": "$_id" },
                    num_cg_hosp: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCGProvinceByZone_DLA(zone) {
            return CG_REGISTER.aggregate([{
                $match: { STATE_ACTIVE: { $in: ["01", "02", "03"] }, zone: zone, confirm: true, DLACODE: { $ne: null } }

            }, {
                $project: {
                    _id: 1,
                    province: "$DLACODE.PROVINCE",
                }

            }, {
                $group: {
                    _id: { province: "$province" },
                    cg_dla: { "$addToSet": "$_id" },
                    num_cg_dla: { "$sum": 1 }
                }
            }]).toArray()
        },

        getCMAmphoeByZone_HOSP(zone) {
            return CM_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    HOSPCODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    province: { $substr: ["$HOSPCODE.PROVINCE", 3, -1] },
                    amphoe: { $substr: ["$HOSPCODE.AMPHOE", 3, -1] },
                }
            }, {
                $match: { province: zone }

            }, {
                $project: {
                    _id: 1,
                    amphoe: "$amphoe"
                }

            }, {
                $group: {
                    _id: { amphoe: "$amphoe" },
                    cm_hosp: { "$addToSet": "$_id" },
                    num_cm_hosp: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCMAmphoeByZone_DLA(zone) {
            return CM_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    DLACODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    province: "$DLACODE.PROVINCE",
                    amphoe: "$DLACODE.DISTRICT",
                }
            }, {
                $match: { province: zone }

            }, {
                $project: {
                    _id: 1,
                    amphoe: "$amphoe"
                }

            }, {
                $group: {
                    _id: { amphoe: "$amphoe" },
                    cm_dla: { "$addToSet": "$_id" },
                    num_cm_dla: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCGAmphoeByZone_HOSP(zone) {
            return CG_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    HOSPCODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    province: { $substr: ["$HOSPCODE.PROVINCE", 3, -1] },
                    amphoe: { $substr: ["$HOSPCODE.AMPHOE", 3, -1] },
                }
            }, {
                $match: { province: zone }

            }, {
                $project: {
                    _id: 1,
                    amphoe: "$amphoe"
                }

            }, {
                $group: {
                    _id: { amphoe: "$amphoe" },
                    cg_hosp: { "$addToSet": "$_id" },
                    num_cg_hosp: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCGAmphoeByZone_DLA(zone) {
            return CG_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    DLACODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    province: "$DLACODE.PROVINCE",
                    amphoe: "$DLACODE.DISTRICT",
                }
            }, {
                $match: { province: zone }

            }, {
                $project: {
                    _id: 1,
                    amphoe: "$amphoe"
                }

            }, {
                $group: {
                    _id: { amphoe: "$amphoe" },
                    cg_dla: { "$addToSet": "$_id" },
                    num_cg_dla: { "$sum": 1 }
                }
            }]).toArray()
        },

        getCMTambonByZone_HOSP(zone) {
            return CM_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    HOSPCODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    amphoe: { $substr: ["$HOSPCODE.AMPHOE", 3, -1] },
                    tambon: { $substr: ["$HOSPCODE.DISTRICT", 3, -1] },
                }
            }, {
                $match: { amphoe: { $regex: zone } }

            }, {
                $project: {
                    _id: 1,
                    tambon: "$tambon"
                }

            }, {
                $group: {
                    _id: { tambon: "$tambon" },
                    cm_hosp: { "$addToSet": "$_id" },
                    num_cm_hosp: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCMTambonByZone_DLA(zone) {
            return CM_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    DLACODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    amphoe: "$DLACODE.DISTRICT",
                    tambon: "$DLACODE.TAMBON",
                }
            }, {
                $match: { amphoe: { $regex: zone } }

            }, {
                $project: {
                    _id: 1,
                    tambon: "$tambon"
                }

            }, {
                $group: {
                    _id: { tambon: "$tambon" },
                    cm_dla: { "$addToSet": "$_id" },
                    num_cm_dla: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCGTambonByZone_HOSP(zone) {
            return CG_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    HOSPCODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    amphoe: { $substr: ["$HOSPCODE.AMPHOE", 3, -1] },
                    tambon: { $substr: ["$HOSPCODE.DISTRICT", 3, -1] },
                }
            }, {
                $match: { amphoe: { $regex: zone } }

            }, {
                $project: {
                    _id: 1,
                    tambon: "$tambon"
                }

            }, {
                $group: {
                    _id: { tambon: "$tambon" },
                    cg_hosp: { "$addToSet": "$_id" },
                    num_cg_hosp: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCGTambonByZone_DLA(zone) {
            return CG_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    DLACODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    amphoe: "$DLACODE.DISTRICT",
                    tambon: "$DLACODE.TAMBON",
                }
            }, {
                $match: { amphoe: { $regex: zone } }

            }, {
                $project: {
                    _id: 1,
                    tambon: "$tambon"
                }

            }, {
                $group: {
                    _id: { tambon: "$tambon" },
                    cg_dla: { "$addToSet": "$_id" },
                    num_cg_dla: { "$sum": 1 }
                }
            }]).toArray()
        },

        getCMHospByZone_HOSP(zone, tam) {
            return CM_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    HOSPCODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    amphoe: { $substr: ["$HOSPCODE.AMPHOE", 3, -1] },
                    tambon: { $substr: ["$HOSPCODE.DISTRICT", 3, -1] },
                    hospname: "$HOSPCODE.NAME",
                }
            }, {
                $match: { amphoe: { $regex: zone }, tambon: { $regex: tam } }

            }, {
                $project: {
                    _id: 1,
                    hospname: "$hospname"
                }

            }, {
                $group: {
                    _id: { hospname: "$hospname" },
                    num_cm_hosp: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCMHospByZone_DLA(zone, tam) {
            return CM_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    DLACODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    amphoe: "$DLACODE.DISTRICT",
                    tambon: "$DLACODE.TAMBON",
                    hospname: "$DLACODE.NAME",
                }
            }, {
                $match: { amphoe: { $regex: zone }, tambon: { $regex: tam } }

            }, {
                $project: {
                    _id: 1,
                    hospname: "$hospname"
                }

            }, {
                $group: {
                    _id: { hospname: "$hospname" },
                    cm_dla: { "$addToSet": "$_id" },
                    num_cm_dla: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCGHospByZone_HOSP(zone, tam) {
            return CG_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    HOSPCODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    amphoe: { $substr: ["$HOSPCODE.AMPHOE", 3, -1] },
                    tambon: { $substr: ["$HOSPCODE.DISTRICT", 3, -1] },
                    hospname: "$HOSPCODE.NAME",
                }
            }, {
                $match: { amphoe: { $regex: zone }, tambon: { $regex: tam } }

            }, {
                $project: {
                    _id: 1,
                    hospname: "$hospname"
                }

            }, {
                $group: {
                    _id: { hospname: "$hospname" },
                    cg_hosp: { "$addToSet": "$_id" },
                    num_cg_hosp: { "$sum": 1 }
                }
            }]).toArray()
        },
        getCGHospByZone_DLA(zone, tam) {
            return CG_REGISTER.aggregate([{
                $match: {
                    STATE_ACTIVE: { $in: ["01", "02", "03"] },
                    confirm: true,
                    DLACODE: { $ne: null }
                }
            }, {
                $project: {
                    _id: 1,
                    amphoe: "$DLACODE.DISTRICT",
                    tambon: "$DLACODE.TAMBON",
                    hospname: "$DLACODE.NAME",
                }
            }, {
                $match: { amphoe: { $regex: zone }, tambon: { $regex: tam } }

            }, {
                $project: {
                    _id: 1,
                    hospname: "$hospname"
                }

            }, {
                $group: {
                    _id: { hospname: "$hospname" },
                    cg_dla: { "$addToSet": "$_id" },
                    num_cg_dla: { "$sum": 1 }
                }
            }]).toArray()
        },
    })


});