const WebSocketServer = require('ws').Server
const http = require('http')
const express = require('express')

const app = express()

app.use(express.static(`${__dirname}/chat`))

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

let connections = []

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec))

async function broadcast(message) {
  const random = Math.round(Math.random() * 100)
  if (random > 70) {
    await sleep(1000)
    connections.forEach((con) => {
      con.send(JSON.stringify({ read: true }))
    })
    await sleep(2000)
    connections.forEach((con) => {
      con.send(JSON.stringify({ text: `Bot : ${message}` }))
    })
  }
}

wss.on('connection', (ws) => {
  connections.push(ws)
  ws.on('close', () => {
    connections = connections.filter((conn) => {
      return conn !== ws
    })
  })
  ws.on('message', (message) => {
    broadcast(JSON.stringify(message))
  })
})

server.listen(8080)
