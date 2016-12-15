 $(document).ready(function() {
   
    Materialize.updateTextFields();
	$('.button-collapse').sideNav();
	 $('#textarea1').val('New Text');
  $('#textarea1').trigger('autoresize');


  $('.del-offer').on('click', function (event) {
  	console.log(this.id)
  	console.log(event.target.id)

  	if(confirm('delete offer?')){

  		$.post('/delete', { theid: this.id },function(response){
			console.log('deleting offer');
			window.location.href='/profile';
  		})
  	}
  })

$(document).on('click', 'a.smoothScroll', function(event){
    event.preventDefault();


  $('html, body').animate({
    scrollTop: $( $.attr(this, 'href') ).offset().top
  }, 1000);
});



 

  });
      
