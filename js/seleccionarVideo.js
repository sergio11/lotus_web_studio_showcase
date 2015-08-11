;(function($){

	var reproductor = (function(){

		var maxim,media,play,mute,barra,progreso,volume,loop;

		// los métodos play() y pause() son algunos de los métodos incorporados por
		// HTML5 para el procesamiento de materiales multimedia.
		var push = function(){
			// si la reprodución no está detenida y no ha terminado
			// pausamos el video.
			var icon = play.children[0];
			if(!media.paused && !media.ended){
				media.pause();
				icon.className = "icon-play";
				clearInterval(loop);
			}else{
				media.play();
				icon.className = "icon-pause";
				loop = setInterval(status,1000);
			}
		}

		var status = function(){
			if (!media.ended){	
				//calculamos la longitud en píxeles que debería tener la barra de reprodución.
				var size = parseInt(media.currentTime * maxim / media.duration);
				progreso.style.width = size + "px";
			}
			else{
				//Ha finalizado vuelve al princio.
				progreso.style.width = "0px";
			}
		}



		var move = function(e){
			if(!media.paused && !media.ended){
				//distancia en píxeles desde la posición del ratón y el comienzo de la barra.
				var mouseX = e.pageX - barra.offsetLeft;
				// el número de segundos que esa distancia representa en la línea de tiempo
				var newTime = mouseX * media.duration / maxim;
				media.currentTime = newTime;
				progreso.style.width = mouseX + "px";

			}
		}

		var sound = function(){
			var icon = mute.children[0];
			if (icon.className == "icon-volume-high"){
				media.muted = true;
				icon.className = "icon-volume-off";
			}
			else{
				media.muted = false;
				icon.className = "icon-volume-high";
			}
		}

		var level = function(){
			media.volume = volume.value;
			//console.log(volume.value);
		}

		var setSource = function(newSrc){
			if (newSrc){
				//Restablecemos barra de progreso si fuera necesario.
				progreso.style.width = "0px";
				media.src = newSrc;
				//Provocamos evento click sobre el primer track.
				var eventPlay = new Event("click");
				play.dispatchEvent(eventPlay);
				//Activamos Subtítulos.
				media.textTracks[0].mode = "showing";
				console.log("Inciando video");
			};
		}

		var defaultSettings = {
			//tamaño máximo de la barra de progreso
			maxim : 400,
			idMedia : "media",
			idPlayButton:"play",
			idMuteButton:"mute",
			idBarra:"barra",
			idProgreso:"progreso",
			idVolume:"volume"
		}

		var extend = function(object1,object2){
			if (object1&&object2) {
				for(var property in object1){
					if (object2[property]&&object2[property]!=object1[property])
						object1[property] = object2[property];
				}
			};

			return object1;
		}

		var init = function(settings){

			var settings = extend(defaultSettings,settings);
			maxim = settings.maxim;
			media =  document.getElementById(settings.idMedia);
			play  =  document.getElementById(settings.idPlayButton);
			mute  =  document.getElementById(settings.idMuteButton);
			barra =  document.getElementById(settings.idBarra);
			progreso = document.getElementById(settings.idProgreso);
			volume = document.getElementById(settings.idVolume);

			play.addEventListener('click',push);
			mute.addEventListener('click',sound);
			barra.addEventListener('click',move);
			volume.addEventListener('click',level);
		}

		//API Pública
		return{

			init:init,
			setSource:setSource
		}

	})();

	//Módulo encargado de gestionar los track.
	window.selectorVideos = (function(){

		var $listaVideos = $("#listaVideo");
		var $progressBar = $("#progress-bar");
		var	urlBase = '../../js/talleres.json';
		var	$contenedorDesc = $("#descripcionVideo");
		var	$currentTrack;
		var $template  = $listaVideos.find("li.template");

		var cloneTemplate = function(){
			//realizamos una copia de la plantilla oculta en el HTML
			// así evitamos la creación del HTML desde JavaSript.
			
			$li = $template.clone().removeClass('template');
			return $li;
		}

		var fillTrack = function($li,data){
			$li.find("h4.tituloVideo").text(data.tittle);
			$li.find("p.explicacion").text(data.teaser);
			$li.data("descripcion",data.otherData);
			return $li;
		}

		var createTracks = function(tracks){
			var numTracks = tracks.length;
			var $fragment = $(document.createDocumentFragment());
			for(var i = 0; i < numTracks; i++){
				$li = fillTrack(cloneTemplate(),tracks[i]);
				$fragment.append($li);
			}
			
			// añadimos todos los li al contendor.
			$listaVideos.append($fragment);
		}
			
	
		var showTrack = function(){
			$currentTrack = $(this);
			if (!$currentTrack.hasClass('selected')){
				$currentTrack.siblings().removeClass('selected').end().addClass('selected');
				//Simulamos un posible retardo de la red
				// Esto se quita en entorno real
				$contenedorDesc.children().fadeOut();
				$progressBar.removeClass("hide");
				setTimeout(function(){
					showContent();
					$progressBar.addClass("hide");
					$contenedorDesc.children().fadeIn("Medium");
				},1500);
			}
				
		}

		var getContent = function(){
			return $currentTrack.data("descripcion");
		}

		var showContent = function(data){
			$data = getContent();
			$contenedorDesc.find("time.fechaTaller").text($data.date);
			$contenedorDesc.find("figure.imagen img").attr('src',$data.img.src);
			$contenedorDesc.find("figure.imagen figcaption").text($data.img.leyenda);
			$contenedorDesc.find("article.text").text($data.text);
			reproductor.setSource($data.srcVideo);
		}

		var selectTrackByIndex = function(indx){
			$.proxy(showTrack,$listaVideos.children().get(indx + 1))();
		}

		var init = function(callback){
			reproductor.init();
			//obtenemos JSON con los datos.
			$.getJSON(urlBase,function(resp){
				//creamos los tracks de los videos
				//(elementos li html)
				createTracks(resp.talleres);
				//configuramos que los eventos sobre los li
				// se delegen al padre.
				$listaVideos.delegate('li','click',function(e){
					$track = $(this);
					showTrack.call($track);

				});

				callback();
				
			});	
		}
		
		// API Pública
		return{

			init:init,
			selectTrackByIndex:selectTrackByIndex
		}

	})();


})(jQuery);