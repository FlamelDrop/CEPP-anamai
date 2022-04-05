import MultiplePagesForm from '../components/multiple-pages-form.js';
import RadioLikeInputList from "../components/radio-like-inputlist.js";

/** @type {MultiplePagesForm} */
let form
let Counter = function () {
    let i = 0;
    this.increase = function () {
        return ++i;
    }
    this.reset = function () {
        return i = 0;
    }
}
let parts = {
    1: new Counter(),
    2: new Counter(),
    3: new Counter(),
    4: new Counter(),
}
/** @param {HTMLFormElement} formElement */
let ScoreChecker = function(formElement){
    /** @param {string} name Name of input value. */
    if(!formElement instanceof HTMLFormElement) throw new Error('Invalid form element.');

    this.getValue = function(name){
        return formElement[name] ? formElement[name].value : null;
    }
}

/** @type {Blaze.Template} */
let that;

/** @type {Array<RadioLikeList>} */
let answers = [];

/**
 * @type {function}
 * 
 * */
let delayTickRejector = null;

Template.adl_m.onRendered(function(){ 
    $("meta[name='viewport']").attr('content', 'width=device-width, initial-scale=1.0');
    that = this;

    /** @type {HTMLFormElement} */
    let formElement = this.$('#s-rick_osm')[0];

    form = new MultiplePagesForm(formElement);
    form.looping = false;

    for(let i = 0; i < form.length; i++){
        answers.push(new RadioLikeInputList(formElement["answer" + (i + 1)]))
    }

    form.onchange = function () {
        that.$('.pages-controller .page-display').html(this.pageNumber + '/' + this.length);

        if (this.pageNumber == this.length) {
            that.$('button[command="next"]').attr('hidden', true);
            that.$('button[command="confirm"]').attr('hidden', false);
        } else {
            that.$('button[command="next"]').attr('hidden', false);
            that.$('button[command="confirm"]').attr('hidden', true);
        }

        if (this.pageNumber == 1) {
            that.$('button[command="prev"]').attr('hidden', true);
            that.$('button[command="cancel"]').attr('hidden', false);
        } else {
            that.$('button[command="prev"]').attr('hidden', false);
            that.$('button[command="cancel"]').attr('hidden', true);
        }


    }

    form.onnext = function () {

    };

    form.onprev = function () {

    }

    form.onchange();
}); 

Template.adl_m.events({
    'change input'() {
        let currentPage = form.pageNumber;
        let objsc = Session.get('ElderDetailADL')
        if (objsc) {
            objsc['ADL1'] = $('input[name="answer1"]:checked').val() ? $('input[name="answer1"]:checked').val() : ''
            objsc['ADL2'] = $('input[name="answer2"]:checked').val() ? $('input[name="answer2"]:checked').val() : ''
            objsc['ADL3'] = $('input[name="answer3"]:checked').val() ? $('input[name="answer3"]:checked').val() : ''
            objsc['ADL4'] = $('input[name="answer4"]:checked').val() ? $('input[name="answer4"]:checked').val() : ''
            objsc['ADL5'] = $('input[name="answer5"]:checked').val() ? $('input[name="answer5"]:checked').val() : ''
            objsc['ADL6'] = $('input[name="answer6"]:checked').val() ? $('input[name="answer6"]:checked').val() : ''
            objsc['ADL7'] = $('input[name="answer7"]:checked').val() ? $('input[name="answer7"]:checked').val() : ''
            objsc['ADL8'] = $('input[name="answer8"]:checked').val() ? $('input[name="answer8"]:checked').val() : ''
            objsc['ADL9'] = $('input[name="answer9"]:checked').val() ? $('input[name="answer9"]:checked').val() : ''
            objsc['ADL10'] =  $('input[name="answer10"]:checked').val() ? $('input[name="answer10"]:checked').val() : ''
            objsc['EVADATE'] = moment().format('YYYY-MM-DD')
            Session.set('ElderDetailADL',objsc)
        }
        if (currentPage != 1) {
            let b = currentPage, x = b - 3, y = b - 2;
            if (answers[b + x].value == "" || answers[b + y].value == "") {
                return;
            }
        }

        if (typeof delayTickRejector == 'function') {
            delayTickRejector();
            delayTickRejector == null;
        }
        new Promise(function (resolve, reject) {
            delayTickRejector = reject;
            setTimeout(function () {
                resolve();
            }, 1000);
        })
            .then(function () {
                form.next();
                delayTickRejector = null;
            })
            .catch(function () { })
    },
    'click button[command="prev"]'() {
        form.prev();
    },
    'click button[command="next"]'() {
        form.next();
    },
    'click button[command="confirm"]': function () {
        Router.go('/CMDashboard_m')
    },
    'click button[command="cancel"]'() {
        Router.go('/CMDashboard_m')
    },
    'change input'(){
        if(typeof delayTickRejector == 'function'){
            delayTickRejector();
            delayTickRejector == null;
        }
        new Promise(function(resolve, reject){
            delayTickRejector = reject;
            setTimeout(function(){
                resolve();
            }, 1000);
        })
        .then(function(){
            form.next();
            delayTickRejector = null;
        })
        .catch(function(){})
    }
});

Template.adl_m.helpers({
    part1count() {
        return "1." + parts[1].increase() + ")"
    },
    part2count() {
        return "2." + parts[2].increase() + ")"
    },
    part3count() {
        return "3." + parts[3].increase() + ")"
    },
    part4count() {
        return "4." + parts[4].increase() + ")"
    }
})