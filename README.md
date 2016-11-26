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

## Navigation
* [Add User](#add-user)
* [Aesthetics](#aesthetics)
* [Color](#color)
* [Decide](#decide)
* [Echo](#echo)
* [Emoji](#emoji)
* [Figlet](#figlet)
* [Giphy](#giphy)
* [Karma](#karma)
* [Let Me Google That for You](#lmgtfy)
* [Movie Search](#movie-search)
* [Nickname](#nickname)
* [Notifications](#ping)
* [Poll](#poll)
* [Pokedex](#pokedex)
* [Remove User](#remove-user)
* [Space](#space)
* [Summary](#summary)
* [Title](#title)
* [Vote](#vote)
* [Weather](#weather)
* [Weed](#weed)
* [Wolfram](#wolfram)
* [XKCD](#XKCD)

## Commands

### Add User
Adds user to thread, given name

`/add <name>`

### Aesthetics
Sends text with better ａｅｓｔｈｅｔｉｃ

`/aesthetic <text>`

### Color
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

### Emoji
Changes the emoji based on a word or emoji

`/emoji <emoji character>`

`/emoji <word>`

### Figlet
Sends a figlet ASCII figure of a message.

`/figlet <message>`

### Giphy
Connects to Giphy to send gifs corresponding to search term. If no search term is provided, it will send a random gif.

`/giphy <search term>`

`/giphy`

### Karma
`/++ <user>` Increase a user's karma

`/-- <user>` Decrease a user's karma

`/karma <user>` Check a user's karma

### LMGTFY
`/lmgtfy <phrase>` Generates a snarky LMGTFY link (shortened, of course)

### Movie Search
`/movie <search term>` Search for a movie or TV show. Returns cover art, run status, and IMDb rating

### Nickname
Check or modify nicknames

`/nick` Check your own nick

`/nick <username>` Check a specific nick

`/nick <username,nickname>, <newNickname>` Set a nick

### Notifications
`/ping <user>` Send a user a private message to get their attention.

### Poll
Creates a poll that users in the chat can view and vote
`/poll create <question>`

`/poll add <option>` Note that `/poll add decide` will automatically add a Yes and No option

`/poll view` Print the poll

`/poll delete`Delete the poll

### Pokedex
Allows access to pokémon and move information
`/pokedex <pokemon name>` Display pokémon information

`/pokedex <pokemon id>` Display pokémon information

`/pokedex move <move name>` Display move information

### Remove User
Removes user from thread, given name or thread nickname

`/kick <name>`

`/kick <nickname>`

### Space
Sends a random space-related image to thread.

`/space`

### Summary
`/smmry <url>` Produces a summary of an article

### Title
Sets title of thread.

`/title`

### Vote
`/vote <index>` To be used in conjunction with `/poll view`

### Weather
Sends weather information for given location.

`/weather <location>`

`/weather <location> daily`

### Weed
Provides strain information and effects for given query.

`/weed <strain name>`

### Wolfram
`/wolfram <query>` Queries wolfram alpha to solve your question

### XKCD
`/xkcd random` Random XKCD comic

`/xkcd today` Most recent XKCD comic


## Credits
*ft. ankles, jak the narc, j, kdr, mat, nikolaj, shan, uk, and the sadboyz*
