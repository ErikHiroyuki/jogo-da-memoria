//VAR's
let card = document.getElementsByClassName("card");
let cards = [...card];
let openedCards = [];
let matchedCard = document.getElementsByClassName("match");
let movimentos = 0;

//POPUP DE PRABENS
	const popup = document.getElementById("parabens-popup");

	let refreshHTML = function(target, value) 
	{
		return target.innerHTML = value;
	};

	let CounterSet = function(movimentos) 
	{
		this.target = document.querySelector(".counter");
		refreshHTML(this.target, movimentos);
	};

//CONTADOR DE MOVIMENTOS
	CounterSet.prototype.add = function() 
	{
		movimentos++;
		refreshHTML(this.target, movimentos);
	};

//ATUALIZAR-RESETAR O CONTATADOR

	CounterSet.prototype.restart = function() 
	{
		movimentos = 0;
		refreshHTML(this.target, movimentos);
	};

	let counter = new CounterSet(movimentos);

//ESTRELA - ATÉ 15 MOVIMENTOS = 3 ESTRELAS, ATÉ 23 MOVIMENTOS = 2 ESTRELAS, ACIMA DE 23 MOVIMENTOS = 1 ESTRELA
	let PlcarEstrela = function() 
	{
		this.estrelas = document.querySelectorAll(".fa-star");
	};

	PlcarEstrela.prototype.rate = function() 
	{
		if(movimentos > 15 && movimentos < 23) {
			this.estrelas[2].classList.remove("luz");
		} else if(movimentos > 23) {
			this.estrelas[1].classList.remove("luz");
		}
	};

	PlcarEstrela.prototype.restart = function() 
	{
		for(var i=0; i<this.estrelas.length; i++) 
		{
			this.estrelas[i].classList.add("luz");
		}
	};

	let estrelas = new PlcarEstrela();

//DECLANDO O TIMER
	const timer = document.querySelector(".timer");


//MOSTRANDO MINUTOS E SEGUNDOS 
	let second = {
		value: 0,
		label: " "
	};

	let minute = {
		value: 0,
		label: " : "
	};

	let interval;

	window.onload = iniciarJogo();

// LISTANDO OS EVENTOS
	for(var i = 0; i < cards.length; i++) 
	{
		cards[i].addEventListener("click", displayCard);
		cards[i].addEventListener("click", cardAbrir);
		cards[i].addEventListener("click", parabens);
	}

//RESETAR O BTN
	document.querySelector(".restart").addEventListener("click", iniciarJogo);

//SHUFFLE (ANOTADO PÁGINA 50)
	function shuffle(array) {
		var currentIndex = array.length, timerraryValue, randomIndex;
		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			timerraryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = timerraryValue;
		}

	return array;
}

//COMEÇA UM NOVO JOGO
	function iniciarJogo() {
		cards = shuffle(cards);
		for(var i=0; i<cards.length; i++) {
			document.querySelector(".deck").innerHTML = "";
			[].forEach.call(cards, function(item) {
				document.querySelector(".deck").appendChild(item);
			});
			cards[i].classList.remove("show", "open", "match", "disabled");
		}
		counter.restart();
		estrelas.restart();
		resetatimer();
	}

//DEFININDO FUNCIONALIDADE
	function displayCard() 
	{
		this.classList.toggle("open");
		this.classList.toggle("show");
		this.classList.toggle("disabled");
	}

	function cardAbrir() 
	{
		openedCards.push(this);
		if(openedCards.length === 2) {
			counter.add();
			estrelas.rate();
			comecatimer();
			if(openedCards[0].type === openedCards[1].type) {
				matched();
			} else {
				unmatched();
			}
		}
	}

//CARTAS IGUAIS
	function matched() 
	{
		for(var i=0; i<openedCards.length; i++) {
			openedCards[i].classList.add("match", "disabled");
			openedCards[i].classList.remove("show", "open", "no-event");
		}
		openedCards = [];
	}

//CARTAS DIFERENTES
	function unmatched() 
	{
		for(var i=0; i<openedCards.length; i++) {
			openedCards[i].classList.add("unmatched");
		}
		disable();
		setTimeout(function() {
			for(var i=0; i<openedCards.length; i++) {
				openedCards[i].classList.remove("show", "open", "no-event", "unmatched");
			}
			enable();
			openedCards = [];
		}, 1100);
	}

	function disable() 
	{
		for(var i = 0; i < cards.length; i++) {
			cards[i].classList.add("disabled");
		}
	}


	function enable() 
	{
		for(var i = 0; i < cards.length; i++) {
			if(!cards[i].classList.contains("match")) {
				cards[i].classList.remove("disabled");
			};
		}
	}

//ATURALIZAR E RESETAR O TEMPO
	function refreshtimer() 
	{
		timer.innerHTML = minute.value + minute.label + second.value + second.label;
	}

	function resetatimer() 
	{
		second.value = 0;
		minute.value = 0;
		refreshtimer();
	}

// INICIAR O TEMPO
	function comecatimer() 
	{
		if(movimentos == 1) {
			interval = setInterval(function() {
				second.value++;
				if(second.value == 60) {
					minute.value++;
					second.value = 0;
				}
				refreshtimer();
			}, 1000);
		}
	}

// PARABENS POPUP - MOSTRANDO O RESULTADO
	function parabens() 
	{
		if(matchedCard.length == 16) {
			clearInterval(interval);
			popup.classList.add("show");
			document.getElementById("total-movi").innerHTML = movimentos;
			document.getElementById("total-tempo").innerHTML = timer.innerHTML;
			document.getElementById("placar-estrela").innerHTML = document.querySelector(".stars").innerHTML;
			closePopup();
		};
	}

//BTN INICIAR JOGO
	function closePopup() 
	{
		document.getElementById("btn-replay").addEventListener("click", function() {
			popup.classList.remove("show");
			iniciarJogo();
		});
	}