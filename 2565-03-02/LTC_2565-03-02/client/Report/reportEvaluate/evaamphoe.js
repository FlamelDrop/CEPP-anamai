import { Meteor } from "meteor/meteor";

Template.reportevaamphoe.onRendered(function () {
    Meteor.call('reportAmphoeAssessment', Session.get('ZoneViewAmphoeEva'), function (err, res) {
        Session.set('amphoeInProvinceAssessment', res);
        let amphoeInProvinceAssessment = res;
        amphoeInProvinceData = [];
        amphoeInProvinceAssessment.forEach((item, index, self) => {
            let i = item.amphoeID;
            if (!amphoeInProvinceData[i]) {
                amphoeInProvinceData[i] = {
                    tambonCount: 0, verdictPass: 0, verdictFail: 0,
                    c1Fail: 0, c2Fail: 0, c3Fail: 0, c4Fail: 0, c5Fail: 0, c6Fail: 0,
                    c1Pass: 0, c2Pass: 0, c3Pass: 0, c4Pass: 0, c5Pass: 0, c6Pass: 0,
                    provinceID: item.provinceID,
                    provinceName: item.provinceName,
                    zoneID: item.zoneID,
                    amphoeID: item.amphoeID,
                    amphoeName: item.amphoeName,
                };
            }
            amphoeInProvinceData[i].tambonCount++;
            if (item.c1) {
                amphoeInProvinceData[i].c1Pass++;
            } else { amphoeInProvinceData[i].c1Fail++; }
            if (item.c2) {
                amphoeInProvinceData[i].c2Pass++;
            } else { amphoeInProvinceData[i].c2Fail++; }
            if (item.c3) {
                amphoeInProvinceData[i].c3Pass++;
            } else { amphoeInProvinceData[i].c3Fail++; }
            if (item.c4) {
                amphoeInProvinceData[i].c4Pass++;
            } else { amphoeInProvinceData[i].c4Fail++; }
            if (item.c5) {
                amphoeInProvinceData[i].c5Pass++;
            } else { amphoeInProvinceData[i].c5Fail++; }
            if (item.c6) {
                amphoeInProvinceData[i].c6Pass++;
            } else { amphoeInProvinceData[i].c6Fail++; }
            if (item.verdict === 'ผ่านเกณฑ์') {
                amphoeInProvinceData[i].verdictPass++;
            } else {
                amphoeInProvinceData[i].verdictFail++;
            }
        })
        amphoeInProvinceData = amphoeInProvinceData.filter((item) => item);
        Session.set('amphoeInProvinceData', amphoeInProvinceData);
        $('#zoneevaltc').remove(); // this is my <canvas> element
        $('#container-zoneltc').append('<canvas id="zoneevaltc" style="width:100%;height:320px;"></canvas>');
        var ctx = document.getElementById("zoneevaltc").getContext("2d");
        var data = {
            labels: amphoeInProvinceData.map((item) => item.amphoeName),
            datasets: [{
                label: "ผ่านเกณฑ์",
                backgroundColor: "#3C9CDC",
                data: amphoeInProvinceData.map((item) => item.verdictPass)
            }, {
                label: "ไม่ผ่านเกณฑ์",
                backgroundColor: "#999da3",
                data: amphoeInProvinceData.map((item) => item.verdictFail)
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
    })
});

Template.reportevaamphoe.helpers({
    zoneID() {
        return Session.get('ZoneViewProvinceEva');
    },
    amphoeAssessmentData() {
        return Session.get('amphoeInProvinceData');
    },
    total() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.tambonCount }, 0);
    },
    pass() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.verdictPass }, 0);
    },
    fail() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.verdictFail }, 0);
    },
    c1_fail() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.c1Fail }, 0);
    },
    c2_fail() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.c2Fail }, 0);
    },
    c3_fail() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.c3Fail }, 0);
    },
    c4_fail() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.c4Fail }, 0);
    },
    c5_fail() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.c5Fail }, 0);
    },
    c6_fail() {
        return Session.get('amphoeInProvinceData').reduce((total, item) => { return total + item.c6Fail }, 0);
    },
    provinceName() {
        return Session.get('amphoeInProvinceData')[0].provinceName;
    },
});

Template.reportevaamphoe.events({
    'click .viewTambonInAmphoe'(event, template) {
        console.log(this);
        Session.set('viewTambonInAmphoe', this.amphoeID)
        Router.go('/reportevatambon')
    }
});


Router.route('/reportevaamphoe', function () {
    this.render('reportevaamphoe');
});

