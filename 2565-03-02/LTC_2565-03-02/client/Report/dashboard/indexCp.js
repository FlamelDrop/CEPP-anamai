Template.indexcpdash.onRendered(function () {

    var year = parseInt(moment().format('YYYY')) + 543
    Meteor.call('countCPIndexbyZone', year, function (error, result2) {
       // console.log(result2)
        Session.set('countCPIndexbyZone', result2)

        Meteor.call('countElderCPIndexbyZone', year, function (error, result) {
          //  console.log(result)
            var concatArr = _.concat(Session.get('countCPIndexbyZone'), result)
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

            var ctx = document.getElementById("zonecp").getContext("2d");
            var data = {
                labels: zone,
                datasets: [{
                    label: "ผู้สูงอายุที่มีภาวะพึงพิง LTC",
                    backgroundColor: "#21c221",
                    data: dataelder
                },{
                    label: "Careplan",
                    backgroundColor: "#d41685",
                    data: datacp
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
                                stepSize: 2000
                            }
                        }]
                    }
                },
            });
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        });

    });

});

Template.indexcpdash.events({
    'click #printrep'() {
        Router.go('/reportzonecp')
    },
});


Router.route('/indexcpdash', function () {
    this.render('indexcpdash');
});