import { Meteor } from "meteor/meteor";

Template.reportevazone.onRendered(function () {
    zoneData = Session.get('zoneData');
    zoneDataSummary = {
        total: 0, pass: 0, fail: 0,
        c1_pass: 0, c2_pass: 0, c3_pass: 0, c4_pass: 0, c5_pass: 0, c6_pass: 0,
        c1_fail: 0, c2_fail: 0, c3_fail: 0, c4_fail: 0, c5_fail: 0, c6_fail: 0,
    }
    zoneData.forEach((item, index, self) => {
        item.verdict_notPass = item.count - item.verdict_pass;
        item.c1_notPass = item.count - item.c1_pass;
        item.c2_notPass = item.count - item.c2_pass;
        item.c3_notPass = item.count - item.c3_pass;
        item.c4_notPass = item.count - item.c4_pass;
        item.c5_notPass = item.count - item.c5_pass;
        item.c6_notPass = item.count - item.c6_pass;
        zoneDataSummary.total += item.count;
        zoneDataSummary.pass += item.verdict_pass;
        zoneDataSummary.fail += item.verdict_notPass;
        zoneDataSummary.c1_fail += item.c1_notPass;
        zoneDataSummary.c2_fail += item.c2_notPass;
        zoneDataSummary.c3_fail += item.c3_notPass;
        zoneDataSummary.c4_fail += item.c4_notPass;
        zoneDataSummary.c5_fail += item.c5_notPass;
        zoneDataSummary.c6_fail += item.c6_notPass;
        zoneDataSummary.c1_pass += item.c1_pass;
        zoneDataSummary.c2_pass += item.c2_pass;
        zoneDataSummary.c3_pass += item.c3_pass;
        zoneDataSummary.c4_pass += item.c4_pass;
        zoneDataSummary.c5_pass += item.c5_pass;
        zoneDataSummary.c6_pass += item.c6_pass;
    });
    // แสดงผล โดยให้เขตกรุงเทพ zoneID 13 เป็น ศูนย์ เพราะไม่ได้เข้าร่วม
    zoneData[12].count = 0; zoneData[12].pass = 0; zoneData[12].fail = 0;
    zoneData[12].c1_pass = 0; zoneData[12].c1_fail = 0;
    zoneData[12].c2_pass = 0; zoneData[12].c2_fail = 0;
    zoneData[12].c3_pass = 0; zoneData[12].c3_fail = 0;
    zoneData[12].c4_pass = 0; zoneData[12].c4_fail = 0;
    zoneData[12].c5_pass = 0; zoneData[12].c5_fail = 0;
    zoneData[12].c6_pass = 0; zoneData[12].c6_fail = 0;

    Session.set('zoneData', zoneData);
    Session.set('zoneDataSummary', zoneDataSummary);


    $('#zoneevaltc').remove(); // this is my <canvas> element
    $('#container-zoneltc').append('<canvas id="zoneevaltc" style="width:100%;height:320px;"></canvas>');
    var ctx = document.getElementById("zoneevaltc").getContext("2d");
    var data = {
        labels: zoneData.map((item) => { return 'เขต ' + item.zoneID; }),
        datasets:
            [{
                label: "ผ่านเกณฑ์",
                backgroundColor: "#3C9CDC",
                data: zoneData.map((item) => { return item.verdict_pass; }),
            }, {
                label: "ไม่ผ่านเกณฑ์",
                backgroundColor: "#999da3",
                data: zoneData.map((item) => { return item.verdict_notPass; }),
            }]
    };

    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        min: 0,
                        beginAtZero: true
                    },

                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        beginAtZero: true
                    },

                }],
            }
        }
    });


});

Template.reportevazone.helpers({
    zoneData() {
        return Session.get('zoneData');
    },
    zoneDataSummary() {
        x = [];
        x[0] = Session.get('zoneDataSummary')
        return x;
    },

});

Template.reportevazone.events({
    'click .viewprovince'(event, template) {
        console.log(this);
        Session.set('ZoneViewProvinceEva', this.zoneID)
        //Router.go('/reportevaprovince')
    }
});


Router.route('/reportevazone', function () {
    this.render('reportevazone');
});

