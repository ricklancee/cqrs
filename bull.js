const Arena = require('bull-arena')
const express = require('express')

const app = express.Router()

const arenaConfig = Arena(
    {
        queues: [
            {
                // Name of the bull queue, this name must match up exactly with what you've defined in bull.
                name: 'jobs',

                // Hostname or queue prefix, you can put whatever you want.
                hostId: 'Mail queue',

                // Redis auth.
                redis: {
                    port: 6379 /* Your redis port */,
                    host: '127.0.0.1' /* Your redis host domain*/,
                    password: 'auth' /* Your redis password */,
                },
            },
            {
                // Name of the bull queue, this name must match up exactly with what you've defined in bull.
                name: 'mail',

                // Hostname or queue prefix, you can put whatever you want.
                hostId: 'Mail queue',

                // Redis auth.
                redis: {
                    port: 6379 /* Your redis port */,
                    host: '127.0.0.1' /* Your redis host domain*/,
                    password: 'auth' /* Your redis password */,
                },
            },
        ],
    },
    {
        // Make the arena dashboard become available at {my-site.com}/arena.
        basePath: '/arena',

        // Let express handle the listening.
        disableListen: false,
    }
)

// Make arena's resources (js/css deps) available at the base app route
app.use('/', arenaConfig)
