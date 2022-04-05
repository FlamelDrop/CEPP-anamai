

Template.printNonUcCp.onRendered(function () {

    var start = +new Date();

    var soutput = _.sortBy(Session.get('sendToPrintCpNonUC'), o => o._id)
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

    var end = +new Date();  // log end timestam
    var diff = end - start;

    setTimeout(() => {
        window.print();
        window.history.back();
    }, diff * 200);

});

Template.printNonUcCp.helpers({
    txthead(){
        if(Session.get('isZonePrintCpNonUC')){
            return "รายงานจำนวน Care Plan สิทธิอื่นๆในแต่ละเขต"
        }else if( Session.get('isProPrintCpNonUC')){
            return "รายงานจำนวน Care Plan สิทธิอื่นๆในแต่ละจังหวัด"
        }else if( Session.get('isAmpPrintCpNonUC')){
            return "รายงานจำนวน Care Plan สิทธิอื่นๆในแต่ละอำเภอ"
        }else if( Session.get('isTamPrintCpNonUC')){
            return "รายงานจำนวน Care Plan สิทธิอื่นๆในแต่ละตำบล"
        }else if( Session.get('isHospPrintCpNonUC')){
            return "รายงานจำนวน Care Plan สิทธิอื่นๆในแต่ละหน่วยบริการ"
        }

    },
    txttable(){
        if(Session.get('isZonePrintCpNonUC')){
            return "เขต"
        }else if( Session.get('isProPrintCpNonUC')){
            return "จังหวัด"
        }else if( Session.get('isAmpPrintCpNonUC')){
            return "อำเภอ"
        }else if( Session.get('isTamPrintCpNonUC')){
            return "ตำบล"
        }else if( Session.get('isHospPrintCpNonUC')){
            return "หน่วยบริการ"
        }

    },
    zonerep1() {
        return _.sortBy(Session.get('sendToPrintCpNonUC'), o => o._id)
    },
    sumCMCG() {
        var data = Session.get('sendToPrintCpNonUC')
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
    time() {
        var curyear = new Date().getFullYear()
        var thyear = (parseInt(curyear) + 543)
        return moment().format('DD/MM/' + thyear + '')
    },
});

