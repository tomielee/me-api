A API with Express

Part of coarse in javascript based framework.
Notes to set this API up.

## On your local machine

### NOT DONE
You will need Node.js installed on your enviroment.
Node includes [https://www.npmjs.com/](NPM).

Use
    `brew install npm`

For further installation check out [https://nodejs.org/en/](Node.js) official website.

### Setup
in your workdir.
    ` npm init `

#### Dependencies
For third party access of api: Cors
For log: Morgan
    ` npm install express cors morgan --save `

To protect routes
    `npm install --save cookie-parser `

To create token with Jwebtoken
    ` npm install jsonwebtoken --save `

To use bcrypt
    ` npm install bcryptjs --save `

To read .env, use doentv
    ` npm install dotenv `

The database is based in sqlite.
    ` npm install sqlite3 --save `

To run tests with mocha - test the api
    `npm install mocha --save-dev`

To get code coverage use Istanbul
    `npm install nyc --save-dev`

To test integration - test the api with routes
    `npm install chai chai-http --save-dev`

To validate code
    `npm install javascript-style-guide --save-dev`
also run `cp node_modules/javascript-style-guide/.eslint* . `
    `npm install eslint eslint-plugin-react --save-dev`
    




#### To keep npm running
In development mode
    `npm install -g nodemon `

Add in your package.json
{
    "scripts": {
        "start": "nodemon app.js"
    }
}

run server with
    `npm start `

## Your package.json should look like
For a api named Title
`{
    ...
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.4",
    "cors": "^2.8.5",
    "dotenv": "^8.1.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "morgan": "^1.9.1",
    "sqlite3": "^4.1.0"
  }
} 
`


### Database
In your 
` 
$ cd db
$ sqlite3 texts.sqlite
    .read migrate.sql
    .exit
`
Run ` .tables ` to check if tables are created

## On your server

