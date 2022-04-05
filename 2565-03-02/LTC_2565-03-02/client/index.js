import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker'
import 'datatables.net-bs/css/dataTables.bootstrap.css';

//set ROOT_URL=http://ltc.anamai.moph.go.th:80
//meteor --port 80
var captchapng = require('captchapng');

CM_REGISTER = new Mongo.Collection('CM_REGISTER');
SERVICE_CENTER = new Mongo.Collection('SERVICE_CENTER');
DISTRICT = new Mongo.Collection('DISTRICT');
USER_LOGIN = new Mongo.Collection('USER_LOGIN');
CG_REGISTER = new Mongo.Collection('CG_REGISTER');
DLA = new Mongo.Collection('DLA');
ELDERLYREGISTER = new Mongo.Collection('ELDERLYREGISTER');
CARECODE = new Mongo.Collection('CARECODE');
CARETYPE = new Mongo.Collection('CARETYPE');
ADMINCODE = new Mongo.Collection('ADMINCODE');
CAREPLAN_DETAIL = new Mongo.Collection('CAREPLAN_DETAIL');
CAREPLAN_DETAIL_ACTIVITY = new Mongo.Collection('CAREPLAN_DETAIL_ACTIVITY');
CAREPLAN = new Mongo.Collection('CAREPLAN');
CAREPLAN_ACTIVITY = new Mongo.Collection('CAREPLAN_ACTIVITY');
VENDER_CODE = new Mongo.Collection('VENDER_CODE');

function captcha() {
    var result = parseInt(Math.random() * 9999 + 1000);
    var p = new captchapng(80, 30, result); // width,height,numeric captcha
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(0, 0, 0, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    Session.set('captcha', 'data:image/png;base64,' + img)
    Session.set('result', 'data:image/png;base64,' + img)
}
Template.index.onRendered(function () {
    $("meta[name='viewport']").attr('content', '');
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    Session.set('IsNHSOElder', false);
    Object.keys(Session.keys).forEach(function (key) {
        Session.set(key, undefined);
    });
    Session.keys = {};

    // tab 1
    $(document).ready(function () {
        $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");
            var index = $(this).index();
            $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
            $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
        });
        $('.bhoechie-tab-menu').css("height", $(document).height() / 1.3)
        $('#graph-container-ltc').css("height", $(document).height() / 1.8)
        $('#graph-container-elder').css("height", $(document).height() / 1.8)
        $('#graph-container-cm').css("height", $(document).height() / 1.8)
        $('#graph-container-cp').css("height", $(document).height() / 1.8)
        $('#graph-container-ex').css("height", $(document).height() / 1.8)
    });
    // Meteor.call('countJoinDistrict', function (err, res) {
    //     var g = new JustGage({
    //         id: "gauge",
    //         value: parseInt(20),
    //         min: 0,
    //         max: 100
    //     });
    // })
    Meteor.call('tambonAssessmentOverview', function (err, res) {
        var g = new JustGage({
            id: "gauge",
            value: parseInt(res),
            min: 0,
            max: 100
        });
    })


    // tab 2
    $('#zoneltc').remove(); // this is my <canvas> element
    $('#graph-container-ltc').append('<canvas id="zoneltc" style="width:100%;height:320px;"></canvas>');
    var ctx = document.getElementById("zoneltc").getContext("2d");
    var data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
        datasets: [{
            label: "เปรียบเทียบระดับเขตสุขภาพ",
            backgroundColor: "#F59111",
            data: [5, 3, 2, 4, 5, 6, 2, 8, 6, 9, 6, 2, 4]
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

    // tab 3
    $('#zoneelder').remove(); // this is my <canvas> element
    $('#graph-container-elder').append('<canvas id="zoneelder" style="width:100%;"></canvas>');
    $('#zonecm').remove(); // this is my <canvas> element
    $('#graph-container-cm').append('<canvas id="zonecm" style="width:100%;"></canvas>');
    var ctxcm = document.getElementById("zonecm").getContext("2d");
    ctxcm.height = 300;
    $('#zoneltc').remove(); // this is my <canvas> element
    $('#graph-container-ltc').append('<canvas id="zoneltc" style="width:100%;"></canvas>');
    var ctxeva = document.getElementById("zoneltc").getContext("2d");
    ctxeva.height = 300;
    // $('#zonecp').remove(); // this is my <canvas> element
    // $('#graph-container-cp').append('<canvas id="zonecp" style="width:100%;"></canvas>');
    // var ctxcp = document.getElementById("zonecp").getContext("2d");
    // ctxcp.height = 300;
    $('#zoneexcmcg').remove(); // this is my <canvas> element
    $('#graph-container-ex').append('<canvas id="zoneexcmcg" style="width:100%;"></canvas>');
    var ctxex = document.getElementById("zoneexcmcg").getContext("2d");
    ctxex.height = 300;

    Meteor.call('countAllElder', function (err, result) {
        Session.set('indexReportCountElder', result)
    })
    Meteor.call('countAllCp', function (err, result) {
        //  console.log(result)
        Session.set('indexReportCountCp', result)
    })
    Meteor.call('countAllCM', function (err, result) {
        // console.log(result)
        Session.set('indexReportCountCM', result)
    })
    Meteor.call('countAllCG', function (err, result) {
        // console.log(result)
        Session.set('indexReportCountCG', result)
    })

});

Template.index.helpers({
    countelder() {
        // console.log(Session.get('indexReportCountElder'))
        return Session.get('indexReportCountElder')
    },
    countcp() {
        return Session.get('indexReportCountCp')
    },
    countcm() {
        return Session.get('indexReportCountCM')
    },
    countcg() {
        return Session.get('indexReportCountCG')
    },
    percentallcp() {
        var el = Session.get('indexReportCountElder')
        var cp = Session.get('indexReportCountCp')
        var percent = ((parseInt(cp) / parseInt(el)) * 100)
        return percent.toFixed(1)
    },
});

Template.index.events({
    'click #repelder'() {
        Router.go('reportnumelder_host')
    },
    'click #repcp'() {
        Router.go('repzone_hosp')
    }
})