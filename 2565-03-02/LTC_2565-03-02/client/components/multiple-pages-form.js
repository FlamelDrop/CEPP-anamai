/**
 * @typedef State
 * @property {boolean} prevent_change
 * 
 * @param {State} state 
 */
function Ev(state){
    this.stopExecution = function(){
        state.prevent_change = true;
    }
}

export default class MultiplePagesForm {

    /** 
     * @constructor
     * @param {HTMLElement} element
     */
    constructor(element) {

        let loop = (function (val) {
            var x = val;
            return function (setAs) {
                if (typeof x == typeof setAs) {
                    return x = setAs;
                }
                return x;
            }
        })(true);

        if (!$(element).hasClass('multiple-pages-form')) throw new Error('Error.');

        this.$form = $(element);
        this.$pages = $(element).find('.page');
        this.__loop__ = loop;
        /** 
         * 
         * @callback EventListener
         * @param {Ev} event
         * 
         * @type {EventListener}
         */
        this.onchange = null;
        /**
         * @type {EventListener}
         */
        this.onnext = null;
        /**
         * @type {EventListener}
         */
        this.onprev = null;

        if (this.$pages.filter('.current').length >= 2) {
            this.$pages.filter('.current:not(:last)').removeClass('current');
        } else if (this.$pages.filter('.current').length == 0) {
            this.$pages.filter('.page:first').addClass('current');
        }

        Object.defineProperties(this, {
            __loop__: {
                writable: false,
                enumerable: false,
                configurable: false,
                value: loop
            },
            $form: {
                writable: false,
                enumerable: false,
                configurable: false,
                value: $(element)
            },
            $pages: {
                writable: false,
                enumerable: false,
                configurable: false,
                value: $(element).find('.page')
            }
        })
    }

    loopMode(mode) {
        if (typeof mode == 'boolean') {
            this.__loop__(mode);
        }
        return this.__loop__();
    }

    /**
     * Change current page to next page.
     */
    next() {
        let $current = this.$pages.filter('.current'),
            $next = $current.next(),
            state = {
                prevent_change: false,
            },
            ev = new Ev(state);

        if (this.loopMode() === false && $next.length == 0) return;
        if ($next.length == 0) $next = this.$pages.first();

        if (typeof this.onnext == 'function') this.onnext(ev);

        if(state.prevent_change === true) return;

        $current.removeClass('current');
        $next.addClass('current');

        if (typeof this.onchange == 'function') this.onchange(ev);

        return;
    };

    /**
     * Change current page to previous page.
     */
    prev() {
        let $current = this.$pages.filter('.current'),
            $prev = $current.prev(),
            state = {
                prevent_change: false
            },
            ev = new Ev(state);

        if (this.loopMode() === false && $prev.length == 0) return;
        if ($prev.length == 0) $prev = this.$pages.last();

        if (typeof this.onprev == 'function') this.onprev(ev);
        
        if(state.prevent_change === true) return;

        $current.removeClass('current');
        $prev.addClass('current');

        if (typeof this.onchange == 'function') this.onchange(ev);

        return;
    };

    /**
     * Change current page by page number.
     * 
     * @param {number} number Specify integer page number
     * @param {boolean} onChangeTrigger If it is FALSE, 'onchange' event callback will be not fired.
     * 
     */
    goTo(number, onChangeTrigger) {
        let $current = this.$pages.filter('.current');

        if (number != this.pageNumber && number >= 1 && number <= this.length) {
            $(this.$pages.get(number - 1)).addClass('current');
            $current.removeClass('current');
            if (typeof this.onchange == 'function' && onChangeTrigger === true) this.onchange();
        }

    }

    /**
     * @param {boolean} state if false, stop looping when current page is first or last.  
     */
    set looping(state) {
        return this.loopMode(state);
    }

    get looping() {
        return this.loopMode();
    }

    /**
     * Get maximum of pages
     */
    get length() {
        return this.$pages.length;
    }

    /**
     * Get current page number
     */
    get pageNumber() {
        let that = this;
        return $(that.$pages).index(that.$pages.filter('.current')) + 1;
    }

}