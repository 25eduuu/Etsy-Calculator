(() => {
  const ids = [
    'price', 'shipping', 'gift', 'discount', 'cogs', 'postage', 'other',
    'listing', 'transaction', 'processing', 'fixed', 'regulatory', 'feeVat', 'offsite'
  ];
  const fields = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  const euros = new Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR'});
  const caps = {discount: 100, transaction: 100, processing: 100, regulatory: 100, feeVat: 100, offsite: 100};

  function value(id) {
    const raw = Number(fields[id].value);
    const safe = Number.isFinite(raw) ? Math.max(0, raw) : 0;
    const bounded = Math.min(caps[id] ?? 10_000_000, safe);
    fields[id].value = String(bounded);
    return bounded;
  }

  function calculate() {
    const result = window.calculateOrder({
      price: value('price'), shipping: value('shipping'), gift: value('gift'),
      discount: value('discount'), cogs: value('cogs'), postage: value('postage'),
      other: value('other'), listing: value('listing'), transaction: value('transaction'),
      processing: value('processing'), fixed: value('fixed'), regulatory: value('regulatory'),
      feeVat: value('feeVat'), offsite: value('offsite'),
      vatOnFees: document.getElementById('vatOnFees').checked
    });
    document.getElementById('net').textContent = euros.format(result.net);
    document.getElementById('net').classList.toggle('negative', result.net < 0);
    document.getElementById('margin').textContent = `${result.margin.toLocaleString('it-IT', {maximumFractionDigits: 1})}%`;
    document.getElementById('breakEven').textContent = euros.format(result.breakEven);
    const rows = [
      ['Commissione transazione', result.transaction], ['Elaborazione pagamento', result.processing],
      ['Quota regolamentare', result.regulatory], ['Offsite Ads', result.offsite],
      ['Pubblicazione', result.listing], ['IVA stimata sulle commissioni', result.vat],
      ['Costi inseriti', result.costs]
    ];
    document.getElementById('feeList').innerHTML = rows
      .map(([label, amount]) => `<div class="fee-row"><span>${label}</span><strong>${euros.format(amount)}</strong></div>`)
      .join('');
    return result;
  }

  function shareableUrl() {
    const url = new URL(location.href);
    ids.forEach(id => url.searchParams.set(id, fields[id].value));
    url.searchParams.set('vatOnFees', document.getElementById('vatOnFees').checked ? '1' : '0');
    return url;
  }

  ids.forEach(id => fields[id].addEventListener('input', calculate));
  document.getElementById('vatOnFees').addEventListener('change', calculate);
  document.getElementById('copy').addEventListener('click', async event => {
    try {
      const result = calculate();
      const text = `Stima margine Etsy\nTotale ordine: ${euros.format(result.gross)}\nDopo commissioni e costi inseriti: ${euros.format(result.net)}\nMargine: ${result.margin.toLocaleString('it-IT', {maximumFractionDigits: 1})}%\nPareggio articolo: ${euros.format(result.breakEven)}\n\nStima orientativa, non include imposte sul reddito o contributi. ${location.href}`;
      await navigator.clipboard.writeText(text);
      event.currentTarget.textContent = 'Riepilogo copiato';
      setTimeout(() => { event.currentTarget.textContent = 'Copia riepilogo'; }, 1800);
    } catch {
      event.currentTarget.textContent = 'Copia non disponibile';
    }
  });
  document.getElementById('share').addEventListener('click', async event => {
    const url = shareableUrl();
    try {
      if (navigator.share) {
        await navigator.share({title: 'La mia stima margine Etsy', url: url.toString()});
      } else {
        history.replaceState(null, '', url);
        await navigator.clipboard.writeText(url.toString());
        event.currentTarget.textContent = 'Link copiato ↗';
      }
    } catch {
      // A user can cancel the native share dialog without changing the calculation.
    }
  });

  const params = new URLSearchParams(location.search);
  ids.forEach(id => {
    const raw = params.get(id);
    if (raw !== null && raw.trim() !== '' && Number.isFinite(Number(raw))) {
      fields[id].value = String(Math.min(caps[id] ?? 10_000_000, Math.max(0, Number(raw))));
    }
  });
  if (params.has('vatOnFees')) {
    document.getElementById('vatOnFees').checked = params.get('vatOnFees') === '1';
  }

  const config = window.APP_CONFIG || {};
  const safeHttpsUrl = input => {
    try {
      const url = new URL(input);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  };
  const links = Array.isArray(config.affiliateLinks)
    ? config.affiliateLinks.map(item => ({
      url: safeHttpsUrl(item.url),
      label: String(item.label || 'Risorsa utile').replace(/[<>]/g, '')
    })).filter(item => item.url)
    : [];
  if (links.length) {
    document.getElementById('resources').hidden = false;
    const disclosure = '<p class="affiliate-note">Alcuni link in questa sezione sono affiliati: se ti iscrivi o acquisti tramite questi link potremmo ricevere una commissione, senza costi aggiuntivi per te.</p>';
    const html = links.map(item => `<p><a href="${item.url}" rel="sponsored nofollow noopener" target="_blank">${item.label}</a></p>`).join('');
    document.getElementById('affiliateLinks').innerHTML = disclosure + html;
  }
  calculate();
})();
