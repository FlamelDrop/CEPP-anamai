import { Template } from 'meteor/templating';

Template.simplecpfirst.onRendered(function helloOnCreated() {
    Session.set("CIDShow", null);

});

Template.simplecpfirst.helpers({
    show() {
        return Session.get("CIDShow")
    },
    dated() {
        return new Date();
    },
    showdetail() {
        return Session.get("elderDetail")
    }
})
Template.simplecpfirst.events({
    'click .next' () {
         Session.set('elderDetail',{
            "cid": Session.get("elderDetail").cid,
            "eldername": Session.get("elderDetail").eldername,
            "fulladdress": $('#nowaddress').val(),
            "bird": Session.get("elderDetail").bird,
            "phone": phone = $('#phone').val()
        })
        Router.go('/simplecp');

    },
    'click #click' () {
        Meteor.subscribe('getElderByCid', $('#cidinput').val(), function() {}, function() {
            var cpdata = elder.find({ "eid": $('#cidinput').val() }).fetch()[0];
            if(cpdata){
                Session.set("elderDetail", {
                    "cid": cpdata.eid,
                    "eldername": cpdata.eldername,
                    "fulladdress": cpdata.fulladdress,
                    "bird": new Date(cpdata.bird)
                });
                Session.set("CIDShow", true)
            }else{
                 Session.set("elderDetail", null);
                Session.set("CIDShow", null)
                alert('ไม่พบข้อมูลผู้สูงอายุ');
            }
            
        });
    },
    'click #nowaddressbtn' () {
        $('#nowaddress').val(Session.get("elderDetail").fulladdress);
    },


});

