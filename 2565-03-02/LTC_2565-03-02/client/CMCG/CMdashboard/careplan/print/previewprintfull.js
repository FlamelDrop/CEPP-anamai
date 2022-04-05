
Template.previewprintfull.onRendered(function(){
	Meteor.call('listcareACTIVITY', Session.get('printsimple')._id, function(error, result) {
        Session.set('listcareACTIVITY', result);
    });
    Meteor.call('getAllServiceCenterDistrict', Session.get('printsimple').HOSPCODE, function (error, result) {
    	Session.set('HOSPCODE', result);
    });
});

Template.previewprintfull.helpers({
	datasimplecp(){
		return Session.get('printsimple');
	},
	listcare() {
        return Session.get('listcareACTIVITY');
    },
    HOSPCODE(){
    	return Session.get('HOSPCODE');
    }
});

Template.previewprintfull.events({
	'click #printcp'(){
		Router.go('/printcpfull')
	},
	'click #printcp2'(){
		Router.go('/printcpfull2')
	}
})
