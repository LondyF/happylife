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
   console.log(productName);
   $('.confirmOverlay').css("display", "block");
   $( ".bottomConfirmBox button:first-of-type" ).on("click", function(){
        $.ajax({
        type: 'POST',
        url: '/cms/deleteproduct/' + productName,
        dataType: 'JSON',
        success: function(data) {
        }
      });
   });
  });


  function showError(errorMessage, e){
    e.preventDefault();
    $('.error').show();
    $('.error').html(errorMessage);
  }
});
