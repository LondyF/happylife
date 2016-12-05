$( document ).ready(function() {
    var subItems = $('.submenu').hide();
    $('.menu').click(function(){
      $(this).toggleClass('active');
      $(this).nextUntil('.menu').slideToggle();
    });
    $('.showProducts').on('click', function(){
      $( ".mainContent" ).load("/cms/showproducts");
    });
});
