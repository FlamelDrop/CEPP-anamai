Template.printcpsimple_sign.onRendered(function(){
	window.print();
    Router.go('/careplanhistory')
});

Template.printcpsimple_sign.helpers({
	datasimplecp(){
		return Session.get('printsimple');
	}

});