Template.printprofilecm.onRendered(function(){
    window.print();
    window.history.back();

})

Template.printprofilecm.helpers({
    profile() {
        if(Session.get('zoneViewProfileCM')){
            Session.set('getProfileCM',Session.get('zoneViewProfileCM'))
        }else{
             Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            Session.set('getProfileCM',result)
        });

        }
         if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }

    },
    hosp(){
        Meteor.call('getAllServiceCenterDistrict', Session.get('getProfileCM')[0].HOSPCODE, function(error, result) {
            Session.set('hosp',result)
            Session.set('hospAdd', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
        });
        if (Session.get('hosp')) {
            return Session.get('hosp');
        }
    },
    hospAdd(){
        if (Session.get('hospAdd')) {
            return Session.get('hospAdd');
        }
    },
    workplace(){
        Meteor.call('getDistrictName', Session.get('getProfileCM')[0].TAMBON, function(error, result) {
            try {
                Session.set('getDistrictNameS', "["+result.fullcode+"] ต." + result.subdistrict_name + " อ." + result.district_name + " จ." + result.province_name)
            } catch (e) {}
        });
        return Session.get('getDistrictNameS');

    }
})
