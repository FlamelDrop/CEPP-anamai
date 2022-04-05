import { CM_REGISTER } from '../imports/db.js';
import { SERVICE_CENTER } from '../imports/db.js';
import { CG_REGISTER } from '../imports/db.js';

Meteor.startup(() => {
    Meteor.methods({
        CMRATIO(zone) {
            return CM_REGISTER.aggregate([{
                $project: {
                    zone: "$zone",
                    confirm: "$confirm",
                    STATUS_ACTIVE: 1,
                }

            }, {
                $match: {
                    confirm: true,
                    STATUS_ACTIVE: "01",
                    zone: zone
                }

            }, {
                $group: {
                    _id: "$zone",
                    numcm_ratio: { $sum: 1 },
                }
            }])

        }
    });
})
