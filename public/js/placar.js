//inserindo o resultado no placar
function inserePlacar() {
	var corpoTabela = $(".placar").find("tbody");
	var usuario = $("#usuarios").val();
	var numPalavras = $("#contador-palavras").text();

	if ($(".campo-digitacao").is(".borda-verde")){
		var linha = novaLinha(usuario, numPalavras);

		linha.find(".botao-remover").click(removeLinha);

		corpoTabela.append(linha);
		
		var score = {
			usuario: usuario,
			pontos: numPalavras
		};

		$.post("http://localhost:3000/placar", score, function(){
			console.log("Dados salvos");
		})
		.then(atualizaPlacar)
		.fail(function(){
			alert("Falha ao atualizar o banco de dados.")
		})
		.always(mostraPlacar);
	}else{
		$('.tooltip2').tooltipster("open").tooltipster("content", "O texto contém erros!");
		setTimeout(function() {
			$('.tooltip2').tooltipster("close");
		},2000);
	};
	
}

//função que cria uma linha 
function novaLinha(usuario, numPalavras, id) {
	var linha = $("<tr>")
	var colunaUsuario = $("<td>").text(usuario);
	var colunaPalavras = $("<td>").text(numPalavras);
	var colunaRemover = $("<td>");	
	var link = $("<a>").addClass("botao-remover").attr("href", "#").attr("alt", id);
	var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");
	
	link.append(icone);
	colunaRemover.append(link);

	linha.append(colunaUsuario);
	linha.append(colunaPalavras);
	linha.append(colunaRemover);

	return linha;
}

//funcao de remover placar

function removeLinha(){
	event.preventDefault();
	var linha = $(this).parent().parent();
	var link = linha.find(".botao-remover");
	var idd = link.attr("alt");
	linha.fadeOut();
	setTimeout(function() {
		linha.remove();	
	},1000);
	$.ajax({
    	url: "http://localhost:3000/placar/" + idd,
    	type: 'DELETE',
    	success: function(result) {
        	console.log("Removido com sucesso");
			setTimeout(function() {
				atualizaPlacar();
			},1001);
    	},
    	 error: function(request,msg,error) {
        	alert("Erro ao tentar deletar no servidor.")
    	}
	});	
}

//botão mostra placar
$("#botao-placar").click(mostraPlacar);

function mostraPlacar() {
	$(".placar").stop().slideToggle(600);
}

//botao sincroniza placar
/*$("#botao-sync").click(sincronizaPlacar);

function sincronizaPlacar(){
	var placar = [];
	var linhas = $("tbody>tr");
	linhas.each(function(){
		var usuario = $(this).find("td:nth-child(1)").text();
		var palavras = $(this).find("td:nth-child(2)").text();
		var score = {
			usuario: usuario,
			pontos: palavras
		};
		console.log(score);
	});	


	$.post("http://localhost:3000/placar", score, function(){
		console.log("Dados salvos");
	})
	.then(atualizaPlacar())
	.fail(function(){
		alert("Falha ao atualizar o banco de dados.")
	});
}
*/
//abrindo o site com o placar do servidor
function atualizaPlacar(){
	$("tbody tr").remove();
	$.get("http://localhost:3000/placar", function(data){
		var ordenado = data.sort(sortByScore);
		$(ordenado).each(function(){
			var linha = novaLinha(this.usuario, this.pontos, this.id);
			var idRemocao = this.id;
			linha.find(".botao-remover").click(removeLinha);
			$("tbody").append(linha);
		})
	});
}

//ordenar os itens do placar pelos pontos
function sortByScore(a, b) {
	var aScore = parseInt(a.pontos);
	var bScore = parseInt(b.pontos);
	return ((aScore > bScore) ? -1 : ((aScore < bScore) ? 1 : 0));
}

//ordenar os nomes de usuarios
function sortByName(a, b) {
	var aScore = a.usuario;
	var bScore = b.usuario;
	return ((aScore < bScore) ? -1 : ((aScore > bScore) ? 1 : 0));
}