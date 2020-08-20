//recebendo os elementos do DOM
var tempoInicial = $("#tempo-digitacao").text();
var campo = $(".campo-digitacao");


//carregando as funções quando o documento abre
$(function(){
	atualizaTamanhoFrase();
	inicializaContadores();
	inicializaCronometro();
	inicializaMarcadores();
	fraseAleatoria();
	carregaUsuarios();
	atualizaPlacar();
	$('.tooltip').tooltipster();
	$('.tooltip2').tooltipster({
		trigger: "custom"
	});
	$("#botao-reiniciar").click(reiniciaJogo);

	
	
});


//mostrando a quantidade de palavras iniciais
function atualizaTamanhoFrase() {
	var frase = $(".frase").text();
	var numeroPalavras = frase.split(" ").length;
	var tamanhoFrase = $("#total");
	tamanhoFrase.text(numeroPalavras);
}

//atualizando o tempo baseado no server
function atualizaTempo(tempo) {
	tempoInicial = tempo;
	$("#tempo-digitacao").text(tempo);
}


//contando as letras e palavras digitadas no textarea
function inicializaContadores() {
	campo.on("input", function() {
		var qtdPalavras = campo.val().split(/\S+/).length - 1;	
		$("#contador-palavras").text(qtdPalavras);
		$("#contador-caracteres").text(campo.val().length);
	});
}

//cronometro do jogo
function inicializaCronometro() {	
	campo.one("focus", function(){
		var tempoRestante = $("#tempo-digitacao").text();
		var cronometroID = setInterval(function(){
			tempoRestante --;
			$("#tempo-digitacao").text(tempoRestante);
			if (tempoRestante < 1) {
				clearInterval(cronometroID);
				finalizaJogo();
			}		
		},1000);
	});
}

function finalizaJogo() {
	campo.attr("disabled",true);
	$("#botao-reiniciar").toggleClass("disabled");
	campo.toggleClass("terminou");
	inserePlacar();
}

//cor da borda conforme o usuário digita
function inicializaMarcadores() {	
	campo.on("input", function(){
		var frase = $(".frase").text();
		campo.removeClass("borda-preta");
		var digitado = campo.val();
		var comparavel = frase.startsWith(digitado); //utilizei o startswith no lugar do substr de 0 até digitado length
		if (comparavel) {
			campo.addClass("borda-verde");
			campo.removeClass("borda-vermelha");
		}else{
			campo.addClass("borda-vermelha");
			campo.removeClass("borda-verde");
		}

	});	
}

//botão para reiniciar o jogo
function reiniciaJogo() {
	campo.attr("disabled", false);
	campo.val("");
	$("#contador-palavras").text("0");
	$("#contador-caracteres").text("0");
	$("#tempo-digitacao").text(tempoInicial);
	inicializaCronometro();
	$("#botao-reiniciar").toggleClass("disabled");
	campo.toggleClass("terminou");
	campo.addClass("borda-preta");
	campo.removeClass("borda-verde");
	campo.removeClass("borda-vermelha");
}

//carrega usuários já cadastrados
function carregaUsuarios() {	
	$(".select-usuarios").toggle();
	$.get("http://localhost:3000/placar", function(data){	
		data.sort(sortByName)	
		$(data).each(function(){
			var option = new Option(this.usuario, this.usuario);
			$('#usuarios').append(option);	
		})
	})
	.then(setTimeout(function() { 
		selectizeNomes();
	}, 1000))
	.fail(function(){
		alert("Erro ao carregar usuários, recarregue a página.")
	});	
}

function selectizeNomes() {	
		$('#usuarios').selectize({
	    	create: true,
	    	sortField: 'text'
		});
		$(".select-usuarios").toggle();
		$("#carregando").hide();
}