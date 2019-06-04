# sadbot 🌊
*On March 1st, 2017 zuck finally found and took down sadbot. This repo stands in memoriam. Goodnight, sweet prince.*

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
* [8ball](#8ball)
* [Aesthetics](#aesthetics)
* [Cowsay](#cowsay)
* [Echo](#echo)
* [Help](#help)
* [Figlet](#figlet)
* [Stocks](#stocks)
* [Weather](#weather)
* [XKCD](#XKCD)
* [Yelp](#Yelp)
* [Color (broken)](#color)
* [Emoji (broken)](#emoji)
* [Karma (broken)](#karma)
* [Nickname (broken)](#nickname)
* [Notifications (broken)](#ping)
* [Poll (broken)](#poll)
* [Pokedex (broken)](#pokedex)
* [Title (broken)](#title)
* [Vote (broken)](#vote)

## Commands


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

### 8ball
Asks the mysterious 8ball for an answer to your question

`/8ball <question>`

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

### Karma
`/++ <user>` Increase a user's karma

`/-- <user>` Decrease a user's karma

`/karma <user>` Check a user's karma

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

### Title
Sets title of thread.

`/title`

### Vote
`/vote <index>` To be used in conjunction with `/poll view`

### Weather
Sends weather information for given location.

`/weather <location>`

`/weather <location> daily`

### XKCD
`/xkcd <comic id>` Get the XKCD comic with id `<comic id>`

`/xkcd random` Random XKCD comic

`/xkcd today` Most recent XKCD comic

### Yelp
`/yelp <business>` Get information about a `<business>`


## Credits
*ft. ankles, jak the narc, j, kdr, mat, nikolaj, shan, uk, and the sadboyz*
