import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { photos } from '../imports/db.js';
import { photosg } from '../imports/db.js';
import { photosCG } from '../imports/db.js';
import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';
import { ELDERLYREGISTER } from '../imports/db.js';
import { CARECODE } from '../imports/db.js';
import { CARETYPE } from '../imports/db.js';
import { ADMINCODE } from '../imports/db.js';
import { DISTRICT_USER } from '../imports/db.js';
import { DISTRICT_USER_DATA } from '../imports/db.js';
import { CAREPLAN_DETAIL } from '../imports/db.js';
import { CAREPLAN_DETAIL_ACTIVITY } from '../imports/db.js';
import { CAREPLAN } from '../imports/db.js';
import { CAREPLAN_ACTIVITY } from '../imports/db.js';
import { VENDER_CODE } from '../imports/db.js';
import { CM_REGISTER } from '../imports/db.js';
import { SERVICE_CENTER } from '../imports/db.js';
import { DISTRICT } from '../imports/db.js';
import { USER_LOGIN } from '../imports/db.js';
import { CG_REGISTER } from '../imports/db.js';
import { DLA } from '../imports/db.js';
import { GEOLOCATION } from '../imports/db.js';
import { CC_REGISTER } from '../imports/db.js';
import { EVALUATE_DISTRICT } from '../imports/db.js';
import { provinces } from '../imports/db.js';
Meteor.startup(() => {
    var progress_inc = 0;
    var key =
        'V7T5J53NUDNcDUu1Dl74hpr58JNITaCE5mxEfof0ST0jBka4t6ZAjethO5Px3gZYskqxxwlfdcoEknxEhk2qokv2f8n8eaUwlaSGu1Lv1X0c8lEdvwtJGMAJLLFPMpaVqQrKH06zNUzK53Non5VSHlriXXYxcWiqCz19pVw0FVAyMcM07vIEHXLsKxPLjV1LkQIxB5n4OMsrO2hLoNdTAO9bbMKkxzTFgs2FldAZPQgrJl0VY4EpGBoIdWQAlA5p';
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: 'ltcregistercm@gmail.com',
            pass: '56ESJpjQbFA7yNEd',
        },
    });
    Meteor.methods({
        /////////////////////////////////REST API ELDER/////////////////////////////////
        editCpCreateDate(cpid, ndate, careid, cid, hcode) {
            ////console.log(careid)

            var d = new Date(ndate);
            var n = d.getMonth() + 1;
            var year = d.getFullYear() + 543 - 2500;
            if (n > 9) {
                year = year + 1;
            } else {
                year = year;
            }
            var dstart =
                parseInt(year + 2500 - 543 - 1) + '-10-01 07:00:00.000+07:00';
            var dend =
                parseInt(year + 2500 - 543) + '-09-30 07:00:00.000+07:00';
            var match = {
                CID: cid,
                CREATEDATE: {
                    $gte: new Date(moment(dstart).toDate()),
                    $lt: new Date(moment(dend).toDate()),
                },
            };
            var match2 = {
                HOSPCODE: hcode,
                CREATEDATE: {
                    $gte: new Date(moment(dstart).toDate()),
                    $lt: new Date(moment(dend).toDate()),
                },
            };
            //console.log(match)
            //console.log(match2)
            var data1 = CAREPLAN_DETAIL.find(match).count();
            var data2 = CAREPLAN_DETAIL.find(match2).count();
            var count = zerofront(data2 + 1, 4);
            var copy = data1 + 1 + '/' + year;
            var care = careid.split('-');
            var cplanid =
                care[0] +
                '-' +
                care[1] +
                '-' +
                care[2] +
                '-' +
                year +
                '/' +
                count;
            //console.log(copy, cpid, cplanid);
            // Meteor.setTimeout(function() {
            CAREPLAN_DETAIL.update(
                { _id: cpid },
                {
                    $set: {
                        CREATEDATE: ndate,
                    },
                }
            );
            // }, 400);
            // Meteor.setTimeout(function() {

            // }, 500);

            return CAREPLAN_DETAIL.update(
                { _id: cpid },
                {
                    $set: {
                        YEAR: year,
                        COPY: copy,
                        CAREPLANID: cplanid,
                    },
                }
            );
        },
        getElderDataByHospcode(hospcode, year) {
            const result = HTTP.call(
                'GET',
                'http://ltc.nhso.go.th/ltc/ws/older-person?surveyHcode=' +
                    hospcode +
                    '&budgetYear=' +
                    year +
                    '',
                {
                    auth: 'nhsoWS1234:nhsoWS@1234',
                    headers: {
                        Authorization: 'Basic bmhzb1dTMTIzNDpuaHNvV1NAMTIzNA==',
                    },
                }
            );
            if (result) {
                return result;
            } else {
                return false;
            }
        },
        listHistory(pid) {
            return breastcacer
                .find({ pid: pid }, { sort: { checkDate: -1 } })
                .fetch();
        },
        insertCM_Service(obj, obj_login) {
            encrypted = CryptoJS.AES.encrypt(obj_login.PASSWORD, key);
            obj_login.PASSWORD = encrypted.toString();
            var id = CM_REGISTER.insert(
                obj,

                function (error, result) {
                    USER_LOGIN.insert(obj_login);
                }
            );
            return id;
        },
        insertCM_DLA(obj, obj_login) {
            encrypted = CryptoJS.AES.encrypt(obj_login.PASSWORD, key);
            obj_login.PASSWORD = encrypted.toString();
            CM_REGISTER.insert(
                obj,

                function (error, result) {
                    USER_LOGIN.insert(obj_login);
                }
            );
        },
        showpassword(PASSWORD) {
            var decrypted = CryptoJS.AES.decrypt(PASSWORD, key);
            var final = decrypted.toString(CryptoJS.enc.Utf8);
            // decrypted.toString(CryptoJS.enc.Utf8)
            ////console.log(decrypted.toString(CryptoJS.enc.Utf8))
            return decrypted.toString(CryptoJS.enc.Utf8);
        },
        getlistUsername(skip, limit) {
            var data = USER_LOGIN.find(
                {},
                { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
            ).fetch();
            return data;
        },
        SearchListUsername(skip, limit, search) {
            //console.log(skip, limit, search)
            if (search) {
                var regex = new RegExp(search, 'i');
                find = {
                    $or: [
                        { USERNAME: { $regex: regex } },
                        { RULE: { $regex: regex } },
                    ],
                };
            } else {
                find = {};
            }
            return USER_LOGIN.find(find, {
                sort: { CREATEDATE: 1 },
                skip: skip,
                limit: limit,
            }).fetch();
        },
        SearchListUsername_COUNT(search) {
            if (search) {
                var regex = new RegExp(search, 'i');
                find = {
                    $or: [
                        { USERNAME: { $regex: regex } },
                        { RULE: { $regex: regex } },
                    ],
                };
            } else {
                find = {};
            }
            return USER_LOGIN.find(find, { sort: { CREATEDATE: 1 } }).count();
        },
        getCountUsername() {
            var data = USER_LOGIN.find({}).count();
            return data;
        },
        listVenderCode() {
            var data = VENDER_CODE.find({}).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].vender,
                    text:
                        data[i].dla +
                        ' จ.' +
                        data[i].province +
                        ' ' +
                        data[i].zone.split(' ')[0] +
                        ' ' +
                        data[i].zone.split(' ')[1],
                });
            }
            return arr;
        },
        upDateCareplanActivity(obj) {
            CAREPLAN_DETAIL_ACTIVITY.remove({ CAREPLANID: obj });
        },
        editCareplan(obj) {
            CAREPLAN_DETAIL.remove({ CAREPLANID: obj.CAREPLANID });
            CAREPLAN_DETAIL_ACTIVITY.remove({ CAREPLANID: obj.CAREPLANID });
            CAREPLAN.remove({ CAREPLANID: obj.CAREPLANID });
            CAREPLAN_ACTIVITY.remove({ CAREPLANID: obj.CAREPLANID });

            CAREPLAN_DETAIL.insert(obj);
            CAREPLAN.insert({
                CAREPLANID: obj.CAREPLANID,
                CID: obj.CID,
                MAIN: '',
                HOSPCODE: obj.HOSPCODE,
                VENDERCODE: obj.VENDERCODE,
                APPROVEDATE: '',
                STARTDATE: '',
                CMID: obj.CMID,
                CGID: obj.CGID,
                CREATEDATE: obj.CREATEDATE,
                BIRTHDATE: obj.BIRTHDATE,
                CURRENTADDRESS: obj.CURRENTADDRESS,
                PHONE: obj.PHONE,
            });
        },
        removecareplan(data) {
            CAREPLAN_DETAIL.remove({ _id: data });

            CAREPLAN.remove({ CAREPLANID: data });
            CAREPLAN_ACTIVITY.remove({ CAREPLANID: data });
        },
        getCGName(data) {
            try {
                var dato = CG_REGISTER.find({ CID: data }).fetch()[0];
                return dato.PRENAME + dato.NAME + ' ' + dato.LNAME;
            } catch (e) {}
        },
        //////////////////////////////////CARE PLAN/////////////////////////////////////////////////////////////////////
        HPC_SEARCH_CM(pro, dis, sub, zone, find, skip, limit) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            if (pro && !dis && !sub) {
                if (find) {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                { 'HOSPCODE.PROVINCE': { $regex: pro } },
                                { 'DLACODE.PROVINCE': { $regex: pro } },
                            ],
                            STATE_ACTIVE: find,
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                { 'HOSPCODE.PROVINCE': { $regex: pro } },
                                { 'DLACODE.PROVINCE': { $regex: pro } },
                            ],
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (pro && dis && !sub) {
                if (find) {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                    ],
                                },
                            ],
                            STATE_ACTIVE: find,
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (pro && dis && sub) {
                if (find) {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        {
                                            'HOSPCODE.DISTRICT': {
                                                $regex: sub,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                        { 'DLACODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                            ],
                            STATE_ACTIVE: find,
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        {
                                            'HOSPCODE.DISTRICT': {
                                                $regex: sub,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                        { 'DLACODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (zone && !pro && !dis && !sub) {
                if (find) {
                    return CM_REGISTER.find(
                        {
                            zone: { $regex: zone.toString() },
                            STATE_ACTIVE: find,
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CM_REGISTER.find(
                        { zone: { $regex: zone.toString() }, confirm: true },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            }
        },
        PROVINCE_SEARCH_CM(pro, dis, sub, zone, find, skip, limit) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            if (pro && !dis && !sub) {
                if (find) {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                { 'HOSPCODE.PROVINCE': { $regex: pro } },
                                { 'DLACODE.PROVINCE': { $regex: pro } },
                            ],
                            STATE_ACTIVE: find,
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                { 'HOSPCODE.PROVINCE': { $regex: pro } },
                                { 'DLACODE.PROVINCE': { $regex: pro } },
                            ],
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (pro && dis && !sub) {
                if (find) {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                    ],
                                },
                            ],
                            STATE_ACTIVE: find,
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (pro && dis && sub) {
                if (find) {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        {
                                            'HOSPCODE.DISTRICT': {
                                                $regex: sub,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                        { 'DLACODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            STATE_ACTIVE: find,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CM_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        {
                                            'HOSPCODE.DISTRICT': {
                                                $regex: sub,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                        { 'DLACODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            }

            // } else if (zone && !pro && !dis && !sub) {
            //     if (find) {
            //         return CM_REGISTER.find({ $or: [{ "HOSPCODE.PROVINCE": { $regex: zone.toString() } }, { "DLACODE.PROVINCE": { $regex: zone.toString() } }], "confirm": true, "STATE_ACTIVE": find }, { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }).fetch()
            //     } else {
            //         return CM_REGISTER.find({ $or: [{ "HOSPCODE.PROVINCE": { $regex: zone.toString() } }, { "DLACODE.PROVINCE": { $regex: zone.toString() } }], "confirm": true }, { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }).fetch()
            //     }
            // }
        },
        HPC_SEARCH_CG(pro, dis, sub, zone, find, skip, limit) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            if (pro && !dis && !sub) {
                if (find) {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                { 'HOSPCODE.PROVINCE': { $regex: pro } },
                                { 'DLACODE.PROVINCE': { $regex: pro } },
                            ],
                            confirm: true,
                            STATE_ACTIVE: find,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                { 'HOSPCODE.PROVINCE': { $regex: pro } },
                                { 'DLACODE.PROVINCE': { $regex: pro } },
                            ],
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (pro && dis && !sub) {
                if (find) {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            STATE_ACTIVE: find,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (pro && dis && sub) {
                if (find) {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        {
                                            'HOSPCODE.DISTRICT': {
                                                $regex: sub,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                        { 'DLACODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            STATE_ACTIVE: find,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        {
                                            'HOSPCODE.DISTRICT': {
                                                $regex: sub,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                        { 'DLACODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            zone: { $regex: zone.toString() },
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (zone && !pro && !dis && !sub) {
                if (find) {
                    return CG_REGISTER.find(
                        {
                            zone: { $regex: zone.toString() },
                            STATE_ACTIVE: find,
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CG_REGISTER.find(
                        { zone: { $regex: zone.toString() }, confirm: true },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            }
        },
        PROVINCE_SEARCH_CG(pro, dis, sub, zone, find, skip, limit) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            if (pro && !dis && !sub) {
                if (find) {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                { 'HOSPCODE.PROVINCE': { $regex: pro } },
                                { 'DLACODE.PROVINCE': { $regex: pro } },
                            ],
                            confirm: true,
                            STATE_ACTIVE: find,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                { 'HOSPCODE.PROVINCE': { $regex: pro } },
                                { 'DLACODE.PROVINCE': { $regex: pro } },
                            ],
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (pro && dis && !sub) {
                if (find) {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            STATE_ACTIVE: find,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            } else if (pro && dis && sub) {
                if (find) {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        {
                                            'HOSPCODE.DISTRICT': {
                                                $regex: sub,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                        { 'DLACODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                            STATE_ACTIVE: find,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                } else {
                    return CG_REGISTER.find(
                        {
                            $or: [
                                {
                                    $and: [
                                        {
                                            'HOSPCODE.PROVINCE': {
                                                $regex: pro,
                                            },
                                        },
                                        {
                                            'HOSPCODE.DISTRICT': {
                                                $regex: sub,
                                            },
                                        },
                                        { 'HOSPCODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                                {
                                    $and: [
                                        { 'DLACODE.PROVINCE': { $regex: pro } },
                                        { 'DLACODE.DISTRICT': { $regex: dis } },
                                        { 'DLACODE.AMPHOE': { $regex: dis } },
                                    ],
                                },
                            ],
                            confirm: true,
                        },
                        { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }
                    ).fetch();
                }
            }
            // } else if (zone && !pro && !dis && !sub) {
            //     if (find) {
            //         return CG_REGISTER.find({ $or: [{ "HOSPCODE.PROVINCE": { $regex: zone.toString() } }, { "DLACODE.PROVINCE": { $regex: zone.toString() } }], "confirm": true, "STATE_ACTIVE": find }, { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }).fetch()
            //     } else {
            //         return CG_REGISTER.find({ $or: [{ "HOSPCODE.PROVINCE": { $regex: zone.toString() } }, { "DLACODE.PROVINCE": { $regex: zone.toString() } }], "confirm": true }, { sort: { CREATEDATE: -1 }, skip: skip, limit: limit }).fetch()
            //     }
            // }
        },
        AddCPActivity(data) {
            var find = CAREPLAN_DETAIL_ACTIVITY.find({
                CAREPLANID: data,
            }).fetch();
            for (var i = find.length - 1; i >= 0; i--) {
                var carec_e = CARECODE.find({
                    CARENAME: find[i].ACTIVITY,
                }).fetch()[0].CARECODE;
                var adminc_e = ADMINCODE.find({
                    ADMINNAME: find[i].ADMIN,
                }).fetch()[0].ADMINCODE;
                CAREPLAN_ACTIVITY.insert({
                    CAREPLANID: data,
                    CARECODE: carec_e,
                    ADMINCODE: adminc_e,
                    CREATEDATE: new Date(),
                });
            }
        },
        INSERT_CAREPLAN(data) {
            var refId = CAREPLAN_DETAIL.insert(data);
            return refId;
        },
        UPDATE_CAREPLAN(id, data) {
            CAREPLAN_DETAIL.update({ _id: id }, { $set: data });
        },
        insertELDERLYREGISTER(a, b, c, d, e, f, g, h, i, j, k, l, m) {
            ELDERLYREGISTER.insert({
                ELDERLYID: ELDERLYREGISTER.find().count() + 1,
                CID: a,
                PID: '',
                PRENAME: b,
                NAME: c,
                LNAME: d,
                MAIN: '',
                HOSPCODE: e.HOSPCODE ? e.HOSPCODE.CODE : e.DLACODE.CODE,
                VENDERCODE: f,
                ADL: g.toString(),
                TAI: h,
                GROUPID: i.toString(),
                MAININSC: '',
                CONFIRM: '',
                CREATEDATE: new Date(),
                D_UPDATE: '',
                PHONE: j,
                ADDRESS: k,
                BIRTHDATE: l,
                PRIVILEGE: m,
                STATUS: '01',
                SERVICE_CENTER: {
                    NAME: e.HOSPCODE ? e.HOSPCODE.NAME : e.DLACODE.NAME,
                    CODE: e.HOSPCODE ? e.HOSPCODE.CODE : e.DLACODE.CODE,
                    PROVINCE: e.HOSPCODE
                        ? e.HOSPCODE.PROVINCE.split('-')[1]
                        : e.DLACODE.PROVINCE,
                    AMPHOE: e.HOSPCODE
                        ? e.HOSPCODE.AMPHOE.split('-')[1]
                        : e.DLACODE.DISTRICT.includes('อ.')
                        ? e.DLACODE.DISTRICT.split('.')[1]
                        : e.DLACODE.DISTRICT,
                    DISTRICT: e.HOSPCODE
                        ? e.HOSPCODE.DISTRICT.split('-')[1]
                        : e.DLACODE.TAMBON,
                },
                ZONE: e.zone,
            });
        },
        INSERT_CM_REGISTER(data) {
            CM_REGISTER.insert(data);
        },
        INSERT_DISTRICT_USER_DATA(data) {
            DISTRICT_USER.insert(data);
        },
        INSERT_CG_REGISTER(data) {
            CG_REGISTER.insert(data);
        },
        INSERT_CC_REGISTER(data) {
            CC_REGISTER.insert(data);
        },
        INSERT_USER_LOGIN(cid, data) {
            USER_LOGIN.upsert(
                { USERNAME: cid },
                { $set: data },
                { upsert: true }
            );
        },
        updateStatusElder(cid, stat) {
            //console.log(cid, stat)
            ELDERLYREGISTER.update(
                {
                    CID: cid,
                },
                {
                    $set: {
                        STATUS: stat,
                    },
                }
            );
        },
        upsertELDERLYREGISTER(data) {
            _.each(data, function (x) {
                ELDERLYREGISTER.upsert(
                    {
                        CID: x.pid,
                    },
                    {
                        $set: {
                            CID: x.pid,
                            PRENAME: x.sex == '1' ? 'นาย' : 'นาง',
                            NAME: x.firstName,
                            LNAME: x.lastName,
                            HOSPCODE: x.surveyHospital.code,
                            VENDERCODE: x.vendor.code,
                            ADL: x.adl,
                            TAI: x.tai,
                            GROUPID: x.groupId.toString(),
                            D_UPDATE: new Date(),
                            CREATEDATE: new Date(x.createDate),
                            ADDRESS: x.district
                                ? 'อ. ' +
                                  x.district.name +
                                  ' จ. ' +
                                  x.district.province.name
                                : '',
                            BIRTHDATE: new Date(x.birthDate),
                            PRIVILEGE: x.maininsclName,
                            MAINSCLCODE: x.maininsclCode,
                            SERVICE_CENTER: {
                                NAME: x.surveyHospital
                                    ? x.surveyHospital.name
                                    : '',
                                CODE: x.surveyHospital
                                    ? x.surveyHospital.code
                                    : '',
                                PROVINCE: x.vendor
                                    ? x.vendor.district.province.name
                                    : '',
                                AMPHOE: x.vendor ? x.vendor.district.name : '',
                                DISTRICT: x.vendor
                                    ? x.vendor.name.includes('ตำบล')
                                        ? x.vendor.name
                                              .split('ตำบล')[1]
                                              .includes(')')
                                            ? x.vendor.name
                                                  .split('ตำบล')[1]
                                                  .substr(
                                                      0,
                                                      x.vendor.name
                                                          .split('ตำบล')[1]
                                                          .indexOf(')')
                                                  )
                                            : x.vendor.name.split('ตำบล')[1]
                                        : null
                                    : '',
                            },
                            STATUS: x.death == 'N' ? '01' : '03',
                            ZONE: x.vendor
                                ? x.vendor.district.province.zone.code.length ==
                                  1
                                    ? '0' + x.vendor.district.province.zone.code
                                    : x.vendor.district.province.zone.code
                                : '',
                            NHSO: true,
                            BUDGETYEAR: x.budgetYear.toString(),
                        },
                    },
                    {
                        upsert: true,
                    }
                );
                CAREPLAN_DETAIL.update(
                    { CID: x.pid },
                    {
                        $set: {
                            NAME:
                                x.sex == '1'
                                    ? 'นาย'
                                    : 'นาง' +
                                      '' +
                                      x.firstName +
                                      ' ' +
                                      x.lastName,
                            BIRTHDATE: new Date(x.birthDate),
                            ADL: x.adl.toString(),
                            TAI: x.tai,
                            GROUP: x.groupId.toString(),
                        },
                    },
                    { multi: true }
                );
            });

            return '';
        },
        upDateELDERLYMUIT(x, n, o, p, q, r, s, z) {
            ELDERLYREGISTER.update(
                {
                    _id: x,
                },
                {
                    $set: {
                        HOSPCODE: n,
                        'SERVICE_CENTER.NAME': o,
                        'SERVICE_CENTER.CODE': p,
                        'SERVICE_CENTER.PROVINCE': q,
                        'SERVICE_CENTER.AMPHOE': r,
                        'SERVICE_CENTER.DISTRICT': s,
                        ZONE: z,
                    },
                }
            );
            return '';
        },
        upDateADMINELDERLY(
            x,
            a,
            b,
            c,
            d,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
            p,
            q,
            r,
            s,
            z
        ) {
            ELDERLYREGISTER.update(
                {
                    _id: x,
                },
                {
                    $set: {
                        CID: a,
                        PRENAME: b,
                        NAME: c,
                        LNAME: d,
                        VENDERCODE: f,
                        ADL: g,
                        TAI: h,
                        GROUPID: i,
                        D_UPDATE: new Date(),
                        PHONE: j,
                        ADDRESS: k,
                        BIRTHDATE: l,
                        PRIVILEGE: m,
                        HOSPCODE: n,
                        'SERVICE_CENTER.NAME': o,
                        'SERVICE_CENTER.CODE': p,
                        'SERVICE_CENTER.PROVINCE': q,
                        'SERVICE_CENTER.AMPHOE': r,
                        'SERVICE_CENTER.DISTRICT': s,
                        ZONE: z,
                    },
                }
            );
            CAREPLAN_DETAIL.update(
                { CID: a },
                {
                    $set: {
                        NAME: b + '' + c + ' ' + d,
                        BIRTHDATE: l,
                        PHONE: j,
                        ADL: g,
                        TAI: h,
                        GROUP: i,
                    },
                },
                { multi: true }
            );
            return '';
        },
        upDateELDERLYREGISTER(x, a, b, c, d, f, g, h, i, j, k, l, m) {
            ELDERLYREGISTER.update(
                {
                    _id: x,
                },
                {
                    $set: {
                        CID: a,
                        PRENAME: b,
                        NAME: c,
                        LNAME: d,
                        VENDERCODE: f,
                        ADL: g,
                        TAI: h,
                        GROUPID: i,
                        D_UPDATE: new Date(),
                        PHONE: j,
                        ADDRESS: k,
                        BIRTHDATE: l,
                        PRIVILEGE: m,
                    },
                }
            );
            CAREPLAN_DETAIL.update(
                { CID: a },
                {
                    $set: {
                        NAME: b + '' + c + ' ' + d,
                        BIRTHDATE: l,
                        PHONE: j,
                        ADL: g,
                        TAI: h,
                        GROUP: i,
                    },
                },
                { multi: true }
            );
            return '';
        },
        // Added by Kanut 2564-11-30
        upDateELDERLYREGISTER_v2(data) {
            data.D_UPDATE = new Date();
            console.log(data);

            ELDERLYREGISTER.update(
                {
                    CID: data.CID,
                },
                {
                    $set: data,
                }
            );
            let cpDetail = CAREPLAN_DETAIL.find({ CID: data.CID });
            console.log(cpDetail);
            CAREPLAN_DETAIL.update(
                { CID: data.CID },
                {
                    $set: {
                        NAME: data.PRENAME + ' ' + data.NAME + '' + data.LNAME,
                        BIRTHDATE: data.BIRTHDATE,
                        PHONE: data.PHONE,
                        ADL: data.ADL,
                        TAI: data.TAI,
                        GROUP: data.GROUPID,
                    },
                },
                { multi: true }
            );
            return '';
        },
        upDateCMserviceCenter(x, a, b, c, d, e, z) {
            // console.log(x);
            // console.log(a);
            // console.log(b);
            // console.log(c);
            // console.log(d);
            // console.log(e);
            // console.log(z);
            CM_REGISTER.update(
                {
                    _id: x,
                },
                {
                    $set: {
                        HOSPCODE: {
                            CODE: a,
                            NAME: b,
                            DISTRICT: c,
                            AMPHOE: d,
                            PROVINCE: e,
                        },
                        zone: z,
                        DLACODE: null,
                    },
                }
            );
            return '';
        },
        upDateCM_DLA(x, a, b, c, d, e, z) {
            // console.log(x);
            // console.log(a);
            // console.log(b);
            // console.log(c);
            // console.log(d);
            // console.log(e);
            // console.log(z);
            CM_REGISTER.update(
                {
                    _id: x,
                },
                {
                    $set: {
                        DLACODE: {
                            CODE: a,
                            NAME: b,
                            DISTRICT: c,
                            AMPHOE: d,
                            PROVINCE: e,
                        },
                        zone: z,
                        HOSPCODE: null,
                    },
                }
            );
            return '';
        },
        upDateCGserviceCenter(x, a, b, c, d, e, z) {
            // console.log(x);
            // console.log(a);
            // console.log(b);
            // console.log(c);
            // console.log(d);
            // console.log(e);
            // console.log(z);
            CG_REGISTER.update(
                {
                    _id: x,
                },
                {
                    $set: {
                        HOSPCODE: {
                            CODE: a,
                            NAME: b,
                            DISTRICT: c,
                            AMPHOE: d,
                            PROVINCE: e,
                        },
                        zone: z,
                        DLACODE: null,
                    },
                }
            );
            return '';
        },
        upDateCG_DLA(x, a, b, c, d, e, z) {
            // console.log(x);
            // console.log(a);
            // console.log(b);
            // console.log(c);
            // console.log(d);
            // console.log(e);
            // console.log(z);
            CG_REGISTER.update(
                {
                    _id: x,
                },
                {
                    $set: {
                        DLACODE: {
                            CODE: a,
                            NAME: b,
                            DISTRICT: c,
                            AMPHOE: d,
                            PROVINCE: e,
                        },
                        zone: z,
                        HOSPCODE: null,
                    },
                }
            );
            return '';
        },
        LISTBETTERELDER(data) {
            return ELDERLYREGISTER.find({
                $and: [{ HOSPCODE: data }, { STATUS: '02' }],
            }).fetch();
        },
        CHECKED_CAREPLAN(data) {
            return CAREPLAN_DETAIL.find({ CID: data }).fetch();
        },
        LISTELDERLY(data, stat) {
            return ELDERLYREGISTER.find({
                $and: [
                    { NHSO: { $exists: false } },
                    { HOSPCODE: { $exists: true } },
                    { HOSPCODE: data },
                ],
                STATUS: stat,
            }).fetch();
        },
        LISTELDERLY_DEATH(data, stat) {
            return ELDERLYREGISTER.find({
                $and: [{ HOSPCODE: { $exists: true } }, { HOSPCODE: data }],
                STATUS: stat,
            }).fetch();
        },
        countAll_ELDER(data) {
            var newdata = [];
            var data = ELDERLYREGISTER.aggregate([
                {
                    $match: {
                        $and: [
                            { HOSPCODE: { $exists: true } },
                            { HOSPCODE: data },
                        ],
                    },
                },
                {
                    $group: {
                        _id: '$STATUS',
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);

            _.each(data, function (x) {
                newdata.push({
                    title:
                        x._id == '01'
                            ? 'พึ่งพิง'
                            : x._id == '02'
                            ? 'ดีขึ้น'
                            : 'เสียชีวิต',
                    numelder: x.count,
                });
            });
            return newdata;
        },
        LISTELDERLYNHSO(data, stat) {
            return ELDERLYREGISTER.find({
                $and: [{ NHSO: { $exists: true } }, { HOSPCODE: data }],
                STATUS: stat,
            }).fetch();
        },
        elderbycid(data) {
            return ELDERLYREGISTER.find({ CID: data }).fetch();
        },
        elderbyRemove(data) {
            return ELDERLYREGISTER.remove({ CID: data });
        },
        cmRemove(data) {
            return CM_REGISTER.remove({ CID: data });
        },
        districtRemove(data) {
            return DISTRICT_USER.remove({ CID: data });
        },
        districtLoginRemove(cid, rule) {
            return USER_LOGIN.remove({ CID: cid, RULE: rule });
        },
        districtLoginUpdate(id) {
            DISTRICT_USER.update(
                {
                    _id: id,
                },
                {
                    $set: {
                        confirm: true,
                    },
                }
            );
            return '';
        },
        cgRemove(data) {
            return CG_REGISTER.remove({ CID: data });
        },
        elderby_id(data) {
            return ELDERLYREGISTER.find({ _id: data }).fetch();
        },
        elderby_cid(data) {
            return ELDERLYREGISTER.find({ CID: data }).fetch();
        },
        elderby_multicid(data) {
            return ELDERLYREGISTER.find({ CID: { $in: data } }).fetch();
        },
        elderby_multiid(data) {
            return ELDERLYREGISTER.find({ _id: { $in: data } }).fetch();
        },
        admincg_id(data) {
            return CG_REGISTER.find({ _id: data }).fetch();
        },
        admincm_id(data) {
            return CM_REGISTER.find({ _id: data }).fetch();
        },
        admincm_multicid(data) {
            return CM_REGISTER.find({ CID: { $in: data } }).fetch();
        },
        admincm_multiid(data) {
            return CM_REGISTER.find({ _id: { $in: data } }).fetch();
        },
        admincg_multicid(data) {
            return CG_REGISTER.find({ CID: { $in: data } }).fetch();
        },
        admincg_multiid(data) {
            return CG_REGISTER.find({ _id: { $in: data } }).fetch();
        },
        getCareCode(data) {
            return CARECODE.find({ CAREID: data }).fetch();
        },
        getCareType(data) {
            ////console.log(CARETYPE.find({CATEGORY:data}).fetch());
            return CARETYPE.find({ CATEGORY: data }).fetch();
        },
        getAllAdmincode(data) {
            ////console.log(CARETYPE.find({CATEGORY:data}).fetch());
            return ADMINCODE.find({}).fetch();
        },
        getNameActivityCareplan(data) {
            // var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                var care = CARECODE.find({
                    CARECODE: data[i].activity,
                }).fetch();
                var admin = ADMINCODE.find({
                    ADMINCODE: data[i].admin,
                }).fetch();
                data[i].actName = care[0].CARENAME;
                data[i].adminName = admin[0].ADMINNAME;
            }
            return data;
        },
        getNumidCP(a, b, bdate, budgetYear) {
            ////console.log('/' + (budgetYear[2] + budgetYear[3]))
            // 3601101358717
            // s060508m
            console.log(`a=`, a);
            console.log(`b=`, b);
            console.log(`bdate=`, bdate);
            console.log(`budgetYear=`, budgetYear);
            var d = new Date(bdate);
            // d.setMonth(10);
            var n = d.getMonth() + 1;
            var year = d.getFullYear() + 543 - 2500;
            if (n > 9) {
                year = year + 1;
            } else {
                year = year;
            }
            var data1 = CAREPLAN_DETAIL.find({
                CID: a,
                COPY: { $regex: '/' + (budgetYear[2] + budgetYear[3]) },
            }).count();
            console.log(`asdfasddddddddde=`);
            var data2 = CAREPLAN_DETAIL.find(
                { HOSPCODE: b },
                { sort: { CREATEDATE: -1 } }
            ).count();
            var copy = data1 + 1 + '/' + (budgetYear[2] + budgetYear[3]);
            var count = zerofront(data2 + 1, 4);
            var obj = {
                copy: copy,
                count: count,
            };
            console.log(obj);
            return obj;
        },

        //rewritten by Kanut 2564-09-19
        /*
        COPYCAREPLAN(cpid) {
            var data = CAREPLAN_DETAIL.find({ _id: cpid }).fetch();
            // this should have only ONE document *************************
            console.log(`cpid=${cpid} count=${data.length}`)
            console.log(`${data[0]}`)
            var year = parseInt(parseInt(moment().format('YYYY')) + 543 - 2500);
            var cp_activity = CAREPLAN_DETAIL_ACTIVITY.find({ CAREPLANID: cpid }).fetch()
            //let dataCount = 0
            _.each(data, function (x) {
                //console.log(`dataCount=${dataCount = dataCount + 1}`)
                cmID = x.CMID;
                // console.log(`cm= ${x.CMID} ${x.CREATEBYNAME}`)
                // console.log(x)
                year = x.YEAR
                var countcp = CAREPLAN_DETAIL.find({ CID: x.CID, YEAR: year.toString(), REMOVE: false }).count();
                var copy = (countcp + 1) + '/' + year;
                x.CAREPLANID = x.CAREPLANID
                x.COPYFROM = "(" + x.COPY + ")" + "-" + x.CAREPLANID
                delete x._id
                x.CREATEDATE = new Date()
                x.COPY = copy
                CAREPLAN_DETAIL.insert(x, function (err, newid) {
                    _.each(cp_activity, function (s) {

                        s.CAREPLANID = newid
                        delete s._id
                        //console.log(s)
                        CAREPLAN_DETAIL_ACTIVITY.insert(s)
                    });
                });

            })
        },
        */
        COPYCAREPLAN(cpid) {
            //console.log(`cpid=${cpid} `)
            let data = CAREPLAN_DETAIL.find({ _id: cpid }).fetch();
            let cp_activity = CAREPLAN_DETAIL_ACTIVITY.find({
                CAREPLANID: cpid,
            }).fetch();
            data = data.pop();
            let x = data;
            let issue = x.COPY.substring(0, x.COPY.search('/'));
            issue = parseInt(issue);
            // console.log(`elder = ${data.CID} ${data.NAME} ====> ${x.CID} ${x.NAME}`)
            // console.log(`care manager = ${data.CMID} ${data.CREATEBYNAME} ====> ${x.CMID} ${x.CREATEBYNAME}`)
            // console.log(`budget year = ${data.YEAR} ====> ${x.YEAR}`)
            // console.log(`careplan id = ${data.CAREPLANID} ====> ${x.CAREPLANID}`)
            // console.log(`issue = ${data.COPY} ==> ${x.COPY}`)
            let careplanAll = CAREPLAN_DETAIL.find({ CID: data.CID }).fetch();
            //search for last issue
            careplanAll = careplanAll.filter((item) => {
                return item.YEAR === data.YEAR;
            });
            careplanAll.sort((a, b) => {
                return b.CREATEDATE - a.CREATEDATE;
            }); // latest at index 0
            maxIssue = 0;

            careplanAll.forEach((item) => {
                // console.log(`${item.CREATEDATE} ${item.CID} ${item.NAME}`)
                // console.log(`${item.CMID} ${item.CREATEBYNAME} ${item.YEAR} ${item.CAREPLANID} ${item.COPY}`)
                //console.log(item._id.getTimestamp());
                let issueNo = item.COPY.substring(0, item.COPY.search('/'));
                issueNo = parseInt(issueNo);
                //console.log(`issue = ${issueNo}`)
                if (maxIssue < issueNo) {
                    maxIssue = issueNo;
                }
                //console.log("---------------------------------------------------")
            });
            let nextIssue = maxIssue + 1;
            //console.log(`nextIssue = ${nextIssue}`);

            x.COPYFROM = '(' + x.COPY + ')' + '-' + x.CAREPLANID;
            delete x._id;
            let copy = nextIssue + '/' + x.YEAR;
            x.CREATEDATE = new Date();
            x.COPY = copy;
            CAREPLAN_DETAIL.insert(x, function (err, newid) {
                _.each(cp_activity, function (s) {
                    s.CAREPLANID = newid;
                    delete s._id;
                    //console.log(s)
                    CAREPLAN_DETAIL_ACTIVITY.insert(s);
                });
            });
        },

        listCpHistory(a) {
            var data1 = CAREPLAN_DETAIL.find(
                {
                    CID: a,
                    REMOVE: false,
                },
                {
                    sort: { CREATEDATE: -1 },
                }
            ).fetch();
            return data1;
        },
        listCpHistoryMulti(a) {
            var data1 = CAREPLAN_DETAIL.aggregate([
                {
                    $match: {
                        CID: { $in: a },
                        REMOVE: false,
                    },
                },
                {
                    $group: {
                        _id: '$CID',
                        CAREPLANID: { $last: '$CAREPLANID' },
                    },
                },
                {
                    $project: {
                        CID: '$_id',
                        CAREPLANID: '$CAREPLANID',
                    },
                },
            ]).toArray();
            // var data1 = CAREPLAN_DETAIL.distinct("CID",{
            //     CID: {$in: a},
            //     REMOVE: false
            // }, {
            //         sort: { CREATEDATE: -1 }
            //     }).fetch();
            return data1;
        },
        listcareACTIVITY(x) {
            var data = CAREPLAN_DETAIL_ACTIVITY.find(
                {
                    CAREPLANID: x,
                },
                {
                    /*
                sort: Sort specifier,
                skip: Number,
                limit: Number,
                fields: Field specifier,
                reactive: Boolean,
                transform: Function
                */
                }
            ).fetch();
            return data.reverse();
        },
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        getAllGEOLOCATION() {
            var dissolve = require('geojson-dissolve');
            var data = GEOLOCATION.find({
                'properties.prov_code': '50',
            }).fetch();
            //var mergegeo = dissolve(data)
            return data;
        },
        encrypted: function (a) {
            encrypted = CryptoJS.AES.encrypt(a, key);
            decrypted = CryptoJS.AES.decrypt(
                encrypted.toString(),
                'V7T5J53NUDNcDUu1Dl74hpr58JNITaCE5mxEfof0ST0jBka4t6ZAjethO5Px3gZYskqxxwlfdcoEknxEhk2qokv2f8n8eaUwlaSGu1Lv1X0c8lEdvwtJGMAJLLFPMpaVqQrKH06zNUzK53Non5VSHlriXXYxcWiqCz19pVw0FVAyMcM07vIEHXLsKxPLjV1LkQIxB5n4OMsrO2hLoNdTAO9bbMKkxzTFgs2FldAZPQgrJl0VY4EpGBoIdWQAlA5p'
            );
            decrypted.toString(CryptoJS.enc.Utf8);
            return encrypted.toString();
        },
        getLoginUserCM: function (a) {
            var data = CM_REGISTER.find(
                { _id: a },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        getLoginUserDISTRICT: function (a) {
            var data = DISTRICT_USER.find(
                { _id: a },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        getLoginUserCG: function (a) {
            var data = CG_REGISTER.find(
                { _id: a },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        getUserCM: function (a) {
            var data = CM_REGISTER.find(
                {
                    CID: a,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        getUserAdminCM: function (a) {
            var data = CM_REGISTER.find(
                {
                    _id: a,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        ForgetCheckCID: function (cid, mail) {
            var data = CM_REGISTER.find({
                CID: cid,
                EMAIL: mail,
            }).fetch();
            return data;
        },
        getUserCG: function (a, b) {
            var data = CG_REGISTER.find(
                {
                    CID: a,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        getUserCC(cid) {
            var data = CC_REGISTER.find(
                {
                    CID: cid,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        removeUserLogin(a) {
            USER_LOGIN.remove({ USERNAME: a });
        },
        AuthenLogin: function (a, b) {
            var data = USER_LOGIN.find(
                {
                    USERNAME: a,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            if (data.length != 0) {
                ////console.log(data)
                if (data[0].PASSWORD == null) {
                    ////console.log('ssss')
                    return data;
                } else {
                    var decrypted = CryptoJS.AES.decrypt(data[0].PASSWORD, key);
                    ////console.log(data[0].PASSWORD)
                    ////console.log(b)
                    ////console.log(decrypted.toString(CryptoJS.enc.Utf8))
                    if (b == decrypted.toString(CryptoJS.enc.Utf8)) {
                        return data;
                    } else {
                        return [];
                    }
                }
            } else {
                return [];
            }
        },
        getDistrictName: function (a) {
            var data = DISTRICT.find({
                fullcode: a,
            }).fetch()[0];
            return data;
        },
        Replace_ServiceCenterCode(arr) {
            _.each(arr, function (e) {
                if (e._id.length > 5) {
                    e._id =
                        typeof DLA.find(
                            { DLA_CODE: e._id },
                            { sort: { zone: 1 } },
                            { limit: 1 }
                        ).fetch()[0] == 'undefined'
                            ? e._id
                            : DLA.find(
                                  { DLA_CODE: e._id },
                                  { sort: { zone: 1 } },
                                  { limit: 1 }
                              ).fetch()[0].DLA_NAME;
                } else {
                    e._id =
                        typeof SERVICE_CENTER.find(
                            { hospcode: e._id },
                            { sort: { zone: 1 } },
                            { limit: 1 }
                        ).fetch()[0] == 'undefined'
                            ? e._id
                            : SERVICE_CENTER.find(
                                  { hospcode: e._id },
                                  { sort: { zone: 1 } },
                                  { limit: 1 }
                              ).fetch()[0].name;
                }
            });

            return arr;
        },
        Replace_ServiceCenterCode_E(arr) {
            _.each(arr, function (e) {
                if (e.z.length > 5) {
                    e.z =
                        typeof DLA.find(
                            { DLA_CODE: e.z },
                            { sort: { zone: 1 } },
                            { limit: 1 }
                        ).fetch()[0] == 'undefined'
                            ? e.z
                            : DLA.find(
                                  { DLA_CODE: e.z },
                                  { sort: { zone: 1 } },
                                  { limit: 1 }
                              ).fetch()[0].DLA_NAME;
                } else {
                    e.z =
                        typeof SERVICE_CENTER.find(
                            { hospcode: e.z },
                            { sort: { zone: 1 } },
                            { limit: 1 }
                        ).fetch()[0] == 'undefined'
                            ? e.z
                            : SERVICE_CENTER.find(
                                  { hospcode: e.z },
                                  { sort: { zone: 1 } },
                                  { limit: 1 }
                              ).fetch()[0].name;
                }
            });

            return arr;
        },
        INSERT_USER_DISTRICT: function (a) {
            var data = USER_LOGIN.find(
                {
                    USERNAME: a,
                },
                {
                    sort: {
                        zone: 1,
                    },
                },
                { limit: 1 }
            ).fetch();
            return data;
        },
        getAllServiceCenterDistrict: function (a) {
            var data = SERVICE_CENTER.find(
                {
                    hospcode: a,
                },
                {
                    sort: {
                        zone: 1,
                    },
                },
                { limit: 1 }
            ).fetch()[0];
            return data;
        },
        getDISTRICT_USER_DATA: function (a) {
            var data = DISTRICT_USER_DATA.find(
                {
                    D_CODE: a,
                },
                {
                    sort: {
                        ZONE: 1,
                    },
                },
                { limit: 1 }
            ).fetch();
            return data;
        },
        AllServiceCenter: function (a) {
            var data = SERVICE_CENTER.find(
                {
                    amphoe: { $regex: a },
                },
                {
                    sort: {
                        zone: 1,
                    },
                }
            ).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                if (data[i].province.split('-')[1] == 'กรุงเทพมหานคร') {
                    arr.push({
                        value: data[i].hospcode,
                        text:
                            '[' +
                            data[i].hospcode +
                            '] ' +
                            data[i].name +
                            ' ' +
                            data[i].amphoe.split('-')[1] +
                            ' จ.' +
                            data[i].province.split('-')[1],
                    });
                } else {
                    arr.push({
                        value: data[i].hospcode,
                        text:
                            '[' +
                            data[i].hospcode +
                            '] ' +
                            data[i].name +
                            ' อ.' +
                            data[i].amphoe.split('-')[1] +
                            ' จ.' +
                            data[i].province.split('-')[1],
                    });
                }
            }

            return arr;
        },
        AllDLA_CODE: function (a) {
            var data = DLA.find({
                DISTRICT: { $regex: a },
            }).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].DLA_CODE,
                    text:
                        data[i].DLA_NAME +
                        ' ' +
                        data[i].DISTRICT +
                        ' จ.' +
                        data[i].PROVINCE,
                });
            }
            return arr;
        },
        getAllServiceCenter: function () {
            var data = SERVICE_CENTER.find(
                {},
                {
                    sort: {
                        zone: 1,
                    },
                }
            ).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                if (data[i].province.split('-')[1] == 'กรุงเทพมหานคร') {
                    arr.push({
                        value: data[i].hospcode,
                        text:
                            '[' +
                            data[i].hospcode +
                            '] ' +
                            data[i].name +
                            ' ' +
                            data[i].amphoe.split('-')[1] +
                            ' จ.' +
                            data[i].province.split('-')[1],
                    });
                } else {
                    arr.push({
                        value: data[i].hospcode,
                        text:
                            '[' +
                            data[i].hospcode +
                            '] ' +
                            data[i].name +
                            ' อ.' +
                            data[i].amphoe.split('-')[1] +
                            ' จ.' +
                            data[i].province.split('-')[1],
                    });
                }
            }

            return arr;
        },
        getAllServiceCenter_v2: function () {
            // console.log(arr.length, '\n', arr[1])
            // mod 2565-01-05 Kanut
            let provinceNotBangkok = provinces.aggregate([
                {
                    $project: {
                        _id: 0,
                        ID: 1,
                        name: 1,
                        zoneID: 1,
                    },
                },
                {
                    $match: {
                        ID: { $ne: 10 }, // no Bangkok
                    },
                },
            ]);
            // console.log(provinceNotBangkok)
            let provinceName = [];
            provinceNotBangkok.map((ele, index) => {
                provinceName[ele.ID] = ele.name;
            });

            let hcList = SERVICE_CENTER.aggregate([
                {
                    $project: {
                        _id: 0,
                        id: '$hospcode',
                        name: 1,
                        amphoe: {
                            $arrayElemAt: [
                                {
                                    $split: ['$amphoe', '-'],
                                },
                                -1,
                            ],
                        },
                        province: {
                            $substr: ['$tambonID', 0, 2],
                        },
                    },
                },
                {
                    $match: {
                        province: { $ne: '10' },
                    },
                },
            ]);
            hcList = hcList.map((ele) => {
                let pID = parseInt(ele.province);
                let pName = provinceName[pID];
                let data = {
                    value: ele.id,
                    text: `[${ele.id}] ${ele.name} อ.${ele.amphoe} จ.${pName}`,
                };
                return data;
            });
            // console.log(hcList[1]);
            return hcList.sort((a, b) => a.value - b.value);
        },
        getAllDISTRICT_USER_DATA: function () {
            var data = DISTRICT_USER_DATA.find(
                {},
                {
                    sort: {
                        ZONE: 1,
                    },
                }
            ).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].D_CODE,
                    text:
                        '[' +
                        data[i].D_CODE +
                        '] ' +
                        data[i].D_NAME +
                        ' ' +
                        data[i].DISTRICT.split('-')[1] +
                        ' จ.' +
                        data[i].PROVINCE.split('-')[1],
                });
            }

            return arr;
        },
        getAllServiceCenterByZone: function (z) {
            var data = SERVICE_CENTER.find(
                { zone: z },
                {
                    sort: {
                        zone: 1,
                    },
                }
            ).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                if (data[i].province.split('-')[1] == 'กรุงเทพมหานคร') {
                    arr.push({
                        value: data[i].hospcode + '-' + data[i].name,
                        text:
                            '[' +
                            data[i].hospcode +
                            '] ' +
                            data[i].name +
                            ' ' +
                            data[i].amphoe.split('-')[1] +
                            ' จ.' +
                            data[i].province.split('-')[1],
                    });
                } else {
                    arr.push({
                        value: data[i].hospcode + '-' + data[i].name,
                        text:
                            '[' +
                            data[i].hospcode +
                            '] ' +
                            data[i].name +
                            ' อ.' +
                            data[i].amphoe.split('-')[1] +
                            ' จ.' +
                            data[i].province.split('-')[1],
                    });
                }
            }

            return arr;
        },
        getAllDLA_CODEByZone(p) {
            var data = DLA.find({ PROVINCE: { $in: p } }).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].DLA_CODE + '-' + data[i].DLA_NAME,
                    text:
                        data[i].DLA_NAME +
                        ' ' +
                        data[i].DISTRICT +
                        ' จ.' +
                        data[i].PROVINCE,
                });
            }
            return arr;
        },
        getRegDistrictLogin(district) {
            var data = DISTRICT.findOne(
                { district_name: { $regex: district } },
                { sort: { district_code: -1 } }
            );
            return data.district_code;
        },
        getRegProvinceLogin(province) {
            var data = DISTRICT.findOne(
                { province_name: { $regex: province } },
                { sort: { province_code: -1 } }
            );
            return data.province_code;
        },
        getRegProvince_name: function () {
            var data = DISTRICT.find(
                {},
                {
                    sort: {
                        province_code: -1,
                    },
                }
            ).fetch();
            var arr = [];

            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].province_code + '-' + data[i].province_name,
                    text: data[i].province_name,
                });
            }
            return arr;
        },
        getRegDistrict_name: function (a) {
            var data = DISTRICT.find(
                {
                    province_code: a,
                },
                {
                    sort: {
                        district_code: -1,
                    },
                }
            ).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].district_code + '-' + data[i].district_name,
                    text: data[i].district_name,
                });
            }
            return arr;
        },
        getRegSubsistrict_name: function (a) {
            var data = DISTRICT.find(
                {
                    district_code: a,
                },
                {
                    sort: {
                        district_code: -1,
                    },
                }
            ).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].fullcode + '-' + data[i].subdistrict_name,
                    text: data[i].subdistrict_name,
                });
            }
            return arr;
        },
        getProinceNameByCode(a) {
            var data = DISTRICT.find(
                {
                    province_code: a,
                },
                {
                    sort: {
                        province_code: -1,
                    },
                }
            ).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].province_code,
                    text: data[i].province_name,
                });
            }
            return arr;
        },
        ForgetSendEmail(cid, mail) {
            var randomnumber = Math.floor(Math.random() * 999999 + 100000);
            var datacm = CM_REGISTER.find({
                CID: cid,
            }).fetch()[0];
            var mailOptions = {
                from: 'LTC Anamai<ltcregistercm@gmail.com>',
                to: mail,
                subject: 'รีเซ็ตรหัสผ่าน LTC กรมอนามัย',
                html:
                    'เรียน คุณ' +
                    datacm.NAME +
                    ' ' +
                    datacm.LNAME +
                    '  <br>ท่านได้ทำการขอร้องขอรีเซ็ตรหัสผ่านใหม่ โดยเราจะให้ท่านตั้งรหัสใหม่โดยใช้เลข 6 หลักต่อไปนี้ <br><center><h1>' +
                    randomnumber +
                    '</h1></center> <br> ให้คัดลอกเลข 6 หลักดังกล่าวกลับไปที่หน้าเว็ปไซต์รีเซ็ตรหัสผ่าน เพื่อทำการยืนยันและเข้าสู่หน้าจอตั้งรหัสผ่านใหม่ต่อไป <br> <br>____________________<br>ระบบการดูแลระยะยาวด้านสาธารณสุขสำหรับผู้สูงอายุที่มีภาวะพึ่งพิง (Long Term Care) <br>สำนักอนามัยผู้สูงอายุ กรมอนามัย กระทรวงสาธารณสุข โทร.02-590-4508 <br>',
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    //console.log(error);
                } else {
                    //console.log('reset password');
                }
            });
            return randomnumber;
        },
        sendEmailToCMRegister(name, username, province, mail, password) {
            var mailOptions = {
                from: 'LTC Anamai<ltcregistercm@gmail.com>',
                to: mail,
                subject: 'สมัครเข้าในงาน LTC กรมอนามัย',
                html:
                    'เรียน คุณ' +
                    name +
                    '  <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ท่านได้ลงทะเบียน CM โดยใช้ username คือ ' +
                    username +
                    ' และ password คือ ' +
                    password +
                    ' ขณะนี้ท่านจะยังไม่สามารถเข้าใช้งานระบบได้ และจะสามารถเข้าใช้งานได้ต่อเมื่อทางศูนย์อนามัยที่' +
                    province +
                    ' ได้อนุมัติบัญชีของท่าน ซึ่งเราจะแจ้งให้ท่านทราบในอีเมล์นี้ต่อไป  <br> <br>____________________<br>ระบบการดูแลระยะยาวด้านสาธารณสุขสำหรับผู้สูงอายุที่มีภาวะพึ่งพิง (Long Term Care) <br>สำนักอนามัยผู้สูงอายุ กรมอนามัย กระทรวงสาธารณสุข โทร.02-590-4508 <br>',
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    //console.log(error);
                } else {
                    //console.log('register');
                }
            });
        },
        sendApproveCM(name, username, province, mail) {
            //console.log(mail)
            var mailOptions = {
                from: 'LTC Anamai<ltcregistercm@gmail.com>',
                to: mail,
                subject: 'อนุมัติบัญชีเข้าในงาน LTC กรมอนามัยแล้ว',
                html:
                    'เรียน คุณ' +
                    name +
                    '  <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ตามที่ท่านได้ลงทะเบียน CM ผ่านเว็บไซต์ ในขณะนี้ทางศูนย์อนามัยได้้อนุมัติบัญชีเข้าใช้งานของท่านแล้ว ท่านสามารถเข้าสู่ระบบโดยใช้ username ' +
                    username +
                    ' และรหัสผ่านจะถูกใช้ตามที่ท่านเคยกำหนดไว้ <br><br> หากพบข้อสงสัยโปรดติดต่อตามช่องทางติดต่อด้านล่าง  <br>____________________<br>ระบบการดูแลระยะยาวด้านสาธารณสุขสำหรับผู้สูงอายุที่มีภาวะพึ่งพิง (Long Term Care) <br>สำนักอนามัยผู้สูงอายุ กรมอนามัย กระทรวงสาธารณสุข โทร.02-590-4508 <br>',
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    //console.log(error);
                } else {
                    //console.log('approve');
                }
            });
        },
        //--------------------------------------------- HPC ---------------------------------------------------------
        getZonelistApproveDISTRICT: function (a) {
            //kanut 2021-07-18 no DISTRICT_USER collection
            //var data = DISTRICT_USER.find({ "zone": { $regex: a.toString() }, "confirm": false }, { sort: { CREATEDATE: -1 } }).fetch()
            //return data
        },
        getZonelistApproveCM: function (a) {
            //---------edit LK
            var data = CM_REGISTER.find(
                { zone: { $regex: a.toString() }, confirm: false },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        getZonelistCM: function (a) {
            //---------------- LK
            var countobj = {
                all: 0,
                active: 0,
                nonactiove: 0,
                RETIRED: 0,
                EXPIRED: 0,
                QUIT: 0,
                DEATH: 0,
                CHANGE: 0,
            };
            var cg = CM_REGISTER.aggregate([
                {
                    $match: {
                        zone: { $regex: a.toString() },
                        confirm: true,
                    },
                },
                {
                    $group: {
                        _id: '$STATE_ACTIVE',
                        count: { $sum: 1 },
                    },
                },
            ]).toArray();
            for (var i = 0; i < cg.length; i++) {
                if (cg[i]._id == '01') {
                    countobj.active = parseInt(cg[i].count);
                } else if (cg[i]._id == '02') {
                    countobj.nonactiove = parseInt(cg[i].count);
                } else if (cg[i]._id == '03') {
                    countobj.EXPIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '04') {
                    countobj.RETIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '05') {
                    countobj.QUIT = parseInt(cg[i].count);
                } else if (cg[i]._id == '06') {
                    countobj.DEATH = parseInt(cg[i].count);
                } else if (cg[i]._id == '07') {
                    countobj.CHANGE = parseInt(cg[i].count);
                }
                countobj.all += parseInt(cg[i].count);
            }

            return countobj;
        },
        getCMlistStateAll(a, skip, limit, str) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                zone: { $regex: a.toString() },
                confirm: true,
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    zone: { $regex: a.toString() },
                    $or: [
                        { CID: { $regex: regex } },
                        { PRENAME: { $regex: regex } },
                        { NAME: { $regex: regex } },
                        { LNAME: { $regex: regex } },
                        { SEX: { $regex: regex } },
                        { MOBILE: { $regex: regex } },
                        { 'HOSPCODE.CODE': { $regex: regex } },
                        { 'HOSPCODE.NAME': { $regex: regex } },
                        { 'HOSPCODE.DISTRICT': { $regex: regex } },
                        { 'HOSPCODE.AMPHOE': { $regex: regex } },
                        { 'HOSPCODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.CODE': { $regex: regex } },
                        { 'DLACODE.NAME': { $regex: regex } },
                        { 'DLACODE.DISTRICT': { $regex: regex } },
                        { 'DLACODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.AMPHOE': { $regex: regex } },
                        { PROVIDERTYPE: { $regex: regex } },
                        { LICENCE_NUMBER: { $regex: regex } },
                        { POSITIONCODE: { $regex: regex } },
                    ],
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CM_REGISTER.find({
            //     "zone": { $regex: a.toString() },
            //     "confirm": true
            // }, { sort: { CREATEDATE: -1 } }).fetch()

            // return data
        },
        getCMlistStateAll_COUNT(a, str) {
            var find = {
                zone: { $regex: a.toString() },
                confirm: true,
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    zone: { $regex: a.toString() },
                    $or: [
                        { CID: { $regex: regex } },
                        { PRENAME: { $regex: regex } },
                        { NAME: { $regex: regex } },
                        { LNAME: { $regex: regex } },
                        { SEX: { $regex: regex } },
                        { MOBILE: { $regex: regex } },
                        { 'HOSPCODE.CODE': { $regex: regex } },
                        { 'HOSPCODE.NAME': { $regex: regex } },
                        { 'HOSPCODE.DISTRICT': { $regex: regex } },
                        { 'HOSPCODE.AMPHOE': { $regex: regex } },
                        { 'HOSPCODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.CODE': { $regex: regex } },
                        { 'DLACODE.NAME': { $regex: regex } },
                        { 'DLACODE.DISTRICT': { $regex: regex } },
                        { 'DLACODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.AMPHOE': { $regex: regex } },
                        { PROVIDERTYPE: { $regex: regex } },
                        { LICENCE_NUMBER: { $regex: regex } },
                        { POSITIONCODE: { $regex: regex } },
                    ],
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find).count();
        },
        getCMlistState_COUNT(a, status, str) {
            var find = {
                zone: { $regex: a.toString() },
                STATE_ACTIVE: status,
                confirm: true,
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    zone: { $regex: a.toString() },
                    STATE_ACTIVE: status,
                    $or: [
                        { CID: { $regex: regex } },
                        { PRENAME: { $regex: regex } },
                        { NAME: { $regex: regex } },
                        { LNAME: { $regex: regex } },
                        { SEX: { $regex: regex } },
                        { MOBILE: { $regex: regex } },
                        { 'HOSPCODE.CODE': { $regex: regex } },
                        { 'HOSPCODE.NAME': { $regex: regex } },
                        { 'HOSPCODE.DISTRICT': { $regex: regex } },
                        { 'HOSPCODE.AMPHOE': { $regex: regex } },
                        { 'HOSPCODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.CODE': { $regex: regex } },
                        { 'DLACODE.NAME': { $regex: regex } },
                        { 'DLACODE.DISTRICT': { $regex: regex } },
                        { 'DLACODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.AMPHOE': { $regex: regex } },
                        { PROVIDERTYPE: { $regex: regex } },
                        { LICENCE_NUMBER: { $regex: regex } },
                        { POSITIONCODE: { $regex: regex } },
                    ],
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find).count();
        },
        getCMlistState(a, status, skip, limit, str) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                zone: { $regex: a.toString() },
                STATE_ACTIVE: status,
                confirm: true,
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    zone: { $regex: a.toString() },
                    STATE_ACTIVE: status,
                    $or: [
                        { CID: { $regex: regex } },
                        { PRENAME: { $regex: regex } },
                        { NAME: { $regex: regex } },
                        { LNAME: { $regex: regex } },
                        { SEX: { $regex: regex } },
                        { MOBILE: { $regex: regex } },
                        { 'HOSPCODE.CODE': { $regex: regex } },
                        { 'HOSPCODE.NAME': { $regex: regex } },
                        { 'HOSPCODE.DISTRICT': { $regex: regex } },
                        { 'HOSPCODE.AMPHOE': { $regex: regex } },
                        { 'HOSPCODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.CODE': { $regex: regex } },
                        { 'DLACODE.NAME': { $regex: regex } },
                        { 'DLACODE.DISTRICT': { $regex: regex } },
                        { 'DLACODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.AMPHOE': { $regex: regex } },
                        { PROVIDERTYPE: { $regex: regex } },
                        { LICENCE_NUMBER: { $regex: regex } },
                        { POSITIONCODE: { $regex: regex } },
                    ],
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CM_REGISTER.find({
            //     "zone": { $regex: a.toString() },
            //     "STATE_ACTIVE": str,
            //     "confirm": true
            // }, { sort: { CREATEDATE: -1 } }).fetch()
            // return data
        },

        getZoneCGlistStateAll(a, skip, limit, str) {
            //--------------- LK
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                zone: { $regex: a.toString() },
                confirm: true,
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    zone: { $regex: a.toString() },
                    $or: [
                        { CID: { $regex: regex } },
                        { PRENAME: { $regex: regex } },
                        { NAME: { $regex: regex } },
                        { LNAME: { $regex: regex } },
                        { SEX: { $regex: regex } },
                        { MOBILE: { $regex: regex } },
                        { 'HOSPCODE.CODE': { $regex: regex } },
                        { 'HOSPCODE.NAME': { $regex: regex } },
                        { 'HOSPCODE.DISTRICT': { $regex: regex } },
                        { 'HOSPCODE.AMPHOE': { $regex: regex } },
                        { 'HOSPCODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.CODE': { $regex: regex } },
                        { 'DLACODE.NAME': { $regex: regex } },
                        { 'DLACODE.DISTRICT': { $regex: regex } },
                        { 'DLACODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.AMPHOE': { $regex: regex } },
                        { LICENCE_NUMBER: { $regex: regex } },
                        { POSITIONCODE: { $regex: regex } },
                    ],
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CG_REGISTER.find({ "zone": { $regex: a.toString() }, "confirm": true }, { sort: { CREATEDATE: -1 } }).fetch();
            // return data
        },
        getZoneCGlistStateAll_COUNT(a, str) {
            //--------------- LK
            var find = {
                zone: { $regex: a.toString() },
                confirm: true,
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    zone: { $regex: a.toString() },
                    $or: [
                        { CID: { $regex: regex } },
                        { PRENAME: { $regex: regex } },
                        { NAME: { $regex: regex } },
                        { LNAME: { $regex: regex } },
                        { SEX: { $regex: regex } },
                        { MOBILE: { $regex: regex } },
                        { 'HOSPCODE.CODE': { $regex: regex } },
                        { 'HOSPCODE.NAME': { $regex: regex } },
                        { 'HOSPCODE.DISTRICT': { $regex: regex } },
                        { 'HOSPCODE.AMPHOE': { $regex: regex } },
                        { 'HOSPCODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.CODE': { $regex: regex } },
                        { 'DLACODE.NAME': { $regex: regex } },
                        { 'DLACODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.DISTRICT': { $regex: regex } },
                        { 'DLACODE.AMPHOE': { $regex: regex } },
                        { LICENCE_NUMBER: { $regex: regex } },
                        { POSITIONCODE: { $regex: regex } },
                    ],
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find).count();
            // var data = CG_REGISTER.find({ "zone": { $regex: a.toString() }, "confirm": true }, { sort: { CREATEDATE: -1 } }).fetch();
            // return data
        },

        getZoneCGlistState(a, status, skip, limit, str) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                zone: { $regex: a.toString() },
                STATE_ACTIVE: status,
                confirm: true,
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    zone: { $regex: a.toString() },
                    STATE_ACTIVE: status,
                    $or: [
                        { CID: { $regex: regex } },
                        { PRENAME: { $regex: regex } },
                        { NAME: { $regex: regex } },
                        { LNAME: { $regex: regex } },
                        { SEX: { $regex: regex } },
                        { MOBILE: { $regex: regex } },
                        { 'HOSPCODE.CODE': { $regex: regex } },
                        { 'HOSPCODE.NAME': { $regex: regex } },
                        { 'HOSPCODE.DISTRICT': { $regex: regex } },
                        { 'HOSPCODE.AMPHOE': { $regex: regex } },
                        { 'HOSPCODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.CODE': { $regex: regex } },
                        { 'DLACODE.NAME': { $regex: regex } },
                        { 'DLACODE.DISTRICT': { $regex: regex } },
                        { 'DLACODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.AMPHOE': { $regex: regex } },
                        { LICENCE_NUMBER: { $regex: regex } },
                        { POSITIONCODE: { $regex: regex } },
                    ],
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CG_REGISTER.find({ "zone": { $regex: a.toString() }, "STATE_ACTIVE": b, "confirm": true }, { sort: { CREATEDATE: -1 } }).fetch()
            // return data
        },
        getZoneCGlistState_COUNT(a, status, str) {
            var find = {
                zone: { $regex: a.toString() },
                STATE_ACTIVE: status,
                confirm: true,
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    zone: { $regex: a.toString() },
                    STATE_ACTIVE: status,
                    $or: [
                        { CID: { $regex: regex } },
                        { PRENAME: { $regex: regex } },
                        { NAME: { $regex: regex } },
                        { LNAME: { $regex: regex } },
                        { SEX: { $regex: regex } },
                        { MOBILE: { $regex: regex } },
                        { 'HOSPCODE.CODE': { $regex: regex } },
                        { 'HOSPCODE.NAME': { $regex: regex } },
                        { 'HOSPCODE.DISTRICT': { $regex: regex } },
                        { 'HOSPCODE.AMPHOE': { $regex: regex } },
                        { 'HOSPCODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.CODE': { $regex: regex } },
                        { 'DLACODE.NAME': { $regex: regex } },
                        { 'DLACODE.DISTRICT': { $regex: regex } },
                        { 'DLACODE.PROVINCE': { $regex: regex } },
                        { 'DLACODE.AMPHOE': { $regex: regex } },
                        { PROVIDERTYPE: { $regex: regex } },
                        { LICENCE_NUMBER: { $regex: regex } },
                        { POSITIONCODE: { $regex: regex } },
                    ],
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find).count();
        },

        getZonelistcg: function (a) {
            //---------------- LK

            var countobj = {
                all: 0,
                active: 0,
                nonactiove: 0,
                EXPIRED: 0,
                QUIT: 0,
                DEATH: 0,
            };
            var cg = CG_REGISTER.aggregate([
                {
                    $match: {
                        zone: { $regex: a.toString() },
                        confirm: true,
                    },
                },
                {
                    $group: {
                        _id: '$STATE_ACTIVE',
                        count: { $sum: 1 },
                    },
                },
            ]).toArray();
            for (var i = 0; i < cg.length; i++) {
                if (cg[i]._id == '01') {
                    countobj.active = parseInt(cg[i].count);
                } else if (cg[i]._id == '02') {
                    countobj.nonactiove = parseInt(cg[i].count);
                } else if (cg[i]._id == '03') {
                    countobj.EXPIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '04') {
                    countobj.QUIT = parseInt(cg[i].count);
                } else if (cg[i]._id == '05') {
                    countobj.DEATH = parseInt(cg[i].count);
                }
                countobj.all += parseInt(cg[i].count);
            }

            return countobj;
        },
        getZonelistcgapprove: function (a) {
            //---------------- LK
            var data = CG_REGISTER.find({
                zone: { $regex: a.toString() },
                confirm: false,
            }).fetch();
            return data;
        },
        getZoneDistrictCGex: function (a, b, c) {
            //---------------- LK
            var data = CG_REGISTER.find({
                'HOSPCODE.AMPHOE': { $regex: a },
                'HOSPCODE.DISTRICT': { $regex: b },
                'HOSPCODE.PROVINCE': { $regex: c },
            }).fetch();
            return data;
        },
        //---------------------------------------------------------------------------------------------------------
        getCG(a) {
            var data = CG_REGISTER.find({
                TAMBON: a,
            }).fetch();
            return data;
        },

        viewEachCGProvince: function (a) {
            var data = CG_REGISTER.find(
                {
                    CID: a,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        viewEachCMProvince: function (a) {
            var data = CM_REGISTER.find(
                { CID: a },
                { sort: { CREATEDATE: -1 } }
            ).fetch(); // Pipeline
            return data;
        },
        getlistcgapprove: function (a) {
            var data = CG_REGISTER.find(
                {
                    $or: [
                        { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                        { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                    ],
                    confirm: false,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },

        getCGlistStateAll(a, skip, limit, str, zone) {
            //--------------- new
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                $or: [
                    { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                    { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                ],
                confirm: true,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                {
                                    'HOSPCODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                                {
                                    'DLACODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    confirm: true,
                    zone: { $regex: zone.toString() },
                };
            }
            return CG_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CG_REGISTER.find({ $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }], "confirm": true }, { sort: { CREATEDATE: -1 } }).fetch()
            // return data
        },
        getCGlistStateAll_COUNT(a, str, zone) {
            var find = {
                $or: [
                    { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                    { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                ],
                confirm: true,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                {
                                    'HOSPCODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                                {
                                    'DLACODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find).count();
        },
        getCGlistState(a, status, skip, limit, str, zone) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                $or: [
                    { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                    { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                ],
                confirm: true,
                STATE_ACTIVE: status,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                {
                                    'HOSPCODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                                {
                                    'DLACODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    STATE_ACTIVE: status,
                    zone: { $regex: zone.toString() },
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CG_REGISTER.find({
            //     $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }],
            //     "confirm": true,
            //     "STATE_ACTIVE": b
            // }, { sort: { CREATEDATE: -1 } }).fetch()
            // return data
        },
        getCGlistState_COUNT(a, status, str, zone) {
            var find = {
                $or: [
                    { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                    { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                ],
                confirm: true,
                STATE_ACTIVE: status,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                {
                                    'HOSPCODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                                {
                                    'DLACODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    STATE_ACTIVE: status,
                    zone: { $regex: zone.toString() },
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find).count();
        },

        provinceGetCMStateAll(a, skip, limit, str, zone) {
            //--------------- new
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                $or: [
                    { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                    { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                ],
                confirm: true,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                {
                                    'HOSPCODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                                {
                                    'DLACODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    confirm: true,
                    zone: { $regex: zone.toString() },
                };
            }
            return CM_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CM_REGISTER.find({ $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }], "confirm": true }, { sort: { CREATEDATE: -1 } }).fetch()
            // return data
        },
        provinceGetCMStateAll_COUNT(a, str, zone) {
            var find = {
                $or: [
                    { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                    { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                ],
                confirm: true,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                {
                                    'HOSPCODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                                {
                                    'DLACODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find).count();
        },
        provinceGetCMlistState(a, status, skip, limit, str, zone) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                $or: [
                    { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                    { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                ],
                confirm: true,
                STATE_ACTIVE: status,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                {
                                    'HOSPCODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                                {
                                    'DLACODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    STATE_ACTIVE: status,
                    zone: { $regex: zone.toString() },
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CM_REGISTER.find({ $or: [{ "HOSPCODE.PROVINCE": { $regex: a.toString() } }, { "DLACODE.PROVINCE": { $regex: a.toString() } }], "confirm": true, "STATE_ACTIVE": b }, { sort: { CREATEDATE: -1 } }).fetch()
            // return data
        },
        provinceGetCMlistState_COUNT(a, status, str, zone) {
            var find = {
                $or: [
                    { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                    { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                ],
                confirm: true,
                STATE_ACTIVE: status,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                {
                                    'HOSPCODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                                {
                                    'DLACODE.PROVINCE': {
                                        $regex: a.toString(),
                                    },
                                },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    STATE_ACTIVE: status,
                    zone: { $regex: zone.toString() },
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find).count();
        },

        DistrictGetCMStateAll(a, skip, limit, str, zone) {
            //--------------- new
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                $or: [
                    { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                    { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                ],
                confirm: true,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                                { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    confirm: true,
                    zone: { $regex: zone.toString() },
                };
            }
            return CM_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CM_REGISTER.find({ $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }], "confirm": true }, { sort: { CREATEDATE: -1 } }).fetch()
            // return data
        },
        DistrictGetCMStateAll_COUNT(a, str, zone) {
            var find = {
                $or: [
                    { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                    { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                ],
                confirm: true,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                                { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find).count();
        },
        DistrictGetCMlistState(a, status, skip, limit, str, zone) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                $or: [
                    { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                    { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                ],
                confirm: true,
                STATE_ACTIVE: status,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                                { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    STATE_ACTIVE: status,
                    zone: { $regex: zone.toString() },
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
            // var data = CM_REGISTER.find({ $or: [{ "HOSPCODE.AMPHOE": { $regex: a.toString() } }, { "DLACODE.AMPHOE": { $regex: a.toString() } }], "confirm": true, "STATE_ACTIVE": b }, { sort: { CREATEDATE: -1 } }).fetch()
            // return data
        },
        DistrictGetCMlistState_COUNT(a, status, str, zone) {
            var find = {
                $or: [
                    { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                    { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                ],
                confirm: true,
                STATE_ACTIVE: status,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                                { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    STATE_ACTIVE: status,
                    zone: { $regex: zone.toString() },
                    confirm: true,
                };
            }
            return CM_REGISTER.find(find).count();
        },

        DistrictGetCGStateAll(a, skip, limit, str, zone) {
            //--------------- new
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                $or: [
                    { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                    { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                ],
                confirm: true,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                                { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    confirm: true,
                    zone: { $regex: zone.toString() },
                };
            }
            return CG_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
        },
        DistrictGetCGStateAll_COUNT(a, str, zone) {
            var find = {
                $or: [
                    { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                    { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                ],
                confirm: true,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                                { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find).count();
        },
        DistrictGetCGlistState(a, status, skip, limit, str, zone) {
            var skip = parseInt(skip);
            var limit = parseInt(limit);
            var find = {
                $or: [
                    { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                    { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                ],
                confirm: true,
                STATE_ACTIVE: status,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                                { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    STATE_ACTIVE: status,
                    zone: { $regex: zone.toString() },
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find, {
                sort: { CREATEDATE: -1 },
                skip: skip,
                limit: limit,
            }).fetch();
        },
        DistrictGetCGlistState_COUNT(a, status, str, zone) {
            var find = {
                $or: [
                    { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                    { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                ],
                confirm: true,
                STATE_ACTIVE: status,
                zone: { $regex: zone.toString() },
            };
            if (str) {
                var regex = new RegExp(str, 'i');
                find = {
                    $and: [
                        {
                            $or: [
                                { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                                { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                            ],
                        },
                        {
                            $or: [
                                { CID: { $regex: regex } },
                                { PRENAME: { $regex: regex } },
                                { NAME: { $regex: regex } },
                                { LNAME: { $regex: regex } },
                                { SEX: { $regex: regex } },
                                { MOBILE: { $regex: regex } },
                                { 'HOSPCODE.CODE': { $regex: regex } },
                                { 'HOSPCODE.NAME': { $regex: regex } },
                                { 'HOSPCODE.DISTRICT': { $regex: regex } },
                                { 'HOSPCODE.AMPHOE': { $regex: regex } },
                                { 'DLACODE.CODE': { $regex: regex } },
                                { 'DLACODE.NAME': { $regex: regex } },
                                { 'DLACODE.DISTRICT': { $regex: regex } },
                                { 'DLACODE.AMPHOE': { $regex: regex } },
                                { PROVIDERTYPE: { $regex: regex } },
                                { LICENCE_NUMBER: { $regex: regex } },
                                { POSITIONCODE: { $regex: regex } },
                            ],
                        },
                    ],
                    STATE_ACTIVE: status,
                    zone: { $regex: zone.toString() },
                    confirm: true,
                };
            }
            return CG_REGISTER.find(find).count();
        },

        getlistcg: function (a) {
            //---------------- new
            var countobj = {
                all: 0,
                active: 0,
                nonactiove: 0,
                EXPIRED: 0,
                QUIT: 0,
                DEATH: 0,
            };
            var cg = CG_REGISTER.aggregate([
                {
                    $match: {
                        $or: [
                            { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                            { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                        ],
                        confirm: true,
                    },
                },
                {
                    $group: {
                        _id: '$STATE_ACTIVE',
                        count: { $sum: 1 },
                    },
                },
            ]).toArray();
            for (var i = 0; i < cg.length; i++) {
                if (cg[i]._id == '01') {
                    countobj.active = parseInt(cg[i].count);
                } else if (cg[i]._id == '02') {
                    countobj.nonactiove = parseInt(cg[i].count);
                } else if (cg[i]._id == '03') {
                    countobj.EXPIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '04') {
                    countobj.QUIT = parseInt(cg[i].count);
                } else if (cg[i]._id == '05') {
                    countobj.DEATH = parseInt(cg[i].count);
                }
                countobj.all += parseInt(cg[i].count);
            }

            return countobj;
        },
        getlistcm: function (a) {
            //----------------  //18/01/2561
            var countobj = {
                all: 0,
                active: 0,
                nonactiove: 0,
                RETIRED: 0,
                EXPIRED: 0,
                QUIT: 0,
                DEATH: 0,
                CHANGE: 0,
            };
            var cg = CM_REGISTER.aggregate([
                {
                    $match: {
                        $or: [
                            { 'HOSPCODE.PROVINCE': { $regex: a.toString() } },
                            { 'DLACODE.PROVINCE': { $regex: a.toString() } },
                        ],
                        confirm: true,
                    },
                },
                {
                    $group: {
                        _id: '$STATE_ACTIVE',
                        count: { $sum: 1 },
                    },
                },
            ]).toArray();
            for (var i = 0; i < cg.length; i++) {
                if (cg[i]._id == '01') {
                    countobj.active = parseInt(cg[i].count);
                } else if (cg[i]._id == '02') {
                    countobj.nonactiove = parseInt(cg[i].count);
                } else if (cg[i]._id == '03') {
                    countobj.EXPIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '04') {
                    countobj.RETIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '05') {
                    countobj.QUIT = parseInt(cg[i].count);
                } else if (cg[i]._id == '06') {
                    countobj.DEATH = parseInt(cg[i].count);
                } else if (cg[i]._id == '07') {
                    countobj.CHANGE = parseInt(cg[i].count);
                }
                countobj.all += parseInt(cg[i].count);
            }

            return countobj;
        },

        getlistDistrictcg: function (a) {
            //---------------- new
            var countobj = {
                all: 0,
                active: 0,
                nonactiove: 0,
                EXPIRED: 0,
                QUIT: 0,
                DEATH: 0,
            };
            var cg = CG_REGISTER.aggregate([
                {
                    $match: {
                        $or: [
                            { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                            { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                        ],
                        confirm: true,
                    },
                },
                {
                    $group: {
                        _id: '$STATE_ACTIVE',
                        count: { $sum: 1 },
                    },
                },
            ]).toArray();
            for (var i = 0; i < cg.length; i++) {
                if (cg[i]._id == '01') {
                    countobj.active = parseInt(cg[i].count);
                } else if (cg[i]._id == '02') {
                    countobj.nonactiove = parseInt(cg[i].count);
                } else if (cg[i]._id == '03') {
                    countobj.EXPIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '04') {
                    countobj.QUIT = parseInt(cg[i].count);
                } else if (cg[i]._id == '05') {
                    countobj.DEATH = parseInt(cg[i].count);
                }
                countobj.all += parseInt(cg[i].count);
            }

            return countobj;
        },
        getlistDistrictcm: function (a) {
            //----------------  //18/01/2561
            var countobj = {
                all: 0,
                active: 0,
                nonactiove: 0,
                RETIRED: 0,
                EXPIRED: 0,
                QUIT: 0,
                DEATH: 0,
                CHANGE: 0,
            };
            var cg = CM_REGISTER.aggregate([
                {
                    $match: {
                        $or: [
                            { 'HOSPCODE.AMPHOE': { $regex: a.toString() } },
                            { 'DLACODE.AMPHOE': { $regex: a.toString() } },
                        ],
                        confirm: true,
                    },
                },
                {
                    $group: {
                        _id: '$STATE_ACTIVE',
                        count: { $sum: 1 },
                    },
                },
            ]).toArray();
            for (var i = 0; i < cg.length; i++) {
                if (cg[i]._id == '01') {
                    countobj.active = parseInt(cg[i].count);
                } else if (cg[i]._id == '02') {
                    countobj.nonactiove = parseInt(cg[i].count);
                } else if (cg[i]._id == '03') {
                    countobj.EXPIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '04') {
                    countobj.RETIRED = parseInt(cg[i].count);
                } else if (cg[i]._id == '05') {
                    countobj.QUIT = parseInt(cg[i].count);
                } else if (cg[i]._id == '06') {
                    countobj.DEATH = parseInt(cg[i].count);
                } else if (cg[i]._id == '07') {
                    countobj.CHANGE = parseInt(cg[i].count);
                }
                countobj.all += parseInt(cg[i].count);
            }

            return countobj;
        },
        getALLCGByHOSP: function (a) {
            //-----------------LK

            var data = CG_REGISTER.find(
                {
                    $or: [{ 'HOSPCODE.CODE': a }, { 'DLACODE.CODE': a }],
                    confirm: true,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            //console.log(data)
            return data;
        },
        getEachCGByHOSP: function (a) {
            //-----------------LK
            var data = CG_REGISTER.find(
                {
                    CID: a,
                    confirm: true,
                },
                { sort: { CREATEDATE: -1 } }
            ).fetch();
            return data;
        },
        getUsernameID: function (a) {
            //----------------- CAKE
            //console.log(a);
            var data = USER_LOGIN.find({
                USERNAME: a,
            }).fetch()[0];
            //console.log(data);
            return data;
        },

        //--------------------------------------------- REPORT ---------------------------------------------------------

        //--------------------------------------------------------------------------------------------------------------

        //--------------------------------------------- REPORT ---------------------------------------------------------

        countCGReportByZone() {
            let data = CG_REGISTER.aggregate([
                {
                    $project: {
                        zone: '$zone',
                        idcg: '$_id',
                        confirm: '$confirm',
                    },
                },
                {
                    $match: {
                        confirm: true,
                        zone: { $ne: null },
                        zone: { $ne: '13' },
                    },
                },
                {
                    $group: {
                        _id: '$zone',
                        numcg: { $sum: 1 },
                        idcg: { $addToSet: '$idcg' },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            // console.log(data[0]);
            return data.filter((ele) => ele._id != null);
        },
        countCMReportByZone() {
            return CM_REGISTER.aggregate([
                {
                    $project: {
                        zone: '$zone',
                        idcm: '$_id',
                        confirm: '$confirm',
                        STATE_ACTIVE: '$STATE_ACTIVE',
                    },
                },
                {
                    $match: {
                        STATE_ACTIVE: { $in: ['01', '02', '03'] },
                        confirm: true,
                    },
                },
                {
                    $group: {
                        _id: '$zone',
                        numcm: { $sum: 1 },
                        idcm: { $addToSet: '$idcm' },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
        },

        countCGReportByProvince(zone) {
            return CG_REGISTER.aggregate([
                {
                    $project: {
                        zone: '$zone',
                        HOSPCODE: {
                            $cond: [
                                { $eq: ['$DLACODE', null] },
                                '$HOSPCODE.CODE',
                                '$DLACODE.CODE',
                            ],
                        },
                        idcg: '$_id',
                        confirm: '$confirm',
                    },
                },
                {
                    $match: {
                        confirm: true,
                        zone: zone,
                    },
                },
                {
                    $group: {
                        _id: '$HOSPCODE',
                        numcg: { $sum: 1 },
                        idcg: { $addToSet: '$idcg' },
                    },
                },
            ]);
        },
        countCMReportByProvince(zone) {
            return CM_REGISTER.aggregate([
                {
                    $project: {
                        zone: '$zone',
                        HOSPCODE: {
                            $cond: [
                                { $eq: ['$DLACODE', null] },
                                '$HOSPCODE.CODE',
                                '$DLACODE.CODE',
                            ],
                        },
                        idcm: '$_id',
                        confirm: '$confirm',
                    },
                },
                {
                    $match: {
                        confirm: true,
                        zone: zone,
                    },
                },
                {
                    $group: {
                        _id: '$HOSPCODE',
                        numcm: { $sum: 1 },
                        idcm: { $addToSet: '$idcm' },
                    },
                },
            ]);
        },
        personexpiry() {
            var data = [];
            for (var i = 1; i < 14; i++) {
                var JAN = 0,
                    FEB = 0,
                    MAR = 0,
                    APR = 0,
                    MAY = 0,
                    JUN = 0,
                    JUL = 0,
                    AUG = 0,
                    SEP = 0,
                    OCT = 0,
                    NOV = 0,
                    DEC = 0,
                    SUM = 0;
                var cmhosp;
                var sumcm;
                if (i < 10) {
                    cmhosp = CM_REGISTER.find({
                        zone: '0' + [i],
                        STATE_ACTIVE: '03',
                        confirm: true,
                    }).fetch();
                    sumcm = CM_REGISTER.find({
                        zone: '0' + [i],
                        confirm: true,
                    }).fetch().length;
                    for (var j = 0; j < cmhosp.length; j++) {
                        SUM++;
                        var date =
                            new Date(cmhosp[j].EXPIREDATE).getMonth() + 1;
                        if (date == '1') {
                            JAN++;
                        } else if (date == '2') {
                            FEB++;
                        } else if (date == '3') {
                            MAR++;
                        } else if (date == '4') {
                            APR++;
                        } else if (date == '5') {
                            MAY++;
                        } else if (date == '6') {
                            JUN++;
                        } else if (date == '7') {
                            JUL++;
                        } else if (date == '8') {
                            AUG++;
                        } else if (date == '9') {
                            SEP++;
                        } else if (date == '10') {
                            OCT++;
                        } else if (date == '11') {
                            NOV++;
                        } else if (date == '12') {
                            DEC++;
                        }
                    }
                } else {
                    cmhosp = CM_REGISTER.find({
                        zone: '' + [i],
                        STATE_ACTIVE: '03',
                        confirm: true,
                    }).fetch();
                    sumcm = CM_REGISTER.find({
                        zone: '' + [i],
                        confirm: true,
                    }).fetch().length;
                    var JAN = 0,
                        FEB = 0,
                        MAR = 0,
                        APR = 0,
                        MAY = 0,
                        JUN = 0,
                        JUL = 0,
                        AUG = 0,
                        SEP = 0,
                        OCT = 0,
                        NOV = 0,
                        DEC = 0,
                        SUM = 0;
                    for (var j = 0; j < cmhosp.length; j++) {
                        var date =
                            new Date(cmhosp[j].EXPIREDATE).getMonth() + 1;
                        SUM++;
                        if (date == '1') {
                            JAN++;
                        } else if (date == '2') {
                            FEB++;
                        } else if (date == '3') {
                            MAR++;
                        } else if (date == '4') {
                            APR++;
                        } else if (date == '5') {
                            MAY++;
                        } else if (date == '6') {
                            JUN++;
                        } else if (date == '7') {
                            JUL++;
                        } else if (date == '8') {
                            AUG++;
                        } else if (date == '9') {
                            SEP++;
                        } else if (date == '10') {
                            OCT++;
                        } else if (date == '11') {
                            NOV++;
                        } else if (date == '12') {
                            DEC++;
                        }
                    }
                }
                data.push({
                    SUM: sumcm,
                    ZONE: i,
                    JAN: JAN,
                    FEB: FEB,
                    MAR: MAR,
                    APR: APR,
                    MAY: MAY,
                    JUN: JUN,
                    JUL: JUL,
                    AUG: AUG,
                    SEP: SEP,
                    OCT: OCT,
                    NOV: NOV,
                    DEC: DEC,
                });
            }
            var JAN = 0,
                FEB = 0,
                MAR = 0,
                APR = 0,
                MAY = 0,
                JUN = 0,
                JUL = 0,
                AUG = 0,
                SEP = 0,
                OCT = 0,
                NOV = 0,
                DEC = 0,
                SUM = 0;

            for (var i = 0; i < data.length; i++) {
                SUM = parseInt(data[i].SUM + SUM);
                JAN = parseInt(data[i].JAN + JAN);
                FEB = parseInt(data[i].FEB + FEB);
                MAR = parseInt(data[i].MAR + MAR);
                APR = parseInt(data[i].APR + APR);
                MAY = parseInt(data[i].MAY + MAY);
                JUN = parseInt(data[i].JUN + JUN);
                JUL = parseInt(data[i].JUL + JUL);
                AUG = parseInt(data[i].AUG + AUG);
                SEP = parseInt(data[i].SEP + SEP);
                OCT = parseInt(data[i].OCT + OCT);
                NOV = parseInt(data[i].NOV + NOV);
                DEC = parseInt(data[i].DEC + DEC);
            }
            data.push({
                SUM: SUM,
                ZONE: 'รวม',
                JAN: JAN,
                FEB: FEB,
                MAR: MAR,
                APR: APR,
                MAY: MAY,
                JUN: JUN,
                JUL: JUL,
                AUG: AUG,
                SEP: SEP,
                OCT: OCT,
                NOV: NOV,
                DEC: DEC,
            });
            return data;
        },
        UpdateActivityCP(id, data) {
            CAREPLAN_DETAIL_ACTIVITY.update({ _id: id }, { $set: data });
        },
        cgpersonexpiry() {
            var data = [];
            for (var i = 1; i < 14; i++) {
                var JAN = 0,
                    FEB = 0,
                    MAR = 0,
                    APR = 0,
                    MAY = 0,
                    JUN = 0,
                    JUL = 0,
                    AUG = 0,
                    SEP = 0,
                    OCT = 0,
                    NOV = 0,
                    DEC = 0,
                    SUM = 0;
                var cmhosp;
                var sumcg;
                if (i < 10) {
                    sumcg = CG_REGISTER.find({
                        zone: '0' + [i],
                        confirm: true,
                    }).fetch().length;
                    cmhosp = CG_REGISTER.find({
                        zone: '0' + [i],
                        STATE_ACTIVE: '03',
                        confirm: true,
                    }).fetch();
                    for (var j = 0; j < cmhosp.length; j++) {
                        var date =
                            new Date(cmhosp[j].EXPIREDATE).getMonth() + 1;
                        SUM++;
                        if (date == '1') {
                            JAN++;
                        } else if (date == '2') {
                            FEB++;
                        } else if (date == '3') {
                            MAR++;
                        } else if (date == '4') {
                            APR++;
                        } else if (date == '5') {
                            MAY++;
                        } else if (date == '6') {
                            JUN++;
                        } else if (date == '7') {
                            JUL++;
                        } else if (date == '8') {
                            AUG++;
                        } else if (date == '9') {
                            SEP++;
                        } else if (date == '10') {
                            OCT++;
                        } else if (date == '11') {
                            NOV++;
                        } else if (date == '12') {
                            DEC++;
                        }
                    }
                } else {
                    sumcg = CG_REGISTER.find({
                        zone: '' + [i],
                        confirm: true,
                    }).fetch().length;
                    cmhosp = CG_REGISTER.find({
                        zone: '' + [i],
                        STATE_ACTIVE: '03',
                        confirm: true,
                    }).fetch();
                    var JAN = 0,
                        FEB = 0,
                        MAR = 0,
                        APR = 0,
                        MAY = 0,
                        JUN = 0,
                        JUL = 0,
                        AUG = 0,
                        SEP = 0,
                        OCT = 0,
                        NOV = 0,
                        DEC = 0,
                        SUM = 0;
                    for (var j = 0; j < cmhosp.length; j++) {
                        var date =
                            new Date(cmhosp[j].EXPIREDATE).getMonth() + 1;
                        SUM++;
                        if (date == '1') {
                            JAN++;
                        } else if (date == '2') {
                            FEB++;
                        } else if (date == '3') {
                            MAR++;
                        } else if (date == '4') {
                            APR++;
                        } else if (date == '5') {
                            MAY++;
                        } else if (date == '6') {
                            JUN++;
                        } else if (date == '7') {
                            JUL++;
                        } else if (date == '8') {
                            AUG++;
                        } else if (date == '9') {
                            SEP++;
                        } else if (date == '10') {
                            OCT++;
                        } else if (date == '11') {
                            NOV++;
                        } else if (date == '12') {
                            DEC++;
                        }
                    }
                }
                data.push({
                    SUM: sumcg,
                    ZONE: i,
                    JAN: JAN,
                    FEB: FEB,
                    MAR: MAR,
                    APR: APR,
                    MAY: MAY,
                    JUN: JUN,
                    JUL: JUL,
                    AUG: AUG,
                    SEP: SEP,
                    OCT: OCT,
                    NOV: NOV,
                    DEC: DEC,
                });
            }
            var JAN = 0,
                FEB = 0,
                MAR = 0,
                APR = 0,
                MAY = 0,
                JUN = 0,
                JUL = 0,
                AUG = 0,
                SEP = 0,
                OCT = 0,
                NOV = 0,
                DEC = 0,
                SUM = 0;
            for (var i = 0; i < data.length; i++) {
                SUM = parseInt(data[i].SUM + SUM);
                JAN = parseInt(data[i].JAN + JAN);
                FEB = parseInt(data[i].FEB + FEB);
                MAR = parseInt(data[i].MAR + MAR);
                APR = parseInt(data[i].APR + APR);
                MAY = parseInt(data[i].MAY + MAY);
                JUN = parseInt(data[i].JUN + JUN);
                JUL = parseInt(data[i].JUL + JUL);
                AUG = parseInt(data[i].AUG + AUG);
                SEP = parseInt(data[i].SEP + SEP);
                OCT = parseInt(data[i].OCT + OCT);
                NOV = parseInt(data[i].NOV + NOV);
                DEC = parseInt(data[i].DEC + DEC);
            }
            data.push({
                SUM: SUM,
                ZONE: 'รวม',
                JAN: JAN,
                FEB: FEB,
                MAR: MAR,
                APR: APR,
                MAY: MAY,
                JUN: JUN,
                JUL: JUL,
                AUG: AUG,
                SEP: SEP,
                OCT: OCT,
                NOV: NOV,
                DEC: DEC,
            });
            return data;
        },
        //--------------------------------------------------------------------------------------------------------------
        //-----------------------------------------------------21 / 12 / 60 เพิ่ม อปท--------------------------------------------
        getAllDLA_CODE: function () {
            var data = DLA.find({}).fetch();
            var arr = [];
            for (var i = data.length - 1; i >= 0; i--) {
                arr.push({
                    value: data[i].DLA_CODE,
                    text:
                        data[i].DLA_NAME +
                        ' ' +
                        data[i].DISTRICT +
                        ' จ.' +
                        data[i].PROVINCE,
                });
            }
            return arr;
        },
        getDLA_NAME: function (c) {
            var data = DLA.find({ DLA_CODE: c }).fetch()[0];
            return data;
        },
        getZoneByDLA: function (a) {
            var arr = '';
            var data = SERVICE_CENTER.aggregate([
                {
                    $project: {
                        province: '$province',
                        zone: '$zone',
                    },
                },
                {
                    $group: { _id: { province: '$province', zone: '$zone' } },
                },
            ]);
            _.each(data, function (e) {
                var res = e._id.province.split('-')[1];
                if (res == a) {
                    arr = e._id.zone;
                }
            });
            return arr;
        },
        //-------------------------------------------------------------------------------------------------------------
        addHospCM(id, obj) {
            CM_REGISTER.update(
                { _id: id },
                {
                    $set: {
                        SECONDARY_COMP: obj,
                    },
                }
            );
        },
        moveHospCM(id, obj) {
            CM_REGISTER.update(
                { _id: id },
                {
                    $set: {
                        HISTORY_COMP: obj,
                    },
                }
            );
        },
        ZonelistSecondaryHosp(z) {
            var cm = CM_REGISTER.aggregate([
                {
                    $project: {
                        _id: 1,
                        CID: 1,
                        PRENAME: 1,
                        NAME: 1,
                        LNAME: 1,
                        MOBILE: 1,
                        EMAIL: 1,
                        HOSPCODE: 1,
                        DLACODE: 1,
                        SECONDARY_COMP: 1,
                        zone: 1,
                        confirm: 1,
                        sizeOfHosp: { $size: '$SECONDARY_COMP' },
                    },
                },
                {
                    $match: {
                        SECONDARY_COMP: {
                            $elemMatch: { approve: { $ne: '0' } },
                        },
                        zone: z.toString(),
                        confirm: true,
                    },
                },
            ]).toArray();
            return cm;
        },
        getZonelistSecondaryHosp(z) {
            var cm = CM_REGISTER.aggregate([
                {
                    $project: {
                        _id: 1,
                        CID: 1,
                        PRENAME: 1,
                        NAME: 1,
                        LNAME: 1,
                        MOBILE: 1,
                        EMAIL: 1,
                        HOSPCODE: 1,
                        DLACODE: 1,
                        SECONDARY_COMP: 1,
                        zone: 1,
                        confirm: 1,
                        sizeOfHosp: { $size: '$SECONDARY_COMP' },
                    },
                },
                {
                    $match: {
                        //"sizeOfHosp": { $gt: 0 },
                        zone: z.toString(),
                        confirm: true,
                        SECONDARY_COMP: { $elemMatch: { approve: '0' } },
                    },
                },
            ]).toArray();
            return cm;
        },
        getZonelistHistoryHosp(z) {
            //console.log("ZONE:", z);

            var cm = CM_REGISTER.aggregate([
                {
                    $project: {
                        CID: 1,
                        PRENAME: 1,
                        NAME: 1,
                        LNAME: 1,
                        MOBILE: 1,
                        EMAIL: 1,
                        HOSPCODE: 1,
                        DLACODE: 1,
                        HISTORY_COMP: 1,
                        zone: 1,
                        confirm: 1,
                        //sizeOfHosp: { $size: "$HISTORY_COMP" }
                    },
                },
                {
                    $match: {
                        //"sizeOfHosp": { $gt: 0 },
                        zone: z.toString(),
                        confirm: true,
                        HISTORY_COMP: { $elemMatch: { approve: '0' } },
                    },
                },
            ]).toArray();
            data = cm[0];
            //console.log(`Care manager: ${data.CID} ${data.PRENAME} ${data.NAME} ${data.LNAME}`);
            return cm;
        },
        getProvinceApproveSecondaryHosp(p) {
            var cm = CM_REGISTER.aggregate([
                {
                    $project: {
                        _id: 1,
                        CID: 1,
                        PRENAME: 1,
                        NAME: 1,
                        LNAME: 1,
                        MOBILE: 1,
                        EMAIL: 1,
                        HOSPCODE: 1,
                        DLACODE: 1,
                        SECONDARY_COMP: 1,
                        zone: 1,
                        confirm: 1,
                        sizeOfHosp: { $size: '$SECONDARY_COMP' },
                    },
                },
                {
                    $match: {
                        //"sizeOfHosp": { $gt: 0 },
                        $or: [
                            { 'HOSPCODE.PROVINCE': { $regex: p.toString() } },
                            { 'DLACODE.PROVINCE': { $regex: p.toString() } },
                        ],
                        confirm: true,

                        SECONDARY_COMP: { $elemMatch: { approve: '0' } },
                    },
                },
            ]).toArray();
            return cm;
        },
        getProvinceListSecondaryHosp(p) {
            var cm = CM_REGISTER.aggregate([
                {
                    $project: {
                        _id: 1,
                        CID: 1,
                        PRENAME: 1,
                        NAME: 1,
                        LNAME: 1,
                        MOBILE: 1,
                        EMAIL: 1,
                        HOSPCODE: 1,
                        DLACODE: 1,
                        SECONDARY_COMP: 1,
                        zone: 1,
                        confirm: 1,
                        sizeOfHosp: { $size: '$SECONDARY_COMP' },
                    },
                },
                {
                    $match: {
                        //"sizeOfHosp": { $gt: 0 },
                        $or: [
                            { 'HOSPCODE.PROVINCE': { $regex: p.toString() } },
                            { 'DLACODE.PROVINCE': { $regex: p.toString() } },
                        ],
                        confirm: true,
                        SECONDARY_COMP: {
                            $elemMatch: { approve: { $ne: '0' } },
                        },
                    },
                },
            ]).toArray();
            return cm;
        },
        removeSecondaryHosp(id, objcomp, objsw) {
            CM_REGISTER.update(
                { _id: id },
                { $set: { SWITCHING: objsw, SECONDARY_COMP: objcomp } }
            );
        },
        removeHistoryHosp(id, objcomp, objsw) {
            CM_REGISTER.update(
                {
                    _id: id,
                },
                {
                    $set: {
                        HISTORY_COMP: objcomp,
                        SWITCHING: objsw,
                    },
                }
            );
        },
        upDateSwitching2(id, objsw) {
            CM_REGISTER.update({ _id: id }, { $set: { SWITCHING: objsw } });
        },
    });
});

const proEditCm = new GridFSStore({
    collection: photos,
    name: 'proEditCm',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png'],
    }),
    path: '/uploads/photos',
});

const hpcEditCm = new GridFSStore({
    collection: photos,
    name: 'hpcEditCm',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png'],
    }),
    path: '/uploads/photos',
});

const proEditCG = new GridFSStore({
    collection: photos,
    name: 'proEditCG',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png'],
    }),
    path: '/uploads/photos',
});

const PhotoCG = new GridFSStore({
    collection: photos,
    name: 'photoCG',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png'],
    }),
});

const PhotoCC = new GridFSStore({
    collection: photos,
    name: 'PhotoCC',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png'],
    }),
});

const editPhotocg = new GridFSStore({
    collection: photos,
    name: 'editPhotocg',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png'],
    }),
    path: '/uploads/photos',
});

const editPhotocm = new GridFSStore({
    collection: photos,
    name: 'editPhotocm',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png'],
    }),
    path: '/uploads/photos',
});

const PhotoStore = new GridFSStore({
    collection: photos,
    name: 'photos',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png'],
    }),
    path: '/uploads/photos',
});

UploadFS.config.defaultStorePermissions = new UploadFS.StorePermissions({
    insert(userId, file) {
        return true;
    },
    remove(userId, file) {
        return !file.userId || userId === file.userId;
    },
    update(userId, file) {
        return !file.userId || userId === file.userId;
    },
});
UploadFS.config.https = true;
UploadFS.config.simulateReadDelay = 1000;
UploadFS.config.simulateUploadSpeed = 128000;
UploadFS.config.simulateWriteDelay = 2000;
UploadFS.config.tmpDirPermissions = '0700';
UploadFS.config.storesPath = 'uploads';
UploadFS.config.tmpDir = '/tmp/uploads';

function zerofront(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}
