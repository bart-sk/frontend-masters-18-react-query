# FM 18 - React-query

Toto je demo projekt, ktorý používa knižnicu [react-query](https://react-query.tanstack.com/) na komunikáciu s [GMail API](https://developers.google.com/gmail/api/reference/rest).

Po prihlásení užívateľa sa získa posledných 5 emailov (táto konštanta je hardkódovaná - hľadaj výskyt `maxResults` v zdrojovom kóde).

V žiadnom prípade nejde o hotovú aplikáciu na čítanie emalov a je tam dosť veľký priestor na dopracovanie (aj refactoring), napríklad:

  - ošetriť chyby z volaní API (`401`, `404` a pod.) a zorbaziť ich užívatelovi
  - ak volanie API skončí na chybe `401` (neplatný token) odhlásiť užívateľa
  - refreshovanie tokenov v google API
  - stránkovanie zoznamu emailov
  - v zozname emailov sa dočítava pre každé *id* emailu predmet a kto email odoslal v samostatnom requeste. Vhodnejšie je spraviť jeden [batch request na GMail API](https://developers.google.com/gmail/api/guides/batch).
  - a ďalšie ...
  
  
## Lokálne spustenie projektu
  
 
 Stiahneme projekt z GIT:
  
```
```
Na základe súboru `.env.sample` vytvoríme súbor s názvom `.env`, kde nastavíme potrebné *"env"* premenné pre beh aplikácie. V tomto prípade stačí nastaviť *Client ID*, ktoré sme si vygenerovali v "Google Cloud Platgorm" (viď postup nižšie)

```
REACT_APP_GOOGLE_CLIENT_ID=XYZ1234.apps.googleusercontent.com
```

Následne nainštalujeme závoslosti a spustíme projekt

```
npm install
npm start
```

> *POZOR*: Pri prvom prihlásení do Google sa môže zobraziť obrazovka s výstrahami pred prihlásením. Je potrebné si ju dobre prezrieť. Niekde dole bude malými písmenami odklik po ktorom povolíme prístup do svojho konta. 


### Vygenerovanie Client ID v Google Cloud Platform

V [Google Cloud Platform](https://console.cloud.google.com/apis/dashboard) si vytvoríme *Client ID* nasledovným spôsobom:

- Preklikáme sa k obrazovke *"Create OAuth client ID"*:

```
Credentials -> CREATE CREDENTIALS -> zvolíme "OAuth client ID"
```

- Z ponuky *"Application Type"* vyberieme *"Web application"*.
- zadáme názov do poľa *"Name"* alebo necháme default
- do *"Authorized Javascript Origins"* zadáme `http://localhost:3000`
- rovnako do *"Authorized redirect URIs"* zadáme `http://localhost:3000`
- tlačidlom *"CREATE"* vytvoríme "credentials"
- zobrazí sa modálne okno ktoré má v poli "Your client ID" to, čo potrebujeme ...



