


import { Meteor } from 'meteor/meteor';
import '../imports/db.js';

import { DATASET_CAREPLAN } from '../imports/db.js';
import { CAREPLAN_DETAIL } from '../imports/db.js';

Meteor.startup(() => {
    Router.route('/careplan/budgetyear=:year/createdate/start=:start&end=:end', { where: 'server' })
        .get(function () {
            var response;
            var start = new Date(this.params.start) || new Date();
            var end = new Date(this.params.end) || new Date();
            var byear = parseInt(this.params.year) ? parseInt(this.params.year) : parseInt(new Date().getFullYear()) + 543;
            var data = CAREPLAN_DETAIL.aggregate(
                // Pipeline
                [{
                    $project: {
                        _id: 0,
                        CAREPLANID: "$CAREPLANID",
                        CID: "$CID",
                        GROUPID: "$GROUP",
                        CMID: "$CMID",
                        CGID: "$CGID",
                        VENDERCODE: { $split: ["$CAREPLANID", "-"] },
                        MAIN: "",
                        HOSPCODE: "$HOSPCODE",
                        STARTDATE: "",
                        APPROVEDATE: "",
                        CREATEDATE: "$CREATEDATE",
                        YEAR: { $cond: ["$CREATEDATE", { $year: "$CREATEDATE" }, null] },
                        D_UPDATE: "",

                    }
                },
                {
                    $project: {
                        _id: 0,
                        CAREPLANID: { $cond: [{ $eq: ["$CAREPLANID", ""] }, null, "$CAREPLANID"] },
                        CID: { $cond: [{ $eq: ["$CID", ""] }, null, "$CID"] },
                        GROUPID: { $cond: [{ $eq: ["$GROUPID", ""] }, null, "$GROUPID"] },
                        CMID: { $cond: [{ $eq: ["$CMID", ""] }, null, "$CMID"] },
                        CGID: { $cond: [{ $eq: ["$CGID", ""] }, null, "$CGID"] },
                        VENDERCODE: { $cond: [{ $eq: [{ $arrayElemAt: ["$VENDERCODE", 1] }, ""] }, null, { $arrayElemAt: ["$VENDERCODE", 1] }] },
                        MAIN: null,
                        HOSPCODE: { $cond: [{ $eq: ["$HOSPCODE", ""] }, null, "$HOSPCODE"] },
                        STARTDATE: null,
                        APPROVEDATE: null,
                        CREATEDATE: { $cond: [{ $eq: ["$CREATEDATE", ""] }, null, "$CREATEDATE"] },
                        BUDGET_YEAR: { $add: ["$YEAR", 543] },
                        D_UPDATE: null,

                    }
                },
                {
                    $match: {
                        $and: [{ BUDGET_YEAR: byear }, { CREATEDATE: { $gte: start, $lte: end } }]

                    }
                }], {
                    cursor: {
                        batchSize: 50
                    },

                    allowDiskUse: true
                }).toArray()
            if (data.length > 0) {
                response = data
            } else {
                response = {
                    "error": true,
                    "message": "User not found."
                }
            }

            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(JSON.stringify(response))
        })

    Router.route('/careplan/budgetyear=:year/vendercode=:vender', { where: 'server' })
        .get(function () {
            var response;
            var vender = this.params.vender;
            var byear = parseInt(this.params.year) ? parseInt(this.params.year) : parseInt(new Date().getFullYear()) + 543;
            var data = CAREPLAN_DETAIL.aggregate(
                // Pipeline
                [
                    {
                        $project: {
                            _id: 0,
                            CAREPLANID: "$CAREPLANID",
                            CID: "$CID",
                            GROUPID: "$GROUP",
                            CMID: "$CMID",
                            CGID: "$CGID",
                            VENDERCODE: { $split: ["$CAREPLANID", "-"] },
                            MAIN: "",
                            HOSPCODE: "$HOSPCODE",
                            STARTDATE: "",
                            APPROVEDATE: "",
                            CREATEDATE: "$CREATEDATE",
                            YEAR: { $cond: ["$CREATEDATE", { $year: "$CREATEDATE" }, null] },
                            D_UPDATE: "",

                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            CAREPLANID: { $cond: [{ $eq: ["$CAREPLANID", ""] }, null, "$CAREPLANID"] },
                            CID: { $cond: [{ $eq: ["$CID", ""] }, null, "$CID"] },
                            GROUPID: { $cond: [{ $eq: ["$GROUPID", ""] }, null, "$GROUPID"] },
                            CMID: { $cond: [{ $eq: ["$CMID", ""] }, null, "$CMID"] },
                            CGID: { $cond: [{ $eq: ["$CGID", ""] }, null, "$CGID"] },
                            VENDERCODE: { $cond: [{ $eq: [{ $arrayElemAt: ["$VENDERCODE", 1] }, ""] }, null, { $arrayElemAt: ["$VENDERCODE", 1] }] },
                            MAIN: null,
                            HOSPCODE: { $cond: [{ $eq: ["$HOSPCODE", ""] }, null, "$HOSPCODE"] },
                            STARTDATE: null,
                            APPROVEDATE: null,
                            CREATEDATE: { $cond: [{ $eq: ["$CREATEDATE", ""] }, null, "$CREATEDATE"] },
                            BUDGET_YEAR: { $add: ["$YEAR", 543] },
                            D_UPDATE: null,

                        }
                    },
                    {
                        $match: {
                            $and: [{ BUDGET_YEAR: byear }, { VENDERCODE: vender }]

                        }
                    }], {
                    cursor: {
                        batchSize: 50
                    },

                    allowDiskUse: true
                }).toArray();
            if (data.length > 0) {
                response = data
            } else {
                response = {
                    "error": true,
                    "message": "User not found."
                }
            }

            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(JSON.stringify(response));
        })

    Router.route('/careplan/budgetyear=:year/hospcode=:hospcode', { where: 'server' })
        .get(function () {
            var response;
            var hospcode = this.params.hospcode;
            var byear = parseInt(this.params.year) ? parseInt(this.params.year) : parseInt(new Date().getFullYear()) + 543;
            var data = CAREPLAN_DETAIL.aggregate(
                // Pipeline
                [
                    {
                        $project: {
                            _id: 0,
                            CAREPLANID: "$CAREPLANID",
                            CID: "$CID",
                            GROUPID: "$GROUP",
                            CMID: "$CMID",
                            CGID: "$CGID",
                            VENDERCODE: { $split: ["$CAREPLANID", "-"] },
                            MAIN: "",
                            HOSPCODE: "$HOSPCODE",
                            STARTDATE: "",
                            APPROVEDATE: "",
                            CREATEDATE: "$CREATEDATE",
                            YEAR: { $cond: ["$CREATEDATE", { $year: "$CREATEDATE" }, null] },
                            D_UPDATE: "",

                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            CAREPLANID: { $cond: [{ $eq: ["$CAREPLANID", ""] }, null, "$CAREPLANID"] },
                            CID: { $cond: [{ $eq: ["$CID", ""] }, null, "$CID"] },
                            GROUPID: { $cond: [{ $eq: ["$GROUPID", ""] }, null, "$GROUPID"] },
                            CMID: { $cond: [{ $eq: ["$CMID", ""] }, null, "$CMID"] },
                            CGID: { $cond: [{ $eq: ["$CGID", ""] }, null, "$CGID"] },
                            VENDERCODE: { $cond: [{ $eq: [{ $arrayElemAt: ["$VENDERCODE", 1] }, ""] }, null, { $arrayElemAt: ["$VENDERCODE", 1] }] },
                            MAIN: null,
                            HOSPCODE: { $cond: [{ $eq: ["$HOSPCODE", ""] }, null, "$HOSPCODE"] },
                            STARTDATE: null,
                            APPROVEDATE: null,
                            CREATEDATE: { $cond: [{ $eq: ["$CREATEDATE", ""] }, null, "$CREATEDATE"] },
                            BUDGET_YEAR: { $add: ["$YEAR", 543] },
                            D_UPDATE: null,

                        }
                    },
                    {
                        $match: {
                            $and: [{ BUDGET_YEAR: byear }, { HOSPCODE: hospcode }]
                        }
                    }], {
                    cursor: {
                        batchSize: 50
                    },

                    allowDiskUse: true
                }).toArray()
            if (data.length > 0) {
                response = data
            } else {
                response = {
                    "error": true,
                    "message": "User not found."
                }
            }

            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(JSON.stringify(response));
        });

    Router.map(function () {
        this.route('fulldatasetcareplan/year/', {
            path: 'fulldatasetcareplan/year/',
            where: 'server',
            action: function () {
                //var year = this.params.year;
                var json = DATASET_CAREPLAN.find({}, { limit: 5 }).fetch();
                this.response.setHeader('Content-Type', 'application/json');
                this.response.end(JSON.stringify(json))
            }
        });
    });
});