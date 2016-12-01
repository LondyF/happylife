$(document).ready(function(){
  $(window).scroll(function () {
    if($(window).scrollTop() !== 0){
      $('.menu').addClass("menuFixed");
      $('.menu li').css("float", "none");
      $('.menu').removeClass("menuAtTop");
      $('.shoppingCart').removeClass("shoppingCartMenu");
    }else{
      $('.menu ul').remove('.fa fa-shopping-cart');
      $('.menu').removeClass("menuFixed");
      $('.menu').addClass("menuAtTop");
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
    var productName = $(this).closest("tr").find(".shoppingCartProductName").html();
    var productPrice = $(this).closest("tr").find(".shoppingCartPrice").attr('data-price');
    var valQty = $(this).val();
    var newPrice = parseFloat(productPrice * valQty).toFixed(2);

    //set value to 0 when below 0
    if($(this).val() < 0){
      $(this).val(0);
    //set value to 100 when higher than 100
    }else if($(this).val() > 100){
      $(this).val(100);
    }

    $(this).closest("tr").find(".shoppingCartPrice").html(newPrice);
    var total = 0;
    $('.shoppingCartPrice').each(function() {
      total += parseFloat($(this).html());
    });

    $('.shoppingCartTotalPrice').html(parseFloat(total).toFixed(2));

    $.ajax({
      type: 'POST',
      url: '/test',
      dataType: 'JSON',
      data: {qty: valQty, productName: productName},
      succes: function(data){
        //callback
      }
    });
  });

  $('.shoppingCartDelete').on("click", function(){
    var productPrice = $(this).closest("tr").find(".shoppingCartPrice").html();
    var productName = $(this).closest("tr").find(".shoppingCartProductName").html();
    var total = $(".shoppingCartTotalPrice").html();
    console.log(total);
    $(this).closest('tr').fadeOut(500, function(){
      $.ajax({
        type: 'DELETE',
        url: '/deleteitem',
        dataType: 'JSON',
        data: {productName: productName},
        success: function(data) {
        }
      });
      $(this).remove();
      total = parseFloat(total - productPrice).toFixed();
      $(".shoppingCartTotalPrice").html(parseFloat(total).toFixed(2));
      });
    });

  $(".bla").hide();
  var ok = true;
  $('.checkOutButton').on("click", function(e){
    $('.checkoutInput').each(function(){
      $(this).css("border", "1px solid #D1D1D1");
      if($(this).val().length === 0){
        $(this).css("border", "1px solid red");
        $('.error').html("Please fill in every");
        ok = false;
      }else{
        ok = true;
      }
    });
    if(ok){
        e.preventDefault();
      $.ajax({
        type: 'POST',
        url: '/checkout',
        data: $('.checkoutForm').serialize(),
        dataType: 'JSON',
        beforeSend: function()
        {
        $(".error").html("l");
        $(".bla").show();
        },
        success: function()
        {
        $(".bla").html("Your Order has been placed");
        },
        error: function()
        {
          $(".bla").html("");
          $(".error").html("Something went wrong!");
        },
      });
    }
  });
});
