export default class RadioLikeInputList extends Array {
    /** @param {Array<HTMLInputElement>} inputs */
    constructor(inputs) {
        super();

        let that = this;

        this.__attributes__ = {
            /**
             * @param {string} key 
             */
            get(key) {
                return this.__sealed__.load(key);
            },
            /**
             * @param {string} key 
             * @param {*} value 
             */
            set(key, value) {
                return this.__sealed__.save(key, value);
            },
            __sealed__: new function Sealed(){
                let inside = {};
                this.save = function(key, value){
                    return inside[key] = value;
                }
                this.load = function(key){
                    return inside[key];
                }
            }
        };

        Object.freeze(this.__attributes__.__sealed__);

        Object.defineProperties(this, {
            __attributes__: {
                value: that.__attributes__,
                writable: false,
                enumerable: false,
                configurable: false
            }
        })

        this.__attributes__.set("$radio_mode", true);

        for (let i = 0; i < inputs.length; i++) {
            that[i] = inputs[i];
            inputs[i].addEventListener('change', function () {
                let index = i;
                let radioStatus = function(){
                    return that.__attributes__.get('$radio_mode');
                };

                if (this.checked && radioStatus()) {
                    for (let i = 0; i < inputs.length; i++) {
                        if (i != index) inputs[i].checked = false;
                    }
                }
            });
        }
    }
    /**
     * Get amount of input list
     */
    get length() {
        let count = 0;
        while (true) {
            if (!this[count]) {
                break;
            }
            count++;
        }
        return count;
    }
    /**
     * Get selected choice's value.
     */
    get value() {
        if (this.__attributes__.get("$radio_mode")) {
            for (let i = 0; i < this.length; i++) {
                if (this[i].checked) return this[i].value;
            }
            return "";
        } else {
            /** @type {Array<String>} */
            let arr = null;
            for (let i = 0; i < this.length; i++) {
                if (this[i].checked){
                    arr = arr === null ? [] : arr;
                    arr.push(this[i].value);
                }
            }
            return arr;
        }

    }

    get radioMode() {
        return this.__attributes__.get("$radio_mode");
    }

    /**
     * @param {boolean} bool If it is TRUE, this input list will be radio-like that allowing only one selected choice. 
     * 
     * */
    set radioMode(bool) {
        if (typeof bool == 'boolean') {
            if(this.__attributes__.set("$radio_mode", bool)){
                let found = false;
                for(let i = this.length - 1; i >= 0; i--){
                    if(this[i].checked && !found){
                        found = true;
                        continue;
                    }
                    this[i].checked = false;
                }
            }
            return this.__attributes__.get("$radio_mode");
        }
        return this.__attributes__.get("$radio_mode");
    }
}