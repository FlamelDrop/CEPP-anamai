import { Meteor } from "meteor/meteor";

Template.reportevatambon.onRendered(function () {
    Meteor.call('reportTambonInAmphoeAssessment', Session.get('viewTambonInAmphoe'), function (err, res) {
        //Meteor.call('reportTambonInAmphoeAssessment', 4121, function (err, res) {
        Session.set('tambonInAmphoeAssessment', res);
    })
});

Template.reportevatambon.helpers({
    zoneID() {
        return Session.get('ZoneViewProvinceEva');
    },
    provinceName() {
        return Session.get('tambonInAmphoeAssessment')[0].provinceName;
    },
    tambonInAmphoeAssessment() {
        return Session.get('tambonInAmphoeAssessment');
    },
    amphoeName() {
        return Session.get('tambonInAmphoeAssessment')[0].amphoeName;
    },
    verdictPassHidden() {
        return this.verdict === 'ผ่านเกณฑ์' ? "" : "hidden";
    },
    verdictFailHidden() {
        return this.verdict === 'ผ่านเกณฑ์' ? "hidden" : "";
    },
    c1Hidden() {
        return this.c1 ? "hidden" : "";
    },
    c2Hidden() {
        return this.c2 ? "hidden" : "";
    },
    c3Hidden() {
        return this.c3 ? "hidden" : "";
    },
    c4Hidden() {
        return this.c4 ? "hidden" : "";
    },
    c5Hidden() {
        return this.c5 ? "hidden" : "";
    },
    c6Hidden() {
        return this.c6 ? "hidden" : "";
    },
});

Template.reportevatambon.events({
    'click #viewtambon'(event, template) {
        Session.set('ZoneViewTambonEva', this.fullcode)
        Router.go('/reportevatambon')
    }
});


Router.route('/reportevatambon', function () {
    this.render('reportevatambon');
});

Template.registerHelper('checkeva', function (data) {
    if (data) {


        return ""

    } else {
        return Spacebars.SafeString("<span class='glyphicon glyphicon-remove' style='font-size:24px;color:red;'aria-hidden='true' ></span >")
    }
});

Template.registerHelper('checkeva4', function (data, c4_1, c4_2, c4_3, c4_4) {
    if (data) {

        if (typeof c4_1 != 'undefined' && typeof c4_2 != 'undefined' && typeof c4_3 != 'undefined' && typeof c4_4 != 'undefined') {
            var checktrue = [c4_1, c4_2, c4_3, c4_4].filter(v => v).length


            if (checktrue >= 2) {
                return ""
            } else {
                return Spacebars.SafeString("<span class='glyphicon glyphicon-remove' style='font-size:24px;color:red;'aria-hidden='true' ></span >")
            }
        } else {
            return Spacebars.SafeString("<span class='glyphicon glyphicon-remove' style='font-size:24px;color:red;'aria-hidden='true' ></span >")
        }

    } else {
        return Spacebars.SafeString("<span class='glyphicon glyphicon-remove' style='font-size:24px;color:red;'aria-hidden='true' ></span >")
    }
});

Template.registerHelper('checkcriterio', function (c1, c2, c3, c4, c4_1, c4_2, c4_3, c4_4) {
    if (c1 && c2 && c3 && c4) {

        if (typeof c4_1 != 'undefined' && typeof c4_2 != 'undefined' && typeof c4_3 != 'undefined' && typeof c4_4 != 'undefined') {
            var checktrue = [c4_1, c4_2, c4_3, c4_4].filter(v => v).length


            if (checktrue >= 2) {
                return Spacebars.SafeString("<label style='color:limegreen;font-weight:bold'>ผ่านเกณฑ์</label>");
            } else {
                return Spacebars.SafeString("<label style='color:red;font-weight:bol'>ไม่ผ่านเกณฑ์</label>");
            }
        }

    } else {
        return false
    }
});