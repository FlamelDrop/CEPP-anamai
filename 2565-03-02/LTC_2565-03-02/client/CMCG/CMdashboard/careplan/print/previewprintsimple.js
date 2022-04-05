Template.previewprintcpsimple.onRendered(function(){

});

Template.previewprintcpsimple.helpers({
	datasimplecp(){
		return Session.get('printsimple');
	}
});

Template.previewprintcpsimple.events({
	'click #printcp'(){
		Router.go('/printcpsimple')
	},
	'click #print_sign_cp'(){
		Router.go('/printcpsimple_sign')
	}
})