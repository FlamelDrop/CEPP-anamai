_ = lodash


Template.reporthospelder.onRendered(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    //*************************************************************
    $('#container-zonecm').append('<canvas id="zonecm" style="width:100%;height:320px"></canvas>');
    $('#zonecm').remove(); // this is my <canvas> element
    var isNhso = Session.get('IsNHSOElder') ? false : true
    Meteor.call('countElderByHosp',Session.get('ZoneFindTambonElder'),isNhso,Session.get('ZoneFindHospElder'), function (error, result) {

        var newData = []
        
        _.each(result, function (x) {
            newData.push({ zone: x._id.hospname, group: x._id.group, count: x.count })
        })
        nameIndices = Object.create(null),
            statusHash = Object.create(null),
            data = { labels: [], datasets: [] };

        newData.forEach(function (o) {
            if (!(o.zone in nameIndices)) {
                nameIndices[o.zone] = data.labels.push("ต." + o.zone) - 1;
                data.datasets.forEach(function (a) { a.data.push(0); });
            }
            if (!statusHash[o.group]) {
                statusHash[o.group] = { label: o.group == "-" ? "ไม่มีกลุ่ม" : "กลุ่ม" + o.group, backgroundColor: 'f00', data: data.labels.map(function () { return 0; }) };
                data.datasets.push(statusHash[o.group]);
            }
            statusHash[o.group].data[nameIndices[o.zone]] = o.count;
        });
        Session.set('graphDataHospNumElder', data)
        //console.log(data);

        //var color = ['#999da3', '#1ca81e', '#288dd6', '#ebf713', '#d67c28']
        var color = ['#1ca81e', '#288dd6', '#ebf713', '#d67c28']
        for(var i=0;i<data.datasets.length;i++){
            data.datasets[i].backgroundColor = color[i]
        }
        // data.datasets[0].backgroundColor = '#999da3'
        // data.datasets[1].backgroundColor = '#1ca81e'
        // data.datasets[2].backgroundColor = '#288dd6'
        // data.datasets[3].backgroundColor = '#ebf713'
        // data.datasets[4].backgroundColor = '#d67c28'
        // console.log(data);

        var ctx = document.getElementById("zonecm").getContext("2d");
        // f_cmamphoe = f_cmamphoe.sort()
        var cdata = {
            labels: data.labels,
            datasets: data.datasets
        };
        var myBarChart = new Chart(ctx, {
            type: 'bar',
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            // suggestedMax: 100
                        }
                    }]
                }
            },
            data: cdata
        });
        var newgroup = []
        var dis_arr = _.uniqBy(newData, 'zone');
        _.each(dis_arr, function (x) {
            newgroup.push({ sum: "all", z: x.zone, g1: 0, g2: 0, g3: 0, g4: 0, g5: 0 })
        })
        for (var i = 0; i < newData.length; i++) {
            for (var j = 0; j < newgroup.length; j++) {
                if (newData[i].zone == newgroup[j].z && newData[i].group == "1") {
                    newgroup[j].g1 = newData[i].count
                }
                if (newData[i].zone == newgroup[j].z && newData[i].group == "2") {
                    newgroup[j].g2 = newData[i].count
                }
                if (newData[i].zone == newgroup[j].z && newData[i].group == "3") {
                    newgroup[j].g3 = newData[i].count
                }
                if (newData[i].zone == newgroup[j].z && newData[i].group == "4") {
                    newgroup[j].g4 = newData[i].count
                }
                if (newData[i].zone == newgroup[j].z && newData[i].group == "-") {
                    newgroup[j].g5 = newData[i].count
                }
            }
        }
     
        Session.set('finalHospNumElder',newgroup)
    });


});

Template.reporthospelder.helpers({
    zonerep1() {
        return Session.get('finalHospNumElder').sort();
    },
    isNhso(){
        var isNhso = Session.get('IsNHSOElder') ? false : true
        return isNhso
    },
    sumCMCG() {
        var sum = Session.get('finalHospNumElder')

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
    zone() {
        return Session.get('ZoneFindHospElder')
    }
});

Template.reporthospelder.events({
    'click #printrep'() {
        Session.set('sendToNumHospElderPrint', { table: Session.get('finalHospNumElder'), graph: Session.get('graphDataHospNumElder') })
        Router.go('/printhospelder')
    },
    'click #viewprovince'() {
        // var data = this.z
        // Session.set('ZoneFindTambonElder', data);
        Router.go('/reporthospelder')
    },
})

