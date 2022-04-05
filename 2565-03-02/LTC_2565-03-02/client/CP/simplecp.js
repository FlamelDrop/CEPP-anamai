import { Template } from 'meteor/templating';

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

Template.simplecp.onRendered(function helloOnCreated() {
    Session.set("CIDShow", null);
    Session.set('id', makeid());
    // console.log(Session.get('id'))
    $('#createDate').datepicker({
        format: 'dd/mm/yyyy',
        locale: 'th',
    })
    setTimeout(function() {
        $('#diagnose').selectize({
            create: function(input) {
                autocom.insert({
                    "textcomplete": input,
                    "type": "วินิจฉัย",
                    "timestamp": new Date()
                })
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#policyLiving').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#policyComplaint').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#policyRecognition').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#policySocial').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#talk').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#policyExcretion').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#policyEat').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#policySupport').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#policyCaretaker').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#shortCare').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#longCare').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#warnningService').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#adlgroup').selectize();
        $('#moneySuport').selectize({
            create: function(input) {
                autocom.insert({
                    "textcomplete": input,
                    "type": "เงินสนับสนุน",
                    "timestamp": new Date()
                })
                return { value: input, text: input };
            },
            sortField: 'text'
        });
        $('#careSuport').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function(input) {
                return {
                    value: input,
                    text: input
                }
            }
        });
        // $('#6mon').selectize({options:[{text:'cat',value:'cat'},{text:'dog',value:'dog'},{text:'snake',value:'snake'}]});

    }, 500)
});

Template.simplecp.helpers({
    listdiagnose() {
        Meteor.subscribe('getAutoComplete', "วินิจฉัย", function() {}, function() {
            Session.set('listdiagnose', autocom.find({ type: "วินิจฉัย" }).fetch());
        });
        return Session.get('listdiagnose');
    },
    listpolicyLiving() {
        Meteor.subscribe('getAutoComplete', "สภาพชีวิต", function() {}, function() {
            Session.set('listpolicyLiving', autocom.find({ type: "สภาพชีวิต" }).fetch());
        });
        return Session.get('listpolicyLiving');
    },
    listpolicyComplaint() {
        Meteor.subscribe('getAutoComplete', "คำร้องเรียนหลัก", function() {}, function() {
            Session.set('listpolicyComplaint', autocom.find({ type: "คำร้องเรียนหลัก" }).fetch());
        });
        return Session.get('listpolicyComplaint');
    },
    listpolicyRecognition() {
        Meteor.subscribe('getAutoComplete', "การรับรู้", function() {}, function() {
            Session.set('listpolicyRecognition', autocom.find({ type: "การรับรู้" }).fetch());
        });
        return Session.get('listpolicyRecognition');
    },
    listpolicySocial() {
        Meteor.subscribe('getAutoComplete', "การคบหาสมาคม", function() {}, function() {
            Session.set('listpolicySocial', autocom.find({ type: "การคบหาสมาคม" }).fetch());
        });
        return Session.get('listpolicySocial');
    },
    listtalk() {
        Meteor.subscribe('getAutoComplete', "การสื่อสาร", function() {}, function() {
            Session.set('listtalk', autocom.find({ type: "การสื่อสาร" }).fetch());
        });
        return Session.get('listtalk');
    },
    listpolicyExcretion() {
        Meteor.subscribe('getAutoComplete', "การขับถ่าย", function() {}, function() {
            Session.set('listpolicyExcretion', autocom.find({ type: "การขับถ่าย" }).fetch());
        });
        return Session.get('listpolicyExcretion');
    },
    listpolicyEat() {
        Meteor.subscribe('getAutoComplete', "การรับประทานอาหาร", function() {}, function() {
            Session.set('listpolicyEat', autocom.find({ type: "การรับประทานอาหาร" }).fetch());
        });
        return Session.get('listpolicyEat');
    },
    listpolicySupport() {
        Meteor.subscribe('getAutoComplete', "การดูแล", function() {}, function() {
            Session.set('listpolicySupport', autocom.find({ type: "การดูแล" }).fetch());
        });
        return Session.get('listpolicySupport');
    },
    listpolicyCaretaker() {
        Meteor.subscribe('getAutoComplete', "ผู้ให้การดูแล", function() {}, function() {
            Session.set('listpolicyCaretaker', autocom.find({ type: "ผู้ให้การดูแล" }).fetch());
        });
        return Session.get('listpolicyCaretaker');
    },
    listshortCare() {
        Meteor.subscribe('getAutoComplete', "ระยะสั้น", function() {}, function() {
            Session.set('listshortCare', autocom.find({ type: "ระยะสั้น" }).fetch());
        });
        return Session.get('listshortCare');
    },
    listlongCare() {
        Meteor.subscribe('getAutoComplete', "ระยะยาว", function() {}, function() {
            Session.set('listlongCare', autocom.find({ type: "ระยะยาว" }).fetch());
        });
        return Session.get('listlongCare');
    },
    listwarnningService() {
        Meteor.subscribe('getAutoComplete', "ข้อควรระวังในการให้บริการ", function() {}, function() {
            Session.set('listwarnningService', autocom.find({ type: "ข้อควรระวังในการให้บริการ" }).fetch());
        });
        return Session.get('listwarnningService');
    },
    listmoneySuport() {
        Meteor.subscribe('getAutoComplete', "เงินสนับสนุน", function() {}, function() {
            Session.set('listmoneySuport', autocom.find({ type: "เงินสนับสนุน" }).fetch());
        });
        return Session.get('listmoneySuport');
    }
})
Template.simplecp.events({
    'click #save' () {
        $('#myModal').modal('hide');
        var formatdate = $('#DateMof').val().split('/')[1] + "-" + $('#DateMof').val().split('/')[0] + "-" + $('#DateMof').val().split('/')[2];
        Session.set('elderDetail', {
            "_id": Session.get('id'),
            "cid": Session.get("elderDetail").cid,
            "eldername": Session.get("elderDetail").eldername,
            "fulladdress": Session.get("elderDetail").fulladdress,
            "bird": Session.get("elderDetail").bird,
            "phone": Session.get("elderDetail").phone,
            "createDate": new Date(formatdate),
            "diagnose": $('#diagnose').val(),
            "group": $("#adlgroup").val(),
            "moneySuport": $('#moneySuport').val(),
            "policySupport": {
                "living": $('#policyLiving').val(),
                "complaint": $('#policyComplaint').val(),
                "recognition": $('#policyRecognition').val(),
                "social": $('#policySocial').val(),
                "excretion": $('#policyExcretion').val(),
                "eat": $('#policyEat').val(),
                "suport": $('#policySupport').val(),
                "caretaker": $('#policyCaretaker').val(),
                "talk": $('#talk').val()
            },
            "help": {
                "short": $('#shortCare').val(),
                "long": $('#longCare').val()
            },
            "care": $('#careSuport').val(),
            "caution": $('#warnningService').val(),
            "cmname": Session.get('cmname'),
            "cmid": Session.get('cmid'),
            "cmservice": Session.get('cmservice'),
            "cmdla": Session.get('cmdla'),
            "cmdla_code": Session.get('cmdla_code'),
            "cmservice_code": Session.get('cmservice_code'),
            "cmprovince": Session.get('cmprovince'),
            "cmdistrict": Session.get('cmdistrict'),
            "cmznum": Session.get('cmznum')
        })
        careplan.insert(Session.get("elderDetail"));
        setTimeout(function() {
            Router.go('/cpindex');
        }, 500)
    },
    'click #createCP' () {
        $('#myModal').modal('hide');
        var formatdate = $('#DateMof').val().split('/')[1] + "-" + $('#DateMof').val().split('/')[0] + "-" + $('#DateMof').val().split('/')[2];
        Session.set('elderDetail', {
            "_id": Session.get('id'),
            "cid": Session.get("elderDetail").cid,
            "eldername": Session.get("elderDetail").eldername,
            "fulladdress": Session.get("elderDetail").fulladdress,
            "bird": Session.get("elderDetail").bird,
            "phone": Session.get("elderDetail").phone,
            "createDate": new Date(formatdate),
            "diagnose": $('#diagnose').val(),
            "group": $("#adlgroup").val(),
            "moneySuport": $('#moneySuport').val(),
            "policySupport": {
                "living": $('#policyLiving').val(),
                "complaint": $('#policyComplaint').val(),
                "recognition": $('#policyRecognition').val(),
                "social": $('#policySocial').val(),
                "excretion": $('#policyExcretion').val(),
                "eat": $('#policyEat').val(),
                "suport": $('#policySupport').val(),
                "caretaker": $('#policyCaretaker').val(),
                "talk": $('#talk').val()
            },
            "help": {
                "short": $('#shortCare').val(),
                "long": $('#longCare').val()
            },
            "care": $('#careSuport').val(),
            "caution": $('#warnningService').val()
        })
        setTimeout(function() {
            Router.go('/createCP');
        }, 500)
    }
});