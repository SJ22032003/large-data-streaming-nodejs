let controller = new AbortController();

const outputContainer = document.getElementById("output");
const itemTracker = document.getElementById("items-fetched");

const fetchData = async (signal) => fetch("/stream-data", { signal });
const fetchFileInfo = async () => await fetch("/file-info").then(async (res) => await res.json());

(async function showFileInfo() {
    const { size } = await fetchFileInfo();
    if (!size) {
        document.getElementById("file-info-container").textContent = "File size not available, please select a file on the server";
        return;
    }
    document.getElementById("file-size-info").textContent = size;
})()

const getParsedDataReader = async (response) => {
  const reader = response.body
    .pipeThrough(new TextDecoderStream()) // Decode stream data into text
    .pipeThrough(parseJson()); // Parse JSON data from the stream

  return reader;
};

let counter = 0;
const createCardToUI = () => {
  return new WritableStream({
    write({ url, journal, authors, cord_uid, license }) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
              <h1>Article ${++counter}</h1>
              <h2>${journal}</h2>
              <p><strong>Authors:</strong> ${authors}</p>
              <p><strong>Cord UID:</strong> ${cord_uid}</p>
              <p><strong>License:</strong> ${license}</p>
              <a href="${url}" target="_blank">Read more</a>
            `;

      outputContainer.appendChild(card);
      outputContainer.scrollTop = outputContainer.scrollHeight;
      itemTracker.textContent = counter;
    },
    abort(reason) {
      console.log("Stream aborted ", reason);
    }
  });
};

async function startStream() {
  document.getElementById("startStream").disabled = true;
  document.getElementById("stopStream").disabled = false;

  try {
    const response = await fetchData(controller.signal);
    const reader = await getParsedDataReader(response);
    
    reader.pipeTo(createCardToUI(), { signal: controller.signal }); // Render data to the UI


  } catch (error) {

    console.error("Error fetching stream data:", error);
    document.getElementById("startStream").disabled = false;
    document.getElementById("stopStream").disabled = true;
  }
}

function stopStream() {
  controller.abort();

  document.getElementById("startStream").disabled = false;
  document.getElementById("stopStream").disabled = true;

  controller = new AbortController();
}

function parseJson() {
  return new TransformStream({
    transform(chunk, controller) {
      for (const data of chunk.split("\n")) {
        if (!data || data.length === 0) continue;
        try {
          controller.enqueue(JSON.parse(data));
        } catch (error) {
          console.error("Error parsing JSON data:", error);
        }
      }
    },
  });
}
