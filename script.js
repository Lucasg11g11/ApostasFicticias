// Inicializa o saldo e o tempo do último jogo
let saldo = localStorage.getItem('saldo') ? parseInt(localStorage.getItem('saldo')) : 100;
let ultimoJogo = localStorage.getItem('ultimoJogo') ? parseInt(localStorage.getItem('ultimoJogo')) : 0;
let podeJogar = true;

// Atualiza o saldo na tela
function atualizarSaldo() {
    document.getElementById("dinheiro").innerText = saldo;
    localStorage.setItem('saldo', saldo);
    verificarJogoDisponivel();
}

// Verifica se o jogo da sorte deve aparecer
function verificarJogoDisponivel() {
    const jogoElement = document.getElementById("jogo");
    const formularioElement = document.querySelector(".formulario-apostas");

    if (saldo <= 0) {
        jogoElement.style.display = 'block';
        formularioElement.style.display = 'none';
        document.getElementById("mensagem").innerText = "Você ficou sem moedas!"; // Exibe mensagem de saldo insuficiente
    } else {
        jogoElement.style.display = 'none';
        formularioElement.style.display = 'block';
        document.getElementById("mensagem").innerText = ""; // Limpa a mensagem de saldo insuficiente
    }
}

// Exibe as opções de aposta conforme o tipo
function mostrarOpcoesAposta() {
    const tipoAposta = document.getElementById("tipoAposta").value;
    document.querySelector(".opcoes-aposta").style.display = 'none';
    document.getElementById("opcoesMultiplicador").style.display = 'none';
    document.getElementById("opcoesValorMaximo").style.display = 'none';

    if (tipoAposta === 'multiplicador') {
        document.getElementById("opcoesMultiplicador").style.display = 'block';
    } else if (tipoAposta === 'valorMaximo') {
        document.getElementById("opcoesValorMaximo").style.display = 'block';
    }

    if (tipoAposta !== "") {
        document.querySelector(".opcoes-aposta").style.display = 'block';
    }
}

// Faz a aposta
function apostar() {
    const aposta = parseInt(document.getElementById("quantidadeAposta").value);
    if (aposta < 50) {
        alert("O valor mínimo de aposta é 50 moedas!");
        return;
    }
    if (aposta > saldo) {
        alert("Saldo insuficiente!");
        return;
    }

    saldo -= aposta;
    let premio = 0;
    let resultado = '';
    const tipoAposta = document.getElementById("tipoAposta").value;

    if (tipoAposta === 'multiplicador') {
        const multiplicador = parseInt(document.getElementById("multiplicador").value);
        const chanceDeGanar = 1 / multiplicador;
        resultado = Math.random() < chanceDeGanar ? "Você ganhou!" : "Você perdeu!";
        if (resultado === "Você ganhou!") {
            premio = aposta * multiplicador;
        }
    } else if (tipoAposta === 'valorMaximo') {
        const valorMaximo = parseInt(document.getElementById("valorMaximo").value);
        const chanceDeGanar = aposta / valorMaximo;
        resultado = Math.random() < chanceDeGanar ? "Você ganhou!" : "Você perdeu!";
        if (resultado === "Você ganhou!") {
            premio = valorMaximo;
        }
    }

    // Exibe o resultado da aposta
    if (resultado === "Você ganhou!") {
        saldo += premio;
        document.getElementById("mensagem").innerText = `Você ganhou! Seu prêmio é ${premio} moedas.`;
    } else {
        document.getElementById("mensagem").innerText = "Você perdeu!";
    }

    atualizarSaldo();
}

// Reseta o saldo
function resetar() {
    saldo = 100;
    atualizarSaldo();
    document.getElementById("mensagem").innerText = "Saldo resetado. Aposte novamente!";
}

// Inicia o jogo da sorte
function jogar() {
    // Removido o cooldown de 5 minutos, agora o jogador pode jogar novamente imediatamente
    document.querySelector(".formulario-apostas").style.display = 'none';
    document.getElementById("jogo").style.display = 'block';
    document.getElementById("resultadoJogo").style.display = 'block';
    document.getElementById("mensagemJogo").innerText = "Escolha um número entre 1 e 20.";

    // Salva o tempo atual como o último jogo (se necessário)
    localStorage.setItem('ultimoJogo', Date.now());
}

// Verifica o resultado do jogo
function verificarJogo() {
    const numeroEscolhido = parseInt(document.getElementById("numeroEscolhido").value);
    const numeroCorreto = Math.floor(Math.random() * 20) + 1;  // Agora o número correto é entre 1 e 20
    let premio = 0;
    let mensagem = '';

    if (isNaN(numeroEscolhido) || numeroEscolhido < 1 || numeroEscolhido > 20) {
        alert("Escolha um número entre 1 e 20.");
        return;
    }

    // Ajusta a chance de ganhar com base no prêmio
    const dificuldade = saldo < 100 ? 1 : (saldo < 500 ? 0.5 : (saldo < 1000 ? 0.3 : 0.1));

    // A probabilidade de ganhar diminui com o prêmio
    if (numeroEscolhido === numeroCorreto) {
        premio = Math.floor(Math.random() * 401) + 100; // O prêmio agora pode ser até 500 moedas
        saldo += premio;
        mensagem = `Parabéns! Você ganhou ${premio} moedas.`;
        document.getElementById("jogo").style.display = 'none';
    } else {
        saldo = Math.max(saldo - 50, 0);
        mensagem = `Que pena! Você errou e perdeu 50 moedas. O número correto era ${numeroCorreto}.`;
    }

    atualizarSaldo();
    document.getElementById("mensagemJogo").innerText = mensagem;
}

// Atualiza o saldo ao carregar
atualizarSaldo();

// Ligar o evento de clique no botão de "Jogar"
document.getElementById("botaoJogar").addEventListener("click", function() {
    if (saldo <= 0) {
        alert("Você não pode jogar sem moedas!");
        return;
    }
    jogar();
});
