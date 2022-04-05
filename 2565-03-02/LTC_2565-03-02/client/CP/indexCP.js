import datatables from 'datatables.net';
import datatables_bs from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';

Template.indexcp.onRendered(function helloOnCreated() {
    Session.set('getPerson', null);
    datatables(window, $);
    datatables_bs(window, $);
    Meteor.subscribe('listCP',Session.get('cmid'), {
        onReady: function() {
            console.log(Session.get('cmid'))
            var x = careplan.find({cmid:Session.get('cmid')}).fetch();
            Session.set('listCP', x);
            setTimeout(function() {
                $('#mytable').DataTable({
                    "ordering": true,
                    "language": {
                        "lengthMenu": "แสดง _MENU_ ชุดต่อหน้า",
                        "zeroRecords": "ไม่พบผลลัพธ์",
                        "info": "หน้าที่ _PAGE_ จากทั้งหมด _PAGES_ หน้า",
                        "infoEmpty": "ไม่พบข้อมูล",
                        "loadingRecords": "กำลังโหลด...",
                        "processing": "กำลังประมวลผล...",
                        "search": "ค้นหา : ",
                        "paginate": {
                            "next": "ถัดไป",
                            "previous": "ก่อนหน้า"
                        }
                    }
                });
            }, 500)

        },

        onStop: function() {
            // called when data publication is stopped
        }
    });
});

Template.indexcp.helpers({
    dddd() {
        return Session.get('listCP');
    },
    cmname() {
        return Session.get('cmname')
    },
    checkcp() {
        // console.log(Session.get('viewpatient'))
        if (Session.get('viewpatient')) {
            return true;
        } else {
            return false;
        }

    },
    checkcolor(){
        if(this.patient){
            return "green"
        }else{
            return "orange"
        }
    }
});

Template.indexcp.events({
    'click .create' () {
        Router.go('/simplecpfirst');
    },
    'click #viewcp' () {
        // Session.set("viewcpCID", this.cid);
        setTimeout(function() {
            Router.go('/viewcp');
        }, 500)

    },
    'click #viewsimple' () {
        // console.log(this.cid)
        // Session.set("viewcpCID", this._id);
        setTimeout(function() {
            Router.go('/viewcpsimple');
        }, 500)
    },
    'click #idfind' () {
        Session.set("viewcpCID", this._id);
        Session.set("viewcpCDate", this.createDate);
        Session.set("viewcpCcid", this.cid);
        Session.set("viewpatient", this.patient);
    },
    'click #createcp' () {
        Meteor.subscribe('getfindelderedit', Session.get('viewcpCcid'), Session.get('viewcpCDate'), function() {}, function() {
            // console.log(Session.get('viewcpCcid'), Session.get('viewcpCDate'))
            // console.log()
            Session.set('elderDetail',careplan.find({ "cid": Session.get('viewcpCcid'), "createDate": Session.get('viewcpCDate') }).fetch()[0]);
        });
        setTimeout(function() {
            Router.go('/createCP');
        }, 500)
    }
});


function getAge(fromdate, todate) {
    if (todate) todate = new Date(todate);
    else todate = new Date();

    var age = [],
        fromdate = new Date(fromdate),
        y = [todate.getFullYear(), fromdate.getFullYear()],
        ydiff = y[0] - y[1],
        m = [todate.getMonth(), fromdate.getMonth()],
        mdiff = m[0] - m[1],
        d = [todate.getDate(), fromdate.getDate()],
        ddiff = d[0] - d[1];

    if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
    if (mdiff < 0) mdiff += 12;
    if (ddiff < 0) {
        fromdate.setMonth(m[1] + 1, 0);
        ddiff = fromdate.getDate() - d[1] + d[0];
        --mdiff;
    }
    if (ydiff > 0) age.push(ydiff + ' ปี' + (ydiff > 1 ? ' ' : ' '));
    if (mdiff > 0) age.push(mdiff + ' เดือน' + (mdiff > 1 ? '' : ''));
    if (ddiff > 0) age.push(ddiff + ' วัน' + (ddiff > 1 ? '' : ''));
    if (age.length > 1) age.splice(age.length - 1, 0, ' ');
    return age.join('');
}