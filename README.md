# sadbot 🌊
*Facebook Messenger bot dedicated to furthering the cause of sadboyz*

## Installation
### Locally:
  1. `npm install`
  2. `npm run start`

### With Docker:
  1. Build the image: `docker build -t sadboyz/sadbot .`
  2. Run the image: `docker run -d sadboyz/sadbot .`
  3. Get container ID/name: `$ docker ps`
  4. Print app output:`$ docker logs <container id>`

* **Remember**: rebuild the image for each code change by running step 1 again.

## Commands

### Add user
Adds user to thread, given name

`/add <name>`

### Change color
Changes color of thread given a hex value or built-in color. To see the list of built-in colors, you can run `/color list`

`/color <hex>`

`/color red`

`/color ++` (increase color brightness)

`/color --` (decrease color brightness)

### Cowsay
Sends the `cowsay` output of a message.

`/cowsay <message>`


### Decide
Makes a yes/no decision for you, and sends a corresponding gif.

`/decide <yes-or-no question>`

### Echo
Sends the specified message.

`/echo <message>`

### Figlet
Sends a figlet ASCII figure of a message.

`/figlet <message>`

### Giphy
Connects to Giphy to send gifs corresponding to search term. If no search term is provided, it will send a random gif.

`/giphy <search term>`

`/giphy`

### Nickname
Sends weather information for given location.

`/nick <username,nickname>, <newNickname>`

### Remove user
Removes user from thread, given name or thread nickname

`/kick <name>`

`/kick <nickname>`

### Space
Sends a random space-related image to thread.

`/space`

### Title
Sets title of thread.

`/title`

### Weather
Sends weather information for given location.

`/weather <location>`

`/weather <location> daily`

### Emoji
Changes the emoji based on a word or emoji

`/emoji <emoji character>`

`/emoji <word>`

### Poll
Creates a poll that users in the chat can view and vote
`/poll create <question>`

`/poll add <option>` Note that `/poll add decide` will automatically add a Yes and No option

`/poll view` Print the poll

`/poll delete`Delete the poll

### Vote
`/vote <index>` To be used in conjunction with `/poll view`

### Summary
`/smmry <url>` Produces a summary of an article

### XKCD
`/xkcd random` Random XKCD comic

`/xkcd today` Most recent XKCD comic

### Movie Search
`/movie <search term>` Search for a movie or TV show. Returns cover art, run status, and IMDb rating

## Credits
*ft. ankles, penguin, i'm only here for lab, sadboy prime, hand, jak the narc, j, private won, kdr, mort, mat,nikolaj, shan, uk*
