



Template.printamphoenum.onCreated(function () {



    //************************************************************

    var f_cgdla = [], f_cghosp = [], f_cmdla = [], f_cmhosp = [];
    var zone = []
    _.each(Session.get('sendToNumAmphoeReport'), function (x) {

        zone.push(x.amphoe);
        f_cghosp.push(parseInt(x.num_cg_hosp));
        f_cgdla.push(parseInt(x.num_cg_dla));
        f_cmhosp.push(parseInt(x.num_cm_hosp));
        f_cmdla.push(parseInt(x.num_cm_dla));
    });

    // try {
    setTimeout(function () {

        var start = +new Date();
        var ctxm = document.getElementById("zonecm").getContext("2d");
        var cmdata = {
            labels: zone,
            datasets: [{
                label: "CM หน่วยบริการ",
                backgroundColor: "#3C9CDC",
                data: f_cmhosp
            }, {
                label: "CM อปท",
                backgroundColor: "#2F4F4F",
                data: f_cmdla
            },]
        };

        var myBarChart = new Chart(ctxm, {
            type: 'bar',
            data: cmdata
        });



        var ctx = document.getElementById("zonecg").getContext("2d");
        var cgdata = {
            labels: zone,
            datasets: [{
                label: "CG หน่วยบริการ",
                backgroundColor: "#F98141",
                data: f_cghosp
            }, {
                label: "CG อปท",
                backgroundColor: "#2F4F4F",
                data: f_cgdla
            },]
        };

        var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: cgdata,
        });
        var end = +new Date();  // log end timestam
        var diff = end - start;


        var printtime = setTimeout(() => {
            window.print();
            window.history.back();
        }, diff * 200);
        Session.set('PrintTime', printtime)

    }, 2000)


});

Template.printamphoenum.helpers({
    zonerep1() {
        return Session.get('sendToNumAmphoeReport')
    },
    zone() {
        if (Session.get('ZoneFindAmphoeCMCG')) {
            return Session.get('ZoneFindAmphoeCMCG')
        }
    },
    time() {
        var curyear = new Date().getFullYear()
        var thyear = (parseInt(curyear) + 543)
        return moment().format('DD/MM/' + thyear + '')
    },
    sumCMCG() {
        var sum = Session.get('sendToNumAmphoeReport')
        var groupData = _.chain(sum).groupBy('sum').map(function (value, key) {
            return {
                zone: key,
                num_cm_hosp: _.reduce(_.map(value, 'num_cm_hosp'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                num_cm_dla: _.reduce(_.map(value, 'num_cm_dla'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                num_cg_hosp: _.reduce(_.map(value, 'num_cg_hosp'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                num_cg_dla: _.reduce(_.map(value, 'num_cg_dla'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
            }
        }).value();
        return groupData
    },
});

