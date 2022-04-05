import Chart from 'chart.js';
Template.districtindex.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.districtindex.onRendered(function () {
    // console.log(new Date().getFullYear());
    // console.log(Session.get('user').ZONE.toString());
    // console.log(Session.get('user').PROVINCE);
    // console.log(Session.get('user').DISTRICT);
    // console.log(Session.get('user').SUBDISTRICT);
    // console.log(Session.get('user'));

    //{"HOSPCODE.AMPHOE": { $regex: "แม่แตง"}}

    Meteor.call('getZoneDistrictApproveCGex', new Date().getFullYear(), Session.get('user').ZONE.toString(), Session.get('user').PROVINCE, Session.get('user').DISTRICT, function (error, result) {
        // console.log(result);
        Session.set('getZonelistApproveCGex', result)
    });

    Meteor.call('getlistDistrictcg', Session.get('user').DISTRICT, function (error, result) {
        var ctx = document.getElementById("myChartCG").getContext('2d');
        var all = result.all;
        var active = parseFloat((result.active * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.active * 100) / result.all).toFixed(2)) ? parseFloat((result.active * 100) / result.all).toFixed(2) : 0;
        var nonactiove = parseFloat((result.nonactiove * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.nonactiove * 100) / result.all).toFixed(2)) ? parseFloat((result.nonactiove * 100) / result.all).toFixed(2) : 0;
        var EXPIRED = parseFloat((result.EXPIRED * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.EXPIRED * 100) / result.all).toFixed(2)) ? parseFloat((result.EXPIRED * 100) / result.all).toFixed(2) : 0;
        var QUIT = parseFloat((result.QUIT * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.QUIT * 100) / result.all).toFixed(2)) ? parseFloat((result.QUIT * 100) / result.all).toFixed(2) : 0;
        var DEATH = parseFloat((result.DEATH * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.DEATH * 100) / result.all).toFixed(2)) ? parseFloat((result.DEATH * 100) / result.all).toFixed(2) : 0;
        var data = {
            labels: [
                "ดูแลผู้สูงอายุตาม Care Plan " + active + "%",
                "ยังไม่มีผู้สูงอายุในความดูแล " + nonactiove + "%",
                "ต้องได้รับการฟื้นฟูศักยภาพ " + EXPIRED + "%",
                "ลาออก " + QUIT + "%",
                "เสียชีวิต " + DEATH + "%",
            ],
            datasets: [{
                data: [result.active, result.nonactiove, result.EXPIRED, result.QUIT, result.DEATH],
                backgroundColor: [
                    "green",
                    "#0092ff",
                    "#ff00ff",
                    "orange",
                    "red"
                ]
            }]
        };
        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: data
        });
        Session.set('getCGDistrict', result)
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });
    Meteor.call('getlistDistrictcm', Session.get('user').DISTRICT, function (error, result) {
        var ctx = document.getElementById("myChartCM").getContext('2d');
        var all = result.all;
        var active = parseFloat((result.active * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.active * 100) / result.all).toFixed(2)) ? parseFloat((result.active * 100) / result.all).toFixed(2) : 0;
        var nonactiove = parseFloat((result.nonactiove * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.nonactiove * 100) / result.all).toFixed(2)) ? parseFloat((result.nonactiove * 100) / result.all).toFixed(2) : 0;
        var EXPIRED = parseFloat((result.EXPIRED * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.EXPIRED * 100) / result.all).toFixed(2)) ? parseFloat((result.EXPIRED * 100) / result.all).toFixed(2) : 0;
        var DEATH = parseFloat((result.DEATH * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.DEATH * 100) / result.all).toFixed(2)) ? parseFloat((result.DEATH * 100) / result.all).toFixed(2) : 0;
        var RETIRED = parseFloat((result.RETIRED * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.RETIRED * 100) / result.all).toFixed(2)) ? parseFloat((result.RETIRED * 100) / result.all).toFixed(2) : 0;
        var QUIT = parseFloat((result.QUIT * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.QUIT * 100) / result.all).toFixed(2)) ? parseFloat((result.QUIT * 100) / result.all).toFixed(2) : 0;
        var CHANGE = parseFloat((result.CHANGE * 100) / all).toFixed(2) > isNaN(parseFloat((result.CHANGE * 100) / all).toFixed(2)) ? parseFloat((result.CHANGE * 100) / all).toFixed(2) : 0;
        var data = {
            labels: [
                "CM ปฏิบัติการ " + active + "%",
                "CM บริหาร " + nonactiove + "%",
                "ต้องได้รับการฟื้นฟูศักยภาพ " + EXPIRED + "%",
                "เกษียณอายุการทำงาน " + RETIRED + "%",
                "ลาออก " + QUIT + "%",
                "เสียชีวิต " + DEATH + "%",
                "เปลี่ยนงาน / ย้ายงาน " + CHANGE + "%",
            ],
            datasets: [{
                data: [result.active, result.nonactiove, result.EXPIRED, result.RETIRED, result.QUIT, result.DEATH, result.CHANGE],
                backgroundColor: [
                    "green",
                    "#0092ff",
                    "#ff00ff",
                    "purple",
                    "orange",
                    "red",
                    "#6d726d"
                ]
            }]
        };
        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: data
        });
        Session.set('getCMDistrict', result)
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });

});
Template.districtindex.helpers({
    user() {
        return Session.get('user').NAME
    },
    countTypecg() {

        return Session.get('getCGDistrict')
    },
    countTypecm() {

        return Session.get('getCMDistrict')
    },
    getZonelistApproveCGex() {
        if (Session.get('getZonelistApproveCGex')) {
            return Session.get('getZonelistApproveCGex').length
        } else {
            return "0"
        }
    }
});

Template.districtindex.events({
    "click #allcg"() {
        // Session.set('listViewCG',Session.get('getCMDistrict').all);
        Session.set('IsDistrictSearchCG', true)
        Session.set('listViewCGName', "ทั้งหมด");
        Router.go('/DistrictViewCG')
    },
    "click #activecg"() {
        Session.set('IsDistrictSearchCG', true)
        Session.set('listViewCG', Session.get('getCGDistrict').active);
        Session.set('listViewCGName', "ดูแลผู้สูงอายุตาม Care Plan");
        Router.go('/DistrictViewCG')
    },
    "click #nonactivecg"() {
        Session.set('IsDistrictSearchCG', true)
        Session.set('listViewCG', Session.get('getCGDistrict').nonactiove);
        Session.set('listViewCGName', "ยังไม่มีผู้สูงอายุในความดูแล");
        Router.go('/DistrictViewCG')
    },
    "click #DEATHcg"() {
        Session.set('IsDistrictSearchCG', true)
        Session.set('listViewCG', Session.get('getCGDistrict').DEATH);
        Session.set('listViewCGName', "เสียชีวิต");
        Router.go('/DistrictViewCG')
    },
    "click #QUITcg"() {
        Session.set('IsDistrictSearchCG', true)
        Session.set('listViewCG', Session.get('getCGDistrict').QUIT);
        Session.set('listViewCGName', "ลาออก");
        Router.go('/DistrictViewCG')
    },
    "click #EXPIREDcg"() {
        Session.set('IsDistrictSearchCG', true)
        Session.set('listViewCG', Session.get('getCGDistrict').EXPIRED);
        Session.set('listViewCGName', "ต้องได้รับการฟื้นฟูศักยภาพ");
        Router.go('/DistrictViewCG')
    },
    "click #allcm"() {
        // Session.set('listViewCM',Session.get('getCMDistrict').all);
        Session.set('IsDistrictSearchCM', true)
        Session.set('listViewCMName', "ทั้งหมด");
        Router.go('/DistrictViewCM')
    },
    "click #activecm"() {
        Session.set('IsDistrictSearchCM', true)
        Session.set('listViewCM', Session.get('getCMDistrict').active);
        Session.set('listViewCMName', "CM ปฏิบัติการ");
        Router.go('/DistrictViewCM')
    },
    "click #nonactivecm"() {
        Session.set('IsDistrictSearchCM', true)
        Session.set('listViewCM', Session.get('getCMDistrict').nonactiove);
        Session.set('listViewCMName', "CM บริหาร");
        Router.go('/DistrictViewCM')
    },
    "click #DEATHcm"() {
        Session.set('IsDistrictSearchCM', true)
        Session.set('listViewCM', Session.get('getCMDistrict').DEATH);
        Session.set('listViewCMName', "เสียชีวิต");
        Router.go('/DistrictViewCM')
    },
    "click #RETIREDcm"() {
        Session.set('IsDistrictSearchCM', true)
        Session.set('listViewCM', Session.get('getCMDistrict').RETIRED);
        Session.set('listViewCMName', "เกษียณอายุการทำงาน");
        Router.go('/DistrictViewCM')
    },
    "click #EXPIREDcm"() {
        Session.set('IsDistrictSearchCM', true)
        Session.set('listViewCM', Session.get('getCMDistrict').EXPIRED);
        Session.set('listViewCMName', "ต้องได้รับการฟื้นฟูศักยภาพ");
        Router.go('/DistrictViewCM')
    },
    "click #QUITcm"() {
        Session.set('IsDistrictSearchCM', true)
        Session.set('listViewCM', Session.get('getCMDistrict').QUIT);
        Session.set('listViewCMName', "ลาออก");
        Router.go('/DistrictViewCM')
    },
    "click #CHANGEcm"() {
        Session.set('IsDistrictSearchCM', true)
        Session.set('listViewCM', Session.get('getCMDistrict').CHANGE);
        Session.set('listViewCMName', "เปลี่ยนงาน / ย้ายงาน");
        Router.go('/DistrictViewCM')
    }
});
