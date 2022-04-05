Template.reportzoneexpire.onCreated(function() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
});


Template.reportzoneexpire.onRendered(function() {
    $('body.waitMe_body').addClass('hideMe');
    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    $('.dropdown-submenu a.test').on("click", function(e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
    Session.set('zoneselect', null);
    Session.set('provinceselect', null);
    Session.set('amphoeselect', null);
    Session.set('personExpiry', null);
    Session.set('datatableobjsum', null);
    Session.set('datatable', null);
    Session.set('textSelect', null);

    Session.set('personselect', $('#personselect').val())
    Session.set('yearselect', $('#yearselect').val())
    var year = parseInt($('#yearselect').val()) - 543;
    var minThYear = parseInt($('#yearselect').val()) - 2500;
    var zone = $('#zoneselect').val()
    var province = $('#provinceselect').val()
    var amphoe = $('#amphoeselect').val()
    var tambon = $('#districtselect').val()
    Session.set('yearex', parseInt($('#yearselect').val()));
    Session.set('minThYear', minThYear);
    // Chart
    Meteor.call('cmExpiryChart', year, zone, province, amphoe, tambon, function(error, success) {
        if (error) {
            console.log('error', error);
        }
        if (success) {
            Session.set('personExpiry', success)
            var obj = {
                oct: 0,
                nov: 0,
                dec: 0,
                jan: 0,
                fab: 0,
                mar: 0,
                api: 0,
                may: 0,
                jun: 0,
                jul: 0,
                aug: 0,
                sep: 0,
                sum: 0
            }
            for (let index = 0; index < success.length; index++) {
                const element = success[index];
                if (element._id.monthex == 1) {
                    obj.jan = element.count
                } else if (element._id.monthex == 2) {
                    obj.fab = element.count
                } else if (element._id.monthex == 3) {
                    obj.mar = element.count
                } else if (element._id.monthex == 4) {
                    obj.api = element.count
                } else if (element._id.monthex == 5) {
                    obj.may = element.count
                } else if (element._id.monthex == 6) {
                    obj.jun = element.count
                } else if (element._id.monthex == 7) {
                    obj.jul = element.count
                } else if (element._id.monthex == 8) {
                    obj.aug = element.count
                } else if (element._id.monthex == 9) {
                    obj.sep = element.count
                } else if (element._id.monthex == 10) {
                    obj.oct = element.count
                } else if (element._id.monthex == 11) {
                    obj.nov = element.count
                } else if (element._id.monthex == 12) {
                    obj.dec = element.count
                }
                obj.sum += parseInt(element.count)
            }
            Session.set('personExpiry', obj)
            $('#zonecm').remove(); // this is my <canvas> element
            $('#graph-container').append('<canvas id="zonecm" style="width:100%;height:320px;"></canvas>');
            var ctx = document.getElementById("zonecm").getContext("2d");
            var data = {
                labels: ['ต.ค. ' + parseInt(minThYear - 1), 'พ.ย. ' + parseInt(minThYear - 1), 'ธ.ค. ' + parseInt(minThYear - 1), 'ม.ค. ' + minThYear, 'ก.พ. ' + minThYear, 'มี.ค. ' + minThYear, 'เม.ย. ' + minThYear, 'พ.ค. ' + minThYear, 'มิ.ย. ' + minThYear, 'ก.ค. ' + minThYear, 'ส.ค. ' + minThYear, 'ก.ย. ' + minThYear],
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


        }
    });
    // Table
    var key = "ZONE"
    if (zone != "all") {
        key = "PROVINCE"
        Session.set('textSelect', "ศูนย์เขตอนามัยที่ " + $('#zoneselect').val());
        if (province != "all") {
            key = "AMPHOE"
            Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
            if (amphoe != "all") {
                key = "DISTRICT"
                Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
                if (tambon != "all") {
                    Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val() + " ต." + $('#districtselect').val());
                } else if (tambon == "all") {
                    Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
                }
            } else if (amphoe == "all") {
                Session.set('textSelect', "จ. " + $('#provinceselect').val());
            }

        } else if (province == "all") {
            Session.set('textSelect', "ศูนย์เขตอนามัยที่ " + $('#zoneselect').val())
        }
    } else if (zone == "all") {
        Session.set('textSelect', "ทั้งหมด")
    }


    Meteor.call('cmExpiryTable', year, zone, province, amphoe, tambon, function(error, success) {
        if (error) {
            console.log('error', error);
        }
        if (success) {

            var dataobj = [];
            for (let index = 0; index < success.length; index++) {
                var element = success[index];
                // console.log(element._id);
                if (element._id[key]) {
                    var obj = {
                        province: "",
                        oct: 0,
                        nov: 0,
                        dec: 0,
                        jan: 0,
                        fab: 0,
                        mar: 0,
                        api: 0,
                        may: 0,
                        jun: 0,
                        jul: 0,
                        aug: 0,
                        sep: 0,
                        sum: 0
                    }

                    var repeat = false;
                    for (let index2 = 0; index2 < dataobj.length; index2++) {
                        const x = dataobj[index2];
                        if (x.province == element._id[key]) {
                            repeat = true
                            if (element._id.monthex == 1) {
                                x.jan += element.count
                            } else if (element._id.monthex == 2) {
                                x.fab += element.count
                            } else if (element._id.monthex == 3) {
                                x.mar += element.count
                            } else if (element._id.monthex == 4) {
                                x.api += element.count
                            } else if (element._id.monthex == 5) {
                                x.may += element.count
                            } else if (element._id.monthex == 6) {
                                x.jun += element.count
                            } else if (element._id.monthex == 7) {
                                x.jul += element.count
                            } else if (element._id.monthex == 8) {
                                x.aug += element.count
                            } else if (element._id.monthex == 9) {
                                x.sep += element.count
                            } else if (element._id.monthex == 10) {
                                x.oct += element.count
                            } else if (element._id.monthex == 11) {
                                x.nov += element.count
                            } else if (element._id.monthex == 12) {
                                x.dec += element.count
                            }
                            x.sum += element.count
                        }
                    }

                    obj.province = element._id[key];
                    if (element._id.monthex == 1) {
                        obj.jan = element.count
                    } else if (element._id.monthex == 2) {
                        obj.fab = element.count
                    } else if (element._id.monthex == 3) {
                        obj.mar = element.count
                    } else if (element._id.monthex == 4) {
                        obj.api = element.count
                    } else if (element._id.monthex == 5) {
                        obj.may = element.count
                    } else if (element._id.monthex == 6) {
                        obj.jun = element.count
                    } else if (element._id.monthex == 7) {
                        obj.jul = element.count
                    } else if (element._id.monthex == 8) {
                        obj.aug = element.count
                    } else if (element._id.monthex == 9) {
                        obj.sep = element.count
                    } else if (element._id.monthex == 10) {
                        obj.oct = element.count
                    } else if (element._id.monthex == 11) {
                        obj.nov = element.count
                    } else if (element._id.monthex == 12) {
                        obj.dec = element.count
                    }
                    obj.sum += parseInt(element.count);
                    if (repeat == false) {
                        dataobj.push(obj)
                    }
                }
            }


            var objsum = {
                    province: "รวม",
                    oct: dataobj.sum("oct"),
                    nov: dataobj.sum("nov"),
                    dec: dataobj.sum("dec"),
                    jan: dataobj.sum("jan"),
                    fab: dataobj.sum("fab"),
                    mar: dataobj.sum("mar"),
                    api: dataobj.sum("api"),
                    may: dataobj.sum("may"),
                    jun: dataobj.sum("jun"),
                    jul: dataobj.sum("jul"),
                    aug: dataobj.sum("aug"),
                    sep: dataobj.sum("sep"),
                    sum: dataobj.sum("sum")
                }
                // console.log(dataobj, objsum)
            Session.set('datatableobjsum', objsum);
            Session.set('datatable', dataobj);
        }
    });

});

Template.reportzoneexpire.helpers({
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


Template.reportzoneexpire.events({
    'click #printrep' () {
        Session.set('sendToPrintReport3_1', Session.get('personexpiry'))
        Session.set('sendToPrintReport3_2', Session.get('cgpersonexpiry'))
        Router.go('/printexpirezone')
    },
    'change #zoneselect' () {
        Session.set('zoneselect', null);
        Session.set('provinceselect', null);
        Session.set('amphoeselect', null);
        Meteor.call('getAllProvinceByZoneReport', $('#zoneselect').val(), function(error, success) {
            if (error) {
                console.log('error', error);
            }
            if (success) {
                var xx = [];
                for (let index = 0; index < success.length; index++) {
                    xx.push({ province: success[index]._id.province })
                }
                Session.set('zoneselect', xx);

            }
        });
    },
    'change #provinceselect' () {
        Session.set('provinceselect', null);
        Session.set('amphoeselect', null);
        Meteor.call('getAllAmphoeByProvinceReport', $('#provinceselect').val(), function(error, success) {
            if (error) {
                console.log('error', error);
            }
            if (success) {
                var xx = [];
                for (let index = 0; index < success.length; index++) {
                    xx.push({ amphoe: success[index]._id.amphoe })
                }
                Session.set('provinceselect', xx);
            }
        });
    },
    'change #amphoeselect' () {
        Session.set('amphoeselect', null);
        Meteor.call('getAllDistrictByAmphoeReport', $('#amphoeselect').val(), function(error, success) {
            if (error) {
                console.log('error', error);
            }
            if (success) {
                var xx = [];
                for (let index = 0; index < success.length; index++) {
                    xx.push({ district: success[index]._id.district })
                }
                Session.set('amphoeselect', xx);
            }
        });
    },
    'click #find' () {
        if ($('#personselect').val() == "CM") {
            Session.set('personselect', $('#personselect').val())
            Session.set('yearselect', $('#yearselect').val())
            var year = parseInt($('#yearselect').val()) - 543;
            var minThYear = parseInt($('#yearselect').val()) - 2500;
            var zone = $('#zoneselect').val()
            var province = $('#provinceselect').val()
            var amphoe = $('#amphoeselect').val()
            var tambon = $('#districtselect').val()
            Session.set('yearex', parseInt($('#yearselect').val()));
            Session.set('minThYear', minThYear);

            // Chart
            Meteor.call('cmExpiryChart', year, zone, province, amphoe, tambon, function(error, success) {
                if (error) {
                    console.log('error', error);
                }
                if (success) {
                    Session.set('personExpiry', success)
                    var obj = {
                        oct: 0,
                        nov: 0,
                        dec: 0,
                        jan: 0,
                        fab: 0,
                        mar: 0,
                        api: 0,
                        may: 0,
                        jun: 0,
                        jul: 0,
                        aug: 0,
                        sep: 0,
                        sum: 0
                    }
                    for (let index = 0; index < success.length; index++) {
                        const element = success[index];
                        if (element._id.monthex == 1) {
                            obj.jan = element.count
                        } else if (element._id.monthex == 2) {
                            obj.fab = element.count
                        } else if (element._id.monthex == 3) {
                            obj.mar = element.count
                        } else if (element._id.monthex == 4) {
                            obj.api = element.count
                        } else if (element._id.monthex == 5) {
                            obj.may = element.count
                        } else if (element._id.monthex == 6) {
                            obj.jun = element.count
                        } else if (element._id.monthex == 7) {
                            obj.jul = element.count
                        } else if (element._id.monthex == 8) {
                            obj.aug = element.count
                        } else if (element._id.monthex == 9) {
                            obj.sep = element.count
                        } else if (element._id.monthex == 10) {
                            obj.oct = element.count
                        } else if (element._id.monthex == 11) {
                            obj.nov = element.count
                        } else if (element._id.monthex == 12) {
                            obj.dec = element.count
                        }
                        obj.sum += parseInt(element.count)
                    }
                    Session.set('personExpiry', obj)
                    $('#zonecm').remove(); // this is my <canvas> element
                    $('#graph-container').append('<canvas id="zonecm" style="width:100%;height:320px;"></canvas>');
                    var ctx = document.getElementById("zonecm").getContext("2d");
                    var data = {
                        labels: ['ต.ค. ' + parseInt(minThYear - 1), 'พ.ย. ' + parseInt(minThYear - 1), 'ธ.ค. ' + parseInt(minThYear - 1), 'ม.ค. ' + minThYear, 'ก.พ. ' + minThYear, 'มี.ค. ' + minThYear, 'เม.ย. ' + minThYear, 'พ.ค. ' + minThYear, 'มิ.ย. ' + minThYear, 'ก.ค. ' + minThYear, 'ส.ค. ' + minThYear, 'ก.ย. ' + minThYear],
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


                }
            });
            // Table
            var key = "ZONE"
            if (zone != "all") {
                key = "PROVINCE"
                Session.set('textSelect', "ศูนย์เขตอนามัยที่ " + $('#zoneselect').val());
                if (province != "all") {
                    key = "AMPHOE"
                    Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
                    if (amphoe != "all") {
                        key = "DISTRICT"
                        Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
                        if (tambon != "all") {
                            Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val() + " ต." + $('#districtselect').val());
                        } else if (tambon == "all") {
                            Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
                        }
                    } else if (amphoe == "all") {
                        Session.set('textSelect', "จ. " + $('#provinceselect').val());
                    }

                } else if (province == "all") {
                    Session.set('textSelect', "ศูนย์เขตอนามัยที่ " + $('#zoneselect').val())
                }
            } else if (zone == "all") {
                Session.set('textSelect', "ทั้งหมด")
            }


            Meteor.call('cmExpiryTable', year, zone, province, amphoe, tambon, function(error, success) {
                if (error) {
                    console.log('error', error);
                }
                if (success) {

                    var dataobj = [];
                    for (let index = 0; index < success.length; index++) {
                        var element = success[index];
                        // console.log(element._id);
                        if (element._id[key]) {
                            var obj = {
                                province: "",
                                oct: 0,
                                nov: 0,
                                dec: 0,
                                jan: 0,
                                fab: 0,
                                mar: 0,
                                api: 0,
                                may: 0,
                                jun: 0,
                                jul: 0,
                                aug: 0,
                                sep: 0,
                                sum: 0
                            }

                            var repeat = false;
                            for (let index2 = 0; index2 < dataobj.length; index2++) {
                                const x = dataobj[index2];
                                if (x.province == element._id[key]) {
                                    repeat = true
                                    if (element._id.monthex == 1) {
                                        x.jan += element.count
                                    } else if (element._id.monthex == 2) {
                                        x.fab += element.count
                                    } else if (element._id.monthex == 3) {
                                        x.mar += element.count
                                    } else if (element._id.monthex == 4) {
                                        x.api += element.count
                                    } else if (element._id.monthex == 5) {
                                        x.may += element.count
                                    } else if (element._id.monthex == 6) {
                                        x.jun += element.count
                                    } else if (element._id.monthex == 7) {
                                        x.jul += element.count
                                    } else if (element._id.monthex == 8) {
                                        x.aug += element.count
                                    } else if (element._id.monthex == 9) {
                                        x.sep += element.count
                                    } else if (element._id.monthex == 10) {
                                        x.oct += element.count
                                    } else if (element._id.monthex == 11) {
                                        x.nov += element.count
                                    } else if (element._id.monthex == 12) {
                                        x.dec += element.count
                                    }
                                    x.sum += element.count
                                }
                            }

                            obj.province = element._id[key];
                            if (element._id.monthex == 1) {
                                obj.jan = element.count
                            } else if (element._id.monthex == 2) {
                                obj.fab = element.count
                            } else if (element._id.monthex == 3) {
                                obj.mar = element.count
                            } else if (element._id.monthex == 4) {
                                obj.api = element.count
                            } else if (element._id.monthex == 5) {
                                obj.may = element.count
                            } else if (element._id.monthex == 6) {
                                obj.jun = element.count
                            } else if (element._id.monthex == 7) {
                                obj.jul = element.count
                            } else if (element._id.monthex == 8) {
                                obj.aug = element.count
                            } else if (element._id.monthex == 9) {
                                obj.sep = element.count
                            } else if (element._id.monthex == 10) {
                                obj.oct = element.count
                            } else if (element._id.monthex == 11) {
                                obj.nov = element.count
                            } else if (element._id.monthex == 12) {
                                obj.dec = element.count
                            }
                            obj.sum += parseInt(element.count);
                            if (repeat == false) {
                                dataobj.push(obj)
                            }
                        }
                    }


                    var objsum = {
                            province: "รวม",
                            oct: dataobj.sum("oct"),
                            nov: dataobj.sum("nov"),
                            dec: dataobj.sum("dec"),
                            jan: dataobj.sum("jan"),
                            fab: dataobj.sum("fab"),
                            mar: dataobj.sum("mar"),
                            api: dataobj.sum("api"),
                            may: dataobj.sum("may"),
                            jun: dataobj.sum("jun"),
                            jul: dataobj.sum("jul"),
                            aug: dataobj.sum("aug"),
                            sep: dataobj.sum("sep"),
                            sum: dataobj.sum("sum")
                        }
                        // console.log(dataobj, objsum)
                    Session.set('datatableobjsum', objsum);
                    Session.set('datatable', dataobj);
                }
            });
        } else {
            Session.set('personselect', $('#personselect').val())
            Session.set('yearselect', $('#yearselect').val())
            var year = parseInt($('#yearselect').val()) - 543;
            var minThYear = parseInt($('#yearselect').val()) - 2500;
            var zone = $('#zoneselect').val()
            var province = $('#provinceselect').val()
            var amphoe = $('#amphoeselect').val()
            var tambon = $('#districtselect').val()
            Session.set('yearex', parseInt($('#yearselect').val()));
            Session.set('minThYear', minThYear);
            // Chart
            Meteor.call('cgExpiryChart', year, zone, province, amphoe, tambon, function(error, success) {
                if (error) {
                    console.log('error', error);
                }
                if (success) {
                    Session.set('personExpiry', success)
                    var obj = {
                        oct: 0,
                        nov: 0,
                        dec: 0,
                        jan: 0,
                        fab: 0,
                        mar: 0,
                        api: 0,
                        may: 0,
                        jun: 0,
                        jul: 0,
                        aug: 0,
                        sep: 0,
                        sum: 0
                    }
                    for (let index = 0; index < success.length; index++) {
                        const element = success[index];
                        if (element._id.monthex == 1) {
                            obj.jan = element.count
                        } else if (element._id.monthex == 2) {
                            obj.fab = element.count
                        } else if (element._id.monthex == 3) {
                            obj.mar = element.count
                        } else if (element._id.monthex == 4) {
                            obj.api = element.count
                        } else if (element._id.monthex == 5) {
                            obj.may = element.count
                        } else if (element._id.monthex == 6) {
                            obj.jun = element.count
                        } else if (element._id.monthex == 7) {
                            obj.jul = element.count
                        } else if (element._id.monthex == 8) {
                            obj.aug = element.count
                        } else if (element._id.monthex == 9) {
                            obj.sep = element.count
                        } else if (element._id.monthex == 10) {
                            obj.oct = element.count
                        } else if (element._id.monthex == 11) {
                            obj.nov = element.count
                        } else if (element._id.monthex == 12) {
                            obj.dec = element.count
                        }
                        obj.sum += parseInt(element.count)
                    }
                    Session.set('personExpiry', obj)
                    $('#zonecm').remove(); // this is my <canvas> element
                    $('#graph-container').append('<canvas id="zonecm" style="width:100%;height:320px;"></canvas>');
                    var ctx = document.getElementById("zonecm").getContext("2d");
                    var data = {
                        labels: ['ต.ค. ' + parseInt(minThYear - 1), 'พ.ย. ' + parseInt(minThYear - 1), 'ธ.ค. ' + parseInt(minThYear - 1), 'ม.ค. ' + minThYear, 'ก.พ. ' + minThYear, 'มี.ค. ' + minThYear, 'เม.ย. ' + minThYear, 'พ.ค. ' + minThYear, 'มิ.ย. ' + minThYear, 'ก.ค. ' + minThYear, 'ส.ค. ' + minThYear, 'ก.ย. ' + minThYear],
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


                }
            });
            // Table
            var key = "ZONE"
            if (zone != "all") {
                key = "PROVINCE"
                Session.set('textSelect', "ศูนย์เขตอนามัยที่ " + $('#zoneselect').val());
                if (province != "all") {
                    key = "AMPHOE"
                    Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
                    if (amphoe != "all") {
                        key = "DISTRICT"
                        Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
                        if (tambon != "all") {
                            Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val() + " ต." + $('#districtselect').val());
                        } else if (tambon == "all") {
                            Session.set('textSelect', "จ. " + $('#provinceselect').val() + " อ." + $('#amphoeselect').val());
                        }
                    } else if (amphoe == "all") {
                        Session.set('textSelect', "จ. " + $('#provinceselect').val());
                    }

                } else if (province == "all") {
                    Session.set('textSelect', "ศูนย์เขตอนามัยที่ " + $('#zoneselect').val())
                }
            } else if (zone == "all") {
                Session.set('textSelect', "ทั้งหมด")
            }


            Meteor.call('cgExpiryTable', year, zone, province, amphoe, tambon, function(error, success) {
                if (error) {
                    console.log('error', error);
                }
                if (success) {

                    var dataobj = [];
                    for (let index = 0; index < success.length; index++) {
                        var element = success[index];
                        // console.log(element._id);
                        if (element._id[key]) {
                            var obj = {
                                province: "",
                                oct: 0,
                                nov: 0,
                                dec: 0,
                                jan: 0,
                                fab: 0,
                                mar: 0,
                                api: 0,
                                may: 0,
                                jun: 0,
                                jul: 0,
                                aug: 0,
                                sep: 0,
                                sum: 0
                            }

                            var repeat = false;
                            for (let index2 = 0; index2 < dataobj.length; index2++) {
                                const x = dataobj[index2];
                                if (x.province == element._id[key]) {
                                    repeat = true
                                    if (element._id.monthex == 1) {
                                        x.jan += element.count
                                    } else if (element._id.monthex == 2) {
                                        x.fab += element.count
                                    } else if (element._id.monthex == 3) {
                                        x.mar += element.count
                                    } else if (element._id.monthex == 4) {
                                        x.api += element.count
                                    } else if (element._id.monthex == 5) {
                                        x.may += element.count
                                    } else if (element._id.monthex == 6) {
                                        x.jun += element.count
                                    } else if (element._id.monthex == 7) {
                                        x.jul += element.count
                                    } else if (element._id.monthex == 8) {
                                        x.aug += element.count
                                    } else if (element._id.monthex == 9) {
                                        x.sep += element.count
                                    } else if (element._id.monthex == 10) {
                                        x.oct += element.count
                                    } else if (element._id.monthex == 11) {
                                        x.nov += element.count
                                    } else if (element._id.monthex == 12) {
                                        x.dec += element.count
                                    }
                                    x.sum += element.count
                                }
                            }

                            obj.province = element._id[key];
                            if (element._id.monthex == 1) {
                                obj.jan = element.count
                            } else if (element._id.monthex == 2) {
                                obj.fab = element.count
                            } else if (element._id.monthex == 3) {
                                obj.mar = element.count
                            } else if (element._id.monthex == 4) {
                                obj.api = element.count
                            } else if (element._id.monthex == 5) {
                                obj.may = element.count
                            } else if (element._id.monthex == 6) {
                                obj.jun = element.count
                            } else if (element._id.monthex == 7) {
                                obj.jul = element.count
                            } else if (element._id.monthex == 8) {
                                obj.aug = element.count
                            } else if (element._id.monthex == 9) {
                                obj.sep = element.count
                            } else if (element._id.monthex == 10) {
                                obj.oct = element.count
                            } else if (element._id.monthex == 11) {
                                obj.nov = element.count
                            } else if (element._id.monthex == 12) {
                                obj.dec = element.count
                            }
                            obj.sum += parseInt(element.count);
                            if (repeat == false) {
                                dataobj.push(obj)
                            }
                        }
                    }


                    var objsum = {
                            province: "รวม",
                            oct: dataobj.sum("oct"),
                            nov: dataobj.sum("nov"),
                            dec: dataobj.sum("dec"),
                            jan: dataobj.sum("jan"),
                            fab: dataobj.sum("fab"),
                            mar: dataobj.sum("mar"),
                            api: dataobj.sum("api"),
                            may: dataobj.sum("may"),
                            jun: dataobj.sum("jun"),
                            jul: dataobj.sum("jul"),
                            aug: dataobj.sum("aug"),
                            sep: dataobj.sum("sep"),
                            sum: dataobj.sum("sum")
                        }
                        // console.log(dataobj, objsum)
                    Session.set('datatableobjsum', objsum);
                    Session.set('datatable', dataobj);
                }
            });
        }
    }

});

Array.prototype.sum = function(prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
        total += this[i][prop]
    }
    return total
}