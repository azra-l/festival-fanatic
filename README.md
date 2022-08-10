# Festival Fanatic

# https://festival-fanatic.herokuapp.com/


# Project Description

Find music festivals and events where your favourite artists will perform based on the artists you listened to most on Spotify. Discover new music festivals that you never knew existed and supercharge your musical experience 

---

- [Project Overview](#project-description)
- [Project Goals](#project-goals)
  - [Minimal Requirements](#minimal)
  - [Standard Requirements](#standard)
  - [Stretch Requirements](#stretch)
- [Project Tech Stack](#project-tech-stack)
  - [Unit 1 - HTML CSS JS](#unit-1---html-css-js)
  - [Unit 2 - React Redux](#unit-2---react-redux)
  - [Unit 3 - MongoDB](#unit-3---mongodb)
  - [Unit 4 - Node Express](#unit-4---node-express)
  - [Unit 5 - Release Engineering](#unit-5---release-engineering)
- [Above and Beyond](#above-and-beyond)
- [Next Steps](#next-steps)
- [List of Contributions](#list-of-contributions)

# Project Goals

## Minimal 

- ✅ Home page
- ✅ Login button
- ✅ Results page showing festivals where a user's artists is shown
- ✅ Detailed festivals page showing more details of the festival such as lineup, date, time, location 

## Standard 

- ✅ Set up Express and connect frontend to the backend, setup routes with React-router
- ✅ Data persistence with MongoDB, as well as encrypting unique user data
- ✅ User Authentication with sessions and authenticated routes
- ✅ Deploy to Heroku, serve frontend and backend
- ✅ Map showing the location of a festival

## Stretch 

- ✅ Live festival data from a curated source so that our team did not have to manually input date, time, location, and lineup of possible festivals and event
- ✅ Implement Spotify OAuth to retrieve a user's running list of top artists rather than having to manually input artists (one click user experience)
- ✅ Components were custom designed (basic components like buttons, etc. Material UI and Font Awesome icons were used) and matched colour scheme of the app
- ❌ Implement Apple Music integration - limited API support to find a users top artists

---

# Project Tech Stack

## Unit 1 - HTML CSS JS

CSS was used to customize styling and design for all of our react components. The rest of the HTML and JS were transpiled from React JSX.


## Unit 2 - React (Redux)
Being able to render the front end using states and components based on conditionals was a huge help and made it a lot easier to reuse components for cleaner code. Additonally, authentication middle  

## Unit 3 - MongoDB
Data persistence for our user's festivals, their favorited or archived festivals. We used nosql archiecture (utilizing documents for new data and querying based on this) to create a centralized db containing artists and festivals so that our app can be scaled. 

## Unit 4 - Node Express
Node Express was used for authenicating API requests and being the trusted entity to transit data to and from the database so that others cannot just modify and delete data from the database. 

## Unit 5 - Release Engineering
Deployed onto Heroku with an automated pipeline to changes on the main branch for a seamless continuous deployment to our public facing app. Using free tier to save $$$

# Above and Beyond


## User Authentication

We set up user authentication using express session. Once a user logs in it uses Spotify OAuth so we don't store user sensitive information. A unique userID is hashed (if it's a new user) from the Spotify user's id so that even if the db is compromised, there is no way to link user data to their userId. Afterwards, their Sotify access token are written into an token which is then encrypted and stored as a cookie. This token is then decrypted in the backend and then the backend makes external requests to the BandsInTown API, Spotify, and MongoDB. The token also has a expiration time of 1 hour to prevent malicious acts on the cookie. With this approach, the network requests won't have sensitive data such as API keys and user credentials (access tokens) exposed to prevent abuse to APIs. Additionally, nobody but the user with their respective userID can make changes to the database because all modifications to the db are made on the backend. We tried to make the user experience simple as possible so all of this happens with 1 click upon logging into Spotify. 

## Top Artists Spotify Data + Festival Matching 

Our entire idea for this project revolved around the concept of helping someone discover an event or music festival where a user's most listened to artists will be performing so they can see as many people over the course of the event. This way, people can see many of their favourite artists in one sitting saving time and money compared to going to individual events one a time. We get a user's top artists from Spotify and then do another search using the BandsInTown API to find festivals where an artist is present. If another artist is present at the same event, it will be added to the event's lineup. Moreover, with each new event or artist, a new document will be added to their respective collections on a shared centralized noSQL database for all users to retrieve from. This allows for us to rely a little less on third party APIs and helps overcome rate limiting issues. Utilizing noSQL allows our database to be scaled rapidly in the event of an influx of new users and it also allows us to perform any query logic using indexed databases which is already built in on MongoDB's noSQL which makes it easier to write future query logic on. 


## Customized Components 

We set up custom react components for our Artist cards, Event cards and detailed results that were styled with CSS instead of using prebuilt components to acheive the UI we had envisioned.


# Next Steps

We would ideally like to integrate our app with other music streaming platforms like Apple music and Amazon music so our app would be useful to a wider audience. Additionally, we plan to make our app responsive for a better m-web experience.

# List of Contributions

## Amman
- Configured a vs-code dev container setup that installs all dependencies, and runs a local mongodb instance
- Made the css grids used in the UI responsive
- Refactored the database schema to make it store less redundant data, then refactored the endpoints to work with new schema
- Implemented a spotify import flow which saves the user's top artists from Spotify at a minimum of every 24 hours

## Azra 
- Created basis for front end including building and styling the event cards, artist cards, event results and detailed results pages
- Implemented state management of the festivals and selected artists with redux
- Implemented the sharing event with a friend feature with the Sendgrid API

## Stanford
- Implemented Spotify OAuth, user authentication/persistance using sessions, redux, secured backend API and frontend assets
- Researched and implemented Spotify APIs, BandsInTown API and other third party APIs 
- Designed architecture of the frontend and backend, helped teammates with frontend and backend additions and trouble shooted 

## Tristan

---

## TODO: Will delete in the future

## Who is it for?
* Spotify Users that attend music festivals or concerts with multiple artists attending
## What will it do? (What "human activity" will it support?)
* Simplify their trip planning and maximize their time by attending a festival that has the most artists present that they listen to on a regular basis to 
## What type of data will it store?
* We use the following API to collect data to store on the user’s top artists on spotify
* https://developer.spotify.com/console/get-current-user-top-artists-and-tracks/
* https://developer.spotify.com/documentation/web-api/guides/rate-limits/ 
* We need to take into account rate limits when implementing this portion

## What will users be able to do with this data?
* Target music festivals and concerts based on their top artists
## What is some additional functionality you can add/remove based on time constraints?
* Add Apple Music or other streaming platforms instead of just spotify
* Filter out based on geographical region (Sort by closest location + most # of artists)
* Adding user ranked and user generated artists track (authentication + reddit style upvote system, ranking the feed from most upvoted to least) 
* Allow playback of a mashup track of all the artist’s most popular songs as a sort of festival preview.


# Project task requirements:
## 3-5 minimal requirements (will definitely complete)
* One button OAuth integration with Spotify API to retrieve most liked artists
* Display a list of festivals where the user’s most played artists are performing - with details like location, ticket price range etc
* Hardcoded festival data with Artists (according to their Spotify unique artist ID) and equally weight their artists
## 3-7 "standard" requirements (will most likely complete)
* When a user authenticates, we store their recommendations on our db for caching and future retrieval (but more so to just fulfill the db requirement)
* Store manually generated festival data in our db, keeping a running db of artists (if it optimizes our ranking algorithm e.g. speeding it up instead of having to constantly fetch from spotify)
* One click user experience (so it’s incredibly easy to use the app)
* Share recommendations as a festival plan to friends and other festival goers (via some email or download)
* Get a future festival list for a selected artist by the user
## 2-3 stretch requirements (plan to complete at least 1!)
* Some easy way to manually generate festival lists that matches keyword input to Spotify artist IDs for ex. searching “Kendrick L”, there’s a dropdown list with “Kendrick Lamar” to add to the list
* Ranking of manually festival list, headliner - has more 10x more weight, secondary headliner?? -  hax 5x more weight, others etc.. Maybe even how many times they’ve listened to the artists 
* Filter festivals by geographic region (store GPS coordinates of festival) and genres, etc.
* Display a feed of the artist’s social media such as Instagram or Twitter
* Display a Google Map with tacks connected to each festival


## Break down 2 minimal requirements into ~2-5 smaller tasks!
### Hardcoded festival data
* Setup dev environment with mongodb and express
* Finalize schema for the db
* Randomly generate rows using a dummy data generator tool and save as csv or db dump
* Collect a list of popular artist ids from spotify (blocked by OAuth integration)
* Write npm script to import dummy data and start the express app with a simple endpoint to verify dummy data
### Display a list of festivals 
* Card of each festival showing Date, time, location, and number of matched artists
* Display only cards that have a match, endlessly scroll based on # of festivals
* Ex. *see festival card*




## Prototype sketches of the app
* *see prototypes*

<img width="776" alt="Screen Shot 2022-05-26 at 9 34 52 PM" src="https://user-images.githubusercontent.com/96637812/170834120-6403e3bd-4d91-44cf-8082-ce4aeb51417e.png">
<img width="776" alt="Screen Shot 2022-05-26 at 9 36 15 PM" src="https://user-images.githubusercontent.com/96637812/170834134-33d10c9f-8989-4dd4-92ef-2bd910bbe53d.png">
<img width="776" alt="Screen Shot 2022-05-26 at 9 36 24 PM" src="https://user-images.githubusercontent.com/96637812/170834140-75216990-0e92-4864-a12e-e9c4d2e8fdbd.png">



## How to run
To apply any changes to the dev container setup, run the `clean-dev-container-for-fresh-build.sh` script on your system terminal (not inside the container), then reopen the project folder in the container.
### Frontend, download docker desktop, run it, then open visual studio code
1. `cd react-app`
2. `npm ci`
3. `npm start`

### Backend
1. Make sure you have .env file
2. Set `MOCK_API_DATA=true` in the `.env` file to fetch mock data from Spotify and Bandintown (useful for circumventing rate-limiting and insufficient data)
3. To connect to the local mongodb instance running in the container, set `MONGO_DB_CLUSTER=mongodb://festival-fanatic:password@localhost:27017/festival-fanatic` in the `.env` file.
4. You can view the contents of the db in the mongo extension that is automatically installed with the dev container. All app data is in the `festival-fanatic` database.
5. `cd server`
6. `npm ci`
7. `npm start`
8. To clean all of the data stored in the db and start fresh, run `npm run start:clean`
