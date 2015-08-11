;(function($){

	//cogemos enlaces internos.
	$(".anchor").on("click",function(e){
		$this = $(this);
		e.preventDefault();
		//cogemos destino.
		var destino = $this.attr('href');
		var desplazamiento = $(destino).offset().top;
		$("html body").animate({scrollTop:desplazamiento},4000);	
	});

})(jQuery);