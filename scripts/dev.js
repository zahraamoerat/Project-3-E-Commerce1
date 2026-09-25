import { spawn } from "node:child_process";
import process from "node:process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const processes = [];

function start(name, args) {
  const child = spawn(npm, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: false,
  });

  processes.push(child);

  child.on("error", (error) => {
    console.error(`[${name}] failed to start: ${error.message}`);
  });

  child.on("exit", (code, signal) => {
    if (code !== 0 && signal !== "SIGINT" && signal !== "SIGTERM") {
      console.error(`[${name}] stopped with code ${code ?? "unknown"}`);
    }
  });

  return child;
}

console.log("Starting WeConnect frontend and backend...");
console.log("Frontend: http://localhost:5173");
console.log("Backend:  http://localhost:5000");

// Vite must run as a development server. The previous script used
// `vite build --watch`, which builds files but does not serve the Vue app.
start("backend", ["run", "dev", "-w", "backend"]);
start("frontend", ["run", "dev", "-w", "frontend"]);

function shutdown() {
  for (const child of processes) {
    if (!child.killed) child.kill("SIGINT");
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);
