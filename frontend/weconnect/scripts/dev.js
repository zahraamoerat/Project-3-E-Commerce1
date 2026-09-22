import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import process from "node:process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const processes = [];

function start(name, args, cwd) {
  const child = spawn(npmCommand, args, {
    cwd,
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

const frontendDir = process.cwd();
const backendDir = fileURLToPath(new URL("../../../backend/", import.meta.url));

console.log("Starting WeConnect frontend and backend...");
console.log("Frontend: http://localhost:5173");
console.log("Backend:  http://localhost:28794");

start("backend", ["run", "dev"], backendDir);
start("frontend", ["run", "dev:frontend"], frontendDir);

function shutdown() {
  for (const child of processes) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
