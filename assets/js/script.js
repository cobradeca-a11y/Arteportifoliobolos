const state = {
  step: 1,
  size: '',
  sizePrice: 0,
  sizeFatias: '',
  massa: [],
  recheio: [],
  cobertura: ''
};

function hasExtra() {
  const recheioExtra = state.recheio.some(r => r.includes('⭐'));
  const coberturaExtra = state.cobertura.includes('⭐');
  return recheioExtra || coberturaExtra;
}

function setStepUI(step) {
  document.querySelectorAll('.sim-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.step-dot').forEach(s => s.classList.remove('active'));
  document.getElementById('p' + step).classList.add('active');
  document.getElementById('sd' + step).classList.add('active');
  state.step = step;
  if (step === 5) buildResumo();
}

function goStep(step) {
  if (step === 2 && !state.size) {
    document.getElementById('e1').style.display = 'block';
    return;
  }
  document.getElementById('e1').style.display = 'none';

  if (step === 3 && state.massa.length === 0) {
    document.getElementById('e2').style.display = 'block';
    return;
  }
  document.getElementById('e2').style.display = 'none';

  if (step === 4 && state.recheio.length === 0) {
    document.getElementById('e3').style.display = 'block';
    return;
  }
  document.getElementById('e3').style.display = 'none';

  if (step === 5 && !state.cobertura) {
    document.getElementById('e4').style.display = 'block';
    return;
  }
  document.getElementById('e4').style.display = 'none';

  setStepUI(step);
}

function selectSize(el, size, price, fatias) {
  document.querySelectorAll('.size-card').forEach(card => card.classList.remove('selected'));
  el.classList.add('selected');
  state.size = size;
  state.sizePrice = price;
  state.sizeFatias = fatias;
}

function toggleCheck(el, group, max) {
  const label = el.textContent.trim();
  const arr = state[group];
  const idx = arr.indexOf(label);

  if (idx > -1) {
    el.classList.remove('selected');
    arr.splice(idx, 1);
  } else {
    if (arr.length >= max) {
      alert('Máximo de ' + max + ' opções para este campo.');
      return;
    }
    el.classList.add('selected');
    arr.push(label);
  }
}

function selectRadio(el, group) {
  document.querySelectorAll('#cobertura-group .radio-item').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');
  state[group] = el.textContent.trim();
}

function fmt(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}

function buildResumo() {
  document.getElementById('r-tamanho').textContent = state.size + ' (' + state.sizeFatias + ')';
  document.getElementById('r-massa').textContent = state.massa.join(' + ') || '—';
  document.getElementById('r-recheio').textContent = state.recheio.join(' + ') || '—';
  document.getElementById('r-cobertura').textContent = state.cobertura || '—';
  document.getElementById('r-preco').textContent = fmt(state.sizePrice);
  const ac = document.getElementById('r-acrescimo');
  ac.style.display = hasExtra() ? 'block' : 'none';
}

function enviarWhats() {
  const extra = hasExtra() ? '\\n⚠️ *Obs:* Recheio/cobertura com acréscimo — aguardo confirmação do valor.' : '';
  const msg = `Olá! Vim pelo site e gostaria de encomendar um bolo 🎂

*Tamanho:* ${state.size} (${state.sizeFatias})
*Massa:* ${state.massa.join(' + ')}
*Recheio:* ${state.recheio.join(' + ')}
*Cobertura:* ${state.cobertura}
*Valor base:* ${fmt(state.sizePrice)}${extra}`;

  window.open('https://wa.me/5521983657626?text=' + encodeURIComponent(msg), '_blank');
}

function openLightbox(el) {
  const img = el.querySelector('img');
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s';
    obs.observe(el);
  });
});
