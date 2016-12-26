$( document ).ready(function() {
    var subItems = $('.submenu').hide();
    $('.menu').click(function(){
      $(this).toggleClass('active');
      $(this).nextUntil('.menu').slideToggle();
    });
    $('.showProducts').on('click', function(){
      $( ".mainContent" ).load("/cms/showproducts");
  });
  $('.addProduct').on('click', function(){
    $( ".mainContent" ).load("/cms/addproduct");
  });

    $('.allOrders').on('click', function(){
    $( ".mainContent" ).load("/cms/orders");
  });

   $('.newOrder').on('click', function(){
  $( ".mainContent" ).load("/cms/neworders");
  });

    $('.mainContent').on( "click", '.fa-eye', function(e) { 
      e.preventDefault();
      var id = $(this).closest("tr").data("id");
      $( ".mainContent" ).load("/cms/orders/" + id);
  });

  


  $('.mainContent').on( "click", '.addSizes', function() {
    if($('.addSizes').prop("checked")){
      $('.sizeCheckBoxes').show();
    }else{
      $('.sizeCheckBoxes').hide();
    }
  });

  $('.mainContent').on( "click", '.addProductBtn', function(e) {
    var counter = 0;
    $('.addProductInput').each(function(){
      $(this).css("border", "1px solid #D1D1D1");
      if($(this).val().length === 0){
        $(this).css("border", "1px solid red");
        showError("Make sure everything is filled in!", e);
        counter--;
      }else{
        counter++;
      }
      if(counter === $('.addProductInput').length){
        console.log("LOL");
        if(isNaN($('input[name="productPrice"]').val())){
          $(this).css("border", "1px solid red");
          showError("Product price is not a number!", e);
        }
      }
    });    
  });
  $('.mainContent').on( "click", '.deleteproduct', function(e) {  
   e.preventDefault();
   var confirmed = false;
   var productName = $(this).closest(".productItem").data("productname");
   var item = $(this).closest(".productItem");
   $('.confirmOverlay').fadeIn(300);
   $('.confirmOverlay').css("display", "block");
   $( ".confirmed" ).on("click", function(e){
        $.ajax({
        type: 'POST',
        url: 'cms/deleteproduct/' + productName,
        dataType: 'JSON',
        complete: function(){
         $('.confirmOverlay').fadeOut(500);
         console.log(item.children());
         item.children(".deleted").css("display", "block");
         item.children(".overlay").css("display", "none");
        }
      }); 
  });

  $( ".bottomConfirmBox button:nth-of-type(2)" ).on("click", function(){
    $('.confirmOverlay').fadeOut(500, function(){
    $('.confirmOverlay').css("display", "none");
    });
  });

  function showError(errorMessage, e){
    e.preventDefault();
    $('.error').show();
    $('.error').html(errorMessage);
  }
  });
   $('.mainContent').on( "click", '.fa-check', function(e) { 
    e.preventDefault();
    var id = $(this).closest("tr").data("id");
    var item = $(this).closest(".fa");
        $.ajax({
        type: 'POST',
        url: 'cms/orders/delivered/' + id,
        dataType: 'JSON',
        complete: function(data){
          console.log(item)
          if(data.responseText === "Yes"){
            item.addClass("delivered");
            item.removeClass("not_delivered");
          }else{
           item.addClass("not_delivered");
           item.removeClass("delivered");
          }
        }
       }); 
  });

  
});
