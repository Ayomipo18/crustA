# Project Info

- An API for authentication

## How to run this project locally without docker

- clone this repository

- use the envexample to set up the project
    CLIENT_ID is your google cloud console project client id
    CLIENT_SECRET is your google cloud console project client secret
    REDIRECT_URL is your google cloud console project redirect url. I have put a vlue to be used in the env example.
    API_URL = http://localhost:3000
    PORT. Set this to 3000, so it can correspond with tht redirect url
    PROFILE_URL = A value has been given in the env.example
    JWT_SECRET. Set any value you desire
    API_VERSION = v1
    DB_DATABASE is your postgressql database
    DB_USERNAME is your postgressql username
    DB_PASSWORD is your postgressql password
    DB_HOST = is your postgressql host

- cd into the cloned repo

- ensure Node.js and posgtres are installed on your system.

- run this command
```bash
npm install
```
- run this command
```bash
npm run dev
```

or 

- run this command
```bash
npm install
```
```bash
npm run build
```
```bash
npm run start
```