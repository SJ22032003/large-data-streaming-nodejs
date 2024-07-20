import express from "express";
import csvtojson from "csvtojson";
import byteSize from "byte-size";
import { stat } from "node:fs/promises"; 
import { createReadStream } from "node:fs";
import { Readable, Transform, Writable } from "node:stream";
import { TransformStream } from "node:stream/web";
import { setTimeout } from "node:timers/promises"

const app = express();

const fileName = "metadata.csv"; // FILE THAT BE USING | CAN BE OF ANY SIZE | ON ROOT DIRECTORY | CHANGE IT TO YOUR FILE

/**
 * HERE WE ARE CONVERTING CSV FILE TO JSON AND THEN MAPPING THE DATA TO A NEW JSON OBJECT
 * AND THEN STREAMING THE DATA TO THE CLIENT
*/

app.use(express.static("public"));

// GO TO / TO SEE THE FRONTEND
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/file-info", async (req, res) => {
  try {
    const { size } = await stat(fileName);
    return res.json({ size: byteSize(size).toString() });
  } catch (error) {
    return res.json({ size: null });
  }
})

app.get("/stream-data", async (req, res) => {
  try {

    let controller = new AbortController();
    req.on("close", () => {
      console.log("Client connection closed");
      controller.abort();
    });


    const csvToJsonTransform = csvtojson();

    await Readable.toWeb(createReadStream(fileName))
      .pipeThrough(Transform.toWeb(csvToJsonTransform))
      .pipeThrough(
        new TransformStream({
          async transform(chunk, controller) {
            const decodeChunk = JSON.parse(Buffer.from(chunk));

            // MAPPING THE DATA TO A NEW OBJECT | YOU CAN CHANGE IT TO YOUR OWN
            const mappedData = {
              url: decodeChunk.url,
              journal: decodeChunk.journal,
              authors: decodeChunk.authors,
              cord_uid: decodeChunk.cord_uid,
              license: decodeChunk.license,
            };

            await setTimeout(200); // SIMULATING A DELAY OTHERWISE IT WILL BE TOO FAST AND OUR UI WILL NOT BE ABLE TO HANDLE IT
            controller.enqueue(JSON.stringify(mappedData).concat("\n"));
          },
        })
      )
      .pipeTo(Writable.toWeb(res), { signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Stream aborted ");
      return;
    }
    console.log("something happened :( ", error);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
