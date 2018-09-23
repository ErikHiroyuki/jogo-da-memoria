//VAR's
	let card = document.getElementsByClassName("card");
	let cards = [...card];
	let openedCards = [];
	let matchedCard = document.getElementsByClassName("match");
	let movi = 0;


//DURANTE O JOGO
	const popup = document.getElementById("popup-parabens");


	let refreshHTML = function(target, value) 
	{
		return target.innerHTML = value;
	};

	let CounterSet = function(movi) 
	{
		this.target = document.querySelector(".counter");
		refreshHTML(this.target, movi);
	};

//CONTADOR DE MOVIMENTOS
	CounterSet.prototype.add = function() 
	{
		movi++; 
		refreshHTML(this.target, movi); 
	};

//ATUALIZAR-RESETAR O CONTATADOR
	CounterSet.prototype.restart = function() 
	{
		movi = 0;
		refreshHTML(this.target, movi); 
	};

//TOTAL DE MOVIMENETOS
	let counter = new CounterSet(movi); 


//ESTRELA - ATÉ 15 MOVIMENTOS = 3 ESTRELAS, ATÉ 23 MOVIMENTOS = 2 ESTRELAS, ACIMA DE 23 MOVIMENTOS = 1 ESTRELA
	let placarEstrela = function() 
	{
		this.estrelas = document.querySelectorAll(".fa-star");
	};

	placarEstrela.prototype.rate = function() 
	{
		if(movi > 15 && movi < 23) 
		{
			this.estrelas[2].classList.remove("luz"); 
		} else if(movi > 23) 
		{
			this.estrelas[1].classList.remove("luz"); 
		}
	};

	placarEstrela.prototype.restart = function() 
	{
		for(var i=0; i<this.estrelas.length; i++) 
		{
			this.estrelas[i].classList.add("luz");
		}
	};

	let estrelas = new placarEstrela();

//  MOSTRANDO MINUTOS E SEGUNDOS 
	const timer = document.querySelector(".timer"); 
	let second = 
	{
		value: 0,
		label: " "
	};

	let minute = 
	{
		value: 0,
		label: " : "
	};


	let interval;

	window.onload = iniciarJogo();

//O TEMPO COMEÇA A CONTAR A PARTIR DO PRIMEIRO MOVIMENTO
	function comecaTimer() 
	{
		if(movi == 1) { 
			interval = setInterval(function() 
			{
				second.value++; 
				if(second.value == 50) 
				{
					minute.value++;
					second.value = 0;
				}
				refreshTimer();
			}, 1200);
		}
	}

//CONTADOR DE SOMA DE MOVIMENTOS 
	for(var i = 0; i < cards.length; i++) 
	{  
		cards[i].addEventListener("click", displayCard);
		cards[i].addEventListener("click", cardAberto);
		cards[i].addEventListener("click", parabens);
	}

//RESETAR O TEMPO
	function resetaTimer() 
	{ 
		second.value = 0;
		minute.value = 0;
		refreshTimer();
	}

// RESETAR O JOGO
	document.querySelector(".restart").addEventListener("click", iniciarJogo);

//APÓS VENCER
	function parabens() {
		if(matchedCard.length == 16) 
		{
			clearInterval(interval);
			popup.classList.add("show");
			document.getElementById("total-movi").innerHTML = movi; 
			document.getElementById("total-tempo").innerHTML = timer.innerHTML;
			document.getElementById("placarEstrela").innerHTML = document.querySelector(".stars").innerHTML;
			closePopup();
		};
	}



// SHUFFLE (ANOTADO PÁGINA 50)
	function shuffle(array) 
	{
		var currentIndex = array.length, temporaryValue, randomIndex;
			while (currentIndex !== 0) 
				{
					randomIndex = Math.floor(Math.random() * currentIndex); //PARA FAZER O RANDOM 
					currentIndex -= 1;
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}
		return array;
	}

	function iniciarJogo() 
	{
		cards = shuffle(cards);
		for(var i=0; i<cards.length; i++) 
		{
			document.querySelector(".deck").innerHTML = "";
			[].forEach.call(cards, function(item) 
			{ 
				document.querySelector(".deck").appendChild(item);
			});
			cards[i].classList.remove("show", "open", "match", "disabled");
		}
		counter.restart();
		estrelas.restart();
		resetaTimer();
	}


	function displayCard() 
	{
		this.classList.toggle("open");
		this.classList.toggle("show");
		this.classList.toggle("disabled");
	}

//CARTAS IGUAIS
	function matched() 
	{
		for(var i=0; i<openedCards.length; i++) 
		{
			openedCards[i].classList.add("match", "disabled"); 
			openedCards[i].classList.remove("show", "open", "no-event");
		}
		openedCards = [];
	}

//CARTAS DIFERENTES
	function unmatched() {
		for(var i=0; i<openedCards.length; i++) 
		{
			openedCards[i].classList.add("unmatched");
		}
		disable();
		setTimeout(function() 
		{
			for(var i=0; i<openedCards.length; i++) 
			{
				openedCards[i].classList.remove("show", "open", "no-event", "unmatched");
			}
			enable();
			openedCards = [];
		}, 1100);
	}

	function cardAberto() 
	{
		openedCards.push(this);
		if(openedCards.length === 2) 
		{
			counter.add();
			estrelas.rate();
			comecaTimer();
			if(openedCards[0].type === openedCards[1].type) 
			{
				matched(); 
			} else {
				unmatched(); 
			}
		}
	}

	function disable() 
	{
		for(var i = 0; i < cards.length; i++) 
		{
			cards[i].classList.add("disabled");
		}
	}

	function enable() {
		for(var i = 0; i < cards.length; i++) 
		{
			if(!cards[i].classList.contains("match")) 
			{
				cards[i].classList.remove("disabled");
			};
		}
	}

//RESETAR O TEMPO
	function refreshTimer() {
		timer.innerHTML = minute.value + minute.label + second.value + second.label; 
	}

//POPUP PARABÉNS FINAL DO JOGO
	function closePopup() 
	{ //HTML
		document.getElementById("btn-replay").addEventListener("click", function() 
		{
			popup.classList.remove("show"); 
			iniciarJogo();
		});
	}


