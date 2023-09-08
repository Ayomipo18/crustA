# Project Info

- An API for authentication

- The database schema is in the models folder

- The swagger file is swagger.yaml and can be accessed on the broswer via http://localhost:3000/docs after setting up the project locally.

## How to run this project locally

- clone this repository

- Move into the cloned repository on your system(cd into the cloned repo)

- Go to Google cloud console, create a project and create an OAuth 2.0 Client ID. The credentials of the Client is what will be used below.

- You can also follow this guide on creating a project on Google Cloud Console https://developers.google.com/workspace/guides/create-project

- use the envexample to set up the project. Create a .env file and set the values using the guideline below
    - CLIENT_ID is your google cloud console project client id
    - CLIENT_SECRET is your google cloud console project client secret
    - REDIRECT_URL is your google cloud console project redirect url. 
        - I have put a value to be used in the env example. Make sure you set this same value(http://localhost:3000/v1/auth/google/callback) in your Authorized redirect URIs in your google cloud console project credentials.

    - API_URL. Use the value in the env.example.
    - PORT. Set this to 3000, so it can correspond with tht redirect url
    - PROFILE_URL. Use the value in the env.example
    - JWT_SECRET. Set any value you desire
    - API_VERSION. Use the value in the env.example
    
    - ### Create a database on postgresql and use your postgresql connection properties for this section.
    - DB_DATABASE is your postgresql database
    - DB_USERNAME is your postgresql username
    - DB_PASSWORD is your postgresql password
    - DB_HOST is your postgresql host

- ensure Node.js and posgtresql are installed on your system.

- run this command
```bash
npm install
```
- run this command
```bash
npm run dev
```

- Open your browser and paste http://localhost:3000/docs to see the swagger documentation

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

- Open your browser and paste http://localhost:3000/docs to see the swagger documentation

- You can reach out to me ayomiposolaja@gmail.com for clarity or questions regarding the project.

### Note
- On swagger, you don't need to add prefix "Bearer " to the jwt token but you must have this prefix if you are using postman to test.
