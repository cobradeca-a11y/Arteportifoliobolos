/* ═══════════════════════════════════════════════════════════
   MELLO'S CAKES — script.js
   ═══════════════════════════════════════════════════════════ */

const pedido = {
  tamanho: '',
  fatias: '',
  preco: 0,
  /* camadas[0]=base, [1]=meio, [2]=topo  — null = não definido */
  camadas: [null, null, null],
  recheio: [],
  cobertura: '',
  acrescimo: false
};

/* ─── Paleta ──────────────────────────────────────────────── */
const CORES = {
  Chocolate: { body: '#5c2d10', top: '#7a3e1a', bottom: '#3e1c08' },
  Baunilha:  { body: '#f5e0a8', top: '#f9edd6', bottom: '#e0c880' },
  neutro:    { body: '#d4bfa0', top: '#e2d0b0', bottom: '#bfaa88' }
};

/* sabor atualmente selecionado no painel esquerdo */
let saborAtivo = null;

/* ─── Selecionar sabor (clique no card esquerdo) ──────────── */
function clicarSabor(sabor) {
  saborAtivo = (saborAtivo === sabor) ? null : sabor;
  document.querySelectorAll('.sabor-card').forEach(function(c) {
    c.classList.toggle('sabor-ativo', c.dataset.sabor === saborAtivo);
  });
}

/* ─── Atribuir sabor a uma camada (clique ou drop) ─────────── */
function atribuirCamada(n, sabor) {
  /* n: 1=base 2=meio 3=topo → índice = n-1 */
  pedido.camadas[n - 1] = sabor;
  pintar(n, CORES[sabor]);
  var lbl = document.getElementById('lbl' + n);
  lbl.textContent = sabor;
  lbl.style.color = (sabor === 'Chocolate') ? '#ffffff' : '#3d1c0e';
  document.getElementById('drop-c' + n).classList.add('camada-preenchida');
  document.getElementById('e2').style.display = 'none';
}

/* ─── Clique numa camada ──────────────────────────────────── */
function clicarCamada(n) {
  if (!saborAtivo) return;
  atribuirCamada(n, saborAtivo);
}

/* ─── Drop numa camada ────────────────────────────────────── */
function soltarNaCamada(event, n) {
  event.preventDefault();
  document.getElementById('drop-c' + n).classList.remove('drop-hl');
  const sabor = event.dataTransfer.getData('text/plain');
  if (sabor) atribuirCamada(n, sabor);
}

/* ─── Pintar camada no SVG ────────────────────────────────── */
function pintar(n, cor) {
  var rect = document.getElementById('cl' + n);
  var top  = document.getElementById('ct' + n);
  var bot  = document.getElementById('cb' + n);
  if (rect) rect.setAttribute('fill', cor.body);
  if (top)  top.setAttribute('fill',  cor.top);
  if (bot)  bot.setAttribute('fill',  cor.bottom);
}

/* ─── Reiniciar ──────────────────────────────────────────── */
function resetarMassa() {
  pedido.camadas = [null, null, null];
  saborAtivo = null;
  document.querySelectorAll('.sabor-card').forEach(function(c) {
    c.classList.remove('sabor-ativo');
  });
  [1, 2, 3].forEach(function(n) {
    pintar(n, CORES.neutro);
    var lbl = document.getElementById('lbl' + n);
    lbl.textContent = ['Base','Meio','Topo'][n - 1];
    lbl.style.color = '';
    document.getElementById('drop-c' + n).classList.remove('camada-preenchida');
  });
}

/* ─── Drag start nos cards de sabor ─────────────────────── */
function initDragDrop() {
  document.querySelectorAll('.sabor-card[draggable]').forEach(function(card) {
    card.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', card.dataset.sabor);
      card.classList.add('dragging');
      saborAtivo = card.dataset.sabor;
      document.querySelectorAll('.sabor-card').forEach(function(c) {
        c.classList.toggle('sabor-ativo', c.dataset.sabor === saborAtivo);
      });
    });
    card.addEventListener('dragend', function() {
      card.classList.remove('dragging');
    });
  });
}

/* ─── Lightbox ───────────────────────────────────────────── */
function openLightbox(item) {
  var img = item.querySelector('img');
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox-img').alt = img.alt;
  document.getElementById('lightbox').classList.add('active');
}
function closeLightbox(event) {
  if (event.target.id === 'lightbox' || event.target.classList.contains('lightbox-close')) {
    document.getElementById('lightbox').classList.remove('active');
  }
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.getElementById('lightbox').classList.remove('active');
});

/* ─── Tamanho ────────────────────────────────────────────── */
function selectSize(element, tamanho, preco, fatias) {
  document.querySelectorAll('.size-card').forEach(function(c) { c.classList.remove('selected'); });
  element.classList.add('selected');
  pedido.tamanho = tamanho;
  pedido.preco   = preco;
  pedido.fatias  = fatias;
  document.getElementById('e1').style.display = 'none';
}

/* ─── Recheio ────────────────────────────────────────────── */
function toggleCheck(element, tipo, limite) {
  var grupo = document.getElementById('recheio-group');
  var sel   = grupo.querySelectorAll('.check-item.selected');
  if (!element.classList.contains('selected') && sel.length >= limite) return;
  element.classList.toggle('selected');
  /* usa data-recheio para evitar problema de textContent */
  var texto = element.dataset.recheio || element.textContent.replace('✓','').trim();
  if (element.classList.contains('selected')) {
    pedido.recheio.push(texto);
  } else {
    pedido.recheio = pedido.recheio.filter(function(i) { return i !== texto; });
  }
  document.getElementById('e3').style.display = 'none';
  atualizarAcrescimo();
}

/* ─── Cobertura ──────────────────────────────────────────── */
function selectRadio(element) {
  document.querySelectorAll('#cobertura-group .radio-item').forEach(function(i) {
    i.classList.remove('selected');
  });
  element.classList.add('selected');
  pedido.cobertura = element.dataset.cobertura || element.textContent.replace('⭐','').trim();
  document.getElementById('e4').style.display = 'none';
  atualizarAcrescimo();
}

/* ─── Acréscimo ──────────────────────────────────────────── */
function atualizarAcrescimo() {
  pedido.acrescimo = pedido.recheio.some(function(i) { return i.includes('⭐'); })
                  || pedido.cobertura.includes('⭐');
}

/* ─── Navegação ──────────────────────────────────────────── */
function goStep(step) {
  if (step === 2 && !pedido.tamanho) {
    document.getElementById('e1').style.display = 'block'; return;
  }
  if (step === 3 && pedido.camadas.some(function(c) { return c === null; })) {
    document.getElementById('e2').style.display = 'block'; return;
  }
  if (step === 4 && pedido.recheio.length === 0) {
    document.getElementById('e3').style.display = 'block'; return;
  }
  if (step === 5 && !pedido.cobertura) {
    document.getElementById('e4').style.display = 'block'; return;
  }

  document.querySelectorAll('.sim-panel').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('p' + step).classList.add('active');

  document.querySelectorAll('.step-dot').forEach(function(dot, i) {
    dot.classList.remove('active', 'done');
    if (i + 1 < step)  dot.classList.add('done');
    if (i + 1 === step) dot.classList.add('active');
  });

  if (step === 5) renderResumo();
}

/* ─── Resumo ─────────────────────────────────────────────── */
function formatarPreco(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}
function renderResumo() {
  atualizarAcrescimo();
  var nomes = ['Base', 'Meio', 'Topo'];
  var massaTexto = pedido.camadas.map(function(c, i) {
    return nomes[i] + ': ' + (c || '—');
  }).join(' | ');
  document.getElementById('r-tamanho').textContent  = pedido.tamanho ? pedido.tamanho + ' (' + pedido.fatias + ')' : '—';
  document.getElementById('r-massa').textContent    = massaTexto;
  document.getElementById('r-recheio').textContent  = pedido.recheio.length ? pedido.recheio.join(' + ') : '—';
  document.getElementById('r-cobertura').textContent= pedido.cobertura || '—';
  document.getElementById('r-preco').textContent    = formatarPreco(pedido.preco);
  document.getElementById('r-acrescimo').style.display = pedido.acrescimo ? 'block' : 'none';
}

/* ─── WhatsApp ───────────────────────────────────────────── */
function enviarWhats() {
  renderResumo();
  var nomes = ['Base', 'Meio', 'Topo'];
  var massaWpp = pedido.camadas.map(function(c, i) {
    return nomes[i] + ': ' + (c || '—');
  }).join(', ');
  var msg =
    "Olá! Quero fazer um pedido na Mello's Cakes.\n\n" +
    "*Tamanho:* " + pedido.tamanho + " (" + pedido.fatias + ")\n" +
    "*Massa:* " + massaWpp + "\n" +
    "*Recheio:* " + (pedido.recheio.join(' + ') || '—') + "\n" +
    "*Cobertura:* " + pedido.cobertura + "\n" +
    "*Valor base:* " + formatarPreco(pedido.preco) +
    (pedido.acrescimo ? "\n*Acréscimo:* Sim, confirmar valor final." : "");
  window.open('https://wa.me/5521983657626?text=' + encodeURIComponent(msg), '_blank');
}

/* ─── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initDragDrop();
});
