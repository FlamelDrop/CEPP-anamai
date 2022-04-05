import { Template } from 'meteor/templating';

Template.printcp.onRendered(function helloOnCreated() {
    window.print();
    window.history.back();
});

Template.printcp.helpers({
    show() {
        Meteor.subscribe('getCP', Session.get('viewcpCID'), function() {}, function() {
            var cpdata = careplan.find({ "_id": Session.get('viewcpCID') }).fetch();
            Session.set('getCP', cpdata);
        });
        return Session.get("getCP")[0];
    }
})
