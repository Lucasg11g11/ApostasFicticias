// Inicializa o saldo e o tempo do último jogo
let saldo = localStorage.getItem('saldo') ? parseInt(localStorage.getItem('saldo')) : 1000;
let podeJogar = true;

// Função para atualizar o saldo
// Função para inicializar a página e verificar o saldo
function inicializar() {
    atualizarSaldo();
    verificarJogoDisponivel(); // Verifica se o saldo é 0 ou se o jogo da sorte deve ser exibido
}

// Função para atualizar o saldo
function atualizarSaldo() {
    document.getElementById("dinheiro").innerText = saldo; // Atualiza o saldo na tela
    localStorage.setItem('saldo', saldo); // Atualiza o saldo no localStorage
    verificarJogoDisponivel(); // Verifica se o jogo pode ser jogado
}

// Função para verificar se o jogo da sorte pode ser exibido
function verificarJogoDisponivel() {
    const jogoElement = document.getElementById("jogo");
    const formularioElement = document.querySelector(".formulario-apostas");

    if (saldo <= 0) {
        jogoElement.style.display = 'block'; // Exibe o jogo da sorte automaticamente
        formularioElement.style.display = 'none';
        document.getElementById("mensagem").innerText = "Você ficou sem moedas!"; // Exibe mensagem de saldo insuficiente
    } else {
        jogoElement.style.display = 'none'; // Esconde o jogo da sorte
        formularioElement.style.display = 'block'; // Exibe o formulário de apostas
        document.getElementById("mensagem").innerText = ""; // Limpa a mensagem de saldo insuficiente
    }
}

// Função para o botão "Jogar Jogo da Sorte" (na parte superior)
function jogarJogoDaSorte() {
    mostrarJogoDaSorte(); // Chama a função que exibe o Jogo da Sorte
}

// Evento do botão "Jogar Jogo da Sorte"
document.getElementById("btnJogarSorte").addEventListener("click", jogarJogoDaSorte);

// Inicializa a página
inicializar();


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
    const tipoAposta = document.getElementById("tipoAposta").value;

    // Verificações adicionais
    if (!tipoAposta) {
        alert("Por favor, selecione o tipo de aposta.");
        return;
    }

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
    verificarConquistas(); // Verificar conquistas após a aposta
}

// Reseta o saldo
function resetar() {
    saldo = 1000;
    atualizarSaldo();
    document.getElementById("mensagem").innerText = "Saldo resetado. Aposte novamente!";
}

// Função para o minijogo de risco
function minijogoDeRisco() {
    const risco = Math.random();
    if (risco < 0.2) {
        saldo += 500;
        alert("Você teve sorte! Ganhou 500 moedas.");
    } else if (risco < 0.5) {
        saldo += 100;
        alert("Você ganhou 100 moedas!");
    } else if (risco < 0.8) {
        saldo -= 50;
        alert("Você perdeu 50 moedas.");
    } else {
        saldo -= 200;
        alert("Que azar! Você perdeu 200 moedas.");
    }
    atualizarSaldo();
    verificarConquistas(); // Verificar conquistas após o risco
}

// Função para verificar conquistas
function verificarConquistas() {
    let mensagemConquista = "";

    // Verificar se já foi desbloqueado
    if (saldo >= 5000 && !localStorage.getItem("conquistaRico")) {
        mensagemConquista += "Parabéns! Você alcançou 5000 moedas e desbloqueou a conquista 'Rico'.\n";
        localStorage.setItem("conquistaRico", "desbloqueado");
    }

    if (saldo >= 10000 && !localStorage.getItem("conquistaMilionario")) {
        mensagemConquista += "Incrível! Você alcançou 10000 moedas e desbloqueou a conquista 'Milionário'.\n";
        localStorage.setItem("conquistaMilionario", "desbloqueado");
    }

    if (saldo <= 0 && !localStorage.getItem("conquistaQuebraBanco")) {
        mensagemConquista += "Você perdeu todas as suas moedas. Conquista 'Quebra-banco' desbloqueada!\n";
        localStorage.setItem("conquistaQuebraBanco", "desbloqueado");
    }

    if (mensagemConquista !== "") {
        alert(mensagemConquista); // Exibe as mensagens de conquista
    }
}

// Função para resetar o saldo
function resetarConquistas() {
    saldo = 1000;
    localStorage.removeItem("conquistaRico");
    localStorage.removeItem("conquistaMilionario");
    localStorage.removeItem("conquistaQuebraBanco");
    alert("Seu progresso foi resetado. Tente novamente!");
    atualizarSaldo();
}

// Função para mostrar as conquistas
function mostrarConquistas() {
    const conquistasContainer = document.getElementById("conquistas");
    const conquistas = [];

    if (localStorage.getItem("conquistaRico")) {
        conquistas.push("Rico - Alcançou 5000 moedas.");
    }
    if (localStorage.getItem("conquistaMilionario")) {
        conquistas.push("Milionário - Alcançou 10000 moedas.");
    }
    if (localStorage.getItem("conquistaQuebraBanco")) {
        conquistas.push("Quebra-banco - Perdeu todas as moedas.");
    }

    if (conquistas.length > 0) {
        conquistasContainer.innerHTML = `<h2>Suas Conquistas</h2><ul>${conquistas.map(c => `<li>${c}</li>`).join('')}</ul>`;
    } else {
        conquistasContainer.innerHTML = "<h2>Você ainda não desbloqueou nenhuma conquista.</h2>";
    }

    document.getElementById("intro").style.display = 'none';
    document.getElementById("saldoSection").style.display = 'none';
    document.getElementById("formularioApostas").style.display = 'none';
    document.getElementById("minijogo").style.display = 'none';
    document.getElementById("jogo").style.display = 'none';
    conquistasContainer.style.display = 'block';
}

// Função para mostrar apostas
function mostrarApostas() {
    document.getElementById("intro").style.display = 'none';
    document.getElementById("saldoSection").style.display = 'block';
    document.getElementById("formularioApostas").style.display = 'block';
    document.getElementById("conquistas").style.display = 'none';
    document.getElementById("minijogo").style.display = 'none';
    document.getElementById("jogo").style.display = 'none';
}

// Função para mostrar minijogo
function mostrarMinijogo() {
    document.getElementById("intro").style.display = 'none';
    document.getElementById("saldoSection").style.display = 'none';
    document.getElementById("formularioApostas").style.display = 'none';
    document.getElementById("conquistas").style.display = 'none';
    document.getElementById("minijogo").style.display = 'block';
    document.getElementById("jogo").style.display = 'none';
}

// Função para mostrar jogo da sorte
function mostrarJogoDaSorte() {
    document.getElementById("intro").style.display = 'none';
    document.getElementById("saldoSection").style.display = 'none';
    document.getElementById("formularioApostas").style.display = 'none';
    document.getElementById("conquistas").style.display = 'none';
    document.getElementById("minijogo").style.display = 'none';
    document.getElementById("jogo").style.display = 'block';
}

// Função para jogar o jogo da sorte
function jogar() {
    const numeroEscolhido = parseInt(document.getElementById("numeroEscolhido").value);
    const numeroSorteado = Math.floor(Math.random() * 20) + 1;
    let mensagem = "";

    if (numeroEscolhido === numeroSorteado) {
        saldo += 1000; // Ganho de 1000 moedas se acertar o número
        mensagem = `Parabéns! Você acertou o número ${numeroSorteado} e ganhou 1000 moedas!`;
    } else {
        mensagem = `Que pena! O número sorteado foi ${numeroSorteado}. Tente novamente!`;
    }

    document.getElementById("mensagemJogo").innerText = mensagem;
    atualizarSaldo();
}

// Inicializa o saldo na primeira carga da página
atualizarSaldo();
