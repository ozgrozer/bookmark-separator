const fs = require('fs')
const path = require('path')
const express = require('express')
const PImage = require('pureimage')

const app = express()
const port = process.env.PORT || 9000

app.listen(port, () => {
  console.log('Example app listening on port http://localhost:' + port)
})

app.get('/', (req, res) => {
  res.redirect('/000000/1')
})

app.get('/:color/:width', (req, res) => {
  const color = req.params.color
  const width = parseInt(req.params.width)

  const code = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Separator for browser bookmarks</title>
      <link rel="icon" type="image/png" href='/favicon/${color}/${width}' />
      <style>
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        body {
          margin: 0;
          display: flex;
          text-align: center;
          align-items: center;
          font-family: Verdana;
          justify-content: center;
        }
        a {
          text-decoration: none;
        }
        #drag {
          color: #fff;
          width: 200px;
          height: 50px;
          font-size: 20px;
          line-height: 50px;
          text-align: center;
          border-radius: 5px;
          display: inline-block;
          background-color: #aaaaaa;
        }
        #drag:before {
          content: 'DRAG ME';
        }
        #me {
          margin-top: 50px;
        }
      </style>
    </head>
    <body>
      <div>
        <a id="drag" href='/${color}/${width}' style='background-color: #${color};'></a>
        <br />
        <div id="me">Me: <a href="https://twitter.com/ozgrozer" target="_blank">twitter.com/ozgrozer</a></div>
      </div>
    </body>
    </html>
  `

  res.send(code.replace(/ {2}|\r\n|\n|\r/gm, ''))
})

app.get('/favicon/:color/:width', (req, res) => {
  const color = req.params.color
  const width = parseInt(req.params.width)

  const filename = path.join(__dirname, 'favicons', `${color}-${width}.png`)

  if (fs.existsSync(filename)) {
    res.sendFile(filename)
  } else {
    const img = PImage.make(16, 16)
    const ctx = img.getContext('2d')
    ctx.fillStyle = '#' + color
    ctx.fillRect((16 - width) / 2, 0, width, 16)

    if (!fs.existsSync('favicons')) fs.mkdirSync('favicons')

    PImage.encodePNGToStream(img, fs.createWriteStream(filename))
      .then(() => {
        res.sendFile(filename)
      })
  }
})
