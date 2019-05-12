/*
Imports
*/
    require('dotenv').config();
    const express = require('express');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const port = process.env.PORT;
    const server = express();
    const { mainRouter } = require('./routes/main.router');
    const mongoDB = require('./services/db.connect');
    const path = require('path');
    const ejs = require('ejs');
//

/*
Server configuration
*/
    class ServerClass {

        // Initialization fonction
        init(){
            //=> Use path to add views
            server.engine( 'html', ejs.renderFile );
            server.set( 'view engine', 'html' );
            server.set( 'views', __dirname + '/www' );
            server.use( express.static(path.join(__dirname, 'www')) );
            server.all('/*', function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Authorization, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
                next();
            });

            //=> Body-parser
            server.use(bodyParser.json({limit: '10mb'}));
            server.use(bodyParser.urlencoded({ extended: true }));

            //=> Cookie-parser
            server.use(cookieParser(process.env.COOKIE_SECRET));

            //=> Router
            server.use('/', mainRouter);

            // Start server
            this.launch();
        };

        // After init. function
        launch(){
            // Connect MongoDB
            mongoDB.initClient()
            .then( mongooseResponse => {
                // Launch server
                server.listen(port, () => console.log({ database: mongooseResponse, server: `http://localhost:${port}` }))
            })
            .catch( mongooseError => console.log(mongooseError));
        };
    };
//



/*
Start server
*/
    new ServerClass().init();
//