// import { Template } from "meteor/templating";
// import { UploadFS } from 'meteor/jalik:ufs';
// import { GridFSStore } from 'meteor/jalik:ufs-gridfs';

// const mobilePhotocm = new GridFSStore({
//     collection: Photos,
//     name: 'mphotoscm',
//     chunkSize: 1024 * 255,
//     filter: new UploadFS.Filter({
//         contentTypes: ['image/*'],
//         extensions: ['jpg', 'png']
//     }),
// });

// Template.mobileregiscm.onRendered(function(){
//     $("meta[name='viewport']").attr('content', 'width=device-width, initial-scale=1.0');
//     Object.keys(Session.keys).forEach(function(key) {
//         Session.set(key, undefined);
//     });
//     Session.keys = {};
//     toastr.options = {
//         "closeButton": true,
//         "debug": false,
//         "newestOnTop": false,
//         "progressBar": false,
//         "positionClass": "toast-top-right",
//         "preventDuplicates": false,
//         "onclick": null,
//         "showDuration": "300",
//         "hideDuration": "1000",
//         "timeOut": "5000",
//         "extendedTimeOut": "1000",
//         "showEasing": "swing",
//         "hideEasing": "linear",
//         "showMethod": "fadeIn",
//         "hideMethod": "fadeOut"
//     }
//     $("#birthDate").datetimepicker({
//         timepicker: false,
//         format: 'd/m/Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000            
//         lang: 'th', // แสดงภาษาไทย
//         mask: true,
//         onChangeMonth: thaiYear,
//         onShow: thaiYear,
//         yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
//         closeOnDateSelect: true,
//     });
//     $("#trainingDate").datetimepicker({
//         timepicker: false,
//         format: 'd/m/Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000            
//         lang: 'th', // แสดงภาษาไทย
//         mask: true,
//         onChangeMonth: thaiYear,
//         onShow: thaiYear,
//         yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
//         closeOnDateSelect: true,
//     });
//     $('#district_name').selectize();
//     $('#subdistrict_name').selectize();
//     $('#companyName').selectize();
//     $('#province_name').selectize();
//     Session.set("removephoto", null);
//     Meteor.call('getAllServiceCenter', function(error, result) {
//         $('#companyName')[0].selectize.destroy()
//         $('#companyName').selectize({ options: result, create: false });
//     });
//     Meteor.call('getRegProvince_name', function(error, result) {
//         $('#province_name')[0].selectize.destroy()
//         $('#province_name').selectize({ options: result, create: false });
//     });
// });

// Template.mobileregiscm.helpers({
//     showimg() {
//         return Session.get('showCMmobileImg');
//     },
//     showaddress() {
//         try {
//             var data = Session.get('districtName');
//             return data.address + " หมู่ " + data.moo + " ต." + data.district.split('-')[1] + " อ." + data.amphoe.split('-')[1] + " จ." + data.province.split('-')[1] + " เขต " + data.zone;
//         } catch (e) {

//         }
//     },
//     EXPIREDATE() {
//         return Session.get('EXPIREDATE')
//     },
//     districtNameWork() {
//         return Session.get('districtNameWork')
//     }
// })

// Template.mobileregiscm.events({
    
//         "change #subdistrict_name" () {
//             Session.set('districtNameWork', $('#subdistrict_name').val())
//         },
//         "change #district_name" () {
//             Meteor.call('getRegSubsistrict_name', $('#district_name').val(), function(error, result) {
//                 $('#subdistrict_name')[0].selectize.destroy()
//                 $('#subdistrict_name').selectize({ options: result, create: false });
    
//             });
//         },
//         "change #province_name" () {
//             Meteor.call('getRegDistrict_name', $('#province_name').val(), function(error, result) {
//                 $('#district_name')[0].selectize.destroy()
//                 $('#district_name').selectize({ options: result, create: false });
    
//             });
//         },
//         "change #companyName" () {
//             Session.set('HOSPCODE', $('#companyName').val())
//             Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function(error, result) {
//                 Session.set('districtName', result)
//             });
//         },
//         "change #trainingDate" () {
//             var tdateString = $("#trainingDate").val().split("/");
//             var tdate = new Date(parseInt(tdateString[2] - 541), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
//             Session.set('EXPIREDATE', tdate)
//         },
//         "keyup #pid" () {
//             $('#username').val($('#pid').val())
//             Meteor.call('getUserCM', $('#pid').val(), function(error, result) {
//                 if (result.length == 0 && $('#pid').val().length == 13) {
//                     $("#ckeckpid").removeClass("has-error");
//                     $("#ckeckpid").addClass("has-success");
//                     $("#symbolckeckpid").removeClass("glyphicon glyphicon-remove");
//                     $("#symbolckeckpid").addClass("glyphicon glyphicon-ok");
//                     Session.set('checkpid', true);
//                 } else {
//                     $("#ckeckpid").removeClass("has-success");
//                     $("#ckeckpid").addClass("has-error");
//                     $("#symbolckeckpid").removeClass("glyphicon glyphicon-ok");
//                     $("#symbolckeckpid").addClass("glyphicon glyphicon-remove");
//                     Session.set('checkpid', false);
//                 }
//                 // $('#companyName')[0].selectize.destroy()
//                 // $('#companyName').selectize({ options: result, create: false });
//             });
//         },
//         "click #save" () {
//             if (Session.get('HOSPCODE') && $("#subdistrict_name").val() && $("#pid").val() && $("#titleName").val() && $("#FName").val() && $("#LName").val() && $("#sex").val() && $("#tel").val() && $("#email").val() && $("#companyName").val() && $("#trainingBy").val() && $("#username").val() && $("#password").val() && $("#passwordq").val() && $("#birthDate").val() && $("#trainingDate").val() && Session.get('checkpid')) {
//                 if ($("#password").val() == $("#passwordq").val()) {
//                     var bdateString = $("#birthDate").val().split("/");
//                     var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
//                     var tdateString = $("#trainingDate").val().split("/");
//                     var tdate = new Date(parseInt(tdateString[2] - 543), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
//                     var data = Session.get('districtName');
//                     CM_REGISTER.insert({
//                         CID: $("#pid").val(),
//                         PRENAME: $("#titleName").val(),
//                         NAME: $("#FName").val(),
//                         LNAME: $("#LName").val(),
//                         SEX: $("#sex").val(),
//                         BIRTH: bdate,
//                         MOBILE: $("#tel").val(),
//                         EMAIL: $("#email").val(),
//                         HOSPCODE: Session.get('HOSPCODE'),
//                         TRAINING_DATE: tdate,
//                         EXPIREDATE: Session.get('EXPIREDATE'),
//                         TRAINING_CENTER_ID: $("#trainingBy").val(),
//                         IMG: Session.get('showCMmobileImg'),
//                         STATE_ACTIVE: $("#stateActive").val(),
//                         ADDRESS: $("#address").val(),
//                         TAMBON: $("#subdistrict_name").val(),
//                         PROVIDERTYPE: $("#persontype").val(),
//                         LICENCE_NUMBER: $("#LICENCE_NUMBER").val(),
//                         POSITIONCODE: $("#POSITIONCODE").val(),
//                         LATITUDE: $("#LATITUDE").val(),
//                         LONGITUDE: $("#LONGITUDE").val(),
//                         CREATEDATE: new Date(),
//                         D_UPDATE: "",
//                         confirm: false,
//                         zone: data.zone,
//                     })
//                     Meteor.call('encrypted', $("#password").val(), function(error, result) {
//                         USER_LOGIN.insert({
//                             USERNAME: $("#username").val(),
//                             PASSWORD: result,
//                             RULE: "CM",
//                             CREATEDATE: new Date(),
//                             LAST_VISIT: new Date()
//                         })
//                     });
                    
//                     Meteor.call('getProinceNameByCode', $("#subdistrict_name").val()[0]+$("#subdistrict_name").val()[1], function(error, result) {
//                         console.log(result)
//                         Meteor.call('sendEmailToCMRegister', $("#FName").val() +" "+ $("#LName").val(), $("#username").val(), result[0].text, $("#email").val(),function(error, result2) {
//                             alert("บึนทึกเรียบร้อย ท่านจะเข้าสู่ระบบได้เมื่อจังหวัดอนุมัติใช้งาน เราจะแจ้งไปอีเมลท่านอีกครั้ง");
//                             Router.go("/")
//                         });
//                     });
    
                    
//                 } else {
//                     toastr.warning("รหัสผ่านไม่ตรงกัน ลองอีกครั้ง", "ไม่สำเร็จ");
//                     $("#password").val("");
//                     $("#passwordq").val("");
//                 }
//             } else {
//                 toastr.warning("ตรวจสอบใหม่ข้อมูลที่กรอกอีกครั้ง", "ไม่สำเร็จ");
//             }
    
//         },
//         'click button[name=upload]' (ev) {
//             Photos.remove({ _id: Session.get("removephoto") })
//             UploadFS.selectFiles(function(file) {
//                 let photo = {
//                     name: file.name,
//                     size: file.size,
//                     type: file.type,
//                 };
//                 let uploader = new UploadFS.Uploader({
//                     store: mobilePhotocm || 'photos',
//                     adaptive: true,
//                     capacity: 0.8,
//                     chunkSize: 8 * 1024,
//                     maxChunkSize: 128 * 1024,
//                     maxTries: 5,
//                     data: file,
//                     file: photo,
//                     onError(err, file) {
//                         if (err) {
//                             alert("ไฟล์รูปเท่านั้น")
//                         } else {
//                             // console.log(file)
//                         }
//                     },
//                     onAbort(file) {
//                         // console.log(file.name + ' upload has been aborted');
//                     },
//                     onComplete(file) {
//                         // console.log(file.name + ' has been uploaded ' + file.url);
//                        // var urlpic = "http://ltc.anamai.moph.go.th"+(file.url).split('http://10.100.1.26:80')[1]
//                         Session.set("showCMmobileImg", file.url)
//                     },
//                     onCreate(file) {
//                         // console.log(file.name + ' has been created with ID ' + file._id);

//                         Session.set("removephoto", file._id);
//                     },
//                     onProgress(file, progress) {
//                         // console.log(file.name + ' ' + (progress * 100) + '% uploaded');
    
//                     },
//                     onStart(file) {
//                         // console.log(file.name + ' started');
//                         Session.set("showCMmobileImg", "InternetSlowdown_Day.gif")
//                     },
//                     onStop(file) {
//                         // console.log(file.name + ' stopped');
//                     },
//                 });
//                 uploader.start();
//             });
//         }
//     });