import { Template } from 'meteor/templating';

Template.viewcp.helpers({
    show() {
        Meteor.subscribe('getCP', Session.get('viewcpCID'), function() {}, function() {
            var cpdata = careplan.find({ "_id": Session.get('viewcpCID') }).fetch();
            Session.set('getCP', cpdata);
            console.log(Session.get("getCP"))
        });
        return Session.get("getCP")[0];
    }
})

Template.viewcp.events({
    'click .ptintcp' () {
        Router.go('/printcp');
    },
    'click .goindex' () {
        Router.go('/');
    }
});
