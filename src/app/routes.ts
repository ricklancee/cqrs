import { app } from '../app'

app.router().get('/foo', (request, response) => {
    console.log('fooo', request)
    response.send('foo')
})
