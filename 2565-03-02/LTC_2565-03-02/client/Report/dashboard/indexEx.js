Template.indexex.onRendered(function () {
   
    Meteor.call('countExpireCM', function (error, result2) {
        Session.set('countIndexExpireCM', result2)

        Meteor.call('countExpireCG', function (error, result) {

            var concatArr = _.concat(Session.get('countIndexExpireCM'), result)
            var output = [];//output array
            var temp = {};//temp object
            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.excm ? temp[o._id].excm = o.excm : temp[o._id].excm = 0
                    o.excg ? temp[o._id].excg = o.excg : temp[o._id].excg = 0
                } else {
                    o.excm ? temp[o._id].excm = temp[o._id].excm + o.excm : temp[o._id].excm
                    o.excg ? temp[o._id].excg = temp[o._id].excg + o.excg : temp[o._id].excg
                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    _id: key,
                    excm: temp[key].excm,
                    excg: temp[key].excg,
                    sum: "sum"
                })
            }
            var soutput = _.sortBy(output, o => o._id)
            var datacp = [], dataelder = [], zone = []
            _.each(soutput, function (x) {
                zone.push("เขต " + x._id);
                datacp.push(parseInt(x.excm));
                dataelder.push(parseInt(x.excg));
            });

            var ctx = document.getElementById("zoneexcmcg").getContext("2d");
            var data = {
                labels: zone,
                datasets: [{
                    label: "Care Manager",
                    backgroundColor: "#d641f4",
                    data: datacp
                }, {
                    label: "Caregiver",
                    backgroundColor: "#9441f4",
                    data: dataelder
                }]
            };

            var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    "hover": {
                        "animationDuration": 0
                    },
                    "animation": {
                        "duration": 1,
                        "onComplete": function () {
                            var chartInstance = this.chart,
                                ctx = chartInstance.ctx;

                            ctx.font = Chart.helpers.fontString(13, "bold", "THChakraPetch");
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';

                            this.data.datasets.forEach(function (dataset, i) {
                                var meta = chartInstance.controller.getDatasetMeta(i);
                                meta.data.forEach(function (bar, index) {
                                    var data = dataset.data[index];
                                    ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                });
                            });
                        }
                    },
                    tooltips: {
                        "enabled": false
                    },
                    title: {
                        display: true,
                        text: 'เปรียบเทียบระดับเขตสุขภาพ',
                        fontFamily: "THChakraPetch",
                        fontSize: 16
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            fontFamily: "THChakraPetch",
                            fontSize: 14,
                            fontStyle: "bold"
                        }

                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false,

                            },
                            ticks: {
                                max: Math.max(...data.datasets[0].data) + 10,
                                fontFamily: "THChakraPetch",
                                fontSize: 12,
                                fontStyle: "bold"
                            },
                            categoryPercentage: 0.5,
                            barPercentage: 1
                        }],
                        yAxes: [{
                            ticks: {
                                fontFamily: "THChakraPetch",
                                fontStyle: "bold",
                                stepSize: 500
                            }
                        }]
                    }
                },
            });
        });

    });
});

Template.indexex.events({
    'click #printrep'() {
        Router.go('/reportzoneexpire')
    },
});


Router.route('/indexex', function () {
    this.render('indexex');
});