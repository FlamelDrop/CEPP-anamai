// import { Mongo } from 'meteor/mongo';

// export const CM_REGISTER = new Mongo.Collection('CM_REGISTER');
// export const SERVICE_CENTER = new Mongo.Collection('SERVICE_CENTER');
// export const DISTRICT = new Mongo.Collection('DISTRICT');
// export const USER_LOGIN = new Mongo.Collection('USER_LOGIN');
// export const CG_REGISTER = new Mongo.Collection('CG_REGISTER');
// export const DLA = new Mongo.Collection('DLA');
// export const GEOLOCATION = new Mongo.Collection('GEOLOCATION');
// export const ELDERLYREGISTER = new Mongo.Collection('ELDERLYREGISTER');
// export const CARECODE = new Mongo.Collection('CARECODE');
// export const CARETYPE = new Mongo.Collection('CARETYPE');
// export const ADMINCODE = new Mongo.Collection('ADMINCODE');
// export const CAREPLAN_DETAIL = new Mongo.Collection('CAREPLAN_DETAIL');
// export const CAREPLAN_DETAIL_ACTIVITY = new Mongo.Collection('CAREPLAN_DETAIL_ACTIVITY');
// export const photos = new Mongo.Collection('photos');
// export const photosg = new Mongo.Collection('photosg');
// export const photosCG = new Mongo.Collection('photosCG');
// export const CAREPLAN = new Mongo.Collection('CAREPLAN');
// export const CAREPLAN_ACTIVITY = new Mongo.Collection('CAREPLAN_ACTIVITY');
// export const VENDER_CODE = new Mongo.Collection('VENDER_CODE');
// export const DATASET_CAREPLAN = new Mongo.Collection('DATASET_CAREPLAN');



import { Mongo } from 'meteor/mongo';

var database;
if (Meteor.isServer) {
    console.log("On collections ");
    database = new MongoInternals.RemoteCollectionDriver("mongodb://localhost:27017/meteor");
}

export const CM_REGISTER = new Mongo.Collection('CM_REGISTER', { _driver: database });
export const CC_REGISTER = new Mongo.Collection('CC_REGISTER', { _driver: database });
export const SERVICE_CENTER = new Mongo.Collection('SERVICE_CENTER', { _driver: database });
export const DISTRICT = new Mongo.Collection('DISTRICT', { _driver: database });
export const USER_LOGIN = new Mongo.Collection('USER_LOGIN', { _driver: database });
export const CG_REGISTER = new Mongo.Collection('CG_REGISTER', { _driver: database });
export const DLA = new Mongo.Collection('DLA', { _driver: database });
export const GEOLOCATION = new Mongo.Collection('GEOLOCATION', { _driver: database });
export const ELDERLYREGISTER = new Mongo.Collection('ELDERLYREGISTER', { _driver: database });
export const CARECODE = new Mongo.Collection('CARECODE', { _driver: database });
export const CARETYPE = new Mongo.Collection('CARETYPE', { _driver: database });
export const ADMINCODE = new Mongo.Collection('ADMINCODE', { _driver: database });
export const CAREPLAN_DETAIL = new Mongo.Collection('CAREPLAN_DETAIL', { _driver: database });
export const CAREPLAN_DETAIL_ACTIVITY = new Mongo.Collection('CAREPLAN_DETAIL_ACTIVITY', { _driver: database });
export const photos = new Mongo.Collection('photos', { _driver: database });
export const photosg = new Mongo.Collection('photosg', { _driver: database });
export const photosCG = new Mongo.Collection('photosCG', { _driver: database });
export const CAREPLAN = new Mongo.Collection('CAREPLAN', { _driver: database })
export const CAREPLAN_ACTIVITY = new Mongo.Collection('CAREPLAN_ACTIVITY', { _driver: database });
export const VENDER_CODE = new Mongo.Collection('VENDER_CODE', { _driver: database });
export const DATASET_CAREPLAN = new Mongo.Collection('DATASET_CAREPLAN', { _driver: database });
export const EVALUATE_DISTRICT = new Mongo.Collection('EVALUATE_DISTRICT', { _driver: database });
export const R_SERVICE_CM_CG_CP = new Mongo.Collection('R_SERVICE_CM_CG_CP', { _driver: database });
export const provinces = new Mongo.Collection('provinces', { _driver: database });
export const amphoes = new Mongo.Collection('amphoes', { _driver: database });
export const tambons = new Mongo.Collection('tambons', { _driver: database });
export const tambonAssessment = new Mongo.Collection('tambonAssessment', { _driver: database });
export const healthCenters = new Mongo.Collection('healthCenters', { _driver: database });
