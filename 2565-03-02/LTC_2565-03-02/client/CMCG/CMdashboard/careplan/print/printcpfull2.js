Template.printcpfull2.onRendered(function() {
    Meteor.call('listcareACTIVITY', Session.get('printsimple')._id, function(error, result) {
        Session.set('listcareACTIVITY', result);
    });
    Meteor.call('getAllServiceCenterDistrict', Session.get('printsimple').HOSPCODE, function (error, result) {
        Session.set('HOSPCODE', result);
    });
    setTimeout(function() {
        window.print();
        Router.go('/careplanhistory')

    }, 500);
});

Template.printcpfull2.helpers({
    datasimplecp() {
        return Session.get('printsimple');
    },
    listcare() {

        return Session.get('listcareACTIVITY');
    },
    HOSPCODE(){
        return Session.get('HOSPCODE');
    }
});
