

selectorMateria = (function(){

	var currentChoice;
	var selectContainer;
	var anios;

	var init = function(){

		selects = document.getElementsByClassName("jsSelect");
	
		for (var i = 0; i < selects.length; i++)
			(function(selects){

				var options = selects.getElementsByClassName("jsOptions")[0];
				var currentOption = selects.getElementsByClassName("jsCurrentChoice")[0];

				selects.addEventListener("click",function(e){
					options.classList.add("show");
					e.cancelBubble = true;
				});

				options.addEventListener('click',function(e){
					var valor = e.target.innerHTML;
					currentOption.textContent = valor;
					this.classList.remove("show");
			
					e.cancelBubble = true;
				});

			})(selects[i]);	

	}

	return {
		init:init
	}


})();


