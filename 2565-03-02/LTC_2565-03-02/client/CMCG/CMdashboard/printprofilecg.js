Template.printprofilecg.onRendered(function(){
    window.print();
    window.history.back(); 
})

Template.printprofilecg.helpers({
    profilecg() {
        if (Session.get('provinceSelectedCG')) {
            return Session.get('provinceSelectedCG')[0];
        }else{
        	 return Session.get('ShowcmSelectedCG')[0];
        }
    },
})