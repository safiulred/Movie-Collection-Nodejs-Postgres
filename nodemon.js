const nodemon = require('nodemon')

nodemon({
    script: 'index.js',
    ext: 'js'
})

nodemon.on('start', () => {
    console.log('nodemon started')
})

nodemon.on('restart', (files) => {
    console.log('nodemon restarting...')
    console.log('Files changed : ', files)
})

nodemon.on('crash', (args) => {
    console.log('nodemon crashed', args)
    // process.exit()
})