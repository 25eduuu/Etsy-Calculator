# Margine Etsy Italia

Calcolatore statico, gratuito e senza account per stimare il margine di un ordine Etsy. I calcoli e i dati inseriti restano nel browser; nessun backend o archivio è richiesto.

## Avvio locale

Richiede Python 3, senza dipendenze esterne.

```powershell
./start.ps1
```

Oppure esegui `python -m http.server 8000` e visita `http://localhost:8000`.

## Pubblicazione

Il progetto è composto da file statici ed è adatto a Cloudflare Pages, GitHub Pages o Netlify sul piano gratuito. Pubblica la cartella radice come sito statico. Dopo aver scelto il dominio o sottodominio pubblico, esegui `./prepare-seo.ps1 -SiteUrl https://tuo-dominio.example` per impostare canonical, Open Graph e sitemap. Prima del lancio sostituisci i riferimenti di contatto nelle pagine Privacy e Trasparenza. Non c'è un database, una chiave API o un processo sempre attivo da mantenere.

## Ricavi già predisposti

- `config.js` accetta link affiliati; la sezione resta nascosta finché non vengono configurati.
- `ads.txt` contiene il publisher ID fornito per l'autorizzazione AdSense. Deve essere pubblicato nella root del dominio e visibile a `https://etsy-calculator-nine.vercel.app/ads.txt`.
- Il file `ads.txt` autorizza la vendita dell'inventario ma non attiva gli annunci: serve anche la revisione AdSense del sito e la CMP/Privacy & messaging configurata per il pubblico europeo.
- L'opzione più coerente è un'affiliazione a un software per venditori Etsy, per esempio eRank o Alura. I rispettivi programmi pubblicano commissioni ricorrenti sui siti ufficiali, ma richiedono registrazione e possono richiedere approvazione. Aggiungi i link di tracciamento solo dopo l'accettazione; disclosure e `rel=sponsored` sono già predisposti.
- Non sono stati attivati annunci né creati link di checkout: richiedono account e consenso privacy/IVA adeguati. L'affiliazione è il percorso iniziale più semplice e privo di costi fissi.
- Un progetto nuovo non genera traffico o entrate automaticamente. La strada iniziale è SEO organica attraverso il tool gratuito e contenuti utili, senza pubblicazione automatica o spam. Distribuzione esterna richiede account, approvazioni o un dominio che il gestore deve fornire.

## Modello di ricavo e funnel

Ricerca "commissioni Etsy Italia / margine Etsy" → calcolo gratuito → risultato e condivisione → risorsa software per venditori affiliata (quando approvata e configurata) → commissione ricorrente.

## Ipotesi

I valori iniziali sono modificabili: transazione 6,5%, elaborazione italiana 4% + €0,30, quota regolamentare 0,8%, Offsite Ads 12%/15%, IVA sulle commissioni 22%, pubblicazione stimata €0,18. Le tariffe fisse Etsy sono definite in USD e possono variare al cambio; la quota regolamentare e l'IVA sulle tariffe dipendono dall'account e dall'ordine. L'IVA sulle commissioni è inclusa nei costi di default, con opzione per escluderla. Non stima imposte sul reddito o contributi e non è consulenza fiscale.

Fonti ufficiali verificate il 6 ottobre 2026:

- [Tariffe e imposte Etsy](https://help.etsy.com/hc/en-us/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy)
- [Tariffe di elaborazione pagamenti per paese](https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy)
- [Politica tariffe Etsy e commissioni Offsite Ads](https://www.etsy.com/legal/fees/)
- [Quota regolamentare per paese](https://help.etsy.com/hc/en-us/articles/1500011073202-What-is-a-Regulatory-Operating-Fee)
- [Programma affiliati eRank](https://erank.com/affiliate)
- [Programma affiliati Alura](https://www.alura.io/affiliate)

## Manutenzione

Ricontrolla le tariffe ufficiali Etsy ogni trimestre e aggiorna i valori predefiniti in `index.html` quando cambiano. L'app non dipende da API esterne; un problema di rete non interrompe i calcoli. Valida importi non negativi e percentuali nel browser. I log sono quelli del provider di hosting; non vengono registrati eventi utente.

## Test

Con Node.js installato esegui `./test.ps1`. I test coprono le formule, il pareggio con sconto, la validazione dei valori condivisi e il filtro degli URL affiliati.
