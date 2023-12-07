
// Fetch version from package.json
fetch('./package.json')
  .then(response => response.json())
  .then(data => {
    // Affichage de la version
    const versionElement = document.getElementById("version");
    versionElement.innerHTML = data.version;
  });