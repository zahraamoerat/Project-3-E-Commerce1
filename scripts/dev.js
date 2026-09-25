import { spawn } from "node:child_process";
import process from "node:process";

const processes = [];

function start(name, command) {
  let child;

  if (process.platform === "win32") {
    // Running npm.cmd directly with spawn() can produce EINVAL on some
    // Windows + Git Bash setups. Use cmd.exe explicitly instead.
    child = spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", command], {
      cwd: process.cwd(),
      stdio: "inherit",
      windowsVerbatimArguments: true,
      shell: false,
    });
  } else {
    child = spawn("sh", ["-c", command], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: false,
    });
  }

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

start("backend", "npm run dev -w backend");
start("frontend", "npm run dev -w frontend");

function shutdown() {
  for (const child of processes) {
    if (!child.killed) {
      child.kill("SIGINT");
    }
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);
