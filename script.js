let saldo = 1000; // Saldo inicial
let nivel = 1; // Nível inicial
let recompensas = [
    "Nenhuma", "100 moedas", "200 moedas", "300 moedas", "500 moedas", 
    "600 moedas", "700 moedas", "800 moedas", "900 moedas", "1000 moedas"
]; // Recompensas por nível

// Função para apostar
function apostar() {
    const quantidadeAposta = parseInt(document.getElementById("quantidadeAposta").value);
    const tipoAposta = document.getElementById("tipoAposta").value;

    if (quantidadeAposta > saldo || quantidadeAposta < 50) {
        alert("Você não tem moedas suficientes ou a aposta é menor que o valor mínimo de 50 moedas.");
        return;
    }

    saldo -= quantidadeAposta;
    let resultado = '';

    if (tipoAposta === 'multiplicadorAleatorio') {
        const chanceDeGanhar = Math.random() < 0.3; // 30% de chance de ganhar

        if (chanceDeGanhar) {
            let multiplicador;
            let sorteio = Math.random();

            if (sorteio < 0.5) multiplicador = 2;  // 50% de chance de x2
            else if (sorteio < 0.75) multiplicador = 3;  // 25% de chance de x3
            else if (sorteio < 0.9) multiplicador = 5;  // 15% de chance de x5
            else if (sorteio < 0.97) multiplicador = 10;  // 7% de chance de x10
            else if (sorteio < 0.995) multiplicador = 50;  // 2.5% de chance de x50
            else multiplicador = 100;  // 0.5% de chance de x100

            const ganho = quantidadeAposta * multiplicador;
            saldo += ganho;
            resultado = `Você ganhou ${ganho.toFixed(2)} moedas com um multiplicador de ${multiplicador}!`;
        } else {
            resultado = "Você perdeu!";
        }

    } else if (tipoAposta === 'multiplicadorFixo') {
        const multiplicadorFixo = parseInt(document.getElementById("multiplicadorFixo").value);
        const chanceDeGanhar = 1 / multiplicadorFixo; // Quanto maior o multiplicador, menor a chance
        if (Math.random() <= chanceDeGanhar) {
            const ganho = quantidadeAposta * multiplicadorFixo;
            saldo += ganho;
            resultado = `Você ganhou ${ganho.toFixed(2)} moedas com um multiplicador fixo de ${multiplicadorFixo}!`;
        } else {
            resultado = "Você perdeu a aposta de multiplicador fixo.";
        }

    } else if (tipoAposta === 'valorMaximo') {
        const valorMaximo = parseInt(document.getElementById("valorMaximo").value);
        const diferenca = valorMaximo - quantidadeAposta;
        const chanceDeGanhar = 1 - (diferenca / valorMaximo); // Quanto maior a diferença, menor a chance

        if (Math.random() <= chanceDeGanhar) {
            saldo += valorMaximo;
            resultado = `Você ganhou ${valorMaximo.toFixed(2)} moedas, que é o valor máximo que você escolheu!`;
        } else {
            resultado = `Você perdeu! Sua aposta foi maior do que o valor máximo de ${valorMaximo}.`;
        }
    } else {
        resultado = "Escolha uma opção de aposta válida.";
    }

    atualizarSaldo();
    document.getElementById("resultadoAposta").textContent = resultado;
    document.getElementById("resultadoAposta").style.display = 'block';
}

function trocarAba(aba) {
    // Esconde todas as abas
    const abas = document.querySelectorAll('.aba');
    abas.forEach(function (abaElement) {
        abaElement.style.display = 'none';
    });

    // Mostra a aba selecionada
    const abaSelecionada = document.getElementById(aba);
    if (abaSelecionada) {
        abaSelecionada.style.display = 'block';
    }
}

// Atualiza o saldo exibido na tela
function atualizarSaldo() {
    if (saldo < 0) saldo = 0;
    document.getElementById("dinheiro").textContent = `R$ ${saldo.toFixed(2)}`;
    salvarDados(); // Salva automaticamente após atualizar o saldo
}

// Função para verificar e atualizar o nível
function verificarNivel() {
    if (saldo >= 10000) {
        nivel = 10;
    } else if (saldo >= 9000) {
        nivel = 9;
    } else if (saldo >= 8000) {
        nivel = 8;
    } else if (saldo >= 7000) {
        nivel = 7;
    } else if (saldo >= 6000) {
        nivel = 6;
    } else if (saldo >= 5000) {
        nivel = 5;
    } else if (saldo >= 4000) {
        nivel = 4;
    } else if (saldo >= 3000) {
        nivel = 3;
    } else if (saldo >= 2000) {
        nivel = 2;
    } else {
        nivel = 1;
    }
    document.getElementById("nivel").textContent = `Nível: ${nivel} - ${recompensas[nivel - 1]}`;
    salvarDados();
}

// Declaração da variável db fora das funções, para ser compartilhada por todo o script
let db;

// Abrir o banco de dados IndexedDB
const request = indexedDB.open('meuBanco', 1);

request.onerror = function(event) {
    console.error("Erro ao abrir o banco de dados:", event.target.error);
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Banco de dados aberto com sucesso");
    
    // Só chama carregarDados() após o banco estar pronto
    carregarDados();
};

// Criar a estrutura do banco de dados se necessário
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("minhaLoja")) {
        db.createObjectStore("minhaLoja", { keyPath: "id" });
    }
};

// Função para salvar os dados
function salvarDados() {
    if (!db) {
        console.error("Banco de dados ainda não está pronto!");
        return;
    }

    const transaction = db.transaction(["minhaLoja"], "readwrite");
    const objectStore = transaction.objectStore("minhaLoja");
    const dados = {
        id: 1,
        saldo: saldo,
        nivel: nivel
    };

    const request = objectStore.put(dados);

    request.onerror = function(event) {
        console.error("Erro ao salvar os dados:", event.target.error);
    };

    request.onsuccess = function(event) {
        console.log("Dados salvos com sucesso!");
    };
}

// Função para carregar os dados corretamente
function carregarDados() {
    if (!db) {
        console.error("Banco de dados ainda não está pronto!");
        return;
    }

    const transaction = db.transaction(["minhaLoja"], "readonly");
    const objectStore = transaction.objectStore("minhaLoja");
    const request = objectStore.get(1); // Supondo que o ID 1 seja o usuário

    request.onerror = function(event) {
        console.error("Erro ao carregar os dados:", event.target.error);
    };

    request.onsuccess = function(event) {
        const dados = event.target.result;
        if (dados) {
            saldo = dados.saldo || saldo;
            nivel = dados.nivel || nivel;
            document.getElementById("dinheiro").textContent = `R$ ${saldo.toFixed(2)}`;
            document.getElementById("nivelUsuario").textContent = `Nível: ${nivel}`;
        } else {
            console.log("Nenhum dado encontrado para este usuário.");
        }
    };
}
function fecharJogoDaSorte() {
    document.getElementById("resultadoJogo").style.display = 'none';
    document.getElementById("jogo").style.display = 'block';
}

function mostrarConquistas() {
    verificarConquistas();
    trocarAba("conquistas");
}

function mostrarNivel() {
    alert(`Você está no nível ${nivel}. Recompensa: ${recompensas[nivel - 1]}`);
}

// Verificar conquistas
function verificarConquistas() {
    let mensagemConquista = '';

    if (saldo >= 5000) {
        mensagemConquista += 'Você alcançou o marco de 5000 moedas! ';
    }
    if (saldo >= 10000) {
        mensagemConquista += 'Você alcançou o marco de 10000 moedas! ';
    }

    if (saldo >= 2000) {
        mensagemConquista += 'Você apostou 2000 moedas! ';
    }

    if (mensagemConquista) {
        alert(mensagemConquista);
    } else {
        alert('Você ainda não desbloqueou nenhuma conquista.');
    }
}

// Função para o minijogo de risco
function minijogoDeRisco() {
    const resultadoMinijogo = Math.random();

    if (resultadoMinijogo < 0.5) {
        saldo -= 100;
        alert("Você perdeu no Minijogo de Risco! Perdeu 100 moedas.");
    } else {
        saldo += 200;
        alert("Você ganhou no Minijogo de Risco! Ganhou 200 moedas.");
    }

    atualizarSaldo();
}

// Função para o jogo da sorte
function jogarJogoDaSorte() {
    const numeroEscolhido = parseInt(document.getElementById("numeroEscolhido").value);

    if (isNaN(numeroEscolhido) || numeroEscolhido < 1 || numeroEscolhido > 20) {
        alert("Por favor, escolha um número entre 1 e 20.");
        return;
    }

    const numeroSorteado = Math.floor(Math.random() * 20) + 1;

    if (numeroEscolhido === numeroSorteado) {
        saldo += 500;  // Ganhou 500 moedas
        document.getElementById("mensagemJogo").textContent = `Você acertou! Ganhou 500 moedas. Número sorteado: ${numeroSorteado}`;
    } else {
        saldo -= 50;  // Perdeu 50 moedas
        document.getElementById("mensagemJogo").textContent = `Você errou! Perdeu 50 moedas. Número sorteado: ${numeroSorteado}`;
    }

    atualizarSaldo();  // Atualiza a exibição do saldo
}

// Função para mostrar a seção de minijogo de risco
function mostrarMinijogo() {
    trocarAba('minijogo');
}

// Função para mostrar a seção do Jogo da Sorte
function mostrarJogoDaSorte() {
    trocarAba('jogo')
    document.getElementById("jogo").style.display = 'block'; // Mostra o Jogo da Sorte
    document.getElementById("resultadoJogo").style.display = 'none'; // Esconde o resultado
}

function iniciarJogoDaSorte() {
    trocarAba('jogo')
    document.getElementById("jogo").style.display = 'none'; // Mostra o Jogo da Sorte
    document.getElementById("resultadoJogo").style.display = 'block'; // Esconde o resultado
}

// Função para fechar o Jogo da Sorte
function fecharJogoDaSorte() {
    document.getElementById("resultadoJogo").style.display = 'none';
    
    document.getElementById("jogo").style.display = 'block';
}

// Função para mostrar as opções de aposta de acordo com o tipo escolhido
function mostrarOpcoesAposta() {
    const tipoAposta = document.getElementById("tipoAposta").value;

    // Esconde todas as opções de aposta
    document.getElementById("opcoesMultiplicadorAleatorio").style.display = 'none';
    document.getElementById("opcoesMultiplicadorFixo").style.display = 'none';
    document.getElementById("opcoesValorMaximo").style.display = 'none';

    // Mostra as opções de aposta de acordo com o tipo selecionado
    if (tipoAposta === 'multiplicadorAleatorio') {
        document.getElementById("opcoesMultiplicadorAleatorio").style.display = 'block';
    } else if (tipoAposta === 'multiplicadorFixo') {
        document.getElementById("opcoesMultiplicadorFixo").style.display = 'block';
    } else if (tipoAposta === 'valorMaximo') {
        document.getElementById("opcoesValorMaximo").style.display = 'block';
    }
}

// Função para mostrar os próximos níveis e recompensas
function mostrarProximosNiveis() {
    // Pegando o saldo atual (você pode obter o valor de qualquer variável de saldo que esteja usando)
    let saldo = parseInt(document.getElementById('dinheiro').innerText.replace('R$', '').trim());

    let proximoNivel = 0;
    let recompensa = '';
    
    // Definir o próximo nível e a recompensa com base no saldo
    if (saldo >= 10000) {
        proximoNivel = 10;
        recompensa = "Recompensa: 1000 moedas!";
    } else if (saldo >= 9000) {
        proximoNivel = 9;
        recompensa = "Recompensa: 900 moedas!";
    } else if (saldo >= 8000) {
        proximoNivel = 8;
        recompensa = "Recompensa: 800 moedas!";
    } else if (saldo >= 7000) {
        proximoNivel = 7;
        recompensa = "Recompensa: 700 moedas!";
    } else if (saldo >= 6000) {
        proximoNivel = 6;
        recompensa = "Recompensa: 600 moedas!";
    } else if (saldo >= 5000) {
        proximoNivel = 5;
        recompensa = "Recompensa: 500 moedas!";
    } else if (saldo >= 4000) {
        proximoNivel = 4;
        recompensa = "Recompensa: 400 moedas!";
    } else if (saldo >= 3000) {
        proximoNivel = 3;
        recompensa = "Recompensa: 300 moedas!";
    } else if (saldo >= 2000) {
        proximoNivel = 2;
        recompensa = "Recompensa: 200 moedas!";
    } else {
        proximoNivel = 1;
        recompensa = "Recompensa: 100 moedas!";
    }

    // Exibir o próximo nível e a recompensa
    document.getElementById('nivelUsuario').innerText = `Próximo Nível: ${proximoNivel}`;
    document.getElementById('recompensaNivel').innerText = recompensa;
}

// Função para verificar e atualizar o nível do usuário
function verificarNivel() {
    if (saldo >= 10000) {
        nivel = 10;
    } else if (saldo >= 9000) {
        nivel = 9;
    } else if (saldo >= 8000) {
        nivel = 8;
    } else if (saldo >= 7000) {
        nivel = 7;
    } else if (saldo >= 6000) {
        nivel = 6;
    } else if (saldo >= 5000) {
        nivel = 5;
    } else if (saldo >= 4000) {
        nivel = 4;
    } else if (saldo >= 3000) {
        nivel = 3;
    } else if (saldo >= 2000) {
        nivel = 2;
    } else {
        nivel = 1;
    }
    document.getElementById("nivel").textContent = `Nível: ${nivel} - ${recompensas[nivel - 1]}`;
    salvarDados();
}

// Função para salvar os dados no localStorage
// Abrir ou criar o banco de dados IndexedDB

request.onerror = function(event) {
    console.error("Erro ao abrir o banco de dados:", event.target.error);
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Banco de dados aberto com sucesso!");

    // Agora que o banco está pronto, podemos carregar os dados
    carregarDados();
};

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("minhaLoja")) {
        db.createObjectStore("minhaLoja", { keyPath: "id" });
    }
};

// Função para salvar os dados
function salvarDados() {
    if (!db) {
        console.error("Banco de dados ainda não está pronto!");
        return;
    }

    const transaction = db.transaction(["minhaLoja"], "readwrite");
    const objectStore = transaction.objectStore("minhaLoja");
    const dados = {
        id: 1,
        saldo: saldo,
        nivel: nivel
    };

    const request = objectStore.put(dados);

    request.onerror = function(event) {
        console.error("Erro ao salvar os dados:", event.target.error);
    };

    request.onsuccess = function(event) {
        console.log("Dados salvos com sucesso!");
    };
}

// Função para carregar dados ao iniciar
function carregarDados() {
    if (!db) {
        console.error("Banco de dados ainda não está pronto!");
        return;
    }

    const transaction = db.transaction(["minhaLoja"], "readonly");
    const objectStore = transaction.objectStore("minhaLoja");
    const request = objectStore.get(1);

    request.onerror = function(event) {
        console.error("Erro ao carregar os dados:", event.target.error);
    };

    request.onsuccess = function(event) {
        const dados = event.target.result;
        if (dados) {
            saldo = dados.saldo ?? saldo;
            nivel = dados.nivel ?? nivel;
            atualizarSaldo(); // Atualiza a interface
            document.getElementById("nivel").textContent = `Nível: ${nivel} - ${recompensas[nivel - 1]}`;
        } else {
            console.log("Nenhum dado encontrado.");
        }
    };
}