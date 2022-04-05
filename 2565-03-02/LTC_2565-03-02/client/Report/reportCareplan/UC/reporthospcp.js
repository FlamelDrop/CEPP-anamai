

Template.reporthospcp.onCreated(function () {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
});
Template.reporthospcp.onRendered(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    var year = parseInt(moment().format('YYYY')) + 543
    $('#budgetyear').val(year.toString())
    Meteor.call('countCPbyHosp', year, Session.get('ZoneViewTambonCP'), Session.get('ZoneViewHospCP'), function (error, result2) {
        Session.set('countCPbyHosp', result2)
        // console.log(result2)
        Meteor.call('countElderCPbyHosp', year, Session.get('ZoneViewTambonCP'), Session.get('ZoneViewHospCP'), function (error, result) {
            // console.log(result)
            var concatArr = _.concat(Session.get('countCPbyHosp'), result)
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
            Meteor.call('Replace_ServiceCenterCode', output, function (error, result2) {
                var soutput = _.sortBy(result2, o => o._id)
                var datacp = [], dataelder = [], zone = []
                _.each(soutput, function (x) {
                    zone.push(x._id);
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
                Session.set('FinalHospElderCp', _.sortBy(result2, o => o._id))
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            });







          
        });

    });

});

Template.reporthospcp.helpers({
    zonerep1() {
        return _.sortBy(Session.get('FinalHospElderCp'), o => o._id)

    },
    sumCMCG() {
        var data = Session.get('FinalHospElderCp')
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
    },
    zone() {
        return Session.get('ZoneViewHospCP')
    }
});


Template.reporthospcp.events({
    'click #printrep'() {
        Session.set('sendToPrintCpHosp', Session.get('FinalHospElderCp'))
        Router.go('/printhospcp')
    },
    'change #budgetyear'(events) {
        //Session.set('getCpBudgetyear',events.target.value)
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        $('#graphcp').remove();
        $('#graph-container').append('<canvas id="graphcp" style="width:100%;height:320px;"><canvas>');
        Meteor.call('countCPbyHosp', events.target.value, Session.get('ZoneViewTambonCP'), Session.get('ZoneViewHospCP'), function (error, result2) {
            Session.set('countCPbyHosp', result2)

            Meteor.call('countElderCPbyHosp', events.target.value, Session.get('ZoneViewTambonCP'), Session.get('ZoneViewHospCP'), function (error, result) {

                var concatArr = _.concat(Session.get('countCPbyHosp'), result)
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
                Meteor.call('Replace_ServiceCenterCode', output, function (error, result2) {
                    var soutput = _.sortBy(result2, o => o._id)
                    var datacp = [], dataelder = [], zone = []
                    _.each(soutput, function (x) {
                        zone.push(x._id);
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
                    Session.set('FinalHospElderCp', _.sortBy(result2, o => o._id))
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                });
            });

        });
    },
    // 'click #viewprovince'(){
    //     Session.set('ZoneViewHospCP', this._id)
    //     Router.go('/reporthospcp')
    // }
});
