$( document ).ready(function() {
  $('#nav-toggle').click(function(){
  	$('.nav-mobile').toggleClass('is-active');
  })
  $('.delete').click(function(){
  	$(this).parent().remove()
  })
});