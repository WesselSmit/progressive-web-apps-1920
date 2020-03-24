# Feedback

Tot nu toe gaat het best lekker qua PWA, ik vind het dan ook erg leuk om te leren over `node.js`, `express` en `service-workers`.

Ik heb mijn PWA app omgeschreven om de afbeelingen per maand te laten zien ipv alles van het hele jaar, omdat dit de performance heel veel verbeterd. Ik ben dan ook best wel trots op hoe ik dit aangepakt heb.

Tot nu toe is het enige waar ik op dit moment moeite mee heb is dat [mijn service-worker](https://github.com/WesselSmit/progressive-web-apps-1920/blob/master/static/serviceWorker.js) nog niet 100% werkt zoals ik wil; deze probeert een network fetch te doen omdat altijd de meest up-to-date page weergegeven moet worden. Als de network fetch faalt dan moet er gekeken worden of de pagina in de cache bestaat en deze serven, als deze niet in de cache bestaat moet de offline page weergegeven worden. Momenteel loop ik een beetje vast met de check of de page bestaat in de cache.

Ik zou graag feedback willen op:
* hoe ik ervoor sta qua opdracht & waar de mogelijkheden voor mij liggen qua de `critical render path` verbeteren
* suggesties over hoe ik mijn service-worker probleem kan oplossen zijn ook welkom
* andere dingen die je opvallen / tips die je hebt.



# Table of Contents
* [Demo](https://nasa-astronomy-pictures.herokuapp.com/)
* [Assignment](#assignment)
* [Goal](#goal)
* [Install-Notes](#install-notes)
* [Features](#features)
* [API](#api)
* [Data](#data)
* [Design-Patterns-and-Best-Practices](#design-patterns-and-best-practices)
* [Credits](#credits)
* [License](#license)

![image](https://user-images.githubusercontent.com/45405413/77421554-5250bb80-6dcc-11ea-9aa2-b8c30c818472.png)
![image](https://user-images.githubusercontent.com/45405413/77155959-ab53e300-6a9e-11ea-8323-bd32b4b91ad7.png)

# Assignment

In this course we will convert the client side web application previously made at the OBA into a server side rendered application. We also add functionalities based on the Service Worker and turn the application into a Progressive Web App. Ultimately we are going to implement a series of optimisations to improve the performance of the application.

# Goal 
The goal of my app is to show users awesome space pictures, the app also provides a brief explanation by a professional. The app is a good place to find beautiful space pictures and/or show people how fascinating our universe is! 

# Install Notes

Clone the repository from Github

`https://github.com/WesselSmit/progressive-web-apps-1920.git`

Make sure you have `node.js` and `npm` installed

Install dependencies / node modules 

```shell
npm install
```

Run the application in a code editor with `npm start`

# Features

<details><summary>Data Efficiency</summary>

This application retrieves many high resolution images, because these images do not change, they are not retrieved every time. The retrieved data is stored in `local JSON`. The next time the application is started, the application will look in the `local JSON`. There are 3 possible situations:

- **Data is empty** | all pictures of this year are `fetched` & stored in `local JSON`
- **Data is complete** | data is loaded from `local JSON`
- **Data exists but is incomplete** | data is loaded from `local JSON`, code determines what the most recent piece of data is, `fetches` missing data (uses most recent date in `local JSON` as startingpoint) & stores updated data in `local JSON`

This has 2 benefits:
- Reduces the number of `API` calls
- Only `fetches` missing data 

</details>

<details><summary>Data Saving</summary>

Not everything from the data that the `API` returns is important, all unnecessary data object keys are deleted. This means the application uses a more compact data object which enhances the performance, also resulting in a smaller JSON file.

</details>

<details><summary>Copyright Filter</summary>

This application allows the user to filter the pictures by copyright. The available filter options are:
- **copyright** | show only the copyrighted pictures
- **non-copyright** | show only the non-copyright pictures (public domain owns theses pictures)
- **all** | show all pictures

This features helps users find usable pictures for their own work/projects.

</details>

# API

This application uses NASA's [Picture of the Day (APOD)](https://api.nasa.gov/) `API`, it provides space related pictures.

Every day NASA adds a new space related picture to the `API`, these are retrievable individually but NASA also supports bulk fetching!

Using parameters you're able to create a more personal request, the following parameters are available;
* **date** | the date of the picture 
* **hd** | url for high resolution picture
* **api_key** | personal api key to identify yourself 

There currently is 1000 calls per hour (per `api` key).

`API` keys are free, you only have to [register](https://api.nasa.gov/) (full name & email).

# Data 
The received data from NASA's APOD `API` that I use:
* **date** | APOD date 
* **title** | title for the APOD
* **hdurl** | high resolution url to image
* **explanation** | explanation of the image by a professional
* **copyright** | copyright owner

## Data cleaning

Because the data is stored it's important the data is as small as possible so no unnessacary space is being wasted. In the cleaning `module` all properties that won't be used are `deleted`, the following properties are deleted:
* service_version
* media_type

The `API` consists of images & videos, all videos are filtered out.

> There aren't that many videos, approximately 15% of the APODs are of media_type **video**.

All APODs are assigned an unique ID.

The data contains no empty values, but data objects only contain the `copyright` key if they are copyrighted. In the code all data objects without the `copyright` key are assigned the `copyright: public domain` key/value pair.

<details><summary>Data after cleaning & transformation</summary>
<img src="https://user-images.githubusercontent.com/45405413/74860015-42b30280-5348-11ea-9e0b-f6a2ddb63227.png">
</details>

# Best Practices
* Code should be easily readable
* Only use shorthands if you really understand how they work
* Stick to a code style you understand and can apply consistently
* Add comments
* Use descriptive `variable`-/`function` names
* Only abbreviate words when instantly understandable
* Commit early and often
* Save JS selectors as variables (`const button = document.querySelector('button')`)
* Group code/logic based on functionality in `modules` 
* Name `modules` after `objects` & name `functions` after `actions`
* Try to avoid using `global` `variables` 

# Stuff I Want To Do

- [x] Add pagination based on available months

# Credits

### [Loading Animation](https://codepen.io/vank0/pen/mARwLg?editors=1100)

I used this codepen as a basis for the "loading" animation.

# [License](https://github.com/WesselSmit/progressive-web-apps-1920/blob/master/LICENSE)
