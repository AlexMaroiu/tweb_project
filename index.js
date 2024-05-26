const express = require('express');
const app = express();
const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const PORT = 8080;

app.use(express.json());

const options = {
    definition:{
        openapi : '3.0.0',
        info : {
            title : 'Node JS API project for oAuth and mongoDB',
            version: '1.0.0'
        },
        servers: [
            { url:  '/localhost:8080' },
        ]
    },
    apis: ['./index.js']
}

const swaggerSpec = swaggerJSDOC(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(
    PORT,
    () => console.log(`its alive on http://localhost:${PORT}`)
)
/**
 * @swagger
 * /:
 *  get:
 *      summary: get the object
 *      responses:
 *          200:
 *              description: ok
 */
app.get('/home', (req, res) => {
    res.status(200).send({
        tshirt: 'maro',
        size: 'large'
    })
})

app.post('/home/:id', (req, res) => {
    const { id } = req.params;
    const { logo } = req.body;

    if(!logo){
        res.status(418).send({message: "We need a logo!"});
    }

    res.send({
        thsirt: `shirt with your logo ${logo} and ID of ${id}`
    });
})