import {
    Meteor
} from 'meteor/meteor';
import '../imports/db.js';
import {
    photos
} from '../imports/db.js';
import {
    photosg
} from '../imports/db.js';
import {
    photosCG
} from '../imports/db.js';
import {
    UploadFS
} from 'meteor/jalik:ufs';
import {
    GridFSStore
} from 'meteor/jalik:ufs-gridfs';

import {
    ELDERLYREGISTER
} from '../imports/db.js';

import {
    CARECODE
} from '../imports/db.js';

import {
    CARETYPE
} from '../imports/db.js';

import {
    ADMINCODE
} from '../imports/db.js';

import {
    CAREPLAN_DETAIL
} from '../imports/db.js';

import {
    CAREPLAN_DETAIL_ACTIVITY
} from '../imports/db.js';

import {
    CAREPLAN
} from '../imports/db.js';

import {
    CAREPLAN_ACTIVITY
} from '../imports/db.js';

import {
    VENDER_CODE
} from '../imports/db.js';

import {
    CM_REGISTER
} from '../imports/db.js';
import {
    SERVICE_CENTER
} from '../imports/db.js';
import {
    DISTRICT
} from '../imports/db.js';
import {
    USER_LOGIN
} from '../imports/db.js';
import {
    CG_REGISTER
} from '../imports/db.js';

import {
    DLA
} from '../imports/db.js';

import {
    GEOLOCATION
} from '../imports/db.js';

Meteor.startup(() => {

    Meteor.methods({
        getallcp() {
            return CAREPLAN_DETAIL.aggregate([
                {
                    $group: {
                        _id: { pro: "$SERVICE_CENTER_DETAIL.PROVINCE", amp: "$SERVICE_CENTER_DETAIL.AMPHOE", tam: "$SERVICE_CENTER_DETAIL.DISTRICT" },
                        count: { $sum: 1 }
                    }
                }])
        },
        getallsubdistrict() {
            return DISTRICT.aggregate([
                {
                    $group: {
                        _id:{pro:"$province_name",amp:"$district_name",tam:"$subdistrict_name"},                        
                        count: { $sum: 0 }
                    }
                }])
        },
        getDLAByCODE(x) {
            var DISTRICTfind = DLA.find({ "DLA_CODE": x }).fetch();
            return DISTRICTfind;
        },
        getSERVICE_CENTERByCODE(x) {
            var DISTRICTfind = SERVICE_CENTER.find({ "hospcode": x }).fetch();
            return DISTRICTfind;
        },
        getDataOfDISTRICTBySUBDISTRICT(x) {
            var DISTRICTfind = DISTRICT.find({ "subdistrict_name": x }).fetch();
            return DISTRICTfind;
        },
        getAllOfService() {
            var DISTRICTfind = SERVICE_CENTER.find({}).fetch();
            return DISTRICTfind;
        },
        getServiceDATA(province, amphoe, district) {
            var DISTRICTfind = SERVICE_CENTER.find({
                "province": { '$regex': province },
                "amphoe": { '$regex': amphoe },
                "district": { '$regex': district }
            }).fetch();
            return DISTRICTfind;
        },
        getServiceAllDATA(limit, skip) {
            var DISTRICTfind = ELDERLYREGISTER.find({
            }, { skip: skip, limit: limit }).fetch();
            return DISTRICTfind;
        },
        Count_getServiceAllDATA() {
            var DISTRICTfind = ELDERLYREGISTER.find({
            }).fetch();
            return DISTRICTfind;
        },
        getElderFromHOSP(code, search, limit, skip) {
            var DISTRICTfind = ELDERLYREGISTER.find({
                "HOSPCODE": { $in: code },
                "NAME": { '$regex': search },
                "LNAME": { '$regex': search }
            }, { skip: skip, limit: limit }).fetch();
            return DISTRICTfind;
        },
        Count_getElderFromHOSP(code, search, limit, skip) {
            var DISTRICTfind = ELDERLYREGISTER.find({
                "HOSPCODE": { $in: code },
                "NAME": { '$regex': search },
                "LNAME": { '$regex': search }
            }).fetch();
            return DISTRICTfind;
        },
        getAllDISTRICT() {
            var DISTRICTfind = DISTRICT.find({}).fetch();
            return DISTRICTfind;
        },

        getSearchCMByAdmin(year, province, amphoe, district, search, limit, skip) {
            if (province != "all") {
                if (amphoe != "all") {
                    if (district != "all") {
                        if (search != "") {
                            return CM_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                "TAMBON.DISTRICT": { '$regex': district },
                                $or: [
                                    { "NAME": { '$regex': search } },
                                    { "LNAME": { '$regex': search } },
                                    { "HOSPCODE.CODE": { '$regex': search } },
                                    { "CID": { '$regex': search } },
                                ]
                            }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                        } else {
                            return CM_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                "TAMBON.DISTRICT": { '$regex': district }
                            }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                        }
                    } else {
                        if (search != "") {
                            return CM_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                $or: [
                                    { "NAME": { '$regex': search } },
                                    { "LNAME": { '$regex': search } },
                                    { "HOSPCODE.CODE": { '$regex': search } },
                                    { "CID": { '$regex': search } },
                                ]
                            }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                        } else {
                            return CM_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                            }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                        }
                    }
                } else {
                    if (search != "") {
                        return CM_REGISTER.find({
                            "TAMBON.PROVINCE": { '$regex': province },
                            $or: [
                                { "NAME": { '$regex': search } },
                                { "LNAME": { '$regex': search } },
                                { "HOSPCODE.CODE": { '$regex': search } },
                                { "CID": { '$regex': search } },
                            ]
                        }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                    } else {
                        return CM_REGISTER.find({
                            "TAMBON.PROVINCE": { '$regex': province },
                        }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                    }
                }
            } else {
                if (search != "") {
                    return CM_REGISTER.find({
                        $or: [
                            { "NAME": { '$regex': search } },
                            { "LNAME": { '$regex': search } },
                            { "HOSPCODE.CODE": { '$regex': search } },
                            { "CID": { '$regex': search } },
                        ]
                    }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                } else {
                    return CM_REGISTER.find({}, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                }
            }

        },
        Count_SearchCMByAdmin(year, province, amphoe, district, search) {
            if (province != "all") {
                if (amphoe != "all") {
                    if (district != "all") {
                        if (search != "") {
                            return CM_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                "TAMBON.DISTRICT": { '$regex': district },
                                $or: [
                                    { "NAME": { '$regex': search } },
                                    { "LNAME": { '$regex': search } },
                                    { "HOSPCODE.CODE": { '$regex': search } },
                                    { "CID": { '$regex': search } },
                                ]
                            }).fetch();
                        } else {
                            return CM_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                "TAMBON.DISTRICT": { '$regex': district }
                            }).fetch();
                        }
                    } else {
                        if (search != "") {
                            return CM_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                $or: [
                                    { "NAME": { '$regex': search } },
                                    { "LNAME": { '$regex': search } },
                                    { "HOSPCODE.CODE": { '$regex': search } },
                                    { "CID": { '$regex': search } },
                                ]
                            }).fetch();
                        } else {
                            return CM_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                            }).fetch();
                        }
                    }
                } else {
                    if (search != "") {
                        return CM_REGISTER.find({
                            "TAMBON.PROVINCE": { '$regex': province },
                            $or: [
                                { "NAME": { '$regex': search } },
                                { "LNAME": { '$regex': search } },
                                { "HOSPCODE.CODE": { '$regex': search } },
                                { "CID": { '$regex': search } },
                            ]
                        }).fetch();
                    } else {
                        return CM_REGISTER.find({
                            "TAMBON.PROVINCE": { '$regex': province },
                        }).fetch();
                    }
                }
            } else {
                if (search != "") {
                    return CM_REGISTER.find({
                        $or: [
                            { "NAME": { '$regex': search } },
                            { "LNAME": { '$regex': search } },
                            { "HOSPCODE.CODE": { '$regex': search } },
                            { "CID": { '$regex': search } },
                        ]
                    }).fetch();
                } else {
                    return CM_REGISTER.find({}).fetch();
                }
            }

        },

        getSearchCGByAdmin(year, province, amphoe, district, search, limit, skip) {
            if (province != "all") {
                if (amphoe != "all") {
                    if (district != "all") {
                        if (search != "") {
                            return CG_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                "TAMBON.DISTRICT": { '$regex': district },
                                $or: [
                                    { "NAME": { '$regex': search } },
                                    { "LNAME": { '$regex': search } },
                                    { "HOSPCODE.CODE": { '$regex': search } },
                                    { "CID": { '$regex': search } },
                                ]
                            }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                        } else {
                            return CG_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                "TAMBON.DISTRICT": { '$regex': district }
                            }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                        }
                    } else {
                        if (search != "") {
                            return CG_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                $or: [
                                    { "NAME": { '$regex': search } },
                                    { "LNAME": { '$regex': search } },
                                    { "HOSPCODE.CODE": { '$regex': search } },
                                    { "CID": { '$regex': search } },
                                ]
                            }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                        } else {
                            return CG_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                            }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                        }
                    }
                } else {
                    if (search != "") {
                        return CG_REGISTER.find({
                            "TAMBON.PROVINCE": { '$regex': province },
                            $or: [
                                { "NAME": { '$regex': search } },
                                { "LNAME": { '$regex': search } },
                                { "HOSPCODE.CODE": { '$regex': search } },
                                { "CID": { '$regex': search } },
                            ]
                        }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                    } else {
                        return CG_REGISTER.find({
                            "TAMBON.PROVINCE": { '$regex': province },
                        }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                    }
                }
            } else {
                if (search != "") {
                    return CG_REGISTER.find({
                        $or: [
                            { "NAME": { '$regex': search } },
                            { "LNAME": { '$regex': search } },
                            { "HOSPCODE.CODE": { '$regex': search } },
                            { "CID": { '$regex': search } },
                        ]
                    }, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                } else {
                    return CG_REGISTER.find({}, { sort: { fullcode: 1 }, skip: skip, limit: limit }).fetch();
                }
            }

        },
        Count_SearchCGByAdmin(year, province, amphoe, district, search) {
            if (province != "all") {
                if (amphoe != "all") {
                    if (district != "all") {
                        if (search != "") {
                            return CG_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                "TAMBON.DISTRICT": { '$regex': district },
                                $or: [
                                    { "NAME": { '$regex': search } },
                                    { "LNAME": { '$regex': search } },
                                    { "HOSPCODE.CODE": { '$regex': search } },
                                    { "CID": { '$regex': search } },
                                ]
                            }).fetch();
                        } else {
                            return CG_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                "TAMBON.DISTRICT": { '$regex': district }
                            }).fetch();
                        }
                    } else {
                        if (search != "") {
                            return CG_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                                $or: [
                                    { "NAME": { '$regex': search } },
                                    { "LNAME": { '$regex': search } },
                                    { "HOSPCODE.CODE": { '$regex': search } },
                                    { "CID": { '$regex': search } },
                                ]
                            }).fetch();
                        } else {
                            return CG_REGISTER.find({
                                "TAMBON.PROVINCE": { '$regex': province },
                                "TAMBON.AMPHOE": { '$regex': amphoe },
                            }).fetch();
                        }
                    }
                } else {
                    if (search != "") {
                        return CG_REGISTER.find({
                            "TAMBON.PROVINCE": { '$regex': province },
                            $or: [
                                { "NAME": { '$regex': search } },
                                { "LNAME": { '$regex': search } },
                                { "HOSPCODE.CODE": { '$regex': search } },
                                { "CID": { '$regex': search } },
                            ]
                        }).fetch();
                    } else {
                        return CG_REGISTER.find({
                            "TAMBON.PROVINCE": { '$regex': province },
                        }).fetch();
                    }
                }
            } else {
                if (search != "") {
                    return CG_REGISTER.find({
                        $or: [
                            { "NAME": { '$regex': search } },
                            { "LNAME": { '$regex': search } },
                            { "HOSPCODE.CODE": { '$regex': search } },
                            { "CID": { '$regex': search } },
                        ]
                    }).fetch();
                } else {
                    return CG_REGISTER.find({}).fetch();
                }
            }

        },
    })


});