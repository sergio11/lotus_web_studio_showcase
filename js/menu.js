;(function($){

	$(".btn-menu").on("click",function(e){
		e.preventDefault();
		$(this).next().toggleClass("visible");
	});

	$("#nav ul.principal > li:has(ul.desplegable)").on("click",function(){
		$(this).find("ul.desplegable").slideToggle();
	});

})(jQuery);