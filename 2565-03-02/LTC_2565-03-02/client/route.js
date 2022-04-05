Router.route('/', function () {
    if (Meteor.Device.isTablet() || Meteor.Device.isPhone()) {
        $("meta[name='viewport']").attr('content', 'width=device-width, initial-scale=1.0');
        if ($.cookie('userlogin')) {
            var user = JSON.parse($.cookie('userlogin'))
            // console.log(user);
            Session.set('Session', true);
            Session.set('provinceid', user.provinceid);
            Session.set('_idLoginCM', user._idLoginCM);
            if (parseInt(user.user) < 13) {
                Session.set('user', user.user);
                Session.set('cmname', user.cmname);
                Session.set('cmid', user.cmid);
                Session.set('cmznum', user.cmznum);
                Session.set('_idCM', user._idCM);

                Session.set('viewProfile', false)
                Session.set('viewCG', false)
                Session.set('viewElder', true)
                Session.set('viewBetterElder', false)
                Session.set('viewDeathElder', false)
                Session.set('viewCmEvaluate', false)
                Router.go("/CMdashboard_m");
            } else {
                this.render('login_m')
            }
        } else {
            this.render('login_m')
        }

    } else {
        if ($.cookie('userlogin')) {
            var user = JSON.parse($.cookie('userlogin'))
            // console.log(user);
            Session.set('Session', true);
            Session.set('provinceid', user.provinceid);
            Session.set('_idLoginCM', user._idLoginCM);
            if (user.user.RULE == "PROVINCE") {
                Session.set('user', user.user);
                Router.go("/province");
            } else if (user.user.RULE == "HPC") {
                Session.set('user', user.user);
                Router.go("/hpcindex");
            } else if (user.user.RULE == "DISTRICT") {
                Session.set('user', user.user);
                Router.go("/districtindex");
            } else if (user.user.RULE == "ADMIN") {
                Session.set('user', user.user);
                Router.go("/admin");
            } else if (parseInt(user.user) < 13) {
                Session.set('user', user.user);
                Session.set('cmname', user.cmname);
                Session.set('cmid', user.cmid);
                Session.set('cmznum', user.cmznum);
                Session.set('_idCM', user._idCM);

                Session.set('viewProfile', false)
                Session.set('viewCG', false)
                Session.set('viewElder', true)
                Session.set('viewBetterElder', false)
                Session.set('viewDeathElder', false)
                Session.set('viewCmEvaluate', false)
                Router.go("/CMdashboard");
            } else {
                this.render('index')
            }
        } else {
            this.render('index')
        }
    }



    // this.render('index')
});

Router.route('/CMdashboard_m', function () {
    if (Session.get('Session')) {
        this.render('CMdashboard_m')
    } else {
        Router.go('/')
    }
});
Router.route('/adl_m', function () {
    if (Session.get('Session')) {
        this.render('adl_m')
    } else {
        Router.go('/')
    }
});
Router.route('/logout', function () {
    var cookies = $.cookie();
    for (var cookie in cookies) {
        $.removeCookie(cookie);
    }
    Router.go('/')
});


Router.route('/login', function () {
    this.render('login')
});

Router.route('/elearning', function () {
    this.render('e_learning')
});


Router.route('/faq', function () {
    this.render('faq')
});

///-----------------------------------
Router.route('/approvecg', function () {
    if (Session.get('Session')) {
        this.render('approvecg')
    } else {
        Router.go('/')
    }
});
///----------------API-------------------

Router.route('/admin', function () {
    if (Session.get('Session')) {
        this.render('admin')
    } else {
        Router.go('/')
    }
});


////-------------------------------------

Router.route('/formregcm', function () {
    this.render('formregcm');
});

Router.route('/formregcg', function () {
    this.render('formregcg');
});

Router.route('/formregcc', function () {
    this.render('formregcc');
});
// Router.route('/mobileregiscm', function() {
//     this.render('mobileregiscm');
// });

Router.route('/forget', function () {
    this.render('forget')
});

Router.route('/printprofilecg', function () {
    if (Session.get('Session')) {
        this.render('printprofilecg')
    } else {
        Router.go('/')
    }
});


Router.route('/hpcapprovecmex', function () {
    if (Session.get('Session')) {
        this.render('hpcapprovecmex')
    } else {
        Router.go('/')
    }
});

Router.route('/hpcapprovecgex', function () {
    if (Session.get('Session')) {
        this.render('hpcapprovecgex')
    } else {
        Router.go('/')
    }
});

Router.route('/CMdashboard', function () {
    if (Session.get('Session')) {
        this.render('CMdashboard')
    } else {
        Router.go('/')
    }
});

Router.route('/cmRequestChange', function () {
    if (Session.get('Session')) {
        this.render('cmRequestChange')
    } else {
        Router.go('/')
    }
});

Router.route('/admincg', function () {
    if (Session.get('Session')) {
        this.render('admincg')
    } else {
        Router.go('/')
    }
});

Router.route('/adminamp', function () {
    this.render('adminamp')
});

Router.route('/hpcapprovehistoryhosp', function () {
    if (Session.get('Session')) {
        this.render('hpcapprovehistoryhosp')
    } else {
        Router.go('/')
    }
});

Router.route('/hpcapprovedistrict', function () {
    if (Session.get('Session')) {
        this.render('hpcapprovedistrict')
    } else {
        Router.go('/')
    }
});

Router.route('/admineditelder', function () {
    if (Session.get('Session')) {
        this.render('admineditelder')
    } else {
        Router.go('/')
    }
});

Router.route('/admineditcm', function () {
    if (Session.get('Session')) {
        this.render('admineditcm')
    } else {
        Router.go('/')
    }
});

Router.route('/admineditcg', function () {
    if (Session.get('Session')) {
        this.render('admineditcg')
    } else {
        Router.go('/')
    }
});

Router.route('/districteditcg', function () {
    if (Session.get('Session')) {
        this.render('districteditcg')
    } else {
        Router.go('/')
    }
});

Router.route('/printprofilecm', function () {
    if (Session.get('Session')) {
        this.render('printprofilecm')
    } else {
        Router.go('/')
    }
});

Router.route('/editaccount', function () {
    if (Session.get('Session')) {
        this.render('editaccount')
    } else {
        Router.go('/')
    }
});
Router.route('/provinceeditcg', function () {
    if (Session.get('Session')) {
        this.render('provinceeditcg')
    } else {
        Router.go('/')
    }
});

Router.route('/newlogin', function () {
    if (Session.get('Session')) {
        this.render('newlogin')
    } else {
        Router.go('/')
    }
});

Router.route('/province', function () {
    if (Session.get('Session')) {
        this.render('province')
    } else {
        Router.go('/')
    }
});

Router.route('/provinceViewCG', function () {
    if (Session.get('Session')) {
        this.render('provinceViewCG')
    } else {
        Router.go('/')
    }
});

Router.route('/provinceViewCM', function () {
    if (Session.get('Session')) {
        this.render('provinceViewCM')
    } else {
        Router.go('/')
    }
});

Router.route('/provinceevaluateltc', function () {
    if (Session.get('Session')) {
        this.render('provinceevaluateltc')
    } else {
        Router.go('/')
    }
});

Router.route('/districtevaluateltc', function () {
    if (Session.get('Session')) {
        this.render('districtevaluateltc')
    } else {
        Router.go('/')
    }
});

Router.route('/cmchangepwd', function () {
    if (Session.get('Session')) {
        this.render('cmchangepwd')
    } else {
        Router.go('/')
    }
});
////////////////////////////////////////////CARE PLAN/////////////////////////////////////

Router.route('/editelder', function () {
    if (Session.get('Session')) {
        this.render('editelder')
    } else {
        Router.go('/')
    }

});

Router.route('/searchelder', function () {
    if (Session.get('Session')) {
        this.render('searchelder')
    } else {
        Router.go('/')
    }

});

Router.route('/simplecareplan', function () {
    if (Session.get('Session')) {
        this.render('simplecareplan')
    } else {
        Router.go('/')
    }

});

Router.route('/fullcareplan', function () {
    if (Session.get('Session')) {
        this.render('fullcareplan')
    } else {
        Router.go('/')
    }

});

Router.route('/careplanhistory', function () {
    if (Session.get('Session')) {
        this.render('careplanhistory')
    } else {
        Router.go('/')
    }

});

Router.route('/printcpsimple', function () {
    if (Session.get('Session')) {
        this.render('printcpsimple')
    } else {
        Router.go('/')
    }

});

Router.route('/printcpsimple_sign', function () {
    if (Session.get('Session')) {
        this.render('printcpsimple_sign')
    } else {
        Router.go('/')
    }

});



Router.route('/printcpfull', function () {
    if (Session.get('Session')) {
        this.render('printcpfull')
    } else {
        Router.go('/')
    }
});

Router.route('/printcpfull2', function () {
    if (Session.get('Session')) {
        this.render('printcpfull2')
    } else {
        Router.go('/')
    }
});


/////////////////////////////////////////////////////////////////////////////////////////

//--------------------------------HPC------------------------------------------------//


Router.route('/hpcevaluateltc', function () {
    if (Session.get('Session')) {
        this.render('hpcevaluateltc')
    } else {
        Router.go('/')
    }
});

Router.route('/tambon_assessment', function () {
    if (Session.get('Session')) {
        this.render('tambon_assessment')
    } else {
        Router.go('/')
    }
});

Router.route('/hpcapprovecg', function () {
    if (Session.get('Session')) {
        this.render('hpcapprovecg')
    } else {
        Router.go('/')
    }
});

Router.route('/hpcapprovecm', function () {
    if (Session.get('Session')) {
        this.render('hpcapprovecm')
    } else {
        Router.go('/')
    }
});

Router.route('/hpcindex', function () {
    if (Session.get('Session')) {
        this.render('hpcindex')
    } else {
        Router.go('/')
    }
});

Router.route('/hpcviewcg', function () {
    if (Session.get('Session')) {
        this.render('hpcviewcg')
    } else {
        Router.go('/')
    }
});

Router.route('/hpcviewcm', function () {
    if (Session.get('Session')) {
        this.render('hpcviewcm')
    } else {
        Router.go('/')
    }
});

Router.route('/hpceditcg', function () {
    if (Session.get('Session')) {
        this.render('hpceditcg')
    } else {
        Router.go('/')
    }
});

Router.route('/previewprintcpsimple', function () {
    if (Session.get('Session')) {
        this.render('previewprintcpsimple')
    } else {
        Router.go('/')
    }
});

Router.route('/previewprintfull', function () {
    if (Session.get('Session')) {
        this.render('previewprintfull')
    } else {
        Router.go('/')
    }
});
//--------------------------------REPORT------------------------------------------------//

Router.route('/reportzonenum', function () {

    this.render('reportzonenum')

});


Router.route('/reportzonecp', function () {

    this.render('reportzonecp')

});

Router.route('/printzonecp', function () {

    this.render('printzonecp')

});

Router.route('/reportprovincenum', function () {

    this.render('reportprovincenum')

});

Router.route('/reportzoneexpire', function () {

    this.render('reportzoneexpire')

});

Router.route('/cmeditcg', function () {
    if (Session.get('Session')) {
        this.render('cmeditcg')
    } else {
        Router.go('/')
    }

});

Router.route('/hpceditcm', function () {
    if (Session.get('Session')) {
        this.render('hpceditcm')
    } else {
        Router.go('/')
    }
});


Router.route('/provinceeditcm', function () {
    if (Session.get('Session')) {
        this.render('provinceeditcm')
    } else {
        Router.go('/')
    }
});

Router.route('/printexpirezone', function () {
    this.render('printexpirezone')
});

Router.route('/printzonenum', function () {
    this.render('printzonenum')
});

Router.route('/printreport', function () {
    this.render('printreport')
});
//-------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------//

Router.route('/mapcmcg', function () {
    this.render('mapcmcg');
});

Router.route('/reportamphoenum', function () {
    this.render('reportamphoenum');
});

Router.route('/printamphoenum', function () {
    this.render('printamphoenum');
});

Router.route('/reporttambonnum', function () {
    this.render('reporttambonnum');
});

Router.route('/printtambonnum', function () {
    this.render('printtambonnum');
});

Router.route('/printhospnum', function () {
    this.render('printhospnum');
});


Router.route('/reporthospnum', function () {
    this.render('reporthospnum');
});


Router.route('/reportnumelder', function () {
    this.render('reportnumelder');
});

Router.route('/printnumelder', function () {
    this.render('printnumelder');
});

Router.route('/reportprovincenumelder', function () {
    this.render('reportprovincenumelder');
});

Router.route('/printprovincenumelder', function () {
    this.render('printprovincenumelder');
});

Router.route('/reportamphoenumelder', function () {
    this.render('reportamphoenumelder');
});

Router.route('/printamphoenumelder', function () {
    this.render('printamphoenumelder');
});

Router.route('/reporttambonnumelder', function () {
    this.render('reporttambonnumelder');
});

Router.route('/printtambonnumelder', function () {
    this.render('printtambonnumelder');
});

Router.route('/reporthospelder', function () {
    this.render('reporthospelder');
});

Router.route('/printhospelder', function () {
    this.render('printhospelder');
});

Router.route('/reportprovincecp', function () {
    this.render('reportprovincecp');
});

Router.route('/printprovincecp', function () {
    this.render('printprovincecp');
});


Router.route('/reportamphoecp', function () {
    this.render('reportamphoecp');
});

Router.route('/printamphoecp', function () {
    this.render('printamphoecp');
});

Router.route('/reporttamboncp', function () {
    this.render('reporttamboncp');
});

Router.route('/printtamboncp', function () {
    this.render('printtammboncp');
});

Router.route('/reporthospcp', function () {
    this.render('reporthospcp');
});

Router.route('/printhospcp', function () {
    this.render('printhospcp');
});
//--------------------------------DISTRICT------------------------------------------------//
Router.route('/districtindex', function () {
    if (Session.get('Session')) {
        this.render('districtindex');
    } else {
        Router.go('/')
    }
});

Router.route('/districtViewCM', function () {
    if (Session.get('Session')) {
        this.render('districtViewCM');
    } else {
        Router.go('/')
    }
});

Router.route('/districtViewCG', function () {
    if (Session.get('Session')) {
        this.render('districtViewCG');
    } else {
        Router.go('/')
    }
});

Router.route('/districtapprovecgex', function () {
    if (Session.get('Session')) {
        this.render('districtapprovecgex');
    } else {
        Router.go('/')
    }
});

Router.route('/provinceapprovecgex', function () {
    if (Session.get('Session')) {
        this.render('provinceapprovecgex');
    } else {
        Router.go('/')
    }
});

Router.route('/districteditcm', function () {
    if (Session.get('Session')) {
        this.render('districteditcm');
    } else {
        Router.go('/')
    }
});

Router.route('/admincm', function () {
    if (Session.get('Session')) {
        this.render('admincm');
    } else {
        Router.go('/')
    }
});

//------------------------------------------------------------------------------------//

Router.route('/addHosp', function () {
    if (Session.get('Session')) {
        this.render('addHosp');
    } else {
        Router.go('/')
    }
});
Router.route('/hpcapprovesecondhosp', function () {
    if (Session.get('Session')) {
        this.render('hpcapprovesecondhosp');
    } else {
        Router.go('/')
    }
});

Router.route('/hpclistcmsecondhosp', function () {
    if (Session.get('Session')) {
        this.render('hpclistcmsecondhosp');
    } else {
        Router.go('/')
    }
});

Router.route('/provinceapprovehosp', function () {
    if (Session.get('Session')) {
        this.render('provinceapprovehosp');
    } else {
        Router.go('/')
    }
});

Router.route('/provincelisthosp', function () {
    if (Session.get('Session')) {
        this.render('provincelisthosp');
    } else {
        Router.go('/')
    }
});


Router.route('/printNonUcCp', function () {

    this.render('printNonUcCp');

});
Router.route('/printAllRepCp', function () {

    this.render('printAllRepCp');

});

Router.route('/repzone_non_uc', function () {

    this.render('repzone_non_uc');

});

Router.route('/rep_pro_nonuc', function () {

    this.render('rep_pro_nonuc');

});

Router.route('/rep_amp_nonuc', function () {

    this.render('rep_amp_nonuc');

});

Router.route('/rep_tam_nonuc', function () {

    this.render('rep_tam_nonuc');

});

Router.route('/rep_hosp_nonuc', function () {

    this.render('rep_hosp_nonuc');

});



Router.route('/rep_zone_allcp', function () {

    this.render('rep_zone_allcp');

});

Router.route('/rep_pro_allcp', function () {

    this.render('rep_pro_allcp');

});

Router.route('/rep_amp_allcp', function () {

    this.render('rep_amp_allcp');

});

Router.route('/rep_tam_allcp', function () {

    this.render('rep_tam_allcp');

});

Router.route('/rep_hosp_allcp', function () {

    this.render('rep_hosp_allcp');

});


Router.route('/cmEvaluation', function () {
    if (Session.get('Session')) {
        this.render('cmEvaluation');
    } else {
        Router.go('/')
    }

});

Router.route('/repzone_hosp', function () {
    this.render('repzone_hosp');
});

Router.route('/reportnumelder_host', function () {
    this.render('reportnumelder_host');
});
