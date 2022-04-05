// file location: server/tambon_assessment_server.js
// Version: 2021-09-04
// Version: 2021-12-20 CM of DLA no display

import { Meteor } from 'meteor/meteor';
import { provinces, amphoes, tambons, tambonAssessment, healthCenters, CM_REGISTER,DLA } from '../imports/db.js';
import { USER_LOGIN } from '../imports/db.js';
import { EVALUATE_DISTRICT } from '../imports/db.js';

_ = lodash
Meteor.startup(() => {

    Meteor.methods({

        tambon_assessment_init(userlogin) {
			
			
            //console.log("tambon_assessment_init");
            //console.log(userlogin);
            currentZone = parseInt(userlogin.ZONE);
            //console.log(typeof (currentZone), currentZone);

            //chanwats = provinces.find({ zoneID: currentZone }).fetch();
            chanwats = provinces.find({ zoneID: currentZone }).fetch();
            chanwats.forEach((item, index, self) => {
                delete item.name_en;
                delete item._id;
            });
            //console.log(chanwats);
            chanwats.sort((a, b) => { return a.ID - b.ID; })
            //console.log(chanwats);
            //console.log(chanwats.length);


            provinceIDs = chanwats.map((item) => { return item.ID; });
            //console.log(provinceIDs);
            amphoe_list = amphoes.find().fetch();
            //console.log(amphoe_list[1]);
            //amphoeInZone = amphoe_list.filter((item) => { return changwat_keys.includes(item.proviceID); });
            amphoeInZone = amphoe_list.filter((item) => { return provinceIDs.includes(item.provinceID); })
            //console.log(amphoeInZone);
            for (let i = 0, len = amphoeInZone.length; i < len; i++) {
                delete amphoeInZone[i]._id;
                delete amphoeInZone[i].name_en;
            }
            amphoeInZone.sort((a, b) => { return a.ID - b.ID; })
            //console.log(amphoeInZone);


            //construct tambons ทุกตำบล ในโซน           
            amphoeIDs = amphoeInZone.map((item) => { return item.ID; });
            //console.log(amphoeIDs);
            tambon_list = tambons.find().fetch();
            tambonInZone = tambon_list.filter((item) => { return amphoeIDs.includes(item.amphoeID); })
            for (let i = 0, len = tambonInZone.length; i < len; i++) {
                delete tambonInZone[i]._id;
                delete tambonInZone[i].name_en;
            }
            tambonInZone.sort((a, b) => { return a.ID - b.ID; })
            //console.log(tambonInZone);
            // tambon_list = tambon_list.forEach((item, index, self) => {
            //     delete item.name_en;
            //     delete item._id;
            // });
            // console.log("จำนวนตำบล = ", tambon_list.length);
            //console.log(tambon_list);

            //tambonAssessment_list = tambonAssessment.find({ zoneID: currentZone }).fetch();

            tambonIDs = tambonInZone.map((item) => { return item.ID; });
            tambonAssessment_list = tambonAssessment.find().fetch();
            tambonAssessment_list.forEach((item, index, self) => {
                delete item._id;
            });
            tambonAssessmentInZone = tambonAssessment_list.filter((item) => { return tambonIDs.includes(item.ID); })
            tambonAssessmentInZone.sort((a, b) => { return a.ID - b.ID; })
            // console.log(tambonAssessment_list[0]);
            // console.log(tambonAssessment_list.length);
            // console.log(tambonAssessmentInZone[0]);
            // console.log(tambonAssessmentInZone.length);

            //return [chanwats, amphoeInZone, tambonInZone];
            return [chanwats, amphoeInZone, tambonInZone, tambonAssessmentInZone];


        },
        updateTambonAssessment(userlogin, data) {
            //console.log(`username=${userlogin.USERNAME} role=${userlogin.RULE} name=${userlogin.NAME}`);
            //console.log(user);
            //console.log(rowData);
            //console.log(`ID= ${data.ID}`);
            tambonAssessment.update({ ID: data.ID }, {
                $set: {
                    c1: data.c1,
                    c2: data.c2,
                    c3: data.c3,
                    c4: data.c4,
                    c5: data.c5,
                    c6: data.c6,
                    attend: data.attend,
                    joinYear: data.joinYear,
                    assessYear: data.assessYear,
                    verdict: data.verdict,
                    migrate: false,
                    modifiedBy: userlogin.USERNAME,
                    remark: data.remark
                },
                $currentDate: { lastModified: true }
            });
            let result = tambonAssessment.find({ ID: data.ID }).fetch();
            //console.log(result)
            //console.log(`result length = ${result.length}`);

            return result.pop() || ["Not found"];


        },
        resetTambonAssessment() {
            /*
            //console.log("resetTambonAssesment-------->")
            tambon_list = tambons.find().fetch();
            let tambonAll = tambon_list;//tambons.find().fetch(); // เอา ID มาใช้อย่างเดียว
            tambonAll.sort((a, b) => a.ID - b.ID);
            tambonAssessment.rawCollection().drop();
            //console.log(`tambons = ${tambonAll.length}`);
            newData = {
                c1: false, c2: false, c3: false, c4: false, c5: false, c6: false,
                assessYear: -1,     // ไม่เข้าร่วม
                joinYear: 0,        // ไม่ระบุ
                verdict: "ไม่ผ่านเกณฑ์",
                remark: "",
                lastModified: new Date().toLocaleString(),
            }
            //             migrate: false, modifiedBy: "Kanut", remark: ""
            //console.time("reset1");
            // for (i = 0, len = tambons.length; i < len; i++) {
            //     console.log(i, tas[i].ID, tas[i].name);
            //     tambonAssessment.insert({ ID: tas[i].ID }, {
            //         $set: {
            //             c1: false, c2: false, c3: false, c4: false, c5: false, c6: false,
            //             assessYear: -1, joinYear: 0, verdict: "ไม่ผ่านเกณฑ์",
            //             migrate: false, modifiedBy: "Kanut", remark: ""
            //         },
            //         $currentDate: { lastModified: true }
            //     });
            // }
            tambonAll.forEach((item, index, self) => {
                newData.ID = item.ID;
                tambonAssessment.insert(newData);
            });
            console.timeEnd('reset1');
            tambonsFind = tambonAssessment.find().fetch();
            console.log(`tambonsFind = ${tambonsFind.length}`);

        */
        },
        transferTambonAssessment() {
            /*
            let tambon_list = tambons.find().fetch();
            tambon_list.forEach((item, index, self) => {
                delete tambon_list[index].name_en;
                delete tambon_list[index]._id;
            });
            let data = EVALUATE_DISTRICT.find().fetch();
            data.forEach((item, index, self) => { delete data[index]._id; });
            // สร้าง field ID ใหม่ เพื่อเก็บตัวเลข tambon ID ที่ ไม่มีปัญหา
            data.forEach((item, index, self) => {
                if (item.district_code === item.fullcode.substring(0, 4)) {
                    data[index].ID = parseInt(data[index].fullcode);
                } else {
                    data[index].ID = -1;
                }
            });

            let data_mismtached_districts = data.filter(item => item.district_code != item.fullcode.substring(0, 4));
            //console.log("จำนวนไม่ตรง1 = ", data_mismtached_districts.length); // 1193
            data_mismtached_districts = data.filter(item => item.ID === -1);
            //console.log("จำนวนไม่ตรง2 = ", data_mismtached_districts.length); // 1193

            data.forEach((item, index, self) => {
                if (item.ID === -1) {
                    let tambon1 = tambon_list.filter((ele, idx, arr) => {
                        return parseInt(ele.ID / 100) === parseInt(item.district_code);
                    })

                    for (let i = 0, len = tambon1.length; i < len; i++) {
                        //console.log(i,tambon1[i].ID, tambon1[i].name,' --> ',item.subdistrict_name,( item.subdistrict_name === tambon1[i].name));
                        if (item.subdistrict_name === tambon1[i].name) {
                            item.ID = tambon1[i].ID;
                            break;
                        }
                    }
                }
            });
            data_mismtached_districts = data.filter(item => item.ID === -1);
            //console.log("จำนวนไม่ตรง3 = ", data_mismtached_districts.length); // 78

            // เอาที่ไม่ตรง 78 ที่ ออก
            data = data.filter((item, index, self) => item.ID != -1);
            // เอาข้อมูล ที่ ID ตรงกัน จาก data ไปใส่ที่ tambon_list
            //console.log("data length=",data.length); // 7356
            //console.log("tambon_list length=",tambon_list.length); // 7436
            let count = 0;
            for (i = 0, len_data = data.length; i < len_data; i++) {
                for (j = 0, len_tambon = tambon_list.length; j < len_tambon; j++) {
                    if (data[i].ID === tambon_list[j].ID) {
                        count++;
                        break;
                    }
                }
            }
            //console.log("count=",count); // 7345

            // verify duplicate
            data2 = data.sort((a, b) => a.ID - b.ID);
            len2 = data2.length; count = 0;
            data2.forEach((item, index, self) => {
                if (index < len2 - 1 && item.ID === data2[index + 1].ID) {
                    count++;
                    //console.log(count,item.ID,item.subdistrict_name," <--> ",data2[index+1].subdistrict_name);
                }
            })
            count = 0; count_not_found = 0;
            tambon_list.forEach((item, index, self) => {
                let not_found = true;
                for (i = 0, len = data2.length; i < len; i++) {
                    if (item.ID === data2[i].ID) {
                        // อัพเดตข้อมูลใน tambonAssessment จาก EVAUATE_DISTRICT ผ่าน data->data2->eval
                        let eval = data2[i].Evaluate;
                        //console.log(`${index} ${item.ID} c1=${eval.c1}  c2=${eval.c2} c3=${eval.c3} c4=${eval.c4} c5=${eval.c5}  c6=${eval.c6}`);
                        //console.log(`join=${eval.join} join_year=${eval.join_year} pass_year=${eval.pass_year} remark=${eval.remark} eval_date=${eval.evaluate_date}`);
                        //console.log();
                        //console.log(eval);
                        count++;
                        not_found = false;

                        // this record has nested array difference from others
                        // if(item.ID===630301) {
                        //     console.log(index," before ",item.ID); console.log(eval);
                        // }
                        if (Array.isArray(eval)) {
                            eval = eval[0];
                        }
                        let todayYear = new Date().getFullYear() + 543;   // ปีพุทธศักราช พ.ศ.
                        let passYear = parseInt(eval.pass_year) || 0;
                        if (eval.c1 && eval.c2 && eval.c3 && eval.c4 &&
                            (todayYear - passYear) <= 3) {
                            eval.c5 = true;
                            eval.c6 = true;
                            eval.verdict = 'ผ่านเกณฑ์';
                        } else {
                            eval.c5 = false;
                            eval.c6 = false;
                            eval.verdict = 'ไม่ผ่านเกณฑ์';
                        }
                        eval.attend = eval.join;
                        eval.joinYear = eval.join_year;
                        eval.passYear = eval.pass_year;
                        eval.modifiedBy = 'kanut';
                        eval.migrate = true;
                        // if(item.ID===630301) {
                        //     console.log(index," after ",item.ID); console.log(eval);
                        // }
                        eval.joinYear = eval.joinYear || "ไม่ระบุ";
                        eval.passYear = eval.passYear || "ไม่ระบุ";
                        eval.c1 = eval.c1 ? true : false;
                        eval.c2 = eval.c2 ? true : false;
                        eval.c3 = eval.c3 ? true : false;
                        eval.c4 = eval.c4 ? true : false;
                        eval.c5 = eval.c5 ? true : false;
                        eval.c6 = eval.c6 ? true : false;

                        tambonAssessment.update({ ID: item.ID }, {
                            $set: {
                                c1: eval.c1,
                                c2: eval.c2,
                                c3: eval.c3,
                                c4: eval.c4,
                                c5: eval.c5,
                                c6: eval.c6,
                                attend: eval.attend,
                                joinYear: eval.joinYear,
                                passYear: eval.passYear,
                                verdict: eval.verdict,
                                migrate: eval.migrate,
                                modifiedBy: eval.modifiedBy,
                                remark: eval.remark
                            },
                            $currentDate: { lastModified: true }
                        });

                        break;
                    }
                }
                if (not_found) {
                    count_not_found++;
                    //console.log(`${count_not_found} index=${index} ${item.ID} ${item.name}  <==== Not Found`);

                }
            })
            //console.log('จำนวนตำบลที่อัพเดตเสร็จแล้ว=',count);
            //console.log('จำนวนตำบลที่ไม่ได้ทำ=',count_not_found);
            */
        },
        transferTambonAssessmentV2() {
            /*
            console.log("Transfering V2 . . . ");
            let data = getCleanEvaluateDistrictData();
            updatingTambonAssessmentV2(data);
            */
        },
        transferTambonAssessmentV3() {
            /*
            console.log("Transfering V3 . . . ");
            console.time("v3")
            let data = getCleanEvaluateDistrictData();
            updatingTambonAssessmentV3(data);
            console.timeEnd("v3");
            */
        },
        checkUserType() {
            let users = USER_LOGIN.find().fetch();
            userRoles = users.map((item, index, self) => { 
                return item.RULE 
            });
            userRoles = userRoles.filter((item, index, self) => {
                return userRoles.indexOf(item) === index;
            });
            console.log(userRoles);
            countKeys = [0, 0, 0, 0, 0]
            userRoles.forEach((item, index, self) => {
                console.log(`================> ${item} <====================`);
                users.forEach((r_item, r_index, r_self) => {
                    if (item === r_item.RULE) {
                        countKeys[index] += 1;
                    }
                });
            })
            console.log(countKeys)


        },
        zoneSummary() {
            let assessmentList = tambonAssessment.find().fetch().sort((a, b) => a.ID - b.ID);
            let provinceList = provinces.find().fetch();
            let provinceZone = [];
            provinceList.forEach((item, index, self) => {
                //console.log(item)
                provinceZone[item.ID] = item.zoneID;
            })
            // provinceZone.forEach((item,index,self)=> {
            //     console.log(index,item);
            // })
            //merge province and amphoe
            assessmentList.forEach((item, index, self) => {
                let provinceID = parseInt(item.ID / 10000);
                assessmentList[index].zoneID = provinceZone[provinceID];
            })
            //assessmentList.slice(-5).forEach((item) => { console.log(item)})
            return assessmentList;
        },
        tambonAssessmentOverview() {
            let assessmentList = tambonAssessment.find().fetch();
            //remove เขต 13 กรุงเทพที่ยังไม่ได้เข้าร่วม
            assessmentList = assessmentList.filter((item) => parseInt(item.ID / 10000) != 10);
            let allTamon = assessmentList.length;
            let verdictPass = assessmentList.filter((item, index, self) => item.verdict === 'ผ่านเกณฑ์').length;
            //console.log(verdictPass, allTamon);
            return parseInt(100 * verdictPass / allTamon);
        },
        reportProvinceAssessment(zoneID) {
            //console.log(`zoneID=${zoneID}`)
            let provinceInZone = getTambonAssessmentAll();
            return provinceInZone.filter((item) => { return item.zoneID === zoneID; });
        },
        reportAmphoeAssessment(provinceID) {
            //console.log(`provinceID=${provinceID}`)
            let allTambons = getTambonAssessmentAll();
            let amphoeInProvince = allTambons.filter((item) => { return item.provinceID === provinceID; });
            //console.log("amphoeInProvince.length=>", amphoeInProvince.length);
            //console.log(allTambons[8]);
            return amphoeInProvince;
        },
        reportTambonInAmphoeAssessment(amphoeID) {
            //console.log(`amphoeID=${amphoeID}`)
            let allTambons = getTambonAssessmentAll();
            let tambonInAmphoe = allTambons.filter((item) => { return item.amphoeID === amphoeID; });
            //console.log("amphoeInProvince.length=>", amphoeInProvince.length);
            //console.log(allTambons[8]);
            return tambonInAmphoe;
        },
        tambonAssessmentCM(cmID) {
            // console.log(`cmID = ${cmID}`);
            let cmTambonIDs = getHealthCenters(cmID);
            // console.log(cmTambonIDs);
            let cmTambonAssessment = getTambonAssessment(cmTambonIDs); 
            return cmTambonAssessment;
        },
        updateTambonAssessmentCM(cmID, data) {
            // console.log(`cmID=${cmID}`);
            // console.log(`ID=${data.ID} c1=${data.c1} c2=${data.c2} c3=${data.c3} c4=${data.c4} c5=${data.c5} c6=${data.c6}`);
            // console.log(`attend=${data.attend} joinYear=${data.joinYear} verdict=${data.verdict}`);
            tambonAssessment.update({ ID: data.ID }, {
                $set: {
                    c1: data.c1,
                    c2: data.c2,
                    c3: data.c3,
                    c4: data.c4,
                    c5: data.c5,
                    c6: data.c6,
                    attend: data.attend,
                    joinYear: data.joinYear,
                    assessYear: data.assessYear,
                    verdict: data.verdict,
                    migrate: false,
                    modifiedBy: cmID,
                    remark: data.remark
                },
                $currentDate: { lastModified: true }
            });
            let result = tambonAssessment.find({ ID: data.ID }).fetch();
            //console.log(result)
            //console.log(`result length = ${result.length}`);

            return result.pop() || ["Not found"];


        },
        serverDate(clientDate) {
            // console.log(`k=${clientDate}`);
            // console.log(this);
            return new Date();
        },
        tambonOver3years() {
            return k_test1();
        }
    })

    const k_test1 = () => {
        console.log("k_test1 ----------------------------");
        // console.log(this);
        // console.log('-----------------this---------------');
        let todayYear = new Date().getFullYear() + 543;
        let todayMonth = new Date().getMonth();
        todayYear = (todayMonth>=9) ? todayYear+1: todayYear;
        console.log(`todayYear= ${todayYear}`);
        let tambonAssessment_list = tambonAssessment.find().fetch();
        console.log(`All tambons = ${tambonAssessment_list.length}`);
        tambonAssessment_list =tambonAssessment_list.filter((item)=> {
            if (item.assessYear>=2559) {
                return todayYear - item.assessYear === 4 && item.verdict !=="ประเมินซ้ำ";
            }
            return false;
            });
        console.log(`4 years = ${tambonAssessment_list.length}`);
        let data = { c1:false,c2:false,c3:false,c4:false,c5:false,c6:false,
                    verdict:"ประเมินซ้ำ"}
        

        tambonAssessment_list.forEach((item)=> {
            tambonAssessment.update({ _id : item._id }, {
                $set: {
                    c1: data.c1,
                    c2: data.c2,
                    c3: data.c3,
                    c4: data.c4,
                    c5: data.c5,
                    c6: data.c6,
                    attend: item.attend,
                    joinYear: item.joinYear,
                    assessYear: data.assessYear,
                    verdict: data.verdict,
                    migrate: false,
                    modifiedBy: "kanut",
                    remark: data.remark
                },
                $currentDate: { lastModified: true }
            });
        })
        
       return "ok";
    };

    const getCleanEvaluateDistrictData = () => {
        //console.log("Cleaning Evaluate District DATA . . . ");
        let data = EVALUATE_DISTRICT.find().fetch();
        data.forEach((item, index, self) => { delete data[index]._id; });
        data.sort((a, b) => a.fullcode - b.fullcode);

        // พบว่า จังหวัดบึงกาฬ transfer ข้อมูลไม่ได้
        // ตรวจสอบพบว่า province code เป็น 97 และไม่สัมพันธ์กับ รหัสอำเภอ และ รหัสตำบล
        // รหัสจังหวัดบึงกาฬ ที่ถูกต้องคือ 38
        let count_buengkan = 0;
        let buengkan_tambons = tambons.find().fetch();
        //console.log("buengkan_tambons => ", buengkan_tambons.length);
        buengkan_tambons = buengkan_tambons.filter((item) => parseInt(item.ID / 10000) === 38)
        // buengkan_tambons.forEach((item,index,self) => {
        //     console.log(index+1,item.ID,item.name,item.amphoeID);
        // })
        data.forEach((item, index, self) => {
            if (parseInt(item.province_code) === 97) {
                count_buengkan++;
                //console.log(count_buengkan,index+1, item.province_code,item.province_name,item.fullcode,item.subdistrict_name);
                let new_ID = buengkan_tambons.filter((ele) => ele.name === item.subdistrict_name).pop().ID
                //console.log("new_ID => ",new_ID)
                data[index].ID = new_ID;
                //console.log("----> ", item.province_code,item.province_name,item.fullcode,item.subdistrict_name, data[index].ID);
            }
        });


        //console.log(data.length); console.log(data[0]);
        // สร้าง field ID ใหม่ เพื่อเก็บตัวเลข tambon ID ที่ ไม่มีปัญหา
        // ตำบล ที่หาไม่ได้ ให้ ID เป็น -1
        data.forEach((item, index, self) => {
            let fullcodeLeft4 = item.fullcode ? item.fullcode.substring(0, 4) : -1;
            //console.log(`${index}. item.district_code= ${item.district_code} item.fullcode= ${item.fullcode} fullcode4= ${fullcodeLeft4}`);
            //if (item.fullcode === -1) { console.log(item) }
            if (data[index].ID) { // skip สำหรับ ตำบลในจังหวัดบึงกาฬ ที่ได้ assign ID แล้ว
            } else if (item.district_code === fullcodeLeft4) {
                data[index].ID = parseInt(data[index].fullcode);
            } else {
                data[index].ID = -1;
            }
        });

        let data_mismtached_step1 = data.filter(item => item.ID === -1);
        console.log("จำนวนไม่ตรง1 = 1122 ", data_mismtached_step1.length); // 1122
        // data_mismtached_step1.forEach((item, index, self) => {
        //     console.log(index + 1, item.ID, item.fullcode, item.subdistrict_name, item.province_name);
        // })

        // create new field ID for each row
        let tambon_list = tambons.find().fetch();
        console.log("tambon_list => ", tambon_list.length);
        data.forEach((item, index, self) => {
            if (item.ID === -1) {
                let tambon1 = tambon_list.filter((ele, idx, arr) => {
                    return parseInt(ele.ID / 100) === parseInt(item.district_code);
                })

                for (let i = 0, len = tambon1.length; i < len; i++) {
                    //console.log(i,tambon1[i].ID, tambon1[i].name,' --> ',item.subdistrict_name,( item.subdistrict_name === tambon1[i].name));
                    if (item.subdistrict_name === tambon1[i].name) {
                        item.ID = tambon1[i].ID;
                        break;
                    }
                }
            }
        });
        data_mismtached_step2 = data.filter(item => item.ID === -1);
        console.log("จำนวนไม่ตรง 2 = ", data_mismtached_step2.length); // 9

        data_mismtached_step2.forEach((item, index, self) => {
            console.log(index + 1, item.province_name, item.subdistrict_name)
        })

        // เอาที่ไม่ตรง 78 ที่ ออก
        data = data.filter((item, index, self) => item.ID != -1);
        // เอาข้อมูล ที่ ID ตรงกัน จาก data ไปใส่ที่ tambon_list
        console.log("data length=", data.length); // 7356
        console.log("tambon_list length=", tambon_list.length); // 7436
        let count = 0;
        for (i = 0, len_data = data.length; i < len_data; i++) {
            for (j = 0, len_tambon = tambon_list.length; j < len_tambon; j++) {
                if (data[i].ID === tambon_list[j].ID) {
                    count++;
                    break;
                }
            }
        }
        console.log("count=", count); // 7345

        // verify duplicate
        data2 = data.sort((a, b) => a.ID - b.ID);
        len2 = data2.length; count = 0;
        data2.forEach((item, index, self) => {
            if (index < len2 - 1 && item.ID === data2[index + 1].ID) {
                count++;
                //console.log(count,item.ID,item.subdistrict_name," <--> ",data2[index+1].subdistrict_name);
            }
        })
        console.log("done remove duplicate....");
        console.log("data final length = ", data2.length)
        buengkanIDs = [380111, 380401, 380405, 380303];
        data2.forEach((item, index, self) => {
            if (item.province_name === 'บึงกาฬ' || item.province_code === '97') {
                console.log(item);
            }
        })
        console.log(data2[1]);
        return data2;

    }

    const updatingTambonAssessmentV2 = (data) => {
        //console.log("updatingTambonAssessmentV2 . . . . ");
        count = 0; count_not_found = 0;
        let tambon_list = tambons.find().fetch();
        tambon_list.forEach((item, index, self) => {
            delete tambon_list[index].name_en;
            delete tambon_list[index]._id;
        });
        tambon_list.forEach((item, index, self) => {
            let not_found = true;
            for (i = 0, len = data2.length; i < len; i++) {

                if (item.ID === data2[i].ID) {
                    // อัพเดตข้อมูลใน tambonAssessment จาก EVAUATE_DISTRICT ผ่าน data->data2->eval
                    let eval = data2[i].Evaluate;
                    if (item.ID === 901603) {
                        console.log();
                        console.log(`${index} ${item.ID} c1=${eval.c1}  c2=${eval.c2} c3=${eval.c3} c4=${eval.c4} c5=${eval.c5}  c6=${eval.c6}`);
                        console.log(`join=${eval.join} join_year=${eval.join_year} pass_year=${eval.pass_year} remark=${eval.remark} eval_date=${eval.evaluate_date}`);
                        console.log("eval ---> 1");
                        console.log(eval);
                    }
                    count++;
                    not_found = false;

                    // this record has nested array difference from others
                    // if(item.ID===630301) {
                    //     console.log(index," before ",item.ID); console.log(eval);
                    // }
                    if (Array.isArray(eval)) {
                        eval = eval[0];
                    }
                    // 1. ถ้าไม่เข้าร่วมกองทุน ให้ทุกอันเป็น false
                    // 2. ถ้าไม่มีปีที่ประเมิน ให้ทุกอันเป็น false
                    // 3. ถ้าปีที่ประเมินเกิน 3 ปี c1-c6 เป็น false และ verdict= ประเมินซ้ำ
                    // 4. ถ้าปีที่ประเมินไม่เกิน 3 ปี c1-c6 ไม่เป็น true ทั้งหมด verdict = ไม่ผ่านเกณฑ์
                    // 5. ถ้าปีที่ประเมินไม่เกิน 3 ปี c1-c6 เป็น true ทั้งหมด verdict = ผ่านเกณฑ์
                    let todayYear = new Date().getFullYear() + 543;   // ปีพุทธศักราช พ.ศ.
                    let passYear = parseInt(eval.pass_year) || 0; // 0 คือไม่ระบุ
                    let assessYear = passYear; // เปลี่ยนจาก ปีที่ผ่านเกณฑ์ เป็น ปีที่ประเมิน
                    eval.attend = eval.join;
                    eval.joinYear = eval.join_year;
                    eval.assessYear = assessYear;
                    eval.modifiedBy = 'kanut';
                    eval.migrate = true;
                    if (item.ID === 901603) {
                        console.log();
                        console.log(`${index} ${item.ID} c1=${eval.c1}  c2=${eval.c2} c3=${eval.c3} c4=${eval.c4} c5=${eval.c5}  c6=${eval.c6}`);
                        console.log(`join=${eval.join} join_year=${eval.join_year} pass_year=${eval.pass_year} remark=${eval.remark} eval_date=${eval.evaluate_date}`);
                        console.log("eval ---> 2");
                        console.log(eval);
                    }
                    if (eval.attend === null) eval.attend = false;
                    if (eval.attend === false) {
                        eval.attend = false;
                        eval.joinYear = 0;      // 0 คือ ยังไม่ได้เข้าร่วม ปีที่เข้าร่วมเป็น 0
                        eval.assessYear = 0;    // 0 คือ ยังไม่มีการประเมิน
                        eval.c1 = false;
                        eval.c2 = false;
                        eval.c3 = false;
                        eval.c4 = false;
                        eval.c5 = false;
                        eval.c6 = false;
                        eval.verdict = 'ไม่ผ่านเกณฑ์';
                    } else { // eval.attend === true
                        if ((todayYear - assessYear) > 3) {
                            eval.c1 = false;
                            eval.c2 = false;
                            eval.c3 = false;
                            eval.c4 = false;
                            eval.c5 = false;
                            eval.c6 = false;
                            eval.verdict = 'ประเมินซ้ำ';
                        } else if (eval.c1 && eval.c2 && eval.c3 && eval.c4 &&
                            (todayYear - passYear) <= 3) {
                            eval.c1 = true;
                            eval.c2 = true;
                            eval.c3 = true;
                            eval.c4 = true;
                            eval.c5 = true;
                            eval.c6 = true;
                            eval.verdict = 'ผ่านเกณฑ์';
                        } else {
                        }

                    }

                    // if(item.ID===630301) {
                    //     console.log(index," after ",item.ID); console.log(eval);
                    // }
                    tambonAssessment.update({ ID: item.ID }, {
                        $set: {
                            c1: eval.c1,
                            c2: eval.c2,
                            c3: eval.c3,
                            c4: eval.c4,
                            c5: eval.c5,
                            c6: eval.c6,
                            attend: eval.attend,
                            assessYear: eval.assessYear,
                            joinYear: eval.joinYear,
                            passYear: eval.passYear,
                            verdict: eval.verdict,
                            migrate: eval.migrate,
                            modifiedBy: eval.modifiedBy,
                            remark: eval.remark
                        },
                        $currentDate: { lastModified: true }
                    });
                    if (item.ID === 900103) console.log(eval);
                    break;
                }

            }
            if (not_found) {
                count_not_found++;
                //console.log(`${count_not_found} index=${index} ${item.ID} ${item.name}  <==== Not Found`);

            }
        })
        //console.log('จำนวนตำบลที่อัพเดตเสร็จแล้ว=',count);
        //console.log('จำนวนตำบลที่ไม่ได้ทำ=',count_not_found);

    }
    const updatingTambonAssessmentV3 = (data) => {
        // 1. การเข้าหรือไม่เข้าร่วมกองทุน ไม่มีผลต่อการประเมิน
        // 2. ถ้าไม่มีปีที่ประเมิน     ==>  ให้ c1-c6 เป็น false และ verdict = ไม่ผ่านเกณฑ์
        // 3. ถ้าปีที่ประเมินไม่เกิน 3 ปี c1-c4 เป็น true  ==>  c1-c6 เป็น true และ verdict = ผ่านเกณฑ์
        // 4. ถ้าปีที่ประเมินไม่เกิน 3 ปี c1-c4 ไม่เป็น true ทั้งหมด    ==> verdict = ไม่ผ่านเกณฑ์
        // 5. ถ้าปีที่ประเมินเกิน 3 ปี      ==> ให้ c1-c6 เป็น false และ verdict = ประเมินซ้ำ
        console.log("updatingTambonAssessmentV3 . . . . ");
        count = 0; count_not_found = 0;
        let tambon_list = tambons.find().fetch();
        tambon_list.forEach((item, index, self) => {
            delete tambon_list[index].name_en;
            delete tambon_list[index]._id;
        });
        let itemIDcheck = 901603;
        tambon_list.forEach((item, index, self) => {
            let not_found = true;
            for (i = 0, len = data2.length; i < len; i++) {

                if (item.ID === data2[i].ID) {
                    // อัพเดตข้อมูลใน tambonAssessment จาก EVAUATE_DISTRICT ผ่าน data->data2->eval
                    let eval = data2[i].Evaluate;
                    if (item.ID === itemIDcheck) {
                        console.log();
                        console.log(`${index} ${item.ID} c1=${eval.c1}  c2=${eval.c2} c3=${eval.c3} c4=${eval.c4} c5=${eval.c5}  c6=${eval.c6}`);
                        console.log(`join=${eval.join} join_year=${eval.join_year} pass_year=${eval.pass_year} remark=${eval.remark} eval_date=${eval.evaluate_date}`);
                        console.log("eval ---> 1");
                        console.log(eval);
                    }
                    count++;
                    not_found = false;

                    // this record has nested array difference from others
                    // if(item.ID===630301) {
                    //     console.log(index," before ",item.ID); console.log(eval);
                    // }
                    if (Array.isArray(eval)) {
                        eval = eval[0];
                    }


                    if (item.ID === itemIDcheck) {
                        console.log();
                        console.log(`${index} ${item.ID} c1=${eval.c1}  c2=${eval.c2} c3=${eval.c3} c4=${eval.c4} c5=${eval.c5}  c6=${eval.c6}`);
                        console.log(`join=${eval.join} join_year=${eval.join_year} pass_year=${eval.pass_year} remark=${eval.remark} eval_date=${eval.evaluate_date}`);
                        console.log("eval ---> 2");
                        console.log(eval);
                    }
                    // คำนวณ joinYear                    
                    eval.joinYear = -1;    // ค่า default ไม่เข้าร่วมคือ -1
                    if (parseInt(eval.join_year) > 0) {
                        eval.joinYear = parseInt(eval.join_year);
                    } else if (eval.join === true) {
                        eval.joinYear = 0; // เข้าร่วม แต่ ไม่ระบุ
                    }

                    let todayYear = new Date().getFullYear() + 543;   // ปีพุทธศักราช พ.ศ.
                    let passYear = parseInt(eval.pass_year) || 0; // 0 คือไม่ระบุ
                    let assessYear = passYear; // เปลี่ยนจาก ปีที่ผ่านเกณฑ์ เป็น ปีที่ประเมิน
                    eval.assessYear = assessYear;
                    eval.modifiedBy = 'kanut';
                    eval.migrate = true;
                    let yearLimit = 3;
                    if ((todayYear - passYear) <= yearLimit) { // อยู่ในช่วง 3 ปี
                        if (eval.c1 && eval.c2 && eval.c3 && eval.c4) {
                            eval.c1 = true;
                            eval.c2 = true;
                            eval.c3 = true;
                            eval.c4 = true;
                            eval.c5 = true;
                            eval.c6 = true;
                            eval.verdict = 'ผ่านเกณฑ์';
                        } else {    // c1-c4 เป็นค่าเดิม ไม่ผ่านเกณฑ์
                            eval.c5 = false;
                            eval.c6 = false;
                            eval.verdict = 'ไม่ผ่านเกณฑ์';
                        }
                    } else { // เกิน yearLimit
                        eval.c1 = false;
                        eval.c2 = false;
                        eval.c3 = false;
                        eval.c4 = false;
                        eval.c5 = false;
                        eval.c6 = false;
                        eval.verdict = 'ประเมินซ้ำ';
                    }

                    // if(item.ID===630301) {
                    //     console.log(index," after ",item.ID); console.log(eval);
                    // }
                    tambonAssessment.update({ ID: item.ID }, {
                        $set: {
                            joinYear: eval.joinYear,
                            c1: eval.c1,
                            c2: eval.c2,
                            c3: eval.c3,
                            c4: eval.c4,
                            c5: eval.c5,
                            c6: eval.c6,
                            assessYear: eval.assessYear,
                            passYear: eval.passYear,
                            verdict: eval.verdict,
                            migrate: eval.migrate,
                            modifiedBy: eval.modifiedBy,
                            remark: eval.remark,
                            lastChange: new Date().toLocaleString(),
                        },
                        $currentDate: { lastModified: true }
                    });
                    if (item.ID === itemIDcheck) console.log(eval);
                    break;
                }

            }
            if (not_found) {
                count_not_found++;
                //console.log(`${count_not_found} index=${index} ${item.ID} ${item.name}  <==== Not Found`);

            }
        })
        //console.log('จำนวนตำบลที่อัพเดตเสร็จแล้ว=',count);
        //console.log('จำนวนตำบลที่ไม่ได้ทำ=',count_not_found);

    }
    const getTambonAssessmentAll = () => {
        let assessmentList = tambonAssessment.find().fetch().sort((a, b) => a.ID - b.ID);
        let provinceList = provinces.find().fetch();
        let amphoeList = amphoes.find().fetch();
        let tambonList = tambons.find().fetch().sort((a, b) => a.ID - b.ID);
        let provinceHash = [];
        provinceList.forEach((item, index, self) => {
            delete provinceList._id;
            delete item._id;
            provinceHash[item.ID] = item;
        })
        // provinceHash.forEach((item, index) => {
        //     console.log(`${index} ${item.ID} ${item.name} ${item.zoneID}`);
        //     console.log(`${provinceHash[index].ID} ${provinceHash[index].name} ${provinceHash[index].zoneID}`);
        // })
        let amphoeHash = [];
        amphoeList.forEach((item, index, self) => {
            //console.log(index, item.ID, item.name)
            delete item._id;
            delete item.name_en;
            item.amphoeID = item.ID;
            item.amphoeName = item.name;
            delete item.ID;
            delete item.name;
            amphoeHash[item.amphoeID] = item;
            amphoeHash[item.amphoeID].zoneID = provinceHash[parseInt(item.amphoeID / 100)].zoneID;
            amphoeHash[item.amphoeID].provinceName = provinceHash[parseInt(item.amphoeID / 100)].name;
        })
        // console.log(`tambonList.length=${tambonList.length}`)
        // console.log(`assessmentList.length=${assessmentList.length}`)
        // console.log(tambonList[7])
        assessmentList.forEach((item, index, self) => {
            delete item._id;
            let amphoeID = parseInt(item.ID / 100);
            let tambonName = { tambonName: tambonList[index].name };
            //console.log(tambonName);
            assessmentList[index] = { ...amphoeHash[amphoeID], ...item, ...tambonName }
        })
        //console.log(assessmentList[9])
        return assessmentList;
    }
    
    const getHealthCenters=(cmID) => {
        let cmData = CM_REGISTER.find({CID:cmID}).fetch().pop();        
        cmTambonIDs =[];
        if (cmData.HOSPCODE && cmData.HOSPCODE.CODE) {
            let hcID5 = cmData.HOSPCODE.CODE;
            // console.log('hcID5 ==>',hcID5,'-->',typeof(hcID5));
            let center = healthCenters.find({id5:hcID5}).fetch().pop();
            cmTambonIDs.push(center.tambonID) ;
        }
        if (cmData.DLACODE && cmData.DLACODE.CODE) {
            dlaIDstr = cmData.DLACODE.CODE;
            // console.log(`dlaID=${dlaIDstr} ==> ${typeof(dlaIDstr)}`)
            // tambonID = DLA.find({DLA_CODE:"4710101"}).fetch();
            tambonID = DLA.find({DLA_CODE:dlaIDstr}).fetch().pop().tambonID;
            // console.log(tambonID)
            // console.log(`tambonID = ${tambonID}`)
            cmTambonIDs.push(tambonID);
        }        
        if (cmData.SWITCHING && cmData.SWITCHING.code) {
            // console.log('SWITCHING ==> ',cmData.SWITCHING.code)
        }
        if (cmData.SECONDARY_COMP && cmData.SECONDARY_COMP) {
            // console.log("SECONDARY_COMP ==> ",cmData.SECONDARY_COMP)
        }
       
        return cmTambonIDs;    // array of healthCenterID and dlaID
    }
    const getTambonAssessment = (tambonIDs) => {
        //console.log(tambonIDs);
        let assessmentList =[];
        tambonIDs.forEach((item) => {
            let assessmentTambon = tambonAssessment.find({ID:item}).fetch().pop();            
            delete assessmentTambon._id;
            delete assessmentTambon.lastModified;
            delete assessmentTambon.lastChange;
            delete assessmentTambon.migrate;
            delete assessmentTambon.modifiedBy;
            //console.log(assessmentTambon)
            let tambonName = tambons.find({ID:item}).fetch().pop().name;
            assessmentTambon.name = tambonName;
            assessmentList.push(assessmentTambon);
        })
        //console.log(assessmentList[0]) 
        return assessmentList;
    }
    
    



});