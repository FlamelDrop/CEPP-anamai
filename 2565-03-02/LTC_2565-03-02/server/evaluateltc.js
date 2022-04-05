import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { EVALUATE_DISTRICT } from '../imports/db.js';
import { DISTRICT } from '../imports/db.js';
import { Dirent } from 'fs';

_ = lodash
Meteor.startup(() => {

    Meteor.methods({
        getSUBDISTRICTbyCM(pro, dis, subdis) {
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: {
                    "Evaluate.evaluate_year": "2562",
                    "province_name": pro,
                    "district_name": dis,
                    "subdistrict_name": subdis,

                }
            }]).toArray()
            // EVALUATE_DISTRICT.find({ "province_name": x }).fetch();
            return DISTRICTfind;
        },
        getSUBDISTRICTbyIdDISTRICT(pro, dis) {
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: {
                    "Evaluate.evaluate_year": "2562",
                    "province_name": pro,
                    "district_name": dis,

                }
            }]).toArray()
            // EVALUATE_DISTRICT.find({ "province_name": x }).fetch();
            return DISTRICTfind;
        },
        getDISTRICTbyIdProvince(x) {
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: {
                    "Evaluate.evaluate_year": "2562",
                    "province_name": x
                }
            }]).toArray()
            // EVALUATE_DISTRICT.find({ "province_name": x }).fetch();
            return DISTRICTfind;
        },
        getDISTRICTbyId(x) {
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: {
                    "Evaluate.evaluate_year": "2562",
                    "fullcode": x
                }
            }]).toArray()
            // var DISTRICTfind = EVALUATE_DISTRICT.find({ "fullcode": x }).fetch();
            return DISTRICTfind;
        },
        updateDISTRICTbyJoin(id, fullcode, data, year, wait) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        "Evaluate.$.join": data,
                        "Evaluate.$.join_year": year,
                        "Evaluate.$.wait": wait
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })
            return 'true';
        },
        updateDISTRICTbyJoinYear(id, fullcode, year) {

            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        "Evaluate.$.join_year": year,
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })

            return 'true';
        },
        updateDISTRICTbyPassYear(id, fullcode, year) {

            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        "Evaluate.$.pass_year": year,
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })

            return 'true';
        },
        updateDISTRICTbyRemark(id, fullcode, text) {

            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        "Evaluate.$.remark": text,
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })
            return 'true';
        },
        clearDISTRICTEva(fullcode) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {

                        "Evaluate.$.remark": "",
                        "Evaluate.$.c1": false,
                        "Evaluate.$.c2": false,
                        "Evaluate.$.c3": false,
                        "Evaluate.$.c4": false,
                        "Evaluate.$.c4_1": false,
                        "Evaluate.$.c4_2": false,
                        "Evaluate.$.c4_3": false,
                        "Evaluate.$.c4_4": false,

                        "Evaluate.$.join": null,
                        "Evaluate.$.join_year": "ไม่ระบุ",
                        "Evaluate.$.pass_year": "ไม่ระบุ",
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })

        },
        getDISTRICT(init, skip, limit, pro, dis) {
            var skip = parseInt(skip)
            var limit = parseInt(limit)
            // var find = { province_name: { $in: init } }
            if (pro && !dis) {
                find = { province_name: pro, "Evaluate.evaluate_year": "2562", }
            } else if (pro && dis) {
                find = { $and: [{ province_name: pro }, { district_name: dis }], "Evaluate.evaluate_year": "2562", }
            } else {
                find = { province_name: { $in: init }, "Evaluate.evaluate_year": "2562", }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $skip: skip }, { $limit: limit }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind
        },
        getDISTRICT_COUNT(init, pro, dis) {
            var skip = parseInt(skip)
            var limit = parseInt(limit)
            // var find = { province_name: { $in: init } }
            if (pro && !dis) {
                find = { province_name: pro, "Evaluate.evaluate_year": "2562", }
            } else if (pro && dis) {
                find = { $and: [{ province_name: pro }, { district_name: dis }], "Evaluate.evaluate_year": "2562", }
            } else {
                find = { province_name: { $in: init }, "Evaluate.evaluate_year": "2562", }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind.length
            //  return EVALUATE_DISTRICT.find(find, { sort: { fullcode: 1 } }).count();
        },
        hpcSearchEvaLTC(init, skip, limit, search) {
            var skip = parseInt(skip)
            var limit = parseInt(limit)
            // var find = { province_name: { $in: init } }
            if (search) {
                var regex = new RegExp(search, 'i');
                find = {
                    $or: [
                        { "fullcode": { '$regex': regex } },
                        { "subdistrict_name": { '$regex': regex } },
                        { "district_code": { '$regex': regex } },
                        { "district_name": { '$regex': regex } },
                        { "province_code": { '$regex': regex } },
                    ],
                    province_name: { $in: init },
                    "Evaluate.evaluate_year": "2562",
                }

            } else {
                find = { province_name: { $in: init }, "Evaluate.evaluate_year": "2562" }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $skip: skip }, { $limit: limit }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind
        },
        hpcSearchEvaLTC_COUNT(init, search) {

            // var find = { province_name: { $in: init } }
            if (search) {
                var regex = new RegExp(search, 'i');
                find = {
                    $or: [
                        { "fullcode": { '$regex': regex } },
                        { "subdistrict_name": { '$regex': regex } },
                        { "district_code": { '$regex': regex } },
                        { "district_name": { '$regex': regex } },
                        { "province_code": { '$regex': regex } },
                    ],
                    province_name: { $in: init }, "Evaluate.evaluate_year": "2562"
                }

            } else {
                find = { province_name: { $in: init }, "Evaluate.evaluate_year": "2562" }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind.length
            //return EVALUATE_DISTRICT.find(find, { sort: { fullcode: 1 } }).count();
        },
        getDISTRICTEvaAll(str) {
            if (str) {
                find = {
                    province_name: { $in: str }, "Evaluate.evaluate_year": "2562"
                }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind

        },
        getSUBDISTRICT(init, skip, limit, pro, dis) {
            var skip = parseInt(skip)
            var limit = parseInt(limit)
            // var find = { province_name: { $in: init } }
            if (pro && !dis) {
                find = { province_name: pro, "Evaluate.evaluate_year": "2562" }
            } else if (pro && dis) {
                find = { $and: [{ province_name: pro }, { district_name: dis }], "Evaluate.evaluate_year": "2562" }
            } else {
                find = { district_name: { $in: init }, "Evaluate.evaluate_year": "2562" }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $skip: skip }, { $limit: limit }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind
        },
        getSUBDISTRICT_COUNT(init, pro, dis) {
            var skip = parseInt(skip)
            var limit = parseInt(limit)
            // var find = { province_name: { $in: init } }
            if (pro && !dis) {
                find = { province_name: pro, "Evaluate.evaluate_year": "2562" }
            } else if (pro && dis) {
                find = { $and: [{ province_name: pro }, { district_name: dis }], "Evaluate.evaluate_year": "2562" }
            } else {
                find = { district_name: { $in: init }, "Evaluate.evaluate_year": "2562" }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind.length
        },
        SUBDISTRICTSearchEvaLTC(init, skip, limit, search) {
            var skip = parseInt(skip)
            var limit = parseInt(limit)
            // var find = { province_name: { $in: init } }
            if (search) {
                var regex = new RegExp(search, 'i');
                find = {
                    $or: [
                        { "fullcode": { '$regex': regex } },
                        { "subdistrict_name": { '$regex': regex } },
                        { "district_code": { '$regex': regex } },
                        { "district_name": { '$regex': regex } },
                        { "province_code": { '$regex': regex } },
                    ],
                    province_name: init,
                    "Evaluate.evaluate_year": "2562"

                }

            } else {
                find = { province_name: init, "Evaluate.evaluate_year": "2562" }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $skip: skip }, { $limit: limit }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind
        },
        SUBDISTRICTSearchEvaLTC_COUNT(init, search) {

            // var find = { province_name: { $in: init } }
            if (search) {
                var regex = new RegExp(search, 'i');
                find = {
                    $or: [
                        { "fullcode": { '$regex': regex } },
                        { "subdistrict_name": { '$regex': regex } },
                        { "district_code": { '$regex': regex } },
                        { "district_name": { '$regex': regex } },
                        { "province_code": { '$regex': regex } },
                    ],
                    province_name: init,
                    "Evaluate.evaluate_year": "2562"
                }

            } else {
                find = { province_name: init, "Evaluate.evaluate_year": "2562" }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind.length
        },

        DISTRICTSearchEvaLTC(init, dis, sk, limit, search) {
            var skip = parseInt(sk)
            var limit = parseInt(limit)
            // var find = { province_name: { $in: init } }
            if (search) {
                var regex = new RegExp(search, 'i');
                find = {
                    $or: [
                        { "fullcode": { '$regex': regex } },
                        { "subdistrict_name": { '$regex': regex } },
                        { "district_code": { '$regex': regex } },
                        { "district_name": { '$regex': regex } },
                    ],
                    province_name: init,
                    district_name: dis,
                    "Evaluate.evaluate_year": "2562"

                }

            } else {
                find = { province_name: init, district_name: dis, "Evaluate.evaluate_year": "2562" }
            }

            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $skip: skip }, { $limit: limit }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind
        },
        DISTRICTSearchEvaLTC_COUNT(init, dis, search) {

            // var find = { province_name: { $in: init } }
            if (search) {
                var regex = new RegExp(search, 'i');
                find = {
                    $or: [
                        { "fullcode": { '$regex': regex } },
                        { "subdistrict_name": { '$regex': regex } },
                        { "district_code": { '$regex': regex } },
                        { "district_name": { '$regex': regex } },
                    ],
                    province_name: init,
                    district_name: dis,
                    "Evaluate.evaluate_year": "2562"
                }

            } else {
                find = { province_name: init, district_name: dis, "Evaluate.evaluate_year": "2562" }
            }
            var DISTRICTfind = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: find
            }, { $sort: { fullcode: 1 } }]).toArray()
            return DISTRICTfind.length
        },
        updateCriterio1(id, fullcode, data) {
            //console.log(fullcode)
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        'Evaluate.$.c1': data
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })
        },
        updateCriterio2(id, fullcode, data) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        'Evaluate.$.c2': data
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })

        },
        updateCriterio3(id, fullcode, data) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        'Evaluate.$.c3': data
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })
        },
        updateCriterio4(id, fullcode, data) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        'Evaluate.$.c4': data
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })
        },
        updateCriterio4_1(id, fullcode, data) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        'Evaluate.$.c4_1': data
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                    // console.log('error');

                })
        },
        updateCriterio4_2(id, fullcode, data) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        'Evaluate.$.c4_2': data
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })
        },
        updateCriterio4_3(id, fullcode, data) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        'Evaluate.$.c4_3': data
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })
        },
        updateCriterio4_4(id, fullcode, data) {
            EVALUATE_DISTRICT.update({ "fullcode": fullcode, "Evaluate.evaluate_year": "2562" },
                {
                    $set:
                    {
                        'Evaluate.$.c4_4': data
                    }
                }, function (err, res) {
                    if (res == '0') {
                        //   console.log('wtf')
                        EVALUATE_DISTRICT.update({ "fullcode": fullcode, },
                            {
                                $addToSet:
                                {
                                    'Evaluate': {
                                        "c1": false,
                                        "c2": false,
                                        "c3": false,
                                        "c4": false,
                                        "c4_1": false,
                                        "c4_2": false,
                                        "c4_3": false,
                                        "c4_4": false,

                                        "join": false,
                                        "join_year": "",
                                        "remark": "",
                                        "pass_year": "",
                                        "evaluate_year": "2562",
                                        "evaluate_date": new Date()
                                    }
                                }
                            })
                    }
                })
        },
        countJoinDistrict() {
            var num_join = EVALUATE_DISTRICT.find({}, { sort: { fullcode: 1 } }).count();
            var criterio = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, {
                $match: {
                    "Evaluate.evaluate_year": "2562",
                    $and: [{ "Evaluate.c1": true }, { "Evaluate.c2": true }, { "Evaluate.c3": true }, { "Evaluate.c4": true }]
                }
            }, { $sort: { fullcode: 1 } }]).toArray().length
            var result = (criterio / num_join) * 100

            return isNaN(result) ? 0 : result
        },
        countPassDistrict() {
            var num_district = EVALUATE_DISTRICT.aggregate([{ $group: { _id: "$zone", numdis: { $sum: 1 } } }, { $sort: { _id: 1 } }])
            var pass_district = EVALUATE_DISTRICT.aggregate([{
                $unwind: {
                    path: "$Evaluate",
                    includeArrayIndex: "arrayIndex", // optional
                    preserveNullAndEmptyArrays: false // optional
                }
            }, { $match: { $and: [{ "Evaluate.c1": true }, { "Evaluate.c2": true }, { "Evaluate.c3": true }, { "Evaluate.c4": true }] } }, { $group: { _id: "$zone", passdis: { $sum: 1 } } }, { $sort: { _id: 1 } }]).toArray()
            var concatArr = _.concat(num_district, pass_district)
            var output = [];//output array
            var temp = {};//temp object
            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.numdis ? temp[o._id].numdis = o.numdis : temp[o._id].numdis = 0
                    o.passdis ? temp[o._id].passdis = o.passdis : temp[o._id].passdis = 0
                } else {
                    o.numdis ? temp[o._id].numdis = temp[o._id].numdis + o.numdis : temp[o._id].numdis
                    o.passdis ? temp[o._id].passdis = temp[o._id].passdis + o.passdis : temp[o._id].passdis
                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    _id: key,
                    numdis: temp[key].numdis,
                    passdis: temp[key].passdis,
                    percentage: 0
                })
            }
            var soutput = _.sortBy(output, o => o._id)

            return soutput;
        },
        async reportEvaluateZoneltc() {
            const cy = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c1: "$Evaluate.c1", c2: "$Evaluate.c2", c3: "$Evaluate.c3", c4: "$Evaluate.c4", "subdistrict_name": 1, "district_name": 1, "province_name": 1 } }, { $project: { pass: { $cond: [{ $and: [{ $eq: ["$c1", true] }, { $eq: ["$c2", true] }, { $eq: ["$c3", true] }, { $eq: ["$c4", true] },] }, "y", "n"] }, zone: 1 } }, { $match: { pass: "y" } }, { $group: { _id: "$zone", y: { $sum: 1 } } }]).toArray();
            const cn = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c1: "$Evaluate.c1", c2: "$Evaluate.c2", c3: "$Evaluate.c3", c4: "$Evaluate.c4", "subdistrict_name": 1, "district_name": 1, "province_name": 1 } }, { $project: { pass: { $cond: [{ $and: [{ $eq: ["$c1", true] }, { $eq: ["$c2", true] }, { $eq: ["$c3", true] }, { $eq: ["$c4", true] },] }, "y", "n"] }, zone: 1 } }, { $match: { pass: "n" } }, { $group: { _id: "$zone", n: { $sum: 1 } } }]).toArray();
            const c1 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c1: "$Evaluate.c1", } }, { $match: { c1: false } }, { $group: { _id: "$zone", c1: { $sum: 1 } } }]).toArray();
            const c2 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c2: "$Evaluate.c2", } }, { $match: { c2: false } }, { $group: { _id: "$zone", c2: { $sum: 1 } } }]).toArray();
            const c3 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c3: "$Evaluate.c3", } }, { $match: { c3: false } }, { $group: { _id: "$zone", c3: { $sum: 1 } } }]).toArray();
            const c4 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c4: "$Evaluate.c4", } }, { $match: { c4: false } }, { $group: { _id: "$zone", c4: { $sum: 1 } } }]).toArray();
            var concatArr = _.concat(cy, cn, c1, c2, c3, c4);
            var output = [];//output array
            var temp = {};//temp object
            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.y ? temp[o._id].y = o.y : temp[o._id].y = 0
                    o.n ? temp[o._id].n = o.n : temp[o._id].n = 0
                    o.c1 ? temp[o._id].c1 = o.c1 : temp[o._id].c1 = 0
                    o.c2 ? temp[o._id].c2 = o.c2 : temp[o._id].c2 = 0
                    o.c3 ? temp[o._id].c3 = o.c3 : temp[o._id].c3 = 0
                    o.c4 ? temp[o._id].c4 = o.c4 : temp[o._id].c4 = 0


                } else {
                    o.y ? temp[o._id].y = temp[o._id].y + o.y : temp[o._id].y
                    o.n ? temp[o._id].n = temp[o._id].n + o.n : temp[o._id].n
                    o.c1 ? temp[o._id].c1 = temp[o._id].c1 + o.c1 : temp[o._id].c1
                    o.c2 ? temp[o._id].c2 = temp[o._id].c2 + o.c2 : temp[o._id].c2
                    o.c3 ? temp[o._id].c3 = temp[o._id].c3 + o.c3 : temp[o._id].c3
                    o.c4 ? temp[o._id].c4 = temp[o._id].c4 + o.c4 : temp[o._id].c4

                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    _id: key,
                    cy: temp[key].y,
                    cn: temp[key].n,
                    c1: temp[key].c1,
                    c2: temp[key].c2,
                    c3: temp[key].c3,
                    c4: temp[key].c4,
                    sum: 0
                })
            }
            var soutput = _.sortBy(output, o => o._id)
            return soutput;


        },
        async reportEvaluateProvinceltc(z) {
            const cy = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c1: "$Evaluate.c1", c2: "$Evaluate.c2", c3: "$Evaluate.c3", c4: "$Evaluate.c4", subdistrict_name: 1, district_name: 1, province_name: 1 } }, { $project: { pass: { $cond: [{ $and: [{ $eq: ["$c1", true] }, { $eq: ["$c2", true] }, { $eq: ["$c3", true] }, { $eq: ["$c4", true] },] }, "y", "n"] }, zone: 1, province_name: 1, district_name: 1, } }, { $match: { pass: "y", zone: z } }, { $group: { _id: "$province_name", y: { $sum: 1 } } }]).toArray();
            const cn = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c1: "$Evaluate.c1", c2: "$Evaluate.c2", c3: "$Evaluate.c3", c4: "$Evaluate.c4", subdistrict_name: 1, district_name: 1, province_name: 1 } }, { $project: { pass: { $cond: [{ $and: [{ $eq: ["$c1", true] }, { $eq: ["$c2", true] }, { $eq: ["$c3", true] }, { $eq: ["$c4", true] },] }, "y", "n"] }, zone: 1, province_name: 1, district_name: 1, } }, { $match: { pass: "n", zone: z } }, { $group: { _id: "$province_name", n: { $sum: 1 } } }]).toArray();
            const c1 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, province_name: 1, district_name: 1, c1: "$Evaluate.c1", } }, { $match: { c1: false, zone: z } }, { $group: { _id: "$province_name", c1: { $sum: 1 } } }]).toArray();
            const c2 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, province_name: 1, district_name: 1, c2: "$Evaluate.c2", } }, { $match: { c2: false, zone: z } }, { $group: { _id: "$province_name", c2: { $sum: 1 } } }]).toArray();
            const c3 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, province_name: 1, district_name: 1, c3: "$Evaluate.c3", } }, { $match: { c3: false, zone: z } }, { $group: { _id: "$province_name", c3: { $sum: 1 } } }]).toArray();
            const c4 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, province_name: 1, district_name: 1, c4: "$Evaluate.c4", } }, { $match: { c4: false, zone: z } }, { $group: { _id: "$province_name", c4: { $sum: 1 } } }]).toArray();

            var concatArr = _.concat(cy, cn, c1, c2, c3, c4);
            var output = [];//output array
            var temp = {};//temp object
            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.y ? temp[o._id].y = o.y : temp[o._id].y = 0
                    o.n ? temp[o._id].n = o.n : temp[o._id].n = 0

                    o.c1 ? temp[o._id].c1 = o.c1 : temp[o._id].c1 = 0
                    o.c2 ? temp[o._id].c2 = o.c2 : temp[o._id].c2 = 0
                    o.c3 ? temp[o._id].c3 = o.c3 : temp[o._id].c3 = 0
                    o.c4 ? temp[o._id].c4 = o.c4 : temp[o._id].c4 = 0

                } else {
                    o.y ? temp[o._id].y = temp[o._id].y + o.y : temp[o._id].y
                    o.n ? temp[o._id].n = temp[o._id].n + o.n : temp[o._id].n

                    o.c1 ? temp[o._id].c1 = temp[o._id].c1 + o.c1 : temp[o._id].c1
                    o.c2 ? temp[o._id].c2 = temp[o._id].c2 + o.c2 : temp[o._id].c2
                    o.c3 ? temp[o._id].c3 = temp[o._id].c3 + o.c3 : temp[o._id].c3
                    o.c4 ? temp[o._id].c4 = temp[o._id].c4 + o.c4 : temp[o._id].c4

                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    _id: key,
                    cy: temp[key].y,
                    cn: temp[key].n,
                    c1: temp[key].c1,
                    c2: temp[key].c2,
                    c3: temp[key].c3,
                    c4: temp[key].c4,
                    sum: 0
                })
            }
            var soutput = _.sortBy(output, o => o._id)
            return soutput;


        },
        async reportEvaluateAmphoeltc(z) {
            const cy = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c1: "$Evaluate.c1", c2: "$Evaluate.c2", c3: "$Evaluate.c3", c4: "$Evaluate.c4", subdistrict_name: 1, district_name: 1, province_name: 1 } }, { $project: { pass: { $cond: [{ $and: [{ $eq: ["$c1", true] }, { $eq: ["$c2", true] }, { $eq: ["$c3", true] }, { $eq: ["$c4", true] },] }, "y", "n"] }, zone: 1, province_name: 1, district_name: 1, } }, { $match: { pass: "y", province_name: z } }, { $group: { _id: "$district_name", y: { $sum: 1 } } }]).toArray();
            const cn = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, c1: "$Evaluate.c1", c2: "$Evaluate.c2", c3: "$Evaluate.c3", c4: "$Evaluate.c4", subdistrict_name: 1, district_name: 1, province_name: 1 } }, { $project: { pass: { $cond: [{ $and: [{ $eq: ["$c1", true] }, { $eq: ["$c2", true] }, { $eq: ["$c3", true] }, { $eq: ["$c4", true] },] }, "y", "n"] }, zone: 1, province_name: 1, district_name: 1, } }, { $match: { pass: "n", province_name: z } }, { $group: { _id: "$district_name", n: { $sum: 1 } } }]).toArray();
            const c1 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, province_name: 1, district_name: 1, c1: "$Evaluate.c1", } }, { $match: { c1: false, province_name: z } }, { $group: { _id: "$district_name", c1: { $sum: 1 } } }]).toArray();
            const c2 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, province_name: 1, district_name: 1, c2: "$Evaluate.c2", } }, { $match: { c2: false, province_name: z } }, { $group: { _id: "$district_name", c2: { $sum: 1 } } }]).toArray();
            const c3 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, province_name: 1, district_name: 1, c3: "$Evaluate.c3", } }, { $match: { c3: false, province_name: z } }, { $group: { _id: "$district_name", c3: { $sum: 1 } } }]).toArray();
            const c4 = await EVALUATE_DISTRICT.aggregate([{ $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }, { $project: { zone: 1, province_name: 1, district_name: 1, c4: "$Evaluate.c4", } }, { $match: { c4: false, province_name: z } }, { $group: { _id: "$district_name", c4: { $sum: 1 } } }]).toArray();

            var concatArr = _.concat(cy, cn, c1, c2, c3, c4);
            var output = [];//output array
            var temp = {};//temp object
            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.y ? temp[o._id].y = o.y : temp[o._id].y = 0
                    o.n ? temp[o._id].n = o.n : temp[o._id].n = 0

                    o.c1 ? temp[o._id].c1 = o.c1 : temp[o._id].c1 = 0
                    o.c2 ? temp[o._id].c2 = o.c2 : temp[o._id].c2 = 0
                    o.c3 ? temp[o._id].c3 = o.c3 : temp[o._id].c3 = 0
                    o.c4 ? temp[o._id].c4 = o.c4 : temp[o._id].c4 = 0

                } else {
                    o.y ? temp[o._id].y = temp[o._id].y + o.y : temp[o._id].y
                    o.n ? temp[o._id].n = temp[o._id].n + o.n : temp[o._id].n

                    o.c1 ? temp[o._id].c1 = temp[o._id].c1 + o.c1 : temp[o._id].c1
                    o.c2 ? temp[o._id].c2 = temp[o._id].c2 + o.c2 : temp[o._id].c2
                    o.c3 ? temp[o._id].c3 = temp[o._id].c3 + o.c3 : temp[o._id].c3
                    o.c4 ? temp[o._id].c4 = temp[o._id].c4 + o.c4 : temp[o._id].c4
                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    _id: key,
                    cy: temp[key].y,
                    cn: temp[key].n,
                    c1: temp[key].c1,
                    c2: temp[key].c2,
                    c3: temp[key].c3,
                    c4: temp[key].c4,
                    sum: 0
                })
            }
            var soutput = _.sortBy(output, o => o._id)
            return soutput;


        },
        async reportEvaluateTambonltc(p, a) {

            return EVALUATE_DISTRICT.aggregate([{ $match: { province_name: p, district_name: a } }, { $unwind: { path: "$Evaluate", includeArrayIndex: "arrayIndex" } }]).toArray();
        }
    })


});

