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
- [Challenges](#challenges)
- [List of Contributions](#list-of-contributions)

# Project Goals

## Minimal 

- ✅ Home page
- ✅ Login button
- ✅ Results page showing festivals where a user's artists are shown
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
- ❌ Implement Apple Music integration - limited API support to find a user's top artists

---

# Project Tech Stack

## Unit 1 - HTML CSS JS

CSS was used to customize styling and design for all of our React components. The rest of the HTML and JS were transpiled from React JSX.

## Unit 2 - React (Redux)
Being able to render the front end using states and components based on conditionals was a huge help and made it a lot easier to reuse components for cleaner code. Additionally, authentication middle 

## Unit 3 - MongoDB
Data persistence for our user's matched festivals, as well as their favourited or archived festivals. We used NoSQL architecture (utilizing documents for new data and querying based on this) to create a centralized db containing artists and festivals so that our app can be scaled. 

## Unit 4 - Node Express
Node Express was used for authenticating API requests and being the trusted entity to transit data to and from the database to prevent unauthorized access to modify and delete data from the database. 

## Unit 5 - Release Engineering
Deployed onto Heroku with an automated pipeline to changes on the main branch for a seamless continuous deployment to our public facing app. Using free tier to save $$$

# Above and Beyond

## User Authentication

We set up user authentication using express session. Once a user logins, it uses Spotify OAuth to avoid managing user sensitive information from our application. A unique userID is hashed (if it's a new user) from the Spotify user's ID so that even if the database is compromised, there is no way to link user data to their userID. Their Spotify access token is written into a token, which is then encrypted and stored as a cookie. This token is then decrypted in the backend and then the backend makes external requests to the BandsInTown API, Spotify, and MongoDB. The token also has an expiration time of 1 hour to prevent malicious attempts using the cookie. With this approach, the network requests won't have sensitive data such as API keys and user credentials (access tokens) exposed to prevent abuse to APIs. Additionally, nobody but the user with their respective userID can make changes to the database because all modifications to the db are made on the backend. We tried to make the user experience as simple as possible, so all of this happens with 1 click upon logging into Spotify. 

## Top Artists Spotify Data + Festival Matching 

Our entire idea for this project revolved around the concept of helping someone discover an event or music festival where a user's most listened to artists will be performing, so they can see as many people over the course of the event. This way, people can see many of their favourite artists in one sitting, saving time and money compared to going to several individual events. We get a user's top artists from Spotify and then do another search using the BandsInTown API to find festivals where an artist is present. If another artist is present at the same event, it will be added to the event's lineup. Moreover, with each new event or artist, a new document will be added to their respective collections on a shared centralized NoSQL database for all users to retrieve from. This allows for us to rely a little less on third party APIs and helps overcome rate limiting issues. Utilizing NoSQL allows our database to be scaled rapidly in the event of an influx of new users, and it also allows us to perform any query logic using indexed databases which is already built in to MongoDB's NoSQL, which makes it easier to write future query logic on.

## Database Architecture and API Caching Strategy

Our design depends heavily on 2 API providers: Spotify and Bandsintown. Theoretically, the app can function without a database (save for the feature which allows users to manually select artists). However, any meaningful traffic would cause the API providers to rate-limit the app's requests to the point where the app would be unusable. This is why we implemented a caching strategy where we make requests to the 2 API providers only when we need to (for "new" data). Whenever a user logs in, the top artists of the user from Spotify is fetched only if the last fetch was made more than 24 hours ago. These top artists are saved as the user's selected artists, and their upcoming festivals are fetched from Bandsintown and saved to our db. In the next 24 hours, the only time the APIs are hit is if the selected artists are manually updated.


## Customized Components 

We set up custom React components for our Artist cards, Event cards and detailed results that were styled with CSS instead of using prebuilt components to achieve the UI we had envisioned.


# Challenges

## Not having enough data on Spotify accounts

## BandsInTown API
The documentation and results from the Bands In Town API was very limited and really just had to work around it because it gave us so much data.
1. The API sometimes showed an entire lineup and sometimes it didn't. To solve this, we would save the festival with existing artists and append artists to our centralized database.
2. When querying artists, the name has to be an exact match. So if an artist had a space in their name like "Justin Bieber" we would have to query "JustinBieber". Beyoncé with the accent would have to be Beyonce without an accent. We solved this by having a manual switch statement that would normalize the queries.
3. Same events may have a different unique ID. This means that finding a single source of truth was sometimes difficult. This made matching events challenging because you couldn't just match an event ID, otherwise it may mismatch. Our solution isn't perfect but it matches the name of the festival and the date and time of the event to find "similar" festivals.
4. Empty data from the API. Not all the events had complete information and we ran into a few duplication and mismatching bugs because the data was not complete.


# Next Steps

We would ideally like to integrate our app with other music streaming platforms like Apple Music and Amazon Music, so our app would be useful to a wider audience. Additionally, we plan to make our app responsive for a better m-web experience. Moreover, adding a loading screen and error modals would be the next steps to improving the overall user experience.

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
- Researched and implemented Spotify APIs (OAuth, Top Artists), BandsInTown API (matching, selective matching) and other third party APIs 
- Designed architecture of the frontend and backend, helped teammates with frontend and backend additions and trouble shooted 

## Tristan
- Implemented Redux actions to maintain state management for artist festivals
- Improved on the front end design with updates to the UI using Material UI components, adding useful details to festival cards, as well as querying and sorting of festivals by venue/location
- Implemented the front end artist search feature for adding and removing user selected Spotify artists to a custom festival query
---


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
