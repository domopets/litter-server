const execa = require("execa")
const path = require("path")
const a = require("awaiting")

const socket = require("socket.io-client")("https://domopets.herokuapp.com/")

const hx711Path = path.join(__dirname, "..", "hx711py")
const tare_cmd = path.join(hx711Path, "tare")
const measure_cmd = path.join(hx711Path, "measure")

async function tare() {
  const {stdout} = await execa(tare_cmd)
  return parseInt(stdout)
}

async function measure(tare) {
  const {stdout, stderr} = await execa(measure_cmd, [tare])
  return parseInt(stdout)
}

let tareVal
let tareTriggered = false
tare().then(async val => {
  tareVal = val
  const measureLoop = async () => {
    if (tareTriggered) {
      console.log("reset tare")
      tareVal = await tare()
      tareTriggered = false
    }
    const measureValue = await measure(tareVal)
    socket.emit("dispatch", {
      action: "measure",
      payload: measureValue,
    })
    console.log(measureValue)
    setTimeout(measureLoop, 200)
  }
  measureLoop()
})

socket.on("connect", () => {
  socket.emit("type", "LITTER")
})
socket.on("tare", () => (tareTriggered = true))
