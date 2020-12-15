# TVmazing web-app

Angular / Apollo / Graphql based web application using `TVmaze` to present TV shows.

### Features

* Dashboard - presents popular shows:
    * by countries like United States or Netherlands (for Netherlands, select all or very popular in the config menu in order to have results)
    * by popularity rating
    * for current and next week
     
* Search - searches shows across all networks in the world by show details
* small config menu to refine Dashboard
* modals to present details about shows as summary, cast, or upcoming episodes information
* dashboard also feature deep-linking with show details

#### Future improvements

* Present former episodes
* Add more countries to dashboard
* Move apollo-server to typescript
* Better error handling with server communication failures
* Address a11y issues

### Open tasks

Check [issue list](https://github.com/csabattilas/tvmaze/issues)

## Install

Run `npm i`.

The used npm version is `6.13.4`.

## Run development

Run client and server in separate terminal windows.

### Run server

Run `npm run start-server`.

### Run client 

Run `npm run start-client`

### Development location

Open [localhost:4200](http://localhost:4200)
