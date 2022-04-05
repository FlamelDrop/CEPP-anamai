import Chart from 'chart.js';
Template.hpcindex.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.hpcindex.onRendered(function () {

    ////console.log(Session.get('user').ZONE);
    

    Meteor.call('getZonelistcgapprove', Session.get('user').ZONE, function (error, result) {
        Session.set('getlistzonecgapprove', result)
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });

    Meteor.call('getZonelistSecondaryHosp', Session.get('user').ZONE, function (error, result) {
        ////console.log(result);
        Session.set('getZonelistSecondaryHosp', result)
    });
    // kanut 
    Meteor.call('getZonelistHistoryHosp', Session.get('user').ZONE, function (error, result) {
        ////console.log(result);
        Session.set('getZonelistHistoryHosp', result)
    });
    Meteor.call('ZonelistSecondaryHosp', Session.get('user').ZONE, function (error, result) {
        // ////console.log(result);
        Session.set('ZonelistSecondaryHosp', result)
    });
    
    Meteor.call('getZonelistApproveCMex', null, Session.get('user').ZONE.toString(), function (error, result) {
        // ////console.log(result);
        Session.set('getZonelistApproveCMex', result)
    });

    Meteor.call('getZonelistApproveCGex', new Date().getFullYear(), Session.get('user').ZONE.toString(), function (error, result) {
        // ////console.log(result);
        Session.set('getZonelistApproveCGex', result)
    });
    //====================================================================================
    //================================CG==================================================
    Meteor.call('getZonelistcg', Session.get('user').ZONE, function (error, result) {
        var ctx = document.getElementById("myChartCG").getContext('2d');
        var ex = Session.get('getZonelistApproveCGex').length;
        var all = parseInt(result.all + ex - result.EXPIRED);
        var active = parseFloat((result.active * 100) / all).toFixed(2) > isNaN(parseFloat((result.active * 100) / all).toFixed(2)) ? parseFloat((result.active * 100) / all).toFixed(2) : 0;
        var nonactiove = parseFloat((result.nonactiove * 100) / all).toFixed(2) > isNaN(parseFloat((result.nonactiove * 100) / all).toFixed(2)) ? parseFloat((result.nonactiove * 100) / all).toFixed(2) : 0;
        var EXPIRED = parseFloat((ex * 100) / all).toFixed(2) > isNaN(parseFloat((ex * 100) / all).toFixed(2)) ? parseFloat((ex * 100) / all).toFixed(2) : 0;
        var QUIT = parseFloat((result.QUIT * 100) / all).toFixed(2) > isNaN(parseFloat((result.QUIT * 100) / all).toFixed(2)) ? parseFloat((result.QUIT * 100) / all).toFixed(2) : 0;
        var DEATH = parseFloat((result.DEATH * 100) / all).toFixed(2) > isNaN(parseFloat((result.DEATH * 100) / all).toFixed(2)) ? parseFloat((result.DEATH * 100) / all).toFixed(2) : 0;
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
        Session.set('getCGByZone', result)
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });
    //=================================CM=================================================
    Meteor.call('getZonelistCM', Session.get('user').ZONE, function (error, result) {
        var ctx = document.getElementById("myChartCM").getContext('2d');

        var ex = Session.get('getZonelistApproveCMex').length;
        var all = parseInt(result.all + ex - result.EXPIRED);
        var active = parseFloat((result.active * 100) / all).toFixed(2) > isNaN(parseFloat((result.active * 100) / all).toFixed(2)) ? parseFloat((result.active * 100) / all).toFixed(2) : 0;
        var nonactiove = parseFloat((result.nonactiove * 100) / all).toFixed(2) > isNaN(parseFloat((result.nonactiove * 100) / all).toFixed(2)) ? parseFloat((result.nonactiove * 100) / all).toFixed(2) : 0;
        var EXPIRED = parseFloat((ex * 100) / all).toFixed(2) > isNaN(parseFloat((ex * 100) / all).toFixed(2)) ? parseFloat((ex * 100) / all).toFixed(2) : 0;
        var RETIRED = parseFloat((result.RETIRED * 100) / all).toFixed(2) > isNaN(parseFloat((result.RETIRED * 100) / all).toFixed(2)) ? parseFloat((result.RETIRED * 100) / all).toFixed(2) : 0;
        var QUIT = parseFloat((result.QUIT * 100) / all).toFixed(2) > isNaN(parseFloat((result.QUIT * 100) / all).toFixed(2)) ? parseFloat((result.QUIT * 100) / all).toFixed(2) : 0;
        var DEATH = parseFloat((result.DEATH * 100) / all).toFixed(2) > isNaN(parseFloat((result.DEATH * 100) / all).toFixed(2)) ? parseFloat((result.DEATH * 100) / all).toFixed(2) : 0;
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
                data: [result.active, result.nonactiove, result.EXPIRED, result.RETIRED, result.QUIT, result.DEATH,result.CHANGE],
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
        Session.set('getCMByZone', result)
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });

    //console.log(Session.get('user').ZONE);
    
    Meteor.call('getZonelistApproveCM', Session.get('user').ZONE, function (error, result) {        
        Session.set('getlistzoneCMapprove', result)

        Meteor.call('getZonelistApproveDISTRICT', Session.get('user').ZONE, function (error, result) {  
            //console.log(result);
            Session.set('getlistzoneDISTRICTapprove', result)
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        })
    });

    //====================================================================================
});

Template.hpcindex.helpers({
    user() {
        return Session.get('user').NAME
    },
    countcg() {
        if (Session.get('getlistzonecgapprove')) {
            return Session.get('getlistzonecgapprove').length;
        } else {
            return "0"
        }
    },
    countTypecg() {

        return Session.get('getCGByZone')
    },
    countDISTRICT() {
        if (Session.get('getlistzoneDISTRICTapprove')) {
            return Session.get('getlistzoneDISTRICTapprove').length;
        } else {
            return "0"
        }
    },
    countcm() {
        if (Session.get('getlistzoneCMapprove')) {
            return Session.get('getlistzoneCMapprove').length;
        } else {
            return "0"
        }
    },
    countTypecm() {

        return Session.get('getCMByZone')
    },
    countcmSecondHosp(){
       return  Session.get('ZonelistSecondaryHosp').length
    },
    countSecondayHosp(){
        return Session.get('getZonelistSecondaryHosp').length
    },
    countHistoryHosp(){
        return Session.get('getZonelistHistoryHosp').length
    },
    getZonelistApproveCMex() {
        if (Session.get('getZonelistApproveCMex')) {
            return Session.get('getZonelistApproveCMex').length
        } else {
            return "0"
        }
    },
    getZonelistApproveCGex() {
        if (Session.get('getZonelistApproveCGex')) {
            return Session.get('getZonelistApproveCGex').length
        } else {
            return "0"
        }
    }
})

Template.hpcindex.events({
    "click #allhosp"(){
        Router.go('/hpclistcmsecondhosp')
    },
    "click #allcg"() {
        // Session.set('listZoneViewCGState',Session.get('getCMProvince').all);
        Session.set('IsHpcSearchCG', true)
        Session.set('listZoneViewCGName', "ทั้งหมด");
        Router.go('/hpcviewcg')
    },
    "click #activecg"() {
        Session.set('IsHpcSearchCG', true)
        Session.set('listZoneViewCGState', Session.get('getCGByZone').active);
        Session.set('listZoneViewCGName', "ดูแลผู้สูงอายุตาม Care Plan");
        Router.go('/hpcviewcg')
    },
    "click #nonactivecg"() {
        Session.set('IsHpcSearchCG', true)
        Session.set('listZoneViewCGState', Session.get('getCGByZone').nonactiove);
        Session.set('listZoneViewCGName', "ยังไม่มีผู้สูงอายุในความดูแล");
        Router.go('/hpcviewcg')
    },
    "click #EXPIREDcg"() {
        // Session.set('IsHpcSearchCG', true)
        // Session.set('listZoneViewCGState', Session.get('getCGByZone').EXPIRED);
        // Session.set('listZoneViewCGName', "ต้องได้รับการฟื้นฟูศักยภาพ");
        Router.go('/hpcapprovecgex')
    },
    "click #QUITcg"() {
        Session.set('IsHpcSearchCG', true)
        Session.set('listZoneViewCGState', Session.get('getCGByZone').QUIT);
        Session.set('listZoneViewCGName', "ลาออก");
        Router.go('/hpcviewcg')
    },
    "click #DEATHcg"() {
        Session.set('IsHpcSearchCG', true)
        Session.set('listZoneViewCGState', Session.get('getCGByZone').DEATH);
        Session.set('listZoneViewCGName', "เสียชีวิต");
        Router.go('/hpcviewcg')
    },
    "click #allcm"() {
        Session.set('IsHpcSearch', true)
        // Session.set('listZoneViewCMState',Session.get('getCMProvince').all);
        Session.set('listZoneViewCMName', "ทั้งหมด");
        Router.go('/hpcviewcm')
    },
    "click #activecm"() {
        Session.set('IsHpcSearch', true)
        Session.set('listZoneViewCMState', Session.get('getCMByZone').active);
        Session.set('listZoneViewCMName', "CM ปฏิบัติการ");
        Router.go('/hpcviewcm')
    },
    "click #nonactivecm"() {
        Session.set('IsHpcSearch', true)
        Session.set('listZoneViewCMState', Session.get('getCMByZone').nonactiove);
        Session.set('listZoneViewCMName', "CM บริหาร");
        Router.go('/hpcviewcm')
    },
    "click #EXPIREDcm"() {
        // Session.set('IsHpcSearch', true)
        // Session.set('listZoneViewCMState', Session.get('getCMByZone').EXPIRED);
        // Session.set('listZoneViewCMName', "ต้องได้รับการฟื้นฟูศักยภาพ");
        Router.go('/hpcapprovecmex')
    },
    "click #RETIREDcm"() {
        Session.set('IsHpcSearch', true)
        Session.set('listZoneViewCMState', Session.get('getCMByZone').RETIRED);
        Session.set('listZoneViewCMName', "เกษียณอายุการทำงาน");
        Router.go('/hpcviewcm')
    },
    "click #QUITcm"() {
        Session.set('IsHpcSearch', true)
        Session.set('listZoneViewCMState', Session.get('getCMByZone').QUIT);
        Session.set('listZoneViewCMName', "ลาออก");
        Router.go('/hpcviewcm')
    },
    "click #DEATHcm"() {
        Session.set('IsHpcSearch', true)
        Session.set('listZoneViewCMState', Session.get('getCMByZone').DEATH);
        Session.set('listZoneViewCMName', "เสียชีวิต");
        Router.go('/hpcviewcm')
    },
    "click #CHANGEcm"() {
        Session.set('IsHpcSearch', true)
        Session.set('listZoneViewCMState', Session.get('getCMByZone').CHANGE);
        Session.set('listZoneViewCMName', "เปลี่ยนงาน / ย้ายงาน");
        Router.go('/hpcviewcm')
    },


});