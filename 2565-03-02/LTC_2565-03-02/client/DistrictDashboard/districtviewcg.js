
Template.districtViewCG.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.districtViewCG.onRendered(function () {


    Session.set('getCMlistState', null)
    Session.set('PROVINCESEARCH', false)
    Session.set('skip', 0);
    Session.set('find', null);
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    var find = "";
    if (Session.get('IsDistrictSearchCG')) {
        if (Session.get('listViewCGName') == "ทั้งหมด") {
            Session.set('listViewCGNameCode', "-");
            find = "-";
        } else if (Session.get('listViewCGName') == "ดูแลผู้สูงอายุตาม Care Plan") {
            Session.set('listViewCGNameCode', "01");
            find = "01";
        } else if (Session.get('listViewCGName') == "ยังไม่มีผู้สูงอายุในความดูแล") {
            Session.set('listViewCGNameCode', "02");
            find = "02";
        } else if (Session.get('listViewCGName') == "ต้องได้รับการฟื้นฟูศักยภาพ") {
            Session.set('listViewCGNameCode', "03");
            find = "03";
        } else if (Session.get('listViewCGName') == "ลาออก") {
            Session.set('listViewCGNameCode', "04");
            find = "04";
        } else if (Session.get('listViewCGName') == "เสียชีวิต") {
            Session.set('listViewCGNameCode', "05");
            find = "05";
        }
        if (find == "-") {
            Session.set('ProvinceFindCGbyStatus', null)
            Meteor.call('DistrictGetCGStateAll', Session.get('user').DISTRICT, Session.get('skip'), 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('DistrictGetCGlistState', result)
                $('#district_name').selectize();
                $('#subdistrict_name').selectize();
                $('#province_name').selectize();
                Meteor.call('getRegProvince_name', function (error, result) {
                    $('#province_name')[0].selectize.destroy()
                    $('#province_name').selectize({ options: result, create: false });
                });
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            });
            Meteor.call('DistrictGetCGStateAll_COUNT', Session.get('user').DISTRICT, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                //console.log(result)
                Session.set('DistrictGetCGStateAll_COUNT', result)
            });
        } else {
            Session.set('ProvinceFindCGbyStatus', find)
            Meteor.call('DistrictGetCGlistState', Session.get('user').DISTRICT, find, Session.get('skip'), 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('DistrictGetCGlistState', result)
                $('#district_name').selectize();
                $('#subdistrict_name').selectize();
                $('#province_name').selectize();
                Meteor.call('getRegProvince_name', function (error, result) {
                    $('#province_name')[0].selectize.destroy()
                    $('#province_name').selectize({ options: result, create: false });
                });
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            });
            Meteor.call('DistrictGetCGlistState_COUNT', Session.get('user').DISTRICT, find, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('DistrictGetCGlistState_COUNT', result)
            });
        }
    } else {
        $('#district_name').selectize();
        $('#subdistrict_name').selectize();
        $('#province_name').selectize();
        Meteor.call('getRegProvince_name', function (error, result) {
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        });
    }
    Meteor.call('getRegDistrictLogin', Session.get('user').DISTRICT, function (err, result) {
        //Session.set('getDistrictCode',result)
        Meteor.call('getRegSubsistrict_name', result, function (error, result) {
            $('#subdistrict_name')[0].selectize.destroy()
            $('#subdistrict_name').selectize({ options: result, create: false });
        });
    })

});
Template.districtViewCG.helpers({
    page() {
        return parseInt(Session.get('skip') / 10) + 1
    },
    pagecount() {
        if (Session.get('ProvinceFindCGbyStatus')) {
            return Math.ceil(parseFloat(Session.get('DistrictGetCGlistState_COUNT') / 10))
        } else {
            return Math.ceil(parseFloat(Session.get('DistrictGetCGStateAll_COUNT') / 10))
        }

    },
    user() {
        return Session.get('user').NAME
    },
    list() {
        return Session.get('DistrictGetCGlistState')
    },
    countType() {

        if (Session.get('ProvinceFindCGbyStatus')) {
            return Session.get('DistrictGetCGlistState_COUNT')
        } else {
            return Session.get('DistrictGetCGStateAll_COUNT')
        }
    },
    listViewCGName() {
        return Session.get('listViewCGName')
    },
    edittambon() {
        return Session.get('edittambon')
    },
    districtNameWork() {
        return Session.get('districtNameWork')
    },
    profilecg() {
        if (Session.get('provinceSelectedCG')) {
            return Session.get('provinceSelectedCG')[0];
        }
    },
});
Template.districtViewCG.events({
    'click #next': function () {
        var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('DistrictGetCGlistState_COUNT'))) {
                    Meteor.call('DistrictGetCGlistState', Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('DistrictGetCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('DistrictGetCGlistState_COUNT'))) {

                    Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, Session.get('user').ZONE, Session.get('ProvinceFindCGbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('DistrictGetCGlistState', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('DistrictGetCGStateAll_COUNT'))) {
                    Meteor.call('DistrictGetCGStateAll', Session.get('user').DISTRICT, next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('DistrictGetCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);

                if (next < parseInt(Session.get('DistrictGetCGStateAll_COUNT'))) {

                    Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, Session.get('user').ZONE, Session.get('ProvinceFindCGbyStatus'), next, 10, function (err, res) {
                        console.log(res)
                        if (res) {
                            Session.set('skip', next);
                            Session.set('DistrictGetCGlistState', res)
                        }
                    })
                }
            }
        }
    },
    'click #prev': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('DistrictGetCGlistState', Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('DistrictGetCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, Session.get('user').ZONE, Session.get('ProvinceFindCGbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('DistrictGetCGlistState', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {

                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('DistrictGetCGStateAll', Session.get('user').DISTRICT, next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('DistrictGetCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('PROVINCE_SEARCH_CG',Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, Session.get('user').ZONE, Session.get('ProvinceFindCGbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('DistrictGetCGlistState', res)
                        }
                    })
                }
            }
        }
    },
    'click #first': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                Meteor.call('DistrictGetCGlistState', Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', 0);
                    Session.set('DistrictGetCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                Meteor.call('PROVINCE_SEARCH_CG',Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, null, Session.get('ProvinceFindCGbyStatus'), 0, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('DistrictGetCGlistState', res)
                    }
                })

            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                Meteor.call('DistrictGetCGStateAll', Session.get('user').DISTRICT, 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', 0);
                    Session.set('DistrictGetCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""

                Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), 0, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('DistrictGetCGlistState', res)
                    }
                })

            }
        }
    },
    'click #last': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('DistrictGetCGlistState_COUNT') - 10))
                Meteor.call('DistrictGetCGlistState', Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', next);
                    Session.set('DistrictGetCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('DistrictGetCGlistState_COUNT') - 10))
                Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), next, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('DistrictGetCGlistState', res)
                    }
                })

            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('DistrictGetCGStateAll_COUNT') - 10))
                Meteor.call('DistrictGetCGStateAll', Session.get('user').DISTRICT, next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', next);
                    Session.set('DistrictGetCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : "";
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : "";
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : "";
                var next = Math.ceil(parseFloat(Session.get('DistrictGetCGStateAll_COUNT') - 10));
                Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), next, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('DistrictGetCGlistState', res)
                    }
                })

            }
        }
    },
    'change #find': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('DistrictGetCGlistState', Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('DistrictGetCGlistState', result)
            })
            Meteor.call('DistrictGetCGlistState_COUNT', Session.get('user').DISTRICT, Session.get('ProvinceFindCGbyStatus'), Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('DistrictGetCGlistState_COUNT', result)
            })
        } else {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('DistrictGetCGStateAll', Session.get('user').DISTRICT, 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('DistrictGetCGlistState', result)
            })
            Meteor.call('DistrictGetCGStateAll_COUNT', Session.get('user').DISTRICT, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('DistrictGetCGStateAll_COUNT', result)
            })
        }
    },
    "click #search_cg"() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        //var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
        var province = Session.get('user').DISTRICT
        var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
        var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
        Session.set('IsDistrictSearchCG', false)
        if (Session.get('ProvinceFindCGbyStatus')) {
            Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, null, Session.get('ProvinceFindCGbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('PROVINCESEARCH', true)
                    Session.set('DistrictGetCGlistState', res)
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }
            })
            Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, null, Session.get('ProvinceFindCGbyStatus'), function (err, res) {
                if (res) {
                    Session.set('DistrictGetCGlistState_COUNT', res.length)
                }
            })
        } else {
            Meteor.call('PROVINCE_SEARCH_CG',  Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, null, Session.get('ProvinceFindCGbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('PROVINCESEARCH', true)
                    Session.set('DistrictGetCGlistState', res)
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }
            })
            Meteor.call('PROVINCE_SEARCH_CG',  Session.get('user').DISTRICT, Session.get('user').DISTRICT, subdis, null, Session.get('ProvinceFindCGbyStatus'), function (err, res) {
                if (res) {
                    Session.set('DistrictGetCGStateAll_COUNT', res.length)
                }
            })
        }


    },

    "change #subdistrict_name"() {
        var res = $('#subdistrict_name').val().split("-")
        Session.set('districtNameWork', res[0])
    },

    "click #viewcg"() {
        var cid = this.CID
        Meteor.call('viewEachCGProvince', cid, function (error, result) {
            Session.set('provinceSelectedCG', result);

        });
    },
    "click #printcg"() {
        if (Session.get('provinceSelectedCG')) {
            $('#cgprofile').modal('hide');
            setTimeout(() => {
                Router.go('/printprofilecg')
            }, 1000);

        } else {
            toastr.error("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", "ไม่สำเร็จ");
        }
    },
    'click #download': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsdiscg/' + Session.get('find') + '/' + Session.get('user').ZONE + '/' + Session.get('ProvinceFindCGbyStatus') + '/' + Session.get('user').DISTRICT);
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsdiscg/-' + '/' + Session.get('user').ZONE + '/' + Session.get('ProvinceFindCGbyStatus') + '/' + Session.get('user').DISTRICT);
            }
        } else {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsdiscgall/' + Session.get('find') + '/' + Session.get('user').ZONE + '/' + Session.get('user').DISTRICT);
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsdiscgall/-' + '/' + Session.get('user').ZONE + '/' + Session.get('user').DISTRICT);
            }
        }
    },
    'click #editAll'() {
            Session.set('hpcEditCmDetail2', this.CID);
            // console.log(this.CID);
            
            setTimeout(() => {
                Router.go('/districteditcg')
            }, 500);
    },
});
