import { Template } from 'meteor/templating';

Template.viewcpsimple.helpers({
    show() {
        Meteor.subscribe('getCP', Session.get('viewcpCID'), function() {}, function() {
            var cpdata = careplan.find({ "_id": Session.get('viewcpCID') }).fetch();
            Session.set('getCP', cpdata);
        });
        console.log(Session.get('viewcpCID'))
        console.log(Session.get("getCP"))
        return Session.get("getCP")[0];
    }
})

Template.viewcpsimple.events({
    'click .ptintcp' () {
        Router.go('/viewcpsimpleprint');
    }
});