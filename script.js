
const movimentos = document.getElementById("movimentos");
const tempoValor = document.getElementById("tempo");
const startButton = document.getElementById("comecar");
const stopButton = document.getElementById("pausar");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("resultado");
const controls = document.querySelector(".controle-container");
const wrapper = document.querySelector(".wrapper");
const flipSound = document.getElementById("flip");
flipSound.volume = 0.1;
const clickSound = document.getElementById("click");
clickSound.volume = 0.1;
const winSound = document.getElementById("win");
winSound.volume = 0.1;

let cards = [];
let interval;
let primeiroCard = false;
let segundoCard = false;

//Array
const itens = [
    {name: "dino", img: "imagens/dino.png"}, 
    {name:"bear", img: "imagens/bear.png"}, 
    {name:"cat", img: "imagens/cat.png"}, 
    {name:"dog", img: "imagens/dog.png"}, 
    {name:"fish", img: "imagens/fish.png"}, 
    {name:"octopus", img: "imagens/octopus.png"},
     {name:"bird", img: "imagens/bird.png"}, 
    {name:"owl", img: "imagens/owl.png"}];



//Movimentos e contagem de vitórias
let movimentosContagem = 0, winCount = 0;


//Tempo Inicial
let seconds = 0, minutes = 0;

//timer
const timeGenerator = () => {
    seconds++;
    if(seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    
    //formato tempo
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    tempoValor.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Movimentos
const movimentosCounter = () => {
    movimentosContagem++;
    movimentos.innerHTML = `<span>Movimentos:</span>${movimentosContagem}`;
}

//Objetos aleatorios da array
const generateRandom = (size=4) => {
    //temporario
    let tempArray = [...itens];
    //valor cards
    let cardValues = [];

    size = (size * size) / 2; //tamanho do array

    //gerar valores aleatorios
    for(let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //remover o item selecionado
        tempArray.splice(randomIndex, 1);
    }

    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //embaralhar os valores
    cardValues.sort(() => Math.random() - 0.5);

    for(let i=0; i < size * size; i++){
        /*criar elemento card frente e costas */
        gameContainer.innerHTML +=`
        <div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-costas"></div>
            <div class="card-frente"><img src="${cardValues[i].img}" class="image" width="50px"></div>
        </div>`;
    };

    //grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    //cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //verificar cards

            if(!card.classList.contains("matched")){
                //girar card
                card.classList.add("flipped");
                flipSound.currentTime = 0;
                flipSound.play();
                //verificar se é o primeiro card
                if(!primeiroCard) {
                    primeiroCard = card;
                    
                    primeiroCardValue = card.getAttribute("data-card-value");
                }
                else{
                //aumentar contagem de movimentos
                movimentosCounter();
                //segundo card
                segundoCard = card;
                let segundoCardValue = card.getAttribute("data-card-value");
                    if(primeiroCardValue == segundoCardValue){
                        primeiroCard.classList.add("matched");
                        segundoCard.classList.add("matched");
                    //reiniciar cards
                        primeiroCard = false;
                    //win count se o jogador acertar
                        winCount++;
                    //verificar se o jogo acabou
                        if(winCount == Math.floor(cardValues.length / 2)) {
                            winSound.currentTime = 0;
                            winSound.play();
                            clearInterval(interval);
                            result.innerHTML = `<h2>Você ganhou!</h2> <h4>Total de movimentos: ${movimentosContagem}</h4>`;
                            stopGame();
                        }
                    } else {
                    //se não for igual, girar de volta
                    let [tempFirst, tempSecond] = [primeiroCard, segundoCard];
                    primeiroCard = false;
                    segundoCard = false;
                    let delay = setTimeout(() => {
                        tempFirst.classList.remove("flipped");
                        tempSecond.classList.remove("flipped");
                        flipSound.currentTime = 0;
                        flipSound.play();
                    },900);
                    }
                }
            } 
        });
    })
};

//iniciar jogo
startButton.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
    movimentosContagem = 0;
    tempo = 0;
    document.querySelector(".wrapper").classList.add("visible")
    //controle e botoes visiveis
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //iniciar contagem de tempo
    interval = setInterval(timeGenerator, 1000);
    //iniciar contagem de movimentos
    movimentos.innerHTML = `<span>Movimentos:</span>${movimentosContagem}`;
    initializer();
});

//parar jogo
stopButton.addEventListener("click", (stopGame = () =>{
    clickSound.currentTime = 0;
    clickSound.play();
    
    wrapper.classList.remove("visible");
    
    setTimeout(() => {
        controls.classList.remove("hide");
    },600)
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
    seconds= 0;
    minutes = 0;
    tempoValor.innerHTML = `<span>Time:</span>00:00`;
}));

//iniciar valores

const initializer = () => {
    result.innerText="";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};


