



Template.printzonenum.onRendered(function () {

    

    //************************************************************
    var start = +new Date();
    var zone = []
    var datacm = []
    var datacg = []
    _.each(Session.get('sendToPrintReport2'), function (x) {
        zone.push("เขต " + x.zone);
        datacm.push(parseInt(x.numcm));
        datacg.push(parseInt(x.numcg));
    });
    var ctx = document.getElementById("zonecm").getContext("2d");
    var data = {
        labels: zone,
        datasets: [{
            label: "CM",
            backgroundColor: "#3C9CDC",
            data: datacm
        },]
    };

    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
    });


    var zones = []
    var datacms = []
    var datacgs = []

    _.each(Session.get('sendToPrintReport2'), function (x) {
        zones.push("เขต " + x.zone);
        datacms.push(parseInt(x.numcm));
        datacgs.push(parseInt(x.numcg));
    });

    var ctx = document.getElementById("zonecg").getContext("2d");
    var data = {
        labels: zone,
        datasets: [{
            label: "CG",
            backgroundColor: "#F98141",
            data: datacg
        },]
    };
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
    });

    var end = +new Date();  // log end timestam
    var diff = end - start;
    setTimeout(() => {
        window.print();
        window.history.back();
    }, diff * 200);





});

Template.printzonenum.helpers({
    zonerep1() {
        return Session.get('sendToPrintReport2')
    },
    sumCMCG() {
        var sum = Session.get('sendToPrintReport2')
        var groupData = _.chain(sum).groupBy('allzone').map(function (value, key) {
            return {
                zone: key,
                numcm: _.reduce(_.pluck(value, 'numcm'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                numcg: _.reduce(_.pluck(value, 'numcg'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
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

