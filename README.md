# Warsztat Świadomych Relacji

Responsywna, wielostronicowa strona WSR — marki Krzysztofa Goljanka poświęconej świadomemu budowaniu, rozwijaniu i dbaniu o relacje.

## Aktualny zakres

- zwięzła strona główna z wejściami do terapii i warsztatów,
- osobne podstrony terapii indywidualnej i terapii par,
- osobne podstrony warsztatów, „Poznaj WSR” i kontaktu,
- polityka prywatności, polityka cookies i centrum preferencji zgód z możliwością cofnięcia wyboru,
- autorski znak typograficzny WSR w HTML/CSS,
- opis filozofii marki i praktycznego znaczenia „warsztatu”,
- sekcja twórcy budująca wiarygodność,
- bezpośrednie przejście do kalendarza ZnanyLekarz,
- responsywność, dostępność, podstawowe SEO, strona 404 i manifest.

Zdjęcie hero pochodzi z przekazanego pliku sesyjnego i zostało zoptymalizowane do WebP. Widoczny watermark jest zachowany; przed publikacją produkcyjną należy podmienić plik na finalny, nieoznaczony kadr.

Strona nie ładuje obecnie zewnętrznych fontów, analityki, reklam ani pikseli marketingowych. Mechanizm zgód emituje zdarzenie `wsr:consent-updated`, pod które można później bezpiecznie podpiąć wybrane narzędzie dopiero po zgodzie użytkownika.

## Uruchomienie lokalne

Projekt nie wymaga procesu budowania:

```bash
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000`.

Szczegółowe założenia dalszego rozwoju znajdują się w `KIERUNEK-PROJEKTU.md`.
