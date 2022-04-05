import { Meteor } from "meteor/meteor";

Template.reportevaprovince.onRendered(function () {
    Meteor.call('reportProvinceAssessment', Session.get('ZoneViewProvinceEva'), function (err, res) {
        Session.set('provinceInZone', res);
        let provinceInZone = res;
        provinceData = [];
        provinceInZone.forEach((item, index, self) => {
            if (!provinceData[item.provinceID]) {
                provinceData[item.provinceID] = {
                    amphoeCount: 0, verdictPass: 0, verdictFail: 0,
                    c1Fail: 0, c2Fail: 0, c3Fail: 0, c4Fail: 0, c5Fail: 0, c6Fail: 0,
                    c1Pass: 0, c2Pass: 0, c3Pass: 0, c4Pass: 0, c5Pass: 0, c6Pass: 0,
                    provinceID: item.provinceID,
                    provinceName: item.provinceName,
                    zoneID: item.zoneID
                };
            }
            provinceData[item.provinceID].amphoeCount++;
            if (item.c1) { provinceData[item.provinceID].c1Pass++; } else { provinceData[item.provinceID].c1Fail++; }
            if (item.c2) { provinceData[item.provinceID].c2Pass++; } else { provinceData[item.provinceID].c2Fail++; }
            if (item.c3) { provinceData[item.provinceID].c3Pass++; } else { provinceData[item.provinceID].c3Fail++; }
            if (item.c4) { provinceData[item.provinceID].c4Pass++; } else { provinceData[item.provinceID].c4Fail++; }
            if (item.c5) { provinceData[item.provinceID].c5Pass++; } else { provinceData[item.provinceID].c5Fail++; }
            if (item.c6) { provinceData[item.provinceID].c6Pass++; } else { provinceData[item.provinceID].c6Fail++; }
            if (item.verdict === 'ผ่านเกณฑ์') { provinceData[item.provinceID].verdictPass++; } else { provinceData[item.provinceID].verdictFail++; }
        })
        provinceData = provinceData.filter((item) => item);
        Session.set('provinceData', provinceData);
        $('#zoneevaltc').remove(); // this is my <canvas> element
        $('#container-zoneltc').append('<canvas id="zoneevaltc" style="width:100%;height:320px;"></canvas>');
        var ctx = document.getElementById("zoneevaltc").getContext("2d");
        var data = {
            labels: provinceData.map((item) => item.provinceName),
            datasets: [{
                label: "ผ่านเกณฑ์",
                backgroundColor: "#3C9CDC",
                data: provinceData.map((item) => item.verdictPass)
            }, {
                label: "ไม่ผ่านเกณฑ์",
                backgroundColor: "#999da3",
                data: provinceData.map((item) => item.verdictFail)
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

Template.reportevaprovince.helpers({
    provinceAssessmentData() {
        return Session.get('provinceData');
    },
    total() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.amphoeCount }, 0);
    },
    pass() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.verdictPass }, 0);
    },
    fail() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.verdictFail }, 0);
    },
    c1_fail() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.c1Fail }, 0);
    },
    c2_fail() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.c2Fail }, 0);
    },
    c3_fail() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.c3Fail }, 0);
    },
    c4_fail() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.c4Fail }, 0);
    },
    c5_fail() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.c5Fail }, 0);
    },
    c6_fail() {
        return Session.get('provinceData').reduce((total, item) => { return total + item.c6Fail }, 0);
    },
    zoneID() {
        return Session.get('ZoneViewProvinceEva');
    }
});

Template.reportevaprovince.events({
    'click .viewAmphoeInProvince'(event, template) {
        console.log(this)
        Session.set('ZoneViewAmphoeEva', this.provinceID)
        Router.go('/reportevaamphoe')
    }
});


Router.route('/reportevaprovince', function () {
    this.render('reportevaprovince');
});

