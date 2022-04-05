import { Template } from 'meteor/templating';
var captchapng = require('captchapng');

function captcha() {
    var result = parseInt(Math.random() * 9000 + 1000);
    var p = new captchapng(80, 30, result); // width,height,numeric captcha 
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha) 
    p.color(0, 0, 0, 255); // Second color: paint (red, green, blue, alpha) 
    var img = p.getBase64();
    Session.set('captcha', 'data:image/png;base64,' + img)
    Session.set('capresult', result)
}


Template.createCP.onRendered(function () {
    Meteor.call('getallcp', function (err, res) {
        const newdata = []
        _.each(res, function (x) {
            newdata.push({ pro: x._id.pro, amp: x._id.amp, _id: x._id.tam, num: x.count })
        })
        Session.set('nodistrictcp', newdata)
        Meteor.call('getallsubdistrict', function (err, res) {
            const newdata2 = []
            _.each(res, function (x) {
                newdata2.push({ pro: x._id.pro, amp: x._id.amp, _id: x._id.tam, num: x.count })
            })
            var concatArr = _.concat(Session.get('nodistrictcp'), newdata2)
            var output = [];//output array
            var temp = {};//temp object
            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.num ? temp[o._id].num = o.num : temp[o._id].num = 0
                    o.pro ? temp[o._id].pro = o.pro : temp[o._id].pro = ""
                    o.amp ? temp[o._id].amp = o.amp : temp[o._id].amp = ""

                } else {
                    o.num ? temp[o._id].num = temp[o._id].num + o.num :  temp[o._id].num
                    o.pro ? temp[o._id].pro = temp[o._id].pro + "" : temp[o._id].pro
                    o.amp ? temp[o._id].amp = temp[o._id].amp + "" : temp[o._id].amp

                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    pro: temp[key].pro,
                    amp: temp[key].amp,
                    _id: key,
                    num: temp[key].num,
                })
            }
            const nocp = _.filter(output, function (o) { return o.num == 0; });
            console.log(_.sortBy(nocp, o => o.pro))
        })
    })
})
