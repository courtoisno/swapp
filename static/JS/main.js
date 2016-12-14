 $(document).ready(function() {
   
    Materialize.updateTextFields();
	$('.button-collapse').sideNav();
	 $('#textarea1').val('New Text');
  $('#textarea1').trigger('autoresize');


  // $('.del-offer').on('click', function (event) {
  // 	console.log(this)
  // 	console.log(event.target)

  // 	if(confirm('delete offer?')){

  // 		$.post('/delete', function(response){
		// 	console.log('deleting offer');
		// 	window.location.href='/profile';
  // 		})
  // 	}
  // })

 $('.del-offer').on('click', function () {
    var id= $(this).data('id');
    var url = '/delete/' + id;
    if(confirm('delete offer?')){

      $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result){
          console.log('deleting offer');
          window.location.href='/';
        },
        error:function(err){
          console.log(err)
        }
      })
    }
  })

  });
      
