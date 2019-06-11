## Components

- Web framework - [express](http://expressjs.com/)
- Database ODM - [mongoose](https://mongoosejs.com/)
- Http Logger - [morgan](https://www.npmjs.com/package/morgan)
- HTTP Request body parser[body-parser](https://www.npmjs.com/package/body-parser)
- Session Manager - [express-session](https://www.npmjs.com/package/express-session)
- Session Store - [connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session)
- Password Encryption - [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- CSRF Validation - [csurf](https://www.npmjs.com/package/csurf)

## Setting Env variables

Source `local-env.sh` on shell prompt before running app.

Variables required:

- MONGO_URI (Dbaas)
- SEND_GRID_API (STMP Service)

## Running the app

```bash
source local-env.sh
npm start
```
