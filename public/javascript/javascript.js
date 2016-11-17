$(document).ready(function(){
  $(window).scroll(function () {
    if($(window).scrollTop() !== 0){
      $('.menu').addClass("menuFixed");
      $('.menu li').css("float", "none");
      $('.shoppingCart').removeClass("shoppingCartMenu");
    }else{
      $('.menu').removeClass("menuFixed");
      $('.menu li').css("float", "left");
      $('.shoppingCart').addClass("shoppingCartMenu");
    }
  });

  $("a").on('click', function(event) {

    if (this.hash !== "") {
      event.preventDefault();

      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
      });
    }
  });

  function fadeInItems(itemClassName){
    $(window).scroll(function () {
         $(itemClassName).each(function (i) {
             var bottom_of_object = $(this).position().top + $(this).outerHeight();
             var bottom_of_window = $(window).scrollTop() + $(window).height() / 3;
             if (bottom_of_window > bottom_of_object) {
               $(this).animate({'opacity':'1'},500);
             }
         });
     });
  }

  fadeInItems('.webshopItem');

  $('.shoppingCartQty').on("input", function(){
    var productPrice = $(this).closest("tr").find("span").attr('data-price');
    var valQty = $(this).val();
    var newPrice = parseFloat(productPrice * valQty).toFixed(2);
    $(this).closest("tr").find("span").html(newPrice);
    var total = 0;
    $('.shoppingCartPrice').each(function() {
      total += parseFloat($(this).html());
    });
      console.log(shoppingCart);
    $('.shoppingCartTotalPrice').html(parseFloat(total).toFixed(2));
  });
});
