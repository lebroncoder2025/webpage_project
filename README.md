# webpage_project

Profesjonalny, responsywny szkielet statycznej strony firmowej przygotowany do dalszego rozwoju i późniejszej migracji do WordPressa.

## Struktura

- `index.html` — semantyczna struktura strony i treści startowe
- `assets/css/styles.css` — responsywny system stylów
- `assets/js/main.js` — menu mobilne, animacje i drobne interakcje
- `assets/images/` — favicon i grafika hero

## Uruchomienie lokalne

Strona nie wymaga procesu budowania. Otwórz `index.html` bezpośrednio lub uruchom prosty serwer HTTP, np.:

```bash
python -m http.server 8000
```

Następnie przejdź do `http://localhost:8000`.

## Kolejny etap

Przed publikacją docelowej wersji należy podmienić nazwę, teksty, dane kontaktowe, metadane SEO i adresy social media. Sekcje są ułożone modułowo, co ułatwi przeniesienie ich do bloków lub szablonów WordPressa.
