$(function() {
    $(document).on("click", ".js__menu-switch", function(){
        $(this).toggleClass('open');
        $('.js__menu-nav').toggleClass('open');
    });

    $(".js__selectbox").selectbox({
        effect: "fade",
        onOpen: function (inst) {
            $(this).next('.sbHolder').addClass("sbHolder_open");
        },
        onClose: function (inst) {
            $(this).next('.sbHolder').removeClass("sbHolder_open");
        }
    });

});

