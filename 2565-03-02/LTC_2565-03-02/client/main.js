// import '../node_modules/@fortawesome/fontawesome-free/js/all.js'

Template.index.onRendered(function () {
    //$('#myModal').modal({ backdrop: 'static', keyboard: false })
})


Template.index.events({

    'click .video-btn'(event, temp) {
        var $videoSrc;
        $videoSrc = $(event.target).data("src");
        $('#svid').attr('src', $videoSrc);
        var v = document.getElementById('evideo');
        $("#myModal").on('shown.bs.modal', function () {
            v.load();
            v.play().catch(function() {
                // do something
            });
        });

    },
    'click .closeV'() {
        var v = document.getElementById('evideo');
        $('#myModal').on('hidden.bs.modal', function () {
            v.pause();
            v.removeAttribute('src'); // empty source
        });

    }

})

