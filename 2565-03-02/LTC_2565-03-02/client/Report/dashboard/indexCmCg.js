Template.indexcm.onRendered(function () {
    Meteor.call('countCMReportByZone', function (error, result) {
        Session.set('countCMReportIndexByZone',result)
        Meteor.call('countCGReportByZone', function (error, result) {
            var concatArr = _.concat(Session.get('countCMReportIndexByZone'), result)
            var output = [];//output array
            var temp = {};//temp object
            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.numcm ? temp[o._id].numcm = o.numcm : temp[o._id].numcm = 0
                    o.numcg ? temp[o._id].numcg = o.numcg : temp[o._id].numcg = 0
                } else {
                    o.numcm ? temp[o._id].numcm = temp[o._id].numcm + o.numcm : temp[o._id].numcm
                    o.numcg ? temp[o._id].numcg = temp[o._id].numcg + o.numcg : temp[o._id].numcg
                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    _id: key,
                    numcm: temp[key].numcm,
                    numcg: temp[key].numcg,
                    sum: "sum"
                })
            }
            var soutput = _.sortBy(output, o => o._id)
            var datacp = [], dataelder = [], zone = []
            _.each(soutput, function (x) {
                zone.push("เขต " + x._id);
                datacp.push(parseInt(x.numcm));
                dataelder.push(parseInt(x.numcg));
            });

            var ctx = document.getElementById("zonecm").getContext("2d");
            var data = {
                labels: zone,
                datasets: [{
                    label: "Care Manager",
                    backgroundColor: "#0084ff",
                    data: datacp
                }, {
                    label: "Caregiver",
                    backgroundColor: "#ff9600",
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
                                stepSize: 3000
                            }
                        }]
                    }
                },
            });
        
        });
    });
});

Template.indexcm.events({
    'click #printrep'() {
        Router.go('/reportzonenum')
    },
});


Router.route('/indexcm', function () {
    this.render('indexcm');
});