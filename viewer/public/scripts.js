
function handleFile() {
    var fileInput = document.getElementById("file-input");

    fileInput.addEventListener("change", function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var contents = e.target.result;
            console.info("File content:" + contents);
            editor1.session.setValue(contents);
        };

        reader.readAsText(file);
    });

    fileInput.click();
}

var mappingTemplates = [
    { name: "option one" },
    { name: "option two" },
    { name: "option one" },
];

function showSelectionDialog() {
    var modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = "";

    for (var i = 0; i < mappingTemplates.length; i++) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "option";
        checkbox.value = i;

        var label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(mappingTemplates[i].name));

        modalBody.appendChild(label);
        modalBody.appendChild(document.createElement("br"));
    }

    // Show the modal dialog
    $("#selectionModal").modal("show");
}

function getSelectedOptions() {
    var selectedOptions = document.querySelectorAll(
        "input[name=option]:checked"
    );
    var selectedIndices = Array.from(selectedOptions).map((option) =>
        parseInt(option.value)
    );

    console.log("Selected indices:", selectedIndices);

    // Hide the modal dialog
    $("#selectionModal").modal("hide");
}

const statusDiv = document.getElementById("status");
const statusText = document.getElementById("status-text");
var socket;

function connectWebSocket() {    

    socket = new WebSocket("ws://localhost:3000");

    console.info('Attempting to connect')
    socket.onopen = () => {
        console.log("Connected to server");
        statusDiv.classList.remove("red");
        statusDiv.classList.add("green");
        statusText.textContent = "Connected";
    };

    socket.onclose = function () {
        statusDiv.classList.remove("green");
        statusDiv.classList.add("red");
        statusText.textContent = "Disconnected (trying to reconnect)";
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
    };

    socket.onmessage = (event) => {
        const message = event.data;
        console.log("Received message:", message);
        const msgobject = JSON.parse(message);

        if (msgobject.responsetype === "output") {
            $("#outputtree").empty();
            const outputtree = jsonview.create(msgobject.payload);
            jsonview.render(outputtree, document.querySelector("#outputtree"));
            jsonview.expand(outputtree);
        } else if (msgobject.responsetype === "error") {
            $("#outputtree").empty();
            const outputtree = jsonview.create({ ERROR: msgobject.payload });
            jsonview.render(outputtree, document.querySelector("#outputtree"));
            jsonview.expand(outputtree);
        }
    };
}

function sendCommand() {
    const input = editor1.getSession().getValue();
    const msg = { command: "transform", payload: input };
    socket.send(JSON.stringify(msg));
    console.log("Sent message:", msg);
}



// Create Ace editors
var editor1 = ace.edit("editor1");
editor1.setTheme("ace/theme/chrome");
editor1.setOption("showInvisibles", true);
editor1.session.setMode("ace/mode/json");

outputtree = jsonview.create(undefined);
jsonview.render(outputtree, document.querySelector("#outputtree"));

editor1.setOptions({
    displayIndentGuides: true,
    fontSize: "14px",
    //wrap: true,
    scrollPastEnd: 0.5,
});

// Update editor height on window resize
window.addEventListener("resize", function () {
    editor1.resize();
});


connectWebSocket()