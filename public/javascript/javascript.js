$(document).ready(function(){
  $('.shoppingCart').addClass("shoppingCartMenu");
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
      url: '/qty',
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

  $('.checkOutButton').on("click", function(e){
    var counter = 0;
    var valCounter = 0;
    var success = true;
    var allOk = false;
    $('.checkoutInput').each(function(){
      $(this).css("border", "1px solid #D1D1D1");
      if($(this).val().length === 0){
        $(this).css("border", "1px solid red");
        $('.error').show();
        $('.error').html("Please fill in everything");
        counter--;
      }else{
        counter++;
      }
    });
    if(counter === $('.checkoutInput').length){
      $('.checkoutInput').each(function(){
        if($(this).val().length < 3){
          $('.error').show();
          $('.error').html($(this).attr("name") + " is too short!");
          valCounter--;
        }else{
          valCounter++;
        }
      });
  }
    if(counter === $('.checkoutInput').length && valCounter === $('.checkoutInput').length){
      if($('input[name=email]').val() !== $('input[name=email_confirmation]').val()){
        $('.error').show();
        $('.error').html("Email and Email Confirmation do not match!");
        allOk = false;
      }else if(isNaN($('input[name=phonenumber]').val())){
        $('.error').show();
        $('.error').html("Phonenumber is not a number");
      }else{
        allOk = true;
      }
    }

    if(allOk){
        e.preventDefault();
      $.ajax({
        type: 'POST',
        url: '/checkout',
        data: $('.checkoutForm').serialize(),
        dataType: 'JSON',
        beforeSend: function()
        {
          $(".checkoutOverlay").fadeIn(300, function(){
            $(this).show();
          });
        },
        error: function()
        {
          success = false;
          $(".checkoutOverlay").delay(400).fadeOut(300, function(){
              $(".error").html("Something went wrong!");
          });
        },
        complete: function()
        {
          if(success){
            $(".checkoutOverlay").fadeOut(300, function(){
              window.location.href = "/path/to/thankyoupage";
            });
          }
        },
      });
    }
  });
});
