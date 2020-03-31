# Table of Contents
* [Demo](https://nasa-astronomy-pictures.herokuapp.com/)
* [Assignment](#assignment)
* [Goal](#goal)
* [Install Notes](#install-notes)
* [Concept](#concept)
* [Optimizations List](#optimizations-list)
* [Optimizations in Depth](#optimizations-in-depth)
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

# Optimizations List

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

# Optimizations in Depth

My WAFS app was incredibly slow; every page had to fetch data from the API & and all the images had external URLs that the browser had to GET. Sometimes the load times were more than a minute on a gooed connection. And this was only January + February. March and all months after that aren't even included.

So with this course I tried to boost the performance by adding new technologes & rewriting my app.

### 1. Server Side Rendering

I started by fetching the data & generating my html pages on the server. The difference wasn't really noticeable but this is important because server-side allows us to apply other perfomance boosting techniques.

![image](https://user-images.githubusercontent.com/45405413/78019198-8a697880-734f-11ea-8e94-1691a3b17174.png)

>As the above image shows; the loading time was terrible. It took 1.1 minutes to finish rendering the page, and the page was a wooping 185MB! These stats are of course outrageous and if it's december these loading times would be 4x worse because it has to load even more images.

![image](https://user-images.githubusercontent.com/45405413/78019308-c0a6f800-734f-11ea-8835-080b839bbacb.png)

>Performance wise: is scores a 69. As you can see the time to interactive isn't as bad. That's because the bottleneck of this app are the images.

### 2. Minifying CSS + concatenating all imports into one file

I minified my CSS code, this isn't that much code and minifying CSS only removes whitespace meaning there isn't much to gain here. However it would be a shame not to do it since it's very easy.

I also concatonated all CSS files/imports into file. Through bundling your CSS the browser only needs 1 GET request to ftech your styles. This is very important as every GEt request can fail which means those styles won't be loaded OR it'll cost more broadband data to fetch multiple files.

>I don't have screenshots of the `network` tab or `audit` tab for this 

### 3. Monthly Overview Pages

I decided to switch up the concept a bit to make it more viable; I decided to divide the content into the months. So each month had it's own page which meant less content would have to be loaded at once!

This meant instead of having to do a GET request for 1 - 365 images the(depending on day of the year) the browser only has to do a maximum of 31 per month!

>I don't have screenshots of the `network` tab or `audit` tab for this 

### 4. Caching Using Service Workers

Browser have service workers which can do work for you and your website to make them faster, things such as: offline mode & caching pages.

**Caching Pages**

Service Workers are installed, when my serviceWorker installs it automatically caches the main pages. This is because these pages are the most important and I want them to be cached so that if the user loses connection they can still see the cached page.

```js
//Array of cached pages & assets

[
	'/',
	'/offline',
	'/public/optimized.css',
	'/public/optimized.js',
	'/media/fonts.nasalization-rg.woff',
	'/media/images/exit_icon.svg',
	'/media/images/favicon.ico',
	'/media/images/nasa_logo.png',
	'/media/images/white_arrow.svg'
]
```

Every visited page is added to the cache!

Since the concept of my app is a everchanging and daily updated page I don't want to have the SW intervene always. I want the browser to try and fetch the newest version of the page everytime it's requested to make sure the page is up to date.

If the network GET request fails I check if the page exists in the cache. If it exists then I serve the cached page (which might be outdated), if it doesn't exist I serve the offline page!

This way the user can still use my app offline (partially)

In the Browser you can see the cache size: after first implementing the SW the cached storage size was 660MB. This was insanely high because all the images are really big.

>I don't have screenshots of the `network` tab or `audit` tab for this 

### 5. Minifying client-side JS 

Then I also minified my client-side JS, this both removes whitespace and minifies variable names etc. I also bundled the multiple client-side JS files into to minimize the amount of GET requests the browser needs to get all scripts.

>I don't have screenshots of the `network` tab or `audit` tab for this 

### 6. Minifying HTML

After that I minified my HTML using the compression middleware (NPM package). Minified HTML also has no whitespace and removes unnessacery quotes. Once again; this isn't all that much in terms of file size but it's low haning-fruit and very easy to do!

>I don't have screenshots of the `network` tab or `audit` tab for this 

### 7. Non-blocking JS Loading

At this moment my client-side JS was being loaded in the tail of the `body`. 

To improve the `time to interactive` I decided put my `<script>` tag in the `head` of the document. This of course will load the JS file earlier on in the document but will block the HTML content from being loaded and rendered.

To prevent the script from blocking the HTML content I added the `defer` attribute to the `script` tag. `defer` loads the JS file async and it doesn't block the process!

>I don't have screenshots of the `network` tab or `audit` tab for this 

### 8. Prefetching 

I decided to prefetch the images, meaning I fetch the images in the npm build script which runs prestart. This means the Heroku app runs start every once in a while when the server needs to be booted up. 

The start phase takes a little longer to start because it needs to 'pre-'fetch the data / images.

Once the images are fetched they are downloaded, and then saved in a folder on the server. These images are in the JPG format which is normal but still prety big.

In my HTML templates I use the server-side saved JPG's as url. This eliminates the external image URLs and reduces the number of GET requests by a lot! 

>I don't have screenshots of the `network` tab or `audit` tab for this 

### 9. webP & Picture

To further improve the performance I convert the JPG's to WebP format.

>WebP is a modern image format that provides superior lossless and lossy compression for images on the web. Using WebP, webmasters and web developers can create smaller, richer images that make the web faster. WebP lossless images are 26% smaller in size compared to PNGs.

WebP images are a lot smaller in size. 

I convert each JPG to WebP and store them in a server-side folder.

![image](https://user-images.githubusercontent.com/45405413/78026758-75dfad00-735c-11ea-947f-cec683229ca3.png)

As the above picture shows; converting JPG to WebP can save up to 90% in size without losing quality. This optimalisation is the biggest performance booster and reduces the size of your websites resources by a lot.

However, not all browsers support WebP. So to make sure the app still works in other browsers I used a `<picture>` element and as sourceset I gave it the webP images. If the browser doesn't support those it'll show the fallback which are the JPG images.

## Result

After all the optimalisations, this is what the network tab looks like:

![image](https://user-images.githubusercontent.com/45405413/78027337-7fb5e000-735d-11ea-8588-798c6dcd7b70.png)

Network Results: 

* **Requests** | from `90` to `44`
* **Transferred data** | from `185 MB` to `11.7 KB`
* **Resources size** | from `185M B` to `3.3 MB`
* **Time to Finish** | from `1.1 min` to `3.08 sec`
* **DOMcontentLoaded** | from `2.29 sec` to `1.99 sec`
* **Load** | from `2.63 sec` to `1.1 min`

Performance wise the audit also shows how much it has improved:

![image](https://user-images.githubusercontent.com/45405413/78027369-89d7de80-735d-11ea-8804-dc7bde30b550.png)

Audit Results:

* **Audit performance** | from `69` performance to `99`
* **First contentful paint** | form `1.8 sec` to `1.2 sec`
* **Speed index** | from `6.4 sec` to `1.6 sec`
* **Time to interactive** | from `5.5 sec` to `2.2 sec`
* **First meaningful paint** | from `2.2 sec` to `1.8 sec`
* **First CPU Idle** | from `5.4 sec` to `2.2 sec`
* **Max potential first input delay** | from `990 ms` to `20 ms`

The website now feels instant.


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
