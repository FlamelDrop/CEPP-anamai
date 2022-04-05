Template.searchelder.onRendered(function () {
    if (Session.get('elderID')) {
        Meteor.call('elderbycid', Session.get('elderID').CID, function (error, result) {
            Session.set('eldercp', result);
        });
    }
    if (Session.get('datacpElder')) {
        $('#phone').val(Session.get('datacpElder').PHONE)
    } else {
        $('#phone').val(Session.get('eldercp')[0].PHONE)
    }

    // $('#cidinput').val(Session.get('elderID').CID);


});
Template.searchelder.helpers({
    showname() {
        return Session.get("cmname");
    },
    profile() {
        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    eldercp() {
        if (Session.get('eldercp')) {
            return Session.get('eldercp')[0];
        }
    },
    editcareplan() {
        return Session.get('datacpElder');
    }
})

Template.searchelder.events({
    'click #search'() { },
    'click #nowaddressbtn'() {
        $('#nowaddress').val(Session.get('eldercp')[0].ADDRESS)
    },
    'click .back'() {
        Router.go('/careplanhistory')
        Session.set('viewProfile', false)
        Session.set('viewCG', false)
        Session.set('viewElder', true)
        Session.set('viewBetterElder', false)
        Session.set('viewDeathElder', false)
        Session.set('viewCmEvaluate', false)
    },
    'click .next'() {
        if (Session.get('datacpElder').CAREPLANID) {
            var obj2 = Session.get('datacpElder')
            obj2.CURRENTADDRESS = $('#nowaddress').val();
            obj2.PHONE = $('#phone').val();
            Session.set('datacpElder', obj2);
            // console.log(Session.get('datacpElder'))
            Router.go('/simplecareplan')
        } else {
            var obj = {
                'CID': Session.get('elderID').CID,
                'CURRENTADDRESS': $('#nowaddress').val(),
                'PHONE': $('#phone').val(),
            }
            Session.set('datacpElder', obj);
            Router.go('/simplecareplan')
        }


    }
})