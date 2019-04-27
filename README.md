# Web App and REST API Server Using the MEAN Stack

MEAN STACK : with authentication, image upload and TDD using: MongoDB, Express, AngulaJS, Node.js, JWT, Bcrypt, cloudinary, Mocha, Chai, etc.

## Prerequisites

Node.js MongoDB, NPM and Cloudinary Account 

* [Node.js](https://nodejs.org/en/) - Server Environment
* [MongoDB](https://www.mongodb.com/) - Database
* [NPM](https://www.npmjs.com/) - Package Manager
* [Cloudinary](https://cloudinary.com/) - Image and Video Management Platform
* [Facebook For Developers](https://developers.facebook.com/) - Facebook Platform for Developers
* [Google For Developers](https://developers.google.com/) - Google Platform for Developers

## Installing

```
Clone the repo: `git clone git@github.com:eltonmoraes6/mean-stack-template.git`
```

```
Environment variables
```
Create a `.env` file in the root directory of your project, and add the following
environment-specific variables on new lines in the form of `NAME=VALUE`:

```dosini
HOST_SERVICE=Gmail
MAIL_USER=yourEmail@gmail.com
MAIL_USERNAME=yourEmailName
MAIL_PASS=yourEmailPassword
MONGO_ATLAS_PW=your_mongo_atlas_password-OR-any-other-DB-pass
MONGOLAB_URI=your_db_uri-development/production
WEB_API_URL=api_url-OR-domain-EX_local_URL:http://localhost:3000/api/
DOMAIN_NAME=your_url_domain_name-EX:http://localhost:3000/
CLOUDINARY_CLOUD_NAME=check_on_your_account
CLOUDINARY_API_KEY=check_on_your_account
CLOUDINARY_API_SECRET=check_on_your_account
SECRET=any_string
FACEBOOK_APP_ID=check_on_your_facebook_app
FACEBOOK_APP_SECRET=check_on_your_facebook_app
FACEBOOK_APP_CALLBACKURL=your_api_url-EX:http://localhost:3000/auth/facebook/callback
GOOGLE_CLIENT_ID=check_on_your_goolge_app
GOOGLE_CLIENT_SECRET=check_on_your_goolge_app
GOOGLE_APP_CALLBACKURL=your_api_url-EX:http://localhost:3000/auth/google/callback

```

For more information on how to configure `environment-specific variables` access [dotenv](https://github.com/motdotla/dotenv/).

OBS: For image upload to cloudinary, loging with Facebook and Google+ create: A cloudinary account, Facebook and Google+ developer app. Access the prerequisites site to learn more about.

```
Install dependencies: `npm install`
```

```
Start the server: `npm start`
```
## Running the tests
Test your API using TDD (Test Driven Development): `npm run test` 
OR
Test your API using [Postman](https://www.getpostman.com) or [Insomnia](https://insomnia.rest/download/).

## Build for production

```
Gulp minify files: `npm run build`
```