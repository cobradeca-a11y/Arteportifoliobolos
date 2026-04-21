
const pedido = {
  tamanho: '',
  fatias: '',
  preco: 0,
  massa: [],
  recheio: [],
  cobertura: '',
  acrescimo: false
};

function openLightbox(item) {
  const img = item.querySelector('img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('active');
}

function closeLightbox(event) {
  const lightbox = document.getElementById('lightbox');
  if (event.target.id === 'lightbox' || event.target.classList.contains('lightbox-close')) {
    lightbox.classList.remove('active');
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.getElementById('lightbox').classList.remove('active');
  }
});

function selectSize(element, tamanho, preco, fatias) {
  document.querySelectorAll('.size-card').forEach(card => card.classList.remove('selected'));
  element.classList.add('selected');
  pedido.tamanho = tamanho;
  pedido.preco = preco;
  pedido.fatias = fatias;
  document.getElementById('e1').style.display = 'none';
}

function toggleCheck(element, tipo, limite) {
  const grupoId = tipo === 'massa' ? 'massa-group' : 'recheio-group';
  const grupo = document.getElementById(grupoId);
  const selecionados = grupo.querySelectorAll('.check-item.selected');

  if (!element.classList.contains('selected') && selecionados.length >= limite) {
    return;
  }

  element.classList.toggle('selected');
  const texto = element.textContent.trim();

  if (tipo === 'massa') {
    if (element.classList.contains('selected')) {
      pedido.massa.push(texto);
    } else {
      pedido.massa = pedido.massa.filter(item => item !== texto);
    }
    document.getElementById('e2').style.display = 'none';
  }

  if (tipo === 'recheio') {
    if (element.classList.contains('selected')) {
      pedido.recheio.push(texto);
    } else {
      pedido.recheio = pedido.recheio.filter(item => item !== texto);
    }
    document.getElementById('e3').style.display = 'none';
    atualizarAcrescimo();
  }
}

function selectRadio(element, tipo) {
  const grupoId = tipo === 'cobertura' ? 'cobertura-group' : '';
  if (!grupoId) return;

  document.querySelectorAll(`#${grupoId} .radio-item`).forEach(item => item.classList.remove('selected'));
  element.classList.add('selected');
  pedido.cobertura = element.textContent.trim();
  document.getElementById('e4').style.display = 'none';
  atualizarAcrescimo();
}

function atualizarAcrescimo() {
  const recheioExtra = pedido.recheio.some(item => item.includes('⭐'));
  const coberturaExtra = pedido.cobertura.includes('⭐');
  pedido.acrescimo = recheioExtra || coberturaExtra;
}

function goStep(step) {
  if (step === 2 && !pedido.tamanho) {
    document.getElementById('e1').style.display = 'block';
    return;
  }
  if (step === 3 && pedido.massa.length === 0) {
    document.getElementById('e2').style.display = 'block';
    return;
  }
  if (step === 4 && pedido.recheio.length === 0) {
    document.getElementById('e3').style.display = 'block';
    return;
  }
  if (step === 5 && !pedido.cobertura) {
    document.getElementById('e4').style.display = 'block';
    return;
  }

  document.querySelectorAll('.sim-panel').forEach(panel => panel.classList.remove('active'));
  document.getElementById(`p${step}`).classList.add('active');

  document.querySelectorAll('.step-dot').forEach((dot, index) => {
    dot.classList.remove('active', 'done');
    const current = index + 1;
    if (current < step) dot.classList.add('done');
    if (current === step) dot.classList.add('active');
  });

  if (step === 5) {
    renderResumo();
  }
}

function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function renderResumo() {
  atualizarAcrescimo();
  document.getElementById('r-tamanho').textContent = pedido.tamanho ? `${pedido.tamanho} (${pedido.fatias})` : '—';
  document.getElementById('r-massa').textContent = pedido.massa.length ? pedido.massa.join(' + ') : '—';
  document.getElementById('r-recheio').textContent = pedido.recheio.length ? pedido.recheio.join(' + ') : '—';
  document.getElementById('r-cobertura').textContent = pedido.cobertura || '—';
  document.getElementById('r-preco').textContent = formatarPreco(pedido.preco);
  document.getElementById('r-acrescimo').style.display = pedido.acrescimo ? 'block' : 'none';
}

function enviarWhats() {
  renderResumo();
  const mensagem =
`Olá! Quero fazer um pedido na Mello's Cakes.

*Tamanho:* ${pedido.tamanho} (${pedido.fatias})
*Massa:* ${pedido.massa.join(' + ')}
*Recheio:* ${pedido.recheio.join(' + ')}
*Cobertura:* ${pedido.cobertura}
*Valor base:* ${formatarPreco(pedido.preco)}${pedido.acrescimo ? '\n*Acréscimo:* Sim, confirmar valor final.' : ''}`;

  const url = `https://wa.me/5521983657626?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}
