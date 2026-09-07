# Kiadási állapot és napló

## Jelenlegi bizonyíték — 2026-09-07 UTC

- Repó: `mobilgeller/taximax`; fejlesztési alapág: `main`.
- Az auditált Git-állapot: `4de3b3f13df772e1f626c5165bb751382acbae4f`. Ez önmagában nem élesítési igazolás.
- Környezet: GitHub Pages: https://mobilgeller.github.io/taximax/; külön igazolandó domain: https://taximax.hu/
- Bizonyított rész: A 34080433999 Actions futás 101614630494 deploy jobja a 4de3b3f13df772e1f626c5165bb751382acbae4f commit sikeres telepítését rögzíti 2026-09-07 03:41:01 UTC-kor. A taximax.hu hozzárendelése még nincs bizonyítva.
- Még hiányzik: A saját domain és a konkrét Pages-környezet igazolt összerendelése, valamint a visszaállítás jóváhagyott módja.
- Részletes források: [központi audit PR #5](https://github.com/mobilgeller/kozos-projektiranyitas/pull/5).

## Sikeres kiadások

Az alábbi sor történeti Pages-telepítés bizonyítéka, nem ennek a dokumentációs munkának a kiadása. A saját domain baseline-ja továbbra is nyitott.

| Időpont (UTC) | Környezet | Teljes commit SHA | Tag | Kiadó / futás | Visszaállítás | Ellenőrzés |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-07 03:41:01 | GitHub Pages / mobilgeller.github.io/taximax | 4de3b3f13df772e1f626c5165bb751382acbae4f | Nincs ebben a munkában létrehozva; korábbi tagok ellenőrizendők | [Actions #34080433999](https://github.com/mobilgeller/taximax/actions/runs/34080433999) | Előző sikeres Pages-commit ba67bdbd287f2ac407ddec8e983992afb2372f79; újratelepítés jóváhagyás után | Deploy job success; saját domain összerendelése nyitott |

## Következő kiadás feltételei

1. Friss origin, aktuális alapág és nyitott PR-ek ellenőrzése. Pontos cél-SHA és érintett rendszer rögzítése; a „legújabb main” nem kiadási azonosító.
2. Alapágból elérhető commit, sikeres releváns teszt és visszaállítási pont igazolása. Wixnél a kiadott appbuild és a külön webhely-publikálás megkülönböztetése; CMS-nél külön tartalomhash és mentés.
3. Wix Publish, CMS-írás, Release és tag létrehozása előtt tulajdonosi jóváhagyás. Ez a dokumentum nem ad kiadási engedélyt.
4. Kiadás után időpont, környezet, teljes SHA, kiadó, build/futás, visszaállítás és kézi ellenőrzés rögzítése a táblában. Ismeretlen értéket ne helyettesítsünk feltételezéssel.
5. Csak bizonyított kiadási commitra, külön jóváhagyással készülhet változatlan annotált `taximax-prod-YYYYMMDD-HHMM` tag; meglévő taget nem mozgatunk. Az időpont UTC.

## Projektspecifikus korlátok

A Pages automatikusan telepíthet alapági módosításkor. Ezért e dokumentációs Draft PR egyesítése is kiadási hatással járhat; külön jóváhagyásig Draft marad.
