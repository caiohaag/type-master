//trocando a frase aleatoriamente, a partir do server

$("#botao-frase").click(fraseAleatoria);
$("#botao-frase-id").click(buscaFrase);

function fraseAleatoria() {
	$("#spinner").show();
	$(".frase").hide();
	$(".informacoes").hide();
	$.get("http://localhost:3000/frases", trocaFraseAleatoria)	
	.fail(function(){
		$("#erro").toggle();
		setTimeout(function(){
			$("#erro").toggle();
		}, 1500);
	})
	.always(function(){
		$("#spinner").hide();
		$(".frase").show();
		$(".informacoes").show();
	});
}

function trocaFraseAleatoria(data) {
	var frase = $(".frase");
	var sorteio = Math.floor(Math.random() * data.length);
	frase.text(data[sorteio].texto);
	atualizaTamanhoFrase();
	atualizaTempo(data[sorteio].tempo);
}

function buscaFrase() {
	$("#spinner").show();
	$(".frase").hide();
	$(".informacoes").hide();
	var fraseId = $("#frase-id").val();
	$.get("http://localhost:3000/frases/" + fraseId, trocaFrase)
	.fail(function(){
		$("#erro").toggle();
		setTimeout(function(){
			$("#erro").toggle();
		}, 1500);
	})
	.always(function(){
		$("#spinner").hide();
		$(".frase").show();
		$(".informacoes").show();
	});
}

function trocaFrase(data) {
	var frase = $(".frase");
	frase.text(data.texto);
	atualizaTamanhoFrase();
	atualizaTempo(data.tempo);
}
