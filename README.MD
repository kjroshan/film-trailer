# Film Trailer

An API for getting **YouTube video Key/ID** for the given **Viaplay movie metadata link**.

The API accepts an url and extract the movie metadata using the url from Viaplay and get the **IMDB** id for the movie from the metadata received. The IMDB id is used to search for the video links for the trailers and teasers of the movie by using a service provided by **TheMovieDB.org**.

## Building and Executing

* Clone/Download the repo
* Inside the root folder of the application
```bash
npm install # To install packages
npm start # To to build and run
npm run build # To create a build
```
* To create and run a docker image of the application
```bash
docker build -t image-name/tag . -- To make a docker image
docker run --name trailerapi -p 3000:3000 image-name/tag -- To create docker container
```
## Using the API

* You can try the API in Postman or browser or integrate it in an application
-- API :  **http://localhost:3000/trailer?url=https://content.viaplay.se/pc-se/film/rysare**
-- Response Schema:
{
&nbsp;&nbsp;&nbsp;&nbsp;"trailer": {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "string"
&nbsp;&nbsp;&nbsp;&nbsp;}
}

* Example:  **http://localhost:3000/trailer?url=https://content.viaplay.se/pc-se/film/rysare**
-- sample response: {"trailer": "acQyrwQyCOk"}
* To get more sample movie id visit **https://content.viaplay.se/pc-se/film** and search for **publicPath**

* UI Interface for the API
A react based UI application which integrates this API available on **https://github.com/kjroshan/trailer-ui**

## Building docker containers for for API and UI Interface

* Download or clone both the **film-trailer** (API) and **trailer-ui** (User Interface) repos into a local folder.
 * Create a file named **docker-composer-yml** inside the folder containing both the applications with the following code or copy the file from root folder of the film-trailer repo into the folder outside.
```yaml
version:  "3"
services:
  ui-app:
    image:  name/tag
    container_name:  ui-app
    restart:  always
    environment:
      - REDIS_ENV=false
      - NODE_TLS_REJECT_UNAUTHORIZED=0
    ports:
      - 8080:8080
  api-app:
    image:  name/tag
    container_name:  api-app
    restart:  always
    environment:
      - NODE_TLS_REJECT_UNAUTHORIZED=0
    ports:
      - 3000:3000
```
```
---
**NOTE**
Maintain the indentation as given in the yaml file
Replace the name/tag using preffered name and tag.
Ex for name/tag:  roshan/film-trailer:latest, roshan/trailer-ui:latest
---
```

* Create a file named **_.sh** inside the folder containing both the applications with the following code or copy the file from root folder of the film-trailer repo into the folder outside.
```bash
docker-compose stop
docker rm $(docker ps -a -f status=exited -q)
docker rmi -f $(docker images -f dangling=true -q)

printf  '\n\n\n\n####### Building trailer-ui #######\n\n'
cd film-trailer && git clean -fxd && git reset --hard && git checkout master && git clean -fxd && git reset --hard
docker build -t name/tag .
cd ..

printf  '\n\n\n\n####### Building film-trailer #######\n\n'
cd trailer-ui && git clean -fxd && git reset --hard && git checkout master && git clean -fxd && git reset --hard
docker build -t name/tag .

pwd

docker-compose up -d
```
```
---
**NOTE**
Replace the name/tag using preffered name and tag.
Ex for name/tag:  roshan/film-trailer:latest, roshan/trailer-ui:latest
---
```
* Your folder structure should like the following
```
.
+-- film-trailer
+-- trailer-ui
+-- docker-compse.yml
+-- _.sh
```
* execute the command **./_.sh**
```
---
**NOTE**
If you are getting permission denied error run **sudo chmod 775 _.sh** and try again
---
```

## Prerequisites

To built, Node.js should be installed on computer.

##  Implementation Details

* The application has used the following framework and libraries
-- Express (https://expressjs.com/) as http framework
-- request-promise (https://github.com/request/request-promise) for making http requests
-- lodash - for performant utility functions like map, forEach, find etc.
-- Redis - for caching the data coming from viaplay and themoviedb.
-- morgan -- For http logging
-- winston -- for logging the application logs based on the levels, this result could be used with splunk to analyze the logs. The current implementation can be improved by adding better formats with timestamps, exception handling, profiling and querying.
-- bluebird -- For promises
-- babel -- for transpiling ES6 code
-- jest -- for unit test scripts
-- supertest for mock testing http requests

### Adapters
Adapters are created for http service requests, moviedb as a Youtube id fetching adapter and an adapter for getting movie information. These adapters are available in **/src/assets** folder.

* A custom http adapter is created based on **request-promise** and injected into the routes and controller functions, in the future is we plan to use any other libraries then, instead of changing the implementation everywhere we just need to change or create another adapter and inject it.
* The moviedb adapter is used for getting a trailer/teaser id from moviedb. in the future is we wish to use another service provider to get the data we could just switch the adapter instead of changing it inside the routes.
* The Viaplay adapter is used for getting the movie information and injected into the application as a dependency. incase of changes in Viaplay API or for some other reason we can switch the adapter or update it to accommodate the change.

### Routes
Routes are created using route creator login where incase of new routes we just to provide it with the path the implementation function. This will help us with a central place to change the route creation logic and  passing settings and environment variables common across the routes. Routes are implemented in **/src/routes** folder.

###  Redis Configuration
If you are planning to use docker-compose then switch the redis client inside ./src/app.js to following
```js
import redisClient from './redis';
// import redisClient from './devcache';
```


