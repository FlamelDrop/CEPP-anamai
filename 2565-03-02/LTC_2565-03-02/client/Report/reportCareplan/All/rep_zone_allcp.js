
Template.rep_zone_allcp.onCreated(function () {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
});
Template.rep_zone_allcp.onRendered(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
    Session.set('ViewAmphoeAllCp', null)
    Session.set('ViewProvinceAllCp', null)
    Session.set('ViewTambonAllCp', null)
    Session.set('BudgetYearAllCp', null)
    Session.set('isZonePrintAllRepCp', false);
    Session.set('isProPrintAllRepCp', false);
    Session.set('isAmpPrintAllRepCp', false);
    Session.set('isTamPrintAllRepCp', false);
    Session.set('isHospPrintAllRepCp', false);
    Session.set('sendToPrintAllRepCp',null)
    var year = parseInt(moment().format('YYYY')) + 543
    $('#graphcp').remove();
    $('#graph-cp').append('<canvas id="graphcp" style="width:100%;height:320px"></canvas>');
    $('#budgetyear').val(year.toString())

    var zone = null, province = null, amp = null, tam = null
    Meteor.call('countAllReportCP', year, zone, province, amp, tam, function (error, result2) {
        Session.set('countZoneAllCP', result2)
        Meteor.call('countAllElderCP', year, zone, province, amp, tam, function (error, result) {

            var concatArr = _.concat(Session.get('countZoneAllCP'), result)
            var output = [];//output array
            var temp = {};//temp object
            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.totalcp ? temp[o._id].totalcp = o.totalcp : temp[o._id].totalcp = 0
                    o.totalelder ? temp[o._id].totalelder = o.totalelder : temp[o._id].totalelder = 0
                } else {
                    o.totalcp ? temp[o._id].totalcp = temp[o._id].totalcp + o.totalcp : temp[o._id].totalcp
                    o.totalelder ? temp[o._id].totalelder = temp[o._id].totalelder + o.totalelder : temp[o._id].totalelder
                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    _id: key,
                    totalcp: temp[key].totalcp,
                    totalelder: temp[key].totalelder,
                    sum: "sum"
                })
            }
            var soutput = _.sortBy(output, o => o._id)
            var datacp = [], dataelder = [], zone = []
            _.each(soutput, function (x) {
                zone.push("เขต " + x._id);
                datacp.push(parseInt(x.totalcp));
                dataelder.push(parseInt(x.totalelder));
            });

            var ctx = document.getElementById("graphcp").getContext("2d");
            var data = {
                labels: zone,
                datasets: [{
                    label: "Care Plan",
                    backgroundColor: "#3C9CDC",
                    data: datacp
                }, {
                    label: "ผู้สูงอายุที่มีภาวะพึงพิง",
                    backgroundColor: "#999da3",
                    data: dataelder
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
            Session.set('FinalElderAllCp', output)
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        });

    });

});

Template.rep_zone_allcp.helpers({
    zonerep1() {
        return _.sortBy(Session.get('FinalElderAllCp'), o => o._id)

    },
    sumCMCG() {
        var data = Session.get('FinalElderAllCp')
        var groupData = _.chain(data).groupBy('sum').map(function (value, key) {
            return {
                zone: key,
                numcp: _.reduce(_.map(value, 'totalcp'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }, 0),
                numelder: _.reduce(_.map(value, 'totalelder'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }, 0),
            }
        }).value();

        return groupData
    },
    year() {
        var year = []
        for (var i = 2561; i < 2580; i++) {
            year.push({ byear: i })
        }
        return year
    }
});


Template.rep_zone_allcp.events({
    'click #printrep'() {
        Session.set('isZonePrintAllRepCp', true);
        Session.set('isProPrintAllRepCp', false);
        Session.set('isAmpPrintAllRepCp', false);
        Session.set('isTamPrintAllRepCp', false);
        Session.set('isHospPrintAllRepCp', false);
        Session.set('sendToPrintAllRepCp', Session.get('FinalElderAllCp'))
        Router.go('/printAllRepCp')
    },
    'change #budgetyear'(events) {
        //Session.set('getCpBudgetyear',events.target.value)
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        $('#graphcp').remove();
        $('#graph-cp').append('<canvas id="graphcp" style="width:100%;height:320px"></canvas>');
        Session.set('BudgetYearAllCp', events.target.value)
        Meteor.call('countAllReportCP', events.target.value, function (error, result2) {
            Session.set('countZoneAllCP', result2)

            Meteor.call('countAllElderCP', events.target.value, function (error, result) {

                var concatArr = _.concat(Session.get('countZoneAllCP'), result)
                var output = [];//output array
                var temp = {};//temp object
                for (var o of concatArr) {
                    if (Object.keys(temp).indexOf(o._id) == -1) {
                        temp[o._id] = {}
                        o.totalcp ? temp[o._id].totalcp = o.totalcp : temp[o._id].totalcp = 0
                        o.totalelder ? temp[o._id].totalelder = o.totalelder : temp[o._id].totalelder = 0
                    } else {
                        o.totalcp ? temp[o._id].totalcp = temp[o._id].totalcp + o.totalcp : temp[o._id].totalcp
                        o.totalelder ? temp[o._id].totalelder = temp[o._id].totalelder + o.totalelder : temp[o._id].totalelder
                    }
                }
                for (var key of Object.keys(temp)) {
                    output.push({
                        _id: key,
                        totalcp: temp[key].totalcp,
                        totalelder: temp[key].totalelder,
                        sum: "sum"
                    })
                }
                var soutput = _.sortBy(output, o => o._id)
                var datacp = [], dataelder = [], zone = []
                _.each(soutput, function (x) {
                    zone.push("เขต " + x._id);
                    datacp.push(parseInt(x.totalcp));
                    dataelder.push(parseInt(x.totalelder));
                });

                var ctx = document.getElementById("graphcp").getContext("2d");
                var data = {
                    labels: zone,
                    datasets: [{
                        label: "Care Plan",
                        backgroundColor: "#3C9CDC",
                        data: datacp
                    }, {
                        label: "ผู้สูงอายุที่มีภาวะพึงพิง",
                        backgroundColor: "#999da3",
                        data: dataelder
                    }]
                };

                var myBarChart = new Chart(ctx, {
                    type: 'bar',
                    data: data,
                });
                Session.set('FinalElderAllCp', output)
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            });

        });
    },
    'click #viewprovince'() {
        Session.set('ViewZoneAllCp', this._id)
        Router.go('/rep_pro_allcp')
    }
});
