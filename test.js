// const http = require("http");
// const fs = require("fs");
// const path = require("path");
// const os = require("os");
// const ping = require("ping");

// function getLocalIP() {
//   const networkInterfaces = os.networkInterfaces();
//   for (let interfaceName in networkInterfaces) {
//     for (let interfaceInfo of networkInterfaces[interfaceName]) {
//       if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
//         return interfaceInfo.address;
//       }
//     }
//   }
// }

// function isValidIPv4(ip) {
//   const ipv4Pattern =
//     /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
//   return ipv4Pattern.test(ip);
// }
// async function resultArray(ip) {
//   try {
//     const result = await ping.promise.probe(ip);
//     return result.alive;
//   } catch (err) {
//     console.error("Error in ping:", err);
//     return false;
//   }
// }

// const server = http.createServer((req, res) => {
//   if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
//     const filePath = path.join(__dirname, "index.html");
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "text/plain" });
//         res.end("Internal Server Error");
//         return;
//       }
//       res.writeHead(200, { "Content-Type": "text/html" });
//       res.end(data);
//     });
//   } else if (req.method === "POST" && req.url === "/submit-ip") {
//     let body = "";

//     req.on("data", (chunk) => {
//       body += chunk;
//     });

//     req.on("end", async () => {
//       try {
//         console.log("Received IP:", JSON.parse(body));

//         // setInterval(async () => {
//         //   const isAlive = await resultArray(ip);
//         //   // console.log(
//         //   //   `Ping result for ${ip}: ${isAlive ? "Online" : "Offline"}`
//         //   // );
//         //   console.log(resultArray);
//         // }, 1000);

//         if (!isValidIPv4(ip)) {
//           console.error("Invalid IP address received:", ip);
//           res.writeHead(400, { "Content-Type": "application/json" });
//           res.end(JSON.stringify({ message: "Invalid IP address" }));
//           return;
//         }

//         // Check if the IP is alive
//         const isAlive = await resultArray(ip);
//         console.log(`Ping result for ${ip}: ${isAlive ? "Online" : "Offline"}`);

//         res.writeHead(200, { "Content-Type": "application/json" });
//         // res.end(JSON.stringify({ message: `IP ${ip} received successfully` }));
//       } catch (err) {
//         console.error("Error parsing request:", err);
//         res.writeHead(400, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ message: "Invalid request data" }));
//       }
//     });
//   } else {
//     res.writeHead(404, { "Content-Type": "text/plain" });
//     res.end("Not Found");
//   }
// });

// server.listen(3000, () => {
//   console.log("Server is running at http://" + getLocalIP() + ":3000");
// });

const temp = ['["box12"', '"box17"]'];
const arr = [];

temp.forEach((element, index) => {
  if (index === 0 || index === temp.length - 1) {
    arr.push(element.replace(/[\["\]]/g, "").trim());
  }
});

console.log("Cleaned Array:", arr);
// ****************inputfile**********************
const fileInput = document.getElementById("fileInput");
const fileInputBox = document.getElementById("fileInputBox");

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    fileInputBox.value = fileInput.files[0].name; // Set file name in the input box
  } else {
    fileInputBox.value = "No file chosen"; // Reset if no file is selected
  }
});
