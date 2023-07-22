import { existsSync, readFileSync, watchFile } from "fs";
import { join } from "path";
import { Server } from "ws";

const args = process.argv;

if (args.length <= 2) {
  console.log("Expected GLSL file input");
  process.exit(1);
}

const shaderFilepath = join(process.cwd(), args[2]);

if (!existsSync(shaderFilepath)) {
  console.log("Input file doesn't exist");
  process.exit(1);
}

const server = new Server({ port: 6969 });


function SendShaderSource() {
  const shaderSource = readFileSync(shaderFilepath, { encoding: "utf-8" });
  for (const client of server.clients) {
    client.send(shaderSource);
  }
}

server.on("connection", () => SendShaderSource());
watchFile(shaderFilepath, { interval: 100 }, () => SendShaderSource());
