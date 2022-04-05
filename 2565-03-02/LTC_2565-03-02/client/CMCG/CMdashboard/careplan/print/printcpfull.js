Template.printcpfull.onRendered(function() {

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

Template.printcpfull.helpers({
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
