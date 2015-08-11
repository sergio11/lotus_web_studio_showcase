;(function($){

	if (Modernizr.localstorage){

		var $form = $("#contacForm");
		var $controlesAlmacenables = $("#contacForm").find(".jsLocalStorage"); 
		
		$controlesAlmacenables.each(function(){
			//recuperamos los valores.
			$this = $(this);
			if (localStorage[$this.attr('name')]){
				$this.val(localStorage[$this.attr('name')]);
			};
		});

		$controlesAlmacenables.on('change',function(){
			//guardamos valores.
			$this = $(this);
			localStorage[$this.attr('name')] = $this.val();
		});

		$form.on('submit reset',function(e){
			localStorage.clear();
			console.log("Datos Borrados");
		});

	}



})(jQuery);