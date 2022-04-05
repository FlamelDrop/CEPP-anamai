Template.reportzonenum.onCreated(function () {
    $('body').addClass('waitMe_body');
    var elem = $(
        '<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>'
    );
    $('body').prepend(elem);
});

function extendZoneReport(obj, src) {
    try {
        for (var i = obj.length - 1; i >= 0; i--) {
            for (var j = src.length - 1; j >= 0; j--) {
                if (obj[i].zone == src[j]._id) {
                    obj[i].numcm = src[j].numcm;
                    obj[i].idcm = src[j].idcm;
                    obj[i].allzone = obj[i].allzone;
                }
            }
        }
        return obj;
    } catch (e) {}
}

function extendZoneReport2(obj, src) {
    try {
        for (var i = obj.length - 1; i >= 0; i--) {
            for (var j = src.length - 1; j >= 0; j--) {
                if (obj[i].zone == src[j]._id) {
                    obj[i].numcg = src[j].numcg;
                    obj[i].idcg = src[j].idcg;
                    obj[i].allzone = obj[i].allzone;
                }
            }
        }
        return obj;
    } catch (e) {}
}

Template.reportzonenum.onRendered(function () {
    $('.dropdown-submenu a.test').on('click', function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
    // var objZoneReportnum = [];
    // for (var i = 1; i < 14; i++) {
    //   objZoneReportnum.push({
    //     zone: i < 10 ? "0" + i.toString() : i.toString(),
    //     numcm: 0,
    //     numcg: 0,
    //     idcm: [],
    //     idcg: [],
    //     allzone: "all"
    //   })
    // }

    // Session.set('objZoneReportnum', objZoneReportnum);
    Meteor.call('countCMReportByZone', function (error, result) {
        Session.set('countCMReportByZone', result);
        Meteor.call('countCGReportByZone', function (error, result2) {
            Meteor.call('CMRATIO', function (result) {
                Session.set('countCGReportByZone', result2);
                // Session.set('finalZoneNumCmCG', extendZoneReport2(extendZoneReport(Session.get('objZoneReportnum'), Session.get('countCMReportByZone')), Session.get('countCGReportByZone')))
                var zone = [];
                var datacm = [];
                var datacg = [];

                var concatArr = _.concat(
                    Session.get('countCMReportByZone'),
                    result2
                );
                var output = []; //output array
                var temp = {}; //temp object
                for (var o of concatArr) {
                    if (Object.keys(temp).indexOf(o._id) == -1) {
                        temp[o._id] = {};
                        o.numcm
                            ? (temp[o._id].numcm = o.numcm)
                            : (temp[o._id].numcm = 0);
                        o.numcg
                            ? (temp[o._id].numcg = o.numcg)
                            : (temp[o._id].numcg = 0);
                    } else {
                        o.numcm
                            ? (temp[o._id].numcm = temp[o._id].numcm + o.numcm)
                            : temp[o._id].numcm;
                        o.numcg
                            ? (temp[o._id].numcg = temp[o._id].numcg + o.numcg)
                            : temp[o._id].numcg;
                    }
                }
                for (var key of Object.keys(temp)) {
                    output.push({
                        _id: key,
                        numcm: temp[key].numcm,
                        numcg: temp[key].numcg,
                        sum: 'sum',
                    });
                }

                var soutput = _.sortBy(output, (o) => o._id);
                Session.set('finalZoneNumCmCG', soutput);

                _.each(Session.get('finalZoneNumCmCG'), function (x) {
                    zone.push('เขต ' + x._id);
                    datacm.push(parseInt(x.numcm));
                    datacg.push(parseInt(x.numcg));
                });

                var ctx = document.getElementById('zonecm').getContext('2d');
                var data = {
                    labels: zone,
                    datasets: [
                        {
                            label: 'CM',
                            backgroundColor: '#3C9CDC',
                            data: datacm,
                        },
                    ],
                };

                var myBarChart = new Chart(ctx, {
                    type: 'bar',
                    data: data,
                });

                var ctx = document.getElementById('zonecg').getContext('2d');
                var data = {
                    labels: zone,
                    datasets: [
                        {
                            label: 'CG',
                            backgroundColor: '#F98141',
                            data: datacg,
                        },
                    ],
                };
                var myBarChart = new Chart(ctx, {
                    type: 'bar',
                    data: data,
                    // options: {
                    //   scales: {
                    //     yAxes: [{
                    //       ticks: {
                    //         beginAtZero: true,
                    //         min: 0,
                    //         max: 100,
                    //         stepSize: 10
                    //       }
                    //     }]
                    //   }
                    // }
                });
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body')
                    .find('.waitMe_container:not([data-waitme_id])')
                    .remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            });
        });
    });
});

Template.reportzonenum.helpers({
    zonerep1() {
        return Session.get('finalZoneNumCmCG');
    },
    sumCMCG() {
        var sum = Session.get('finalZoneNumCmCG');
        var groupData = _.chain(sum)
            .groupBy('allzone')
            .map(function (value, key) {
                return {
                    zone: key,
                    numcm: _.reduce(
                        _.map(value, 'numcm'),
                        function (memo, num) {
                            return parseInt(memo) + parseInt(num) || 0;
                        }
                    ),
                    numcg: _.reduce(
                        _.map(value, 'numcg'),
                        function (memo, num) {
                            return parseInt(memo) + parseInt(num) || 0;
                        }
                    ),
                };
            })
            .value();
        return groupData;
    },
});

Template.reportzonenum.events({
    'click #viewprovince'() {
        var data = this._id;
        Session.set('ZoneFindProvinceCMCG', data);
        Router.go('/reportprovincenum');
    },
    'click #printrep'() {
        Session.set('sendToPrintReport2', Session.get('finalZoneNumCmCG'));
        Router.go('/printzonenum');
    },
});
