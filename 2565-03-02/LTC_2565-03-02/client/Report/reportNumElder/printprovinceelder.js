

Template.printprovinceelder.onRendered(function () {

    var start = +new Date();
    
    var data = Session.get('sendToNumProvinceElderPrint').graph
    var ctx = document.getElementById("zonecm").getContext("2d");
    // f_cmamphoe = f_cmamphoe.sort()
    var cdata = {
        labels: data.labels,
        datasets: data.datasets
    };
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: cdata
    });

    var end = +new Date();  // log end timestam
    var diff = end - start;

    setTimeout(() => {
        window.print();
        window.history.back();
    }, diff * 200);

});

Template.printprovinceelder.helpers({
    zonerep1() {
        return _.sortBy(Session.get('sendToNumProvinceElderPrint').table, o => o._id)
    },
    sumCMCG() {
        var sum = Session.get('sendToNumProvinceElderPrint').table

        var groupData = _.chain(sum).groupBy('sum').map(function (value, key) {
            return {
                zone: key,
                g1: _.reduce(_.map(value, 'g1'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                g2: _.reduce(_.map(value, 'g2'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                g3: _.reduce(_.map(value, 'g3'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                g4: _.reduce(_.map(value, 'g4'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                g5: _.reduce(_.map(value, 'g5'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
            }
        }).value();
        //  console.log(sum)
        return groupData
    },
    time() {
        var curyear = new Date().getFullYear()
        var thyear = (parseInt(curyear) + 543)
        return moment().format('DD/MM/' + thyear + '')
    },
});

Router.route('/printprovinceelder', function () {
    this.render('printprovinceelder');
});