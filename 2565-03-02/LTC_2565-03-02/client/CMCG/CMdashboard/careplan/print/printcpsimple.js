Template.printcpsimple.onRendered(function(){
	window.print();
    Router.go('/careplanhistory')
});

Template.printcpsimple.helpers({
	datasimplecp(){
		return Session.get('printsimple');
	}

});