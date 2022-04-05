// server\report_cp_kmitl.js
// Modified from server\new_cp_report.js
// To remove SERVICE_CENTER
// use SERVICE_CENTER instead of healthCenters 2565-01-10

import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { ELDERLYREGISTER } from '../imports/db.js';
import { CAREPLAN_DETAIL } from '../imports/db.js';
import { EVALUATE_DISTRICT } from '../imports/db.js';
import { SERVICE_CENTER } from '../imports/db.js';
// import { healthCenters } from '../imports/db.js';

Meteor.startup(() => {
    Meteor.methods({
        findElderyRegister_kt(cpSelector) {
            // console.log(cpSelector);

            let tambonIdList = cpSelector.tambonList.map((ele) =>
                ele.tambonID.toString()
            );
            let hcList = SERVICE_CENTER.aggregate([
                {
                    $match: {
                        tambonID: { $in: tambonIdList },
                        hcType: { $ne: '16-คลินิกเอกชน' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        hcType: 1,
                        hcID: '$hospcode',
                        tambonID: 1,
                        zone: 1,
                        name: 1,
                    },
                },
                {
                    $sort: {
                        hcID: 1,
                    },
                },
            ]);
            let hcIDs = hcList.map((ele) => ele.hcID);

            // console.log(`hcIDs => ${hcIDs.length}`);
            // console.log(hcList[3]);

            let elders = ELDERLYREGISTER.aggregate([
                {
                    $project: {
                        HOSPCODE: '$HOSPCODE',
                        CID: '$CID',
                        NHSO: {
                            $cond: {
                                if: { $eq: ['$NHSO', true] },
                                then: 'true',
                                else: 'false',
                            },
                        },
                        MAINSCLCODE: {
                            $cond: {
                                if: { $eq: ['$MAINSCLCODE', 'WEL'] },
                                then: 'WEL',
                                else: 'ETC',
                            },
                        },
                        STATUS: '$STATUS',
                        PRENAME: {
                            $cond: {
                                if: {
                                    $or: [
                                        { $eq: ['$PRENAME', 'เด็กชาย'] },
                                        { $eq: ['$PRENAME', 'นาย'] },
                                    ],
                                },
                                then: 'ชาย',
                                else: 'หญิง',
                            },
                        },
                        BUDGETYEAR: {
                            $ifNull: [
                                '$BUDGETYEAR',
                                {
                                    $toString: {
                                        $add: [
                                            {
                                                $toInt: {
                                                    $dateToString: {
                                                        format: '%Y',
                                                        date: '$CREATEDATE',
                                                        timezone:
                                                            'Asia/Bangkok',
                                                    },
                                                },
                                            },
                                            543,
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    $match: {
                        HOSPCODE: { $in: hcIDs },
                        NHSO: { $regex: cpSelector.db },
                        MAINSCLCODE: { $regex: cpSelector.permission },
                        STATUS: { $in: cpSelector.type },
                        BUDGETYEAR: { $regex: cpSelector.year },
                        PRENAME: { $regex: cpSelector.sex },
                    },
                },
            ]);
            // console.log(`elders => ${elders.length}`);
            // elders
            //     .filter((ele) => ele.HOSPCODE == '05145')
            //     .forEach((ele, index) =>
            //         console.log(
            //             `${index} => ${ele.HOSPCODE} ${ele.CID} ${ele.NHSO} ${ele.BUDGETYEAR}`
            //         )
            //     );
            //add field ELDER to hcList
            hcList.forEach((item, index, self) => {
                hcList[index].ELDER = 0;
                for (i = 0; i < elders.length; i++) {
                    if (elders[i].HOSPCODE === item.hcID) {
                        hcList[index].ELDER++;
                    }
                }
            });
            //add filed CAREPLAN to hcList
            hcList.forEach((item, index, self) => {
                let hcID = item.hcID;
                let elderInHcid = elders.filter((ele) => ele.HOSPCODE == hcID);
                let elderIDs = elderInHcid.map((ele) => ele.CID);
                let carePlans = CAREPLAN_DETAIL.aggregate([
                    {
                        $match: {
                            HOSPCODE: hcID,
                            CID: { $in: elderIDs },
                        },
                    },
                    {
                        $group: {
                            _id: { hcID: '$HOSPCODE', cid: '$CID' },
                            count: { $sum: 1 },
                        },
                    },
                ]);
                // console.log(
                //     `${hcID} => ${elderIDs.length} - ${carePlans.length}`
                // );
                hcList[index].CAREPLAN = carePlans.length;
            });
            // let elderIDs = elders.map((ele) => ele.CID);
            // let carePlans = CAREPLAN_DETAIL.aggregate([
            //     {
            //         $match: {
            //             HOSPCODE: { $in: hcIDs },
            //             CID: { $in: elderIDs },
            //         },
            //     },
            //     {
            //         $group: {
            //             _id: { hcID: '$HOSPCODE', cid: '$CID' },
            //             count: { $sum: 1 },
            //         },
            //     },
            // ]);
            // console.log(`carePlans => ${carePlans.length}`);
            // carePlans
            //     .filter((ele) => ele._id.hcID == '05145')
            //     .forEach((ele, index) =>
            //         console.log(`${index} ${ele._id.hcID} ${ele._id.cid}`)
            //     );
            // hcList.forEach((item, index, self) => {
            //     hcList[index].CAREPLAN = 0;
            //     for (i = 0; i < carePlans.length; i++) {
            //         if (carePlans[i]._id.hcID === item.hcID) {
            //             hcList[index].CAREPLAN += 1;
            //         }
            //     }
            // });
            hcList.forEach((item, index, self) => {
                hcList[index].NAME = `[${item.hcID}] ${item.name}`;
            });
            return hcList;
        },
    });
});
