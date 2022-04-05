

Template.printAllRepCp.onRendered(function () {

    var start = +new Date();

    var soutput = _.sortBy(Session.get('sendToPrintAllRepCp'), o => o._id)
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

Template.printAllRepCp.helpers({
    txthead(){
        if(Session.get('isZonePrintAllRepCp')){
            return "รายงานจำนวน Care Plan ทั้งหมดในแต่ละเขต"
        }else if( Session.get('isProPrintAllRepCp')){
            return "รายงานจำนวน Care Plan ทั้งหมดในแต่ละจังหวัด"
        }else if( Session.get('isAmpPrintAllRepCp')){
            return "รายงานจำนวน Care Plan ทั้งหมดในแต่ละอำเภอ"
        }else if( Session.get('isTamPrintAllRepCp')){
            return "รายงานจำนวน Care Plan ทั้งหมดในแต่ละตำบล"
        }else if( Session.get('isHospPrintAllRepCp')){
            return "รายงานจำนวน Care Plan ทั้งหมดในแต่ละหน่วยบริการ"
        }

    },
    txttable(){
        if(Session.get('isZonePrintAllRepCp')){
            return "เขต"
        }else if( Session.get('isProPrintAllRepCp')){
            return "จังหวัด"
        }else if( Session.get('isAmpPrintAllRepCp')){
            return "อำเภอ"
        }else if( Session.get('isTamPrintAllRepCp')){
            return "ตำบล"
        }else if( Session.get('isHospPrintAllRepCp')){
            return "หน่วยบริการ"
        }

    },
    zonerep1() {
        return _.sortBy(Session.get('sendToPrintAllRepCp'), o => o._id)
    },
    sumCMCG() {
        var data = Session.get('sendToPrintAllRepCp')
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

