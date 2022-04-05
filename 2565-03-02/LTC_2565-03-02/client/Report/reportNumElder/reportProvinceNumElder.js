_ = lodash


Template.reportprovincenumelder.onRendered(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
    $('#container-zonecm').append('<canvas id="zonecm" style="width:100%;height:320px"></canvas>');
    $('#zonecm').remove(); // this is my <canvas> element
    var isNhso = Session.get('IsNHSOElder') ? false : true
    //*************************************************************
    Meteor.call('countElderByProvince', Session.get('ZoneFindProvinceElder'),isNhso, function (error, result) {

        var newData = []
        _.each(result, function (x) {
            newData.push({ zone: x._id.province, group: x._id.group, count: x.count })
        })
        nameIndices = Object.create(null),
            statusHash = Object.create(null),
            data = { labels: [], datasets: [] };

        newData.forEach(function (o) {
            if (!(o.zone in nameIndices)) {
                nameIndices[o.zone] = data.labels.push("จ." + o.zone) - 1;
                data.datasets.forEach(function (a) { a.data.push(0); });
            }
            if (!statusHash[o.group]) {
                statusHash[o.group] = { label: o.group == "-" ? "ไม่มีกลุ่ม" : "กลุ่ม" + o.group, backgroundColor: 'f00', data: data.labels.map(function () { return 0; }) };
                data.datasets.push(statusHash[o.group]);
            }
            statusHash[o.group].data[nameIndices[o.zone]] = o.count;
        });

        //var color = ['#999da3', '#1ca81e', '#288dd6', '#ebf713', '#d67c28']
        var color = ['#1ca81e', '#288dd6', '#ebf713', '#d67c28']
        for (var i = 0; i < data.datasets.length; i++) {
            data.datasets[i].backgroundColor = color[i]
        }
        Session.set('graphDataprovinceNumElder', data)
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

        Session.set('finalProvinceNumElder', newgroup)
    });


});

Template.reportprovincenumelder.helpers({
    zonerep1() {
        return Session.get('finalProvinceNumElder').sort();
    },
    isNhso(){
        var isNhso = Session.get('IsNHSOElder') ? false : true
        return isNhso
    },
    sumCMCG() {
        var sum = Session.get('finalProvinceNumElder')

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
        return Session.get('ZoneFindProvinceElder')
    }
});

Template.reportprovincenumelder.events({
    'click #printrep'() {
        Session.set('sendToNumProvinceElderPrint', { table: Session.get('finalProvinceNumElder'), graph: Session.get('graphDataprovinceNumElder') })
        Router.go('/printprovinceelder')
    },
    'click #viewprovince'() {
        var data = this.z
        Session.set('ZoneFindAmphoeElder', data);
        Router.go('/reportamphoenumelder')
    },
})

