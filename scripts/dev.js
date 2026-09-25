import { spawn } from "node:child_process";
import process from "node:process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const processes = [];

function start(name, args) {
  const child = spawn(npm, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  processes.push(child);

  child.on("error", (error) => {
    console.error(`[${name}] failed to start:`, error.message);
  });

  child.on("exit", (code, signal) => {
    if (code !== 0 && signal !== "SIGINT") {
      console.error(`[${name}] stopped with code ${code ?? "unknown"}`);
    }
  });

  return child;
}

// The backend rebuilds/adds the frontend, so the whole app
// is served from a single port: http://localhost:5000
console.log("Starting WeConnect (single port)...");
console.log("App + API: http://localhost:5000");

start("backend", ["run", "dev", "-w", "backend"]);
start("frontend", ["run", "dev:watch", "-w", "frontend"]);

function shutdown() {
  for (const child of processes) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);