Template.CMdashboard_m.onRendered(function(){
    $("meta[name='viewport']").attr('content', 'width=device-width, initial-scale=1.0');
})
Template.CMdashboard_m.events({
    'click #tocp'() {
        Session.set('elderID', this);
        Router.go('/adl_m');
    },
})