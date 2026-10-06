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

- `config.js` mostra il link affiliato eRank fornito dal gestore, con disclosure visibile e attributi `sponsored`/`nofollow`.
- `ads.txt` è online e AdSense lo segna come autorizzato.
- Il file `ads.txt` autorizza la vendita dell'inventario ma non attiva gli annunci: serve anche la revisione AdSense del sito e la CMP/Privacy & messaging configurata per il pubblico europeo.
- Gli annunci AdSense non sono ancora attivi: il sito è in revisione. Dopo l'approvazione va aggiunto il codice annunci e aggiornata l'informativa privacy.
- L'affiliazione eRank è configurata con il link di tracciamento fornito dal gestore; commissioni e attribuzione dipendono dal programma e dai suoi termini.
- Un progetto nuovo non genera traffico o entrate automaticamente. Il primo canale è SEO organica attraverso il tool e la guida `commissioni-etsy.html`, senza pubblicazione automatica o spam. Distribuzione esterna richiede account o approvazioni.

## Modello di ricavo e funnel

Ricerca "commissioni Etsy Italia / margine Etsy" → guida e calcolo gratuito → risultato e condivisione → risorsa eRank affiliata → eventuale commissione secondo i termini del programma.

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
