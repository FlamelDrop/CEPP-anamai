import Chart from 'chart.js';
Template.province.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.province.onRendered(function () {

    Meteor.call('getlistcg', Session.get('user').PROVINCENAME, function (error, result) {
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
                data: [result.active, result.nonactiove, result.EXPIRED,result.QUIT,result.DEATH],
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
        Session.set('getCGProvince', result)
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });
    Meteor.call('getlistcm', Session.get('user').PROVINCENAME, function (error, result) {
        var ctx = document.getElementById("myChartCM").getContext('2d');
        var all = result.all;
        var active = parseFloat((result.active * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.active * 100) / result.all).toFixed(2)) ? parseFloat((result.active * 100) / result.all).toFixed(2) : 0;
        var nonactiove = parseFloat((result.nonactiove * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.nonactiove * 100) / result.all).toFixed(2)) ? parseFloat((result.nonactiove * 100) / result.all).toFixed(2) : 0;
        var EXPIRED = parseFloat((result.EXPIRED * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.EXPIRED * 100) / result.all).toFixed(2)) ? parseFloat((result.EXPIRED * 100) / result.all).toFixed(2) : 0;
        var DEATH = parseFloat((result.DEATH * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.DEATH * 100) / result.all).toFixed(2)) ? parseFloat((result.DEATH * 100) / result.all).toFixed(2) : 0;
        var RETIRED = parseFloat((result.RETIRED * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.RETIRED * 100) / result.all).toFixed(2)) ? parseFloat((result.RETIRED * 100) / result.all).toFixed(2) : 0;
        var QUIT = parseFloat((result.QUIT * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.QUIT * 100) / result.all).toFixed(2)) ? parseFloat((result.QUIT * 100) / result.all).toFixed(2) : 0;
        var CHANGE = parseFloat((result.CHANGE * 100) / result.all).toFixed(2) > isNaN(parseFloat((result.CHANGE * 100) / result.all).toFixed(2)) ? parseFloat((result.CHANGE * 100) / result.all).toFixed(2) : 0;

        var data = {
            labels: [
                "CM ปฏิบัติการ " + active + "%",
                "CM บริหาร " + nonactiove + "%",
                "ต้องได้รับการฟื้นฟูศักยภาพ " + EXPIRED + "%",
                "เกษียณอายุการทำงาน " + RETIRED + "%",
                "ลาออก " + QUIT + "%",
                "เสียชีวิต " + DEATH + "%",
                "เปลี่ยนงาน / ย้ายงาน " + CHANGE + "%"
            ],
            datasets: [{
                data: [result.active, result.nonactiove, result.EXPIRED, result.RETIRED,result.QUIT,result.DEATH,result.CHANGE],
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
        Session.set('getCMProvince', result)
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });
    Meteor.call('getlistcgapprove', Session.get('user').PROVINCENAME, function (error, result) {
        Session.set('getlistcgapprove', result)
    });

    Meteor.call('getProvinceApproveSecondaryHosp', Session.get('user').PROVINCENAME, function (error, result) {
        // console.log(result);
        Session.set('getProvinceApproveSecondaryHosp', result)
    });
    Meteor.call('getProvinceListSecondaryHosp', Session.get('user').PROVINCENAME, function (error, result) {
        // console.log(result);
        Session.set('getProvinceListSecondaryHosp', result)
    });

    
    var zone = Session.get('user').ZONE

    // console.log(Session.get('user'));
    // console.log(checkZone(zone));

    Meteor.call('getZoneProvinceApproveCGex', new Date().getFullYear(), checkZone(zone), Session.get('user').PROVINCENAME, function (error, result) {
        // console.log(result);
        Session.set('getZonelistApproveCGex', result)
    });
});
Template.province.helpers({
    user() {
        return Session.get('user').PROVINCENAME
    },
    countcg() {
        if(Session.get('getlistcgapprove'))
        return Session.get('getlistcgapprove').length;
    },
    countTypecg() {

        return Session.get('getCGProvince')
    },
    countTypecm() {

        return Session.get('getCMProvince')
    },
    countcmSecondHosp(){
        return  Session.get('getProvinceListSecondaryHosp').length
     },
     countSecondayHosp(){
         return Session.get('getProvinceApproveSecondaryHosp').length
     },
     getZonelistApproveCGex() {
        if (Session.get('getZonelistApproveCGex')) {
            return Session.get('getZonelistApproveCGex').length
        } else {
            return "0"
        }
    }
});

Template.province.events({
    "click #allhosp"(){
        Router.go('/provincelisthosp')
    },
    "click #allcg"() {
        // Session.set('listViewCG',Session.get('getCMProvince').all);
        Session.set('IsProvinceSearchCG', true)
        Session.set('listViewCGName', "ทั้งหมด");
        Router.go('/provinceViewCG')
    },
    "click #activecg"() {
        Session.set('IsProvinceSearchCG', true)
        Session.set('listViewCG', Session.get('getCGProvince').active);
        Session.set('listViewCGName', "ดูแลผู้สูงอายุตาม Care Plan");
        Router.go('/provinceViewCG')
    },
    "click #nonactivecg"() {
        Session.set('IsProvinceSearchCG', true)
        Session.set('listViewCG', Session.get('getCGProvince').nonactiove);
        Session.set('listViewCGName', "ยังไม่มีผู้สูงอายุในความดูแล");
        Router.go('/provinceViewCG')
    },
    "click #DEATHcg"() {
        Session.set('IsProvinceSearchCG', true)
        Session.set('listViewCG', Session.get('getCGProvince').DEATH);
        Session.set('listViewCGName', "เสียชีวิต");
        Router.go('/provinceViewCG')
    },
    "click #QUITcg"() {
        Session.set('IsProvinceSearchCG', true)
        Session.set('listViewCG', Session.get('getCGProvince').QUIT);
        Session.set('listViewCGName', "ลาออก");
        Router.go('/provinceViewCG')
    },
    "click #EXPIREDcg"() {
        Session.set('IsProvinceSearchCG', true)
        Session.set('listViewCG', Session.get('getCGProvince').EXPIRED);
        Session.set('listViewCGName', "ต้องได้รับการฟื้นฟูศักยภาพ");
        Router.go('/provinceViewCG')
    },
    "click #allcm"() {
        // Session.set('listViewCM',Session.get('getCMProvince').all);
        Session.set('IsProvinceSearchCM', true)
        Session.set('listViewCMName', "ทั้งหมด");
        Router.go('/provinceViewCM')
    },
    "click #activecm"() {
        Session.set('IsProvinceSearchCM', true)
        Session.set('listViewCM', Session.get('getCMProvince').active);
        Session.set('listViewCMName', "CM ปฏิบัติการ");
        Router.go('/provinceViewCM')
    },
    "click #nonactivecm"() {
        Session.set('IsProvinceSearchCM', true)
        Session.set('listViewCM', Session.get('getCMProvince').nonactiove);
        Session.set('listViewCMName', "CM บริหาร");
        Router.go('/provinceViewCM')
    },
    "click #DEATHcm"() {
        Session.set('IsProvinceSearchCM', true)
        Session.set('listViewCM', Session.get('getCMProvince').DEATH);
        Session.set('listViewCMName', "เสียชีวิต");
        Router.go('/provinceViewCM')
    },
    "click #RETIREDcm"() {
        Session.set('IsProvinceSearchCM', true)
        Session.set('listViewCM', Session.get('getCMProvince').RETIRED);
        Session.set('listViewCMName', "เกษียณอายุการทำงาน");
        Router.go('/provinceViewCM')
    },
    "click #EXPIREDcm"() {
        Session.set('IsProvinceSearchCM', true)
        Session.set('listViewCM', Session.get('getCMProvince').EXPIRED);
        Session.set('listViewCMName', "ต้องได้รับการฟื้นฟูศักยภาพ");
        Router.go('/provinceViewCM')
    },
    "click #QUITcm"() {
        Session.set('IsProvinceSearchCM', true)
        Session.set('listViewCM', Session.get('getCMProvince').QUIT);
        Session.set('listViewCMName', "ลาออก");
        Router.go('/provinceViewCM')
    },
    "click #CHANGEcm"() {
        Session.set('IsProvinceSearchCM', true)
        Session.set('listViewCM', Session.get('getCMProvince').CHANGE);
        Session.set('listViewCMName', "เปลี่ยนงาน / ย้ายงาน");
        Router.go('/provinceViewCM')
    },
    
});


function checkZone(x) {
    if(x => 1 && x <= 9){
        return "0"+ x
    }else{
        return x
    }
}