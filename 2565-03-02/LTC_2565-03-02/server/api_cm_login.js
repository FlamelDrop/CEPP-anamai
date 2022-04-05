import { Meteor } from 'meteor/meteor';
import '../imports/db.js';
import { USER_LOGIN } from '../imports/db.js';
import { CM_REGISTER } from '../imports/db.js';
var key = "V7T5J53NUDNcDUu1Dl74hpr58JNITaCE5mxEfof0ST0jBka4t6ZAjethO5Px3gZYskqxxwlfdcoEknxEhk2qokv2f8n8eaUwlaSGu1Lv1X0c8lEdvwtJGMAJLLFPMpaVqQrKH06zNUzK53Non5VSHlriXXYxcWiqCz19pVw0FVAyMcM07vIEHXLsKxPLjV1LkQIxB5n4OMsrO2hLoNdTAO9bbMKkxzTFgs2FldAZPQgrJl0VY4EpGBoIdWQAlA5p";

Meteor.startup(() => {
    Router.route('/logincm', {
        where: 'server'
    }).post(function (req, res, next) {
        var response;
        const body = req.body;
        let password
        let findString = {}
        if (Object.keys(body).length === 0) {
            findString = { _id: "" }
        } else {
            findString = { USERNAME: body.USERNAME }
            if (typeof body.PASSWORD !== 'undefined' && body.PASSWORD != "") {
                password = body.PASSWORD
            } else {
                password = null
            }
        }
        var data = USER_LOGIN.find(findString).fetch()

        if (data.length > 0) {

            var decrypted = CryptoJS.AES.decrypt(data[0].PASSWORD, key);
            var final = decrypted.toString(CryptoJS.enc.Utf8);

            if (password == final) {

                if (data[0].RULE == 'CM') {
                    var login_data = CM_REGISTER.find({ CID: data[0].USERNAME, confirm: true }).fetch()
                    if (login_data.length > 0) {
                        response = {
                            "message": "success",
                            "data": login_data
                        };
                    } else {
                        response = {
                            "message": "not found or not confirm by hpc",
                            "data": []
                        };
                    }
                } else if (data[0].RULE == 'HPC') {
                    delete data[0].PASSWORD
                    response = {
                        "message": "success",
                        "data": data
                    };
                } else if (data[0].RULE == 'PROVINCE') {
                    delete data[0].PASSWORD
                    response = {
                        "message": "success",
                        "data": data
                    };
                } else if (data[0].RULE == 'DISTRICT') {
                    delete data[0].PASSWORD
                    response = {
                        "message": "success",
                        "data": data
                    };
                } else {
                    response = {
                        "message": "no rule found",
                        "data": []
                    };
                }


            } else {
                response = {
                    "message": "password incorrect!",
                    "data": []
                };
            }

        } else {
            response = {
                "message": "no user found",
                "data": []
            };
        }

        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(response));
    });
});