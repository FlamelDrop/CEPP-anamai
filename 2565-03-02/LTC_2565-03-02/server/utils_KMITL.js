// file location: server\utils.js
// Version: 2021-11-23

import { Meteor } from 'meteor/meteor';
import {
    provinces,
    amphoes,
    tambons,
    healthCenters,
    CM_REGISTER,
    CG_REGISTER,
    DLA,
    SERVICE_CENTER,
} from '../imports/db.js';

Meteor.startup(() => {
    Meteor.methods({
        cmCleanHOSP(token = 'notPermitted') {
            if (token !== 'KMITL') {
                return `You’re completely finished.`;
            }

            let cm = CM_REGISTER.find({
                HOSPCODE: { $ne: null },
                'HOSPCODE.PROVINCE': { $exists: false },
            }).fetch();
            console.log('cm not ok', cm.length);
            let missingHospCode = [];
            for (let index = 0; index < cm.length; index++) {
                let item = cm[index];
                console.log(index, item.CID, item.HOSPCODE.CODE);
                hospID = item.HOSPCODE.CODE;
                hc = SERVICE_CENTER.find({ hospcode: hospID }).fetch().pop();
                // console.log(hc);
                if (!hc) {
                    let missing = { CID: item.CID, hospCode: hospID };
                    missingHospCode.push(missing);
                    continue;
                }
                hospObject = {};
                hospObject.CODE = hospID;
                hospObject.NAME = hc.name;
                hospObject.DISTRICT = hc.tambon;
                hospObject.AMPHOE = hc.amphoe;
                hospObject.PROVINCE = hc.province;
                hospObject.zone = hc.zone;
                // console.log(index + 1, 'A', hc);
                // console.log(index + 1, 'B', hospCode);
                let result = CM_REGISTER.update(
                    { _id: item._id },
                    { $set: { HOSPCODE: hospObject } }
                );
            }
            console.log(missingHospCode);
            return missingHospCode;
        },
        cgCleanHOSP(token = 'notPermitted') {
            if (token !== 'kmitl') {
                return `You're completely finished.`;
            }
            let cg = CG_REGISTER.aggregate([
                {
                    $match: {
                        HOSPCODE: { $ne: null },
                        'HOSPCODE.PROVINCE': /^\D/,
                        // STATE_ACTIVE:{$in:['01','02','03']},
                        // zone: {$ne:'13'}
                    },
                },
                {
                    $project: {
                        _id: 1,
                        HOSPCODE: 1,
                    },
                },
            ]);
            cgHOSPCODE = cg.map((item) => item.HOSPCODE.CODE);
            cg.forEach((item, index, self) => {
                hospID = item.HOSPCODE.CODE;
                hospCode = item.HOSPCODE;
                hc = healthCenters.find({ id5: hospID }).fetch().pop();
                hospCode.NAME = hc.hcName;
                hospCode.DISTRICT = hc.tambon;
                hospCode.AMPHOE = hc.amphoe;
                hospCode.PROVINCE =
                    hc.tambonID.toString().substr(0, 2) +
                    '-' +
                    hospCode.PROVINCE;
                console.log(index + 1, hc);
                console.log(index + 1, hospCode);
                let result = CG_REGISTER.update(
                    { _id: item._id },
                    { $set: { HOSPCODE: hospCode } }
                );
                console.log(index + 1, ' ==>', result);
            });
            console.log(cg);
            return cg;
        },

        provincesInZone(zoneID = 'forbidden') {
            if (zoneID === 'forbidden') {
                return Object.assign({
                    zone: 0,
                    province: 0,
                    amphoe: 0,
                    tambon: 0,
                });
            }
            zoneID = parseInt(zoneID);
            // console.log(zoneID);
            let provincesInZone = provinces
                .find({ zoneID: zoneID }, { sort: { ID: 1 } })
                .fetch();
            provincesInZone = provincesInZone.map((item) => {
                delete item._id;
                delete item.name_en;
                return item;
            });
            // console.log(provincesInZone);
            return provincesInZone;
        },
        amphoesInProvince(provinceID = 'forbidden') {
            if (provinceID === 'forbidden') {
                return Object.assign({
                    zone: 0,
                    province: 0,
                    amphoe: 0,
                    tambon: 0,
                });
            }
            pID = parseInt(provinceID);
            let amphoesInProvince = amphoes.aggregate([
                {
                    $lookup: {
                        from: 'provinces',
                        localField: 'provinceID',
                        foreignField: 'ID',
                        as: 'province',
                    },
                },
                {
                    $match: {
                        provinceID: pID,
                    },
                },
                {
                    $sort: {
                        ID: 1,
                    },
                },
            ]);
            amphoesInProvince = amphoesInProvince.map((item) => {
                delete item._id;
                let province = item.province.pop();
                delete item.province;
                return {
                    ...item,
                    provinceID: province.ID,
                    provinceName: province.name,
                    zoneID: province.zoneID,
                };
            });
            // console.log(amphoesInProvince);
            return amphoesInProvince;
        },
        tambonsInAmphoe(amphoeID = 'forbidden') {
            if (amphoeID === 'forbidden') {
                return Object.assign({
                    zone: 0,
                    province: 0,
                    amphoe: 0,
                    tambon: 0,
                });
            }
            amphoeID = parseInt(amphoeID);
            tambonsInAmphoe = tambons.aggregate([
                {
                    $match: {
                        amphoeID: amphoeID,
                    },
                },
                {
                    $lookup: {
                        from: 'amphoes',
                        localField: 'amphoeID',
                        foreignField: 'ID',
                        as: 'amphoe',
                    },
                },
            ]);
            tambonsInAmphoe = tambonsInAmphoe.map((item) => {
                delete item._id;
                delete item.name_en;
                let amPhoe = item.amphoe.pop();
                delete item.amphoe;
                return { ...item, amphoeName: amPhoe.name };
            });
            // console.log(tambonsInAmphoe);
            return tambonsInAmphoe;
        },
        getCGtambonHospDla(selected) {
            let amphoeID = selected.amphoeID;
            console.log(amphoeID);
            let tambonsInAmphoe = tambons.aggregate([
                {
                    $match: { amphoeID: amphoeID },
                },
                {
                    $project: {
                        _id: 0,
                        ID: 1,
                        tambonName: '$name',
                        amphoeID: 1,
                    },
                },
            ]);
            tambonsInAmphoe = tambonsInAmphoe.map((ele) => {
                return {
                    ...ele,
                    provinceID: selected.provinceID,
                    zoneID: selected.zoneID,
                };
            });
            console.log(tambonsInAmphoe);
        },

        addTambonidToDLA1(token = 'not permitted') {
            // not finish -----------------------------------------------
            console.log('Calling from', this.connection.clientAddress);
            console.log('userId', this.userId);
            if (token != 'KMITL') return {};
            let dla = getDLAv2();

            console.log('number of DLA =', dla.length);
            let allTambons = allTambonsInThailand();
            // dla = dla.slice(100, 200);
            // console.log(dla[3333]);
            dla.forEach((item, index, self) => {
                dlaID = item.dlaID;
                dlaName = item.dlaName;
                dlaProvince = item.dlaProvince;
                dlaAmphoe = item.dlaAmphoe;
                dlaTambon = item.dlaTambon;
                let dlaTambonID = '';
                for (let i = 0; i < allTambons.length; i++) {
                    let x = allTambons[i];
                    // console.log(x);
                    if (
                        x.tambonName === dlaTambon &&
                        x.amphoeName === dlaAmphoe &&
                        x.provinceName === dlaProvince
                    ) {
                        // console.log(
                        //     x.tambonID,
                        //     x.tambonName,
                        //     x.amphoeName,
                        //     x.provinceName,
                        //     x.zoneID
                        // );
                        dlaTambonID = x.tambonID;
                        break;
                    }
                }
                self[index].dlaTambonID = dlaTambonID;
            });
            dlaNoTambonID = dla.filter((e) => e.dlaTambonID === '');
            dlaFoundTambonID = dla.filter((e) => e.dlaTambonID !== '');
            console.log('Found =', dlaFoundTambonID.length);
            console.log('NotFound =', dlaNoTambonID.length);
            // dlaNoTambonID.forEach((x, index) => {
            //     console.log(
            //         index + 1,
            //         x.dlaID,

            //         x.dlaProvince,
            //         x.dlaAmphoe,
            //         x.dlaTambon,
            //         x.dlaTambonID,
            //         x.dlaName
            //     );
            // });
            dla.forEach((item, index, self) => {
                dlaID = item.dlaID;
                dlaID = dlaID.toString();
                console.log(
                    index + 1,
                    dlaID,
                    typeof item.dlaID,
                    item.dlaTambonID
                );
                DLA.update(
                    { DLA_CODE: dlaID },
                    {
                        $set: {
                            tambonID: item.dlaTambonID,
                        },
                    }
                );
                console.log(index + 1, item.dlaID, ' ...updated.');
            });

            return dla;
        },
        addTambonidToDLA2(token = 'not permitted') {
            // not finish -----------------------------------------------
            console.log('Calling from', this.connection.clientAddress);
            console.log('userId', this.userId);
            if (token != 'KMITL') return {};
            let dla = getDLAnoTambonID();

            console.log('number of DLA =', dla.length);
            // return dla;
            let allTambons = allTambonsInThailand();
            // dla = dla.slice(100, 200);
            // console.log(dla[3333]);
            dla.forEach((item, index, self) => {
                dlaID = item.dlaID;
                dlaName = item.dlaName;
                dlaProvince = item.dlaProvince;
                dlaAmphoe = item.dlaAmphoe;
                dlaTambon = item.dlaTambon;
                let dlaTambonID = '';
                for (let i = 0; i < allTambons.length; i++) {
                    let x = allTambons[i];
                    // console.log(x);
                    if (
                        x.tambonName === dlaTambon &&
                        x.amphoeName === dlaAmphoe &&
                        x.provinceName === dlaProvince
                    ) {
                        // console.log(
                        //     x.tambonID,
                        //     x.tambonName,
                        //     x.amphoeName,
                        //     x.provinceName,
                        //     x.zoneID
                        // );
                        dlaTambonID = x.tambonID;
                        break;
                    }
                }
                self[index].dlaTambonID = dlaTambonID;
            });
            dlaNoTambonID = dla.filter((e) => e.dlaTambonID === '');
            dlaFoundTambonID = dla.filter((e) => e.dlaTambonID !== '');
            console.log('Found =', dlaFoundTambonID.length);
            console.log('NotFound =', dlaNoTambonID.length);
            // dlaNoTambonID.forEach((x, index) => {
            //     console.log(
            //         index + 1,
            //         x.dlaID,

            //         x.dlaProvince,
            //         x.dlaAmphoe,
            //         x.dlaTambon,
            //         x.dlaTambonID,
            //         x.dlaName
            //     );
            // });
            dla.forEach((item, index, self) => {
                dlaID = item.dlaID;
                dlaID = dlaID.toString();
                console.log(
                    index + 1,
                    dlaID,
                    typeof item.dlaID,
                    item.dlaTambonID
                );
                DLA.update(
                    { DLA_CODE: dlaID },
                    {
                        $set: {
                            tambonID: item.dlaTambonID,
                        },
                    }
                );
                console.log(index + 1, item.dlaID, ' ...updated.');
            });

            return dla;
        },
        getDla_fromCM_REGISTER(token = 'forbidden') {
            if (token !== 'KMITL') {
                return Object.assign({
                    zone: 0,
                    province: 0,
                    amphoe: 0,
                    tambon: 0,
                });
            }
            let cmDla = getDLAcm_register();
            let cgDla = getDLAcg_register();
            // let cmcg = [];
            // cmDla.forEach((e) => {
            //     cmcg[e._id] = { ...cmcg[e._id], dlaCM: e.count };
            // });
            return [cmDla, cgDla];
        },
        getAllTambonsButZone13(token = 'not_permitted') {
            // 2564-12-26
            if (token !== 'KMITL') {
                return 'not_permitted.';
            }
            let data = allTambonsInThailand();
            // console.log(data);
            return data.filter((item) => item.zoneID !== 13);
        },
        addDISTRICTtoSERVICE_CENTER(token = 'not permitted') {
            // not finish -----------------------------------------------
            console.log('Calling from', this.connection.clientAddress);
            console.log('userId', this.userId);
            if (token != 'KMITL') return {};
            let sc = SERVICE_CENTER.find().fetch();
            console.log(sc.length);
            while (sc.length > 0) {
                item = sc.pop();
                console.log(item);
                console.log(item.hospcode, item.name, item.tambon);
                SERVICE_CENTER.update(
                    { _id: item._id },
                    {
                        $set: {
                            DISTRICT: item.tambon,
                        },
                    }
                );
            }

            return 'done';
        },
    });

    function allTambonsInThailand() {
        let provinceInThaland = provinces.find().fetch();
        let provinceAll = [];
        provinceInThaland.forEach((item) => {
            delete item._id;
            delete item.name_en;
            provinceAll[item.ID] = item;
        });
        // console.log(provinceInThaland);
        // console.log(provinceAll);
        let tambonsAll = tambons.aggregate([
            {
                $lookup: {
                    from: 'amphoes',
                    localField: 'amphoeID',
                    foreignField: 'ID',
                    as: 'amphoe',
                },
            },
        ]);

        allTambons = tambonsAll.map((item) => {
            let amphoe = item.amphoe[0];
            let province = provinceAll[amphoe.provinceID];
            // console.log(province);
            element = {
                tambonID: item.ID,
                tambonName: item.name,
                amphoeID: item.amphoeID,
                amphoeName: amphoe.name,
                provinceID: amphoe.provinceID,
                provinceName: province.name,
                zoneID: province.zoneID,
            };
            return element;
        });
        return allTambons.toArray();
    }
    function getDLAcm_register() {
        let dla = CM_REGISTER.aggregate([
            {
                $match: {
                    DLACODE: { $ne: null },
                },
            },
            {
                $group: {
                    _id: '$DLACODE.CODE',
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        return dla;
    }

    function getDLAcg_register() {
        let dla = CG_REGISTER.aggregate([
            {
                $match: {
                    DLACODE: { $ne: null },
                },
            },
            {
                $group: {
                    _id: '$DLACODE.CODE',
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        return dla;
    }
    function getDLAv2() {
        // console.log('getDLA');
        let dla = DLA.aggregate([
            {
                $project: {
                    _id: 0,
                    dlaID: { $toInt: ['$DLA_CODE'] },
                    dlaName: '$DLA_NAME',
                    dlaProvince: '$PROVINCE',
                    dlaAmphoe: {
                        $arrayElemAt: [{ $split: ['$DISTRICT', '.'] }, -1],
                    },
                    dlaTambon: '$TAMBON',
                },
            },
        ]);
        // console.log('dla', dla);
        return dla.sort((a, b) => a.dlaID - b.dlaID);
    }

    function getDLAnoTambonID() {
        // console.log('getDLA');
        let dla = DLA.aggregate([
            {
                $project: {
                    _id: 0,
                    dlaID: { $toInt: ['$DLA_CODE'] },
                    dlaName: '$DLA_NAME',
                    dlaProvince: '$PROVINCE',
                    dlaAmphoe: {
                        $arrayElemAt: [{ $split: ['$DISTRICT', '.'] }, -1],
                    },
                    dlaTambon: '$TAMBON',
                    tambonID: 1,
                },
            },
            {
                $match: {
                    tambonID: '',
                },
            },
        ]);
        // console.log('dla', dla);
        return dla.sort((a, b) => a.dlaID - b.dlaID);
    }
});
