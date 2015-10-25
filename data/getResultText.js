var textArea = document.getElementById("edit-box");

self.port.on("setResult", function (text) {
    textArea.value = text;
});

self.port.on("show", function onShow() {
  textArea.focus();
});
