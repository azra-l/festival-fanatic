# Festival Fanatic

Figma: ​​https://www.figma.com/file/jXiy6tmnOk2jeyhyI6hED0/CPSC-455---Design---Spontaneous-4?node-id=8%3A2

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



