(function($){
	// No tocar!!!!!!
	Array.prototype.inArray = function (elem){
	    for (var i=0; i < this.length; i++) {
	    	var regExp = new RegExp(this[i],"i");
	        if (elem.toString().match(regExp) != null) {
	            return true;
	        }
	    }
	    return false;
	};
	// No tocar!!!!!!
	function isArray(val){
		if (typeof val == 'object') { 
			var criterion = val.constructor.toString().match(/array/i); 
			return (criterion != null); 
		}
		return false;
	};

	//Configuración del Plugin.
	var defaultSettings = {
		nativeValidity : true, // Utiliza el  objeto validityState de javaScript para comprobar la validez de los campos.
		validationIndicator : '.jsValidate', // Nombre de la clase utilizada para marcar a un control como validable.
		formControlsValidate : ['input', 'textarea', 'select'], //Elementos que debe ser validados configuralo como quieras para adaptarlo a tus necesidades
		activeValidation : true, //Indica si la validación debe producirse cada vez que el elemeto pierde el foco, cámbialo a false para que sólo se produzca en el momento de enviar el formulario
		cssValidClass:"valid",//Nombre de la clase que se añadirá cuando el control sea válido.
		cssInvalidClass:"invalid",//Nombre de la clase que se añadirá cuando el control sea inválido.
		idErrorBox:"",//Caja donde se incluirán los errores
		defaultErrorMsg:true,//Si se mustran mensajes de error por defecto.
		dataAttributeName:""//Si no se muestran los mensajes de error por defecto se recogerán del data-attribute indicado.
	}


	
	//Variables.
	var validityStateAvaliable;
	var formValid = false;
	var formControlsStatus = [];
	var pluginSettings;


	$.fn.validation = function(settings){
		
		pluginSettings = $.extend({},defaultSettings,settings);
		$errorBox = $("<ul>").appendTo($(pluginSettings.idErrorBox).hide());

		if (pluginSettings.nativeValidity && typeof(ValidityState) == "function") {
			validityStateAvaliable = true;
		}else if(pluginSettings.nativeValidity && !typeof(ValidityState) == "function"){
			validityStateAvaliable = false;
			console.log("Validación Nativa no soportada....");
		}

		return this.each(function(idx,form){

			if(form instanceof HTMLFormElement){

				$form = $(form);
				$controls = $form.find(pluginSettings.validationIndicator);

				if(isArray(pluginSettings.formControlsValidate)){
					$controls.filter(function(){
						if(pluginSettings.formControlsValidate.inArray(this.tagName.toLowerCase())){
							formControlsStatus[$(this).attr('id')] = false;
							return true;
						}else{
							return false;
						}
					});
				}

				$form.on("change",function(e){
					var control = e.target;
					//validamos el control.
					validateControl.call(control);
				});

				$form.on("submit",function(e){
					
					e.preventDefault();

					$controls.each(function(idx,control){
						//validamos cada control.
						validateControl.call(control);
					});

					if(Object.keys(formControlsStatus).map(function(el){return formControlsStatus[el]}).indexOf(false) == -1){
						//$(this).attr("disabled",false);
						//una rutina de la página debe subcribirse
						// a este evento para enviar el form al servidor
						$errorBox.hide();
						$form.trigger("sendForm");
						//console.log(submit);
					}else{
						$errorBox.fadeIn("Medium",function(){
							$form.find(".invalid:first").focus();
						});
					}

					e.stopPropagation();
						
				});
			}

			console.log(formControlsStatus);
		});
	}

	function validateControl(){

		$this = $(this);

		if (validityStateAvaliable){
			
			if(!$this.get(0).validity.valid){
				
				var errorMenssage;

				// el campo de entrada es inválido 
				// le añadimos la clase invalid
				$this.removeClass(pluginSettings.cssValidClass);
				$this.addClass(pluginSettings.cssInvalidClass);

				if (pluginSettings.defaultErrorMsg) {

					// comprobamos que restricción no cumple
					if($this.get(0).validity.patternMismatch){
						errorMenssage = "El texto debe adaptarse al patrón especificado";
					}else if ($this.get(0).validity.valueMissing) {
						errorMenssage = "Este campo es requerido, debes rellenarlo";
					}else if ($this.get(0).typeMismatch && $this.get(0).validity.badInput){
						errorMenssage = "El dato de entrada no se ajusta al tipo especificado";
					}else{
						errorMenssage = "Dato no válido";
					}

				}else{
					console.log($this.get(0).dataset);
					errorMenssage = $this.get(0).dataset[pluginSettings.dataAttributeName];
				}
				
				if(!$this.siblings().filter(".errorBox").length){
					showErrorBox.apply(this,[errorMenssage]);
				}
				
				formControlsStatus[$this.attr("id")] = false;

			}else{
				
				$this.removeClass(pluginSettings.cssInvalidClass);
				$this.addClass(pluginSettings.cssValidClass);
				$this.siblings().filter(".errorBox").fadeOut("Medium",function(){
					$(this).remove();
				})	
				formControlsStatus[$this.attr("id")] = true;
			
			}

		}else{

			console.log("Validación no soportado por el navegador");

		}
			
			
	}

	function showErrorBox(msg){
		var $errorBox = $("<div>",{class:"errorBox"})
			.append("<span>"+msg+"</span>")
			.wrapInner("<p></p>")
			.appendTo(this.parentNode)
			.fadeIn(700);

		//anchura total del párrafo
		var anchDispo = $errorBox.find("p").width();
		console.log("Anchura total Párrafo:" + anchDispo);
		//anchura del mensaje

		var anchErroMens = $errorBox.find("span").width();
		console.log("Anchura total texto:" + anchErroMens);
		//Si el mensaje desborda la caja habrá que moverlo.
		if (anchDispo < anchErroMens){
			//desplazamiento necesario
			var des = anchErroMens - anchDispo;
			var $errorMenssage = $errorBox.find("span");
			$errorMenssage.on('move',function(){
				$self = $(this);	
				$errorBox.find("span").animate({'left':-des},4000)
					.delay(2000).animate({'left':0},4000,function(){
						console.log(this);
						$self.trigger('move')
					});
			});
			$errorMenssage.trigger('move');
		};

	}		

})(jQuery);

