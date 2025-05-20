let jogos = [
  { nome: "Minecraft", idade: 0, categorias: ["aventura", "construção", "sandbox"] },
  { nome: "Pokémon Scarlet/Violet", idade: 0, categorias: ["aventura", "RPG", "coleta"] },
  { nome: "Super Mario Odyssey", idade: 0, categorias: ["aventura", "plataforma", "exploração"] },
  { nome: "The Legend of Zelda: Breath of the Wild", idade: 10, categorias: ["aventura", "RPG", "exploração"] },
  { nome: "Fortnite", idade: 12, categorias: ["ação", "battle royale", "construção"] },
  { nome: "Grand Theft Auto V", idade: 18, categorias: ["ação", "mundo aberto", "aventura"] },
  { nome: "Among Us", idade: 10, categorias: ["social", "dedução", "multiplayer"] },
  { nome: "Stardew Valley", idade: 0, categorias: ["simulação", "fazenda", "RPG"] },
  { nome: "Cyberpunk 2077", idade: 18, categorias: ["RPG", "ficção científica", "ação", "mundo aberto"] },
  { nome: "Red Dead Redemption 2", idade: 18, categorias: ["aventura", "ação", "mundo aberto", "western"] },
  { nome: "Overwatch 2", idade: 12, categorias: ["ação", "shooter", "multiplayer"] },
  { nome: "FIFA 24", idade: 0, categorias: ["esporte", "simulação", "futebol"] },
  { nome: "Hogwarts Legacy", idade: 12, categorias: ["RPG", "aventura", "fantasia", "mundo aberto"] },
  { nome: "God of War Ragnarök", idade: 18, categorias: ["ação", "aventura", "mitologia"] }
];

let idadeUsuario = -1; // -1 indica que a idade ainda não foi definida
let preferencias = {}; // Objeto para armazenar as preferências do usuário
let jogosRecomendados = [];

// Novos estados do programa
const ESTADO_INICIAL = 0;
const ESTADO_IDADE = 1;
const ESTADO_PREFERENCIAS = 2;
const ESTADO_RESULTADOS = 3;
let estadoAtual = ESTADO_INICIAL; // Começa no estado inicial

// Botão "Iniciar"
let botaoIniciar = { label: "Iniciar", x: 300, y: 300, largura: 200, altura: 60 };

// Botões de idade
let botoesIdade = [
  { label: "0-9 anos", minIdade: 0, maxIdade: 9, x: 50, y: 100, largura: 150, altura: 40 },
  { label: "10-13 anos", minIdade: 10, maxIdade: 13, x: 50, y: 150, largura: 150, altura: 40 },
  { label: "14-17 anos", minIdade: 14, maxIdade: 17, x: 50, y: 200, largura: 150, altura: 40 },
  { label: "18+ anos", minIdade: 18, maxIdade: 200, x: 50, y: 250, largura: 150, altura: 40 }
];

// Categorias para os botões de preferência
let categoriasDisponiveis = [
  "aventura", "ação", "RPG", "exploração", "construção", "sandbox", "coleta", "plataforma",
  "battle royale", "mundo aberto", "social", "dedução", "multiplayer", "simulação",
  "fazenda", "ficção científica", "western", "shooter", "esporte", "futebol", "fantasia", "mitologia"
];

let botoesPreferencias = []; // Será preenchido dinamicamente

// Botão para ver resultados
let botaoVerResultados = { label: "Ver Jogos Recomendados", x: 275, y: 580, largura: 250, altura: 50 }; // Ajustei a posição

function setup() {
  createCanvas(800, 650);
  textSize(18); // Aumentei um pouco o tamanho da fonte para o título
  textAlign(CENTER, CENTER);
  inicializarBotoesPreferencias();
}

function draw() {
  background(240);
  fill(50);
  textStyle(BOLD);

  if (estadoAtual === ESTADO_INICIAL) {
    textSize(32); // Tamanho maior para o título inicial
    text("Recomendador de Jogos de Videogame", width / 2, 150);
    textSize(18); // Volta ao tamanho normal para o botão
    desenharBotao(botaoIniciar.x, botaoIniciar.y, botaoIniciar.largura, botaoIniciar.altura, botaoIniciar.label, color(0, 150, 0));
  } else if (estadoAtual === ESTADO_IDADE) {
    text("Qual sua idade?", width / 2, 50);
    desenharBotoes(botoesIdade);
  } else if (estadoAtual === ESTADO_PREFERENCIAS) {
    text("Quais gêneros de jogos você gosta?", width / 2, 50);
    desenharBotoes(botoesPreferencias);
    desenharBotao(botaoVerResultados.x, botaoVerResultados.y, botaoVerResultados.largura, botaoVerResultados.altura, botaoVerResultados.label, color(0, 150, 0));
  } else if (estadoAtual === ESTADO_RESULTADOS) {
    text("Jogos recomendados para você:", width / 2, 50);
    exibirResultados();
  }
}

function mousePressed() {
  if (estadoAtual === ESTADO_INICIAL) {
    if (mouseX > botaoIniciar.x && mouseX < botaoIniciar.x + botaoIniciar.largura &&
        mouseY > botaoIniciar.y && mouseY < botaoIniciar.y + botaoIniciar.altura) {
      estadoAtual = ESTADO_IDADE; // Avança para a seleção de idade
    }
  } else if (estadoAtual === ESTADO_IDADE) {
    for (let botao of botoesIdade) {
      if (mouseX > botao.x && mouseX < botao.x + botao.largura &&
          mouseY > botao.y && mouseY < botao.y + botao.altura) {
        idadeUsuario = botao.minIdade;
        estadoAtual = ESTADO_PREFERENCIAS;
        break;
      }
    }
  } else if (estadoAtual === ESTADO_PREFERENCIAS) {
    for (let botao of botoesPreferencias) {
      if (mouseX > botao.x && mouseX < botao.x + botao.largura &&
          mouseY > botao.y && mouseY < botao.y + botao.altura) {
        preferencias[botao.label] = !preferencias[botao.label];
        break;
      }
    }
    if (mouseX > botaoVerResultados.x && mouseX < botaoVerResultados.x + botaoVerResultados.largura &&
        mouseY > botaoVerResultados.y && mouseY < botaoVerResultados.y + botaoVerResultados.altura) {
      calcularRecomendacoes();
      estadoAtual = ESTADO_RESULTADOS;
    }
  }
}

function desenharBotao(x, y, largura, altura, label, corFundo, corTexto = 255) {
  fill(corFundo);
  rect(x, y, largura, altura, 5);
  fill(corTexto);
  noStroke();
  text(label, x + largura / 2, y + altura / 2);
  stroke(0);
}

function desenharBotoes(listaBotoes) {
  for (let botao of listaBotoes) {
    let corFundo = 100;
    let corTexto = 255;

    if (estadoAtual === ESTADO_PREFERENCIAS && preferencias[botao.label]) {
      corFundo = color(0, 180, 0);
    }

    desenharBotao(botao.x, botao.y, botao.largura, botao.altura, botao.label, corFundo, corTexto);
  }
}

function inicializarBotoesPreferencias() {
  let startX = 50;
  let startY = 100;
  let offsetX = 180;
  let offsetY = 50;
  let colunas = 4;

  for (let i = 0; i < categoriasDisponiveis.length; i++) {
    let categoria = categoriasDisponiveis[i];
    let col = i % colunas;
    let row = floor(i / colunas);

    let x = startX + col * offsetX;
    let y = startY + row * offsetY;

    botoesPreferencias.push({
      label: categoria,
      x: x,
      y: y,
      largura: 160,
      altura: 40
    });
    preferencias[categoria] = false;
  }
}

function calcularRecomendacoes() {
  jogosRecomendados = [];
  for (let jogo of jogos) {
    if (idadeUsuario >= jogo.idade) {
      let atendePreferencia = false;
      for (let categoriaJogo of jogo.categorias) {
        if (preferencias[categoriaJogo]) {
          atendePreferencia = true;
          break;
        }
      }
      if (atendePreferencia) {
        jogosRecomendados.push(jogo.nome);
      }
    }
  }
}

function exibirResultados() {
  if (jogosRecomendados.length > 0) {
    let yPos = 100;
    for (let i = 0; i < jogosRecomendados.length; i++) {
      textStyle(NORMAL);
      textAlign(LEFT);
      text("- " + jogosRecomendados[i], 50, yPos + i * 25);
    }
  } else {
    textStyle(NORMAL);
    text("Nenhum jogo disponível para sua idade e preferências.", width / 2, 100);
  }
}
