function activateLoad() {
    var loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";
    document.head.appendChild(script);
};

function deactivateLoad() {
  var loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block";
  document.head.appendChild(script);
};

document.addEventListener('DOMContentLoaded', function() {
  var loadingElement = document.getElementById("loading");
  if(loadingElement.style.display !== "none") return;
  loadingElement.style.display = "none";
})