// modified: kanut 2564-08-09
Template.indexeva.onRendered(function () {

    var year = parseInt(moment().format('YYYY')) + 543
    
    Meteor.call('zoneSummary', function (error, result) {
        //Session.set('zoneSummary',result);
        let zoneData =[];
        for(let i=0;i<=13;i++) {
            zoneData[i] ={zoneID:i,count:0,verdict_pass:0,c1_pass:0,c2_pass:0,c3_pass:0,c4_pass:0,c5_pass:0,c6_pass:0};
        }
        result.forEach((item,index,self)=> {
            zoneData[item.zoneID].count++;
            if (item.c1) { zoneData[item.zoneID].c1_pass++;}
            if (item.c2) { zoneData[item.zoneID].c2_pass++;}
            if (item.c3) { zoneData[item.zoneID].c3_pass++;}
            if (item.c4) { zoneData[item.zoneID].c4_pass++;}
            if (item.c5) { zoneData[item.zoneID].c5_pass++;}
            if (item.c6) { zoneData[item.zoneID].c6_pass++;}
            if (item.verdict==='ผ่านเกณฑ์') { zoneData[item.zoneID].verdict_pass++;}	
        });
        zoneData.shift(); //remove first element
        Session.set('zoneData',zoneData);
        let ctx = document.getElementById("zoneltc").getContext("2d");
        let cdata = {
            labels: zoneData.map((item,index,self)=>{ return 'เขต '+item.zoneID;}),
            datasets: [{
                label: "ร้อยละตำบลผ่านเกณฑ์",
                backgroundColor: "#33ffc5",
                data: zoneData.map((item,index,self)=>{ return parseInt(100*item.verdict_pass/item.count);}),
            },]

        };
        let myBarChart = new Chart(ctx, {
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
                            max:  Math.max(zoneData.map((item,index,self)=>{ return parseInt(100*item.verdict_pass/item.count);})) + 10,
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
                            stepSize: 25
                        }
                    }]
                }
            },

        });
    });
});

Template.indexeva.events({
    'click #zoneDataDetails'() {
        Router.go('/reportevazone')
    },
});


Router.route('/indexeva', function () {
    this.render('indexeva');
});