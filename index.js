const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const ping = require("ping");
const { isIPv4 } = require("net");
const io = require("socket.io");
const { Socket } = require("dgram");

function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (let interfaceName in networkInterfaces) {
    for (let interfaceInfo of networkInterfaces[interfaceName]) {
      if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
        return interfaceInfo.address;
      }
    }
  }
}

function isValidIPv4(ip) {
  const regex =
    /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  return regex.test(ip);
}

async function checkPing(ip) {
  try {
    const result = await ping.promise.probe(ip);
    const isalive = result.alive;
    return isalive;
  } catch (err) {
    console.error("Error in ping:", err);
    return false;
  }
}

async function getPingStatuses(ipList) {
  const promises = ipList.map(async (item) => {
    const isAlive = await checkPing(item.inputValue);
    return { ...item, status: isAlive };
  });
  return Promise.all(promises);
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.method === "POST" && req.url === "/submit-ip") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const parsedData = JSON.parse(body);
        // console.log(parsedData);
        var IpValidArray = [];

        for (var element of parsedData) {
          let temp = element.inputValue;

          if (!isValidIPv4(temp)) {
            IpValidArray.push(0);
          } else if (isValidIPv4(temp)) {
            IpValidArray.push(1);
          }
        }

        if (IpValidArray.includes(0)) {
          const invalidEntries = parsedData
            .filter((entry) => !isValidIPv4(entry.inputValue))
            .map((entry) => entry.inputId);
          console.log("Invalid Ip's at:", invalidEntries);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify(invalidEntries));
        } else {
          (async () => {
            try {
              let results = "";

              results = await getPingStatuses(parsedData);

              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify(results));
            } catch (error) {
              console.error("Error:", error);
            }
          })();
        }
      } catch (err) {
        console.error("Error parsing request:", err);
      }
    });
  } else {
  }
});

server.listen(3020, () => {
  console.log("Server is running at http://" + getLocalIP() + ":3020");
});
