Template.indexelder.onRendered(function () {
    Meteor.call('countElderOnlyZone', function (error, result) {

        var zone = [], count = []
        _.each(result, function (x) {
            zone.push("เขต " + x._id);
            count.push(x.count);
        })

        var ctx = document.getElementById("zoneelder").getContext("2d");
        var cdata = {
            labels: zone,
            datasets: [{
                label: "ผู้สูงอายุภาวะพึงพิง LTC",
                backgroundColor: "#21c221",
                data: count
            },]

        };
        var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: cdata,
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

                        ctx.font = Chart.helpers.fontString(13,"bold","THChakraPetch");
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
                    fontSize: 18
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
                            max: Math.max(count) + 10,
                            fontFamily: "THChakraPetch",
                            fontSize: 14,
                            fontStyle: "bold"
                        },
                        categoryPercentage: 0.5,
                        barPercentage: 1
                    }],
                    yAxes: [{
                        ticks: {
                            fontFamily: "THChakraPetch",
                            fontStyle: "bold",
                            stepSize: 4000
                        }
                    }]
                }
            },

        });
    });
});
Template.indexelder.helpers({

});

Template.indexelder.events({
    'click #printrep'() {
        Router.go('/reportnumelder')
        Session.set('IsNHSOElder',null);
    },
    'click #printrep2'() {
        Router.go('/reportnumelder')
        Session.set('IsNHSOElder',true);
    }
});


Router.route('/indexelder', function () {
    this.render('indexelder');
});