# Table of Contents
* [Demo](https://nasa-astronomy-pictures.herokuapp.com/)
* [Assignment](#assignment)
* [Goal](#goal)
* [Install Notes](#install-notes)
* [Concept](#concept)
* [Optimizations](#optimizations)
* [API](#api)
* [Todo](#stuff-i-want-to-do)
* [Known Problems](#known-problems)
* [License](#license)

![image](https://user-images.githubusercontent.com/45405413/77421554-5250bb80-6dcc-11ea-9aa2-b8c30c818472.png)

# Assignment

In this course we will convert the client side web application previously made with [WAFS](https://github.com/wesselSmit/web-app-from-scratch-1920) into a server side rendered application. We also add functionalities based on the Service Worker and turn the application into a Progressive Web App. Ultimately we are going to implement a series of optimizations to improve the performance of the application.

# Goal 
The goal of my app is to show users awesome astronomy pictures, the app also provides a brief explanation by a professional. The app is a good place to find beautiful astronomy pictures and/or show people how fascinating our universe is! 

# Install Notes

Clone the repository from Github

`https://github.com/WesselSmit/progressive-web-apps-1920.git`

Make sure you have `node.js` and `npm` installed

Install dependencies / node modules 

```shell
npm install
```

Run the application in a code editor with `npm start` 

# Concept

The assignment continues where [WAFS](https://github.com/wesselSmit/web-app-from-scratch-1920) left off. This course is meant to "upgrade" your application through:
* Server Side Rendering
* Service Workers
* Optimizing the Critical Render Path

My [WAFS](https://github.com/wesselSmit/web-app-from-scratch-1920) app fetches all images of the current year meaning it'll fetch between 1 - 365 data objects all at once. This works fine in January when it only fetches a few images but after that it gets really slow. So this needs to be fixed, in this course I'm fixing this problem through seperating the data into months; this way I only have to fetch a maximum of 31 images at once! 

>There are still some problems / bugs with this approach but you can reach about them [here](#known-problems)

# Optimizations 

* **Image downloading** | Images are downloaded and stored locally, this way the browser won't have to fetch the images. This happens in the build and client won't notice this.
* **webP format** | Images are downloaded and stored in both **.jpg** & **.webp** format. Using a `<picture>` I've ensured there are jpg fallbacks for browser that don't support webp format. **webP** significantly reduces the image size. (up to half the size sometimes!!)
* **Image Compression** | Images are compressed to 70% quality (no visually noticeable loss) which means once again the file sizes are reduced.
* **Gzip Compression** | Gzip compression is used to decrease the size of the response body.
* **Async JS loading** | JS is loaded in the `head` using `defer` to make it non-blocking.
* **Minify** | Files are minified to reduce file sze;
	* **HTML** | HTML is serverside generated and gets minified before serving
	* **CSS** | CSS modules are being concatenated, import statements are removed, CSS is transpiled to be compatible with IE8, and finally CSS is minified
	* **Clientside JS** | Clientside JS (used for filtering) is minified
	* **Service Worker** | JS Service Worker code is minified
* **Service Worker** | Service Worker caches all visited pages, serves cached pages when offline or if detail-pages aren't cached serves an offline page.

# API

This application uses NASA's [Picture of the Day (APOD)](https://api.nasa.gov/) `API`, it provides astronomy related pictures.

Every day NASA adds a new astronomy related picture to the `API`, these are retrievable individually but NASA also supports bulk fetching! (this is however not documented in their API documentation)

Using parameters you're able to create a more customized request, the following parameters are available;
* **date** | the date of the picture 
	* **start-date** & **end-date** | for bulk fetching 
* **hd** | url for high resolution picture
* **api_key** | personal api key to identify yourself 

Rate limit is 1000 calls per hour (per `api` key).

`API` keys are free, you however have to [register](https://api.nasa.gov/) (full name & email).

# Stuff I Want To Do

- [x] Add pagination based on available months
- [ ] Make prefetch (in build) more effective by also saving the non-images data and generating the `JSON` files that are currently being fetched again in the serverside logic
	- [ ] This effectively also eliminates the need for a lot of serverside logic, which ofc then needs to be removed / refactored
- [ ] Rewrite some of the CSS since it has become quite messy
- [ ] Make EJS templates more DRY 
- [ ] Other optimizations such as: ETAG, cache-headers can be used to further improve the performance
- [ ] Support multi-year; meaning you'd effectively have a timeline of all available **Astronomy Pictures of the Year(s)**

# Known Problems

* Currently the build prefetches all images, all images from 24 after the build will not be included in the prefetch and thus won't be locally saved & won't have webp variants. At the moment the `<picture>` image fallback has the online url as `src` so this won't break the app or anything but it'll however slow down the app.

[MIT](https://github.com/WesselSmit/progressive-web-apps-1920/blob/master/LICENSE) @ Wessel Smit
