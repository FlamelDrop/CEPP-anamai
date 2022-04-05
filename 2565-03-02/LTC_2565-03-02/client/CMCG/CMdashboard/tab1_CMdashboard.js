Template.tab1_CMdashboard.onRendered(function () {

    
});
Template.tab1_CMdashboard.helpers({
    profile() {
        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    hosp() {
        if (Session.get('getProfileCM')) {
            Meteor.call('getAllServiceCenterDistrict', Session.get('getProfileCM')[0].HOSPCODE, function (error, result) {
                Session.set('hosp', result)
                Session.set('hospAdd', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            });
            if (Session.get('hosp')) {
                return Session.get('hosp');
            }
        }
    },
    dlaName() {
        Meteor.call('getDLA_NAME', Session.get('getProfileCM')[0].DLACODE, function (error, result) {
            if (result) {
                Session.set('dlaName', result)
            }

        });
        if (Session.get('dlaName')) {
            return Session.get('dlaName').DLA_NAME+" "+Session.get('dlaName').DISTRICT+" จ. "+Session.get('dlaName').PROVINCE
        }

    },
    hospAdd() {
        if (Session.get('hospAdd')) {
            return Session.get('hospAdd');
        }
    },
    workplace() {
        if (Session.get('getProfileCM')) {
            Meteor.call('getDistrictName', Session.get('getProfileCM')[0].TAMBON, function (error, result) {
                try {
                    Session.set('getDistrictNameS', "[" + result.fullcode + "] ต." + result.subdistrict_name + " อ." + result.district_name + " จ." + result.province_name)
                } catch (e) { }
            });
            return Session.get('getDistrictNameS');
        }
    }
})


Template.tab1_CMdashboard.events({
    'click #printcm'() {
        Router.go('/printprofilecm')
    },
})