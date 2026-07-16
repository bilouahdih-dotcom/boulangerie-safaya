import { spawn } from "node:child_process"
import { chromium } from "playwright-core"

const root = new URL("../", import.meta.url)
const vite = spawn(process.execPath, [new URL("../node_modules/vite/bin/vite.js", import.meta.url).pathname.slice(1), "--host", "127.0.0.1", "--port", "4176"], {
  cwd: root.pathname.slice(1),
  stdio: "ignore",
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
await delay(2500)

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
const errors = []
page.on("response", (response) => {
  if (response.status() >= 400) errors.push(`http ${response.status()}: ${response.url()}`)
})
page.on("requestfailed", (request) => errors.push(`failed: ${request.url()} — ${request.failure()?.errorText}`))
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`)
})
page.on("pageerror", (error) => errors.push(`page: ${error.message}`))

await page.goto("http://127.0.0.1:4176/?skipIntro=1", { waitUntil: "networkidle" })
await delay(6000)
const diagnostics = await page.evaluate(async () => ({
  modelStatus: (await fetch("/models/safaya-croissant.glb")).status,
  canvasCount: document.querySelectorAll("canvas").length,
  canvasSize: [...document.querySelectorAll("canvas")].map((canvas) => ({
    pixels: [canvas.width, canvas.height],
    rect: canvas.getBoundingClientRect().toJSON(),
    framebuffer: (() => {
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")
      if (!gl) return null
      const sample = new Uint8Array(4)
      gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, sample)
      return [...sample]
    })(),
  })),
  images: [...document.querySelectorAll("img")].map((img) => ({ src: img.src, naturalWidth: img.naturalWidth, rect: img.getBoundingClientRect().toJSON() })),
  hit: (() => {
    const element = document.elementFromPoint(1000, 400)
    return element ? { tag: element.tagName, className: element.className, html: element.outerHTML.slice(0, 300) } : null
  })(),
  scenes: (window.__safayaScenes ?? []).map((scene) => {
    const nodes = []
    scene.traverse((object) => nodes.push({
      name: object.name,
      type: object.type,
      visible: object.visible,
      position: object.position.toArray(),
      scale: object.scale.toArray(),
      material: object.material?.name,
    }))
    return nodes
  }),
  viewport: [innerWidth, innerHeight, document.documentElement.scrollWidth],
  overlay: Boolean(document.querySelector("vite-error-overlay")),
}))
await page.screenshot({ path: new URL("../blender-desktop.png", import.meta.url).pathname.slice(1) })
console.log(JSON.stringify({ diagnostics, errors }, null, 2))

await browser.close()
vite.kill()
