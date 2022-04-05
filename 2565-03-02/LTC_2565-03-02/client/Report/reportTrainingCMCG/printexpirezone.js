Template.printexpirezone.onRendered(function() {


    var obj = Session.get('personExpiry')
    $('#zonecm').remove(); // this is my <canvas> element
    $('#graph-container').append('<canvas id="zonecm" style="width:100%;height:320px;"></canvas>');
    var ctx = document.getElementById("zonecm").getContext("2d");
    var data = {
        labels: ['ต.ค. ' + parseInt(Session.get('minThYear') - 1), 'พ.ย. ' + parseInt(Session.get('minThYear') - 1), 'ธ.ค. ' + parseInt(Session.get('minThYear') - 1), 'ม.ค. ' + Session.get('minThYear'), 'ก.พ. ' + Session.get('minThYear'), 'มี.ค. ' + Session.get('minThYear'), 'เม.ย. ' + Session.get('minThYear'), 'พ.ค. ' + Session.get('minThYear'), 'มิ.ย. ' + Session.get('minThYear'), 'ก.ค. ' + Session.get('minThYear'), 'ส.ค. ' + Session.get('minThYear'), 'ก.ย. ' + Session.get('minThYear')],
        datasets: [{
            label: "จำนวน " + Session.get('personselect') + " ที่ต้องได้รับการฟื้นฟู (คน)",
            backgroundColor: "#900C3F",
            data: [obj.oct, obj.nov, obj.dec, obj.jan, obj.fab, obj.mar, obj.api, obj.may, obj.jun, obj.jul, obj.aug, obj.sep]
        }]
    };
    myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    Meteor.setTimeout(function() {
        window.print();
        window.history.back();
    }, 500);

});

Template.printexpirezone.helpers({
    listprovince() {
        return Session.get('zoneselect')
    },
    listamphoe() {
        return Session.get('provinceselect')
    },
    listdistric() {
        return Session.get('amphoeselect')
    },
    personexpiry() {
        return Session.get('personselect');
    },
    datatable() {
        return Session.get('datatable')

    },
    datatableobjsum() {
        return Session.get('datatableobjsum')
    },
    yearex() {
        return Session.get('yearex')
    },
    textSelect() {
        return Session.get('textSelect')
    },
    minThYear() {
        return Session.get('minThYear')
    },
});