

import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { R_SERVICE_CM_CG_CP } from '../imports/db.js';


Meteor.startup(() => {
    /////////////////////////////HPC////////////////////////
    Router.route('/getcmbyzone/:zone/:province/:district', { // API 2
        where: 'server'
    }).get(function () {
        var zone = this.params.zone
        var pro = this.params.province
        var dis = this.params.district
        // var subdis = this.params.subdistrict
        var matchdata = {}
        var groupdata = {}
        var response;
        if (zone !== 'null' && pro == 'null' && dis == 'null') {
            matchdata = {

                "zone": { $regex: zone },


            }
            groupdata = {
                _id: "$province",
                CM: { $sum: "$CM" },
                CG: { $sum: "$CG" }
            }
        } else if (zone !== 'null' && pro !== 'null' && dis == 'null') {
            matchdata = {

                "zone": { $regex: zone },
                province: { $regex: pro },

            }
            groupdata = {
                _id: "$amphoe",
                CM: { $sum: "$CM" },
                CG: { $sum: "$CG" }
            }
        } else if (zone !== 'null' && pro !== 'null' && dis !== 'null') {
            matchdata = {

                "zone": { $regex: zone },
                province: { $regex: pro },
                amphoe: { $regex: dis },

            }
            groupdata = {
                _id: "$district",
                CM: { $sum: "$CM" },
                CG: { $sum: "$CG" }
            }
        } else {
            matchdata = {

                "zone": { $ne:null },


            }
            groupdata = {
                _id: "$zone",
                CM: { $sum: "$CM" },
                CG: { $sum: "$CG" }
            }
        }
        // }else if(pro !== 'null' && dis !== 'null' && subdis == 'null'){
        //     matchdata  =  {
        //         $and: [
        //             { "TAMBON.PROVINCE": {$regex:pro} },
        //             { "TAMBON.AMPHOE": {$regex:dis} },
        //         ]
        //     }
        // }else if(pro !== 'null' && dis !== 'null' && subdis !== 'null'){
        //     matchdata  =  {
        //         $and: [
        //             { "TAMBON.PROVINCE": {$regex:pro} },
        //             { "TAMBON.AMPHOE": {$regex:dis} },
        //             { "TAMBON.DISTRCIT": {$regex:subdis} }
        //         ]
        //     }
        // }
        var data = R_SERVICE_CM_CG_CP.aggregate([{
            $match: matchdata
        }, {
            $project: {
                zone: "$zone",
                province: { $substr: ["$province", 3, -3] },
                amphoe: { $substr: ["$amphoe", 3, -3] },
                district: { $substr: ["$district", 3, -3] },
                CM: { $size: "$CM" },
                CG: { $size: "$CG" },
            }
        }, {
            $group: groupdata
        }, { $sort: { fullcode: -1 } }]).toArray()

        if (data.length > 0) {
            response = data
        } else {
            response = {
                "error": true,
                "message": "data not found."
            }
        }

        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(response));
    })
    Router.route('/getcmbymap/:province/:district/:subdis', { // API 2
        where: 'server'
    }).get(function () {
        var pro = this.params.province
        var dis = this.params.district
        var subdis = this.params.subdis
        var matchdata = {}
        var response;
        if (pro !== 'null' && dis == 'null' && subdis == 'null') {
            matchdata = {

                "TAMBON.PROVINCE": { $regex: pro },


            }
        } else if (pro !== 'null' && dis !== 'null' && subdis == 'null') {
            matchdata = {
                $and: [
                    { "TAMBON.PROVINCE": { $regex: pro } },
                    { "TAMBON.AMPHOE": { $regex: dis } },
                ]
            }
        } else if (pro !== 'null' && dis !== 'null' && subdis !== 'null') {
            matchdata = {
                $and: [
                    { "TAMBON.PROVINCE": { $regex: pro } },
                    { "TAMBON.AMPHOE": { $regex: dis } },
                    { "TAMBON.DISTRCIT": { $regex: subdis } }
                ]
            }
        }
        var data = CM_REGISTER.aggregate([{

            $match: matchdata
        }, {
            $group: {
                _id: { PROVINCE: "$TAMBON.PROVINCE", DISTRCIT: "$TAMBON.AMPHOE", SUBDISTRICT: "$TAMBON.DISTRICT" },
                CM: { $sum: 1 }



            }
        }, { $sort: { fullcode: -1 } }]).toArray()

        if (data.length > 0) {
            response = data
        } else {
            response = {
                "error": true,
                "message": "data not found."
            }
        }

        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(response));
    })



});

