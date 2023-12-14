

const logsElement = document.getElementById("solsysgen-logs");
const solSysGenversionElement = document.getElementById("solsysgen-version");
const solsysgenIframe = document.getElementById("solsysgen-iframe");

const solsysgenSource = "https://revilofr.github.io/solgen.html?nogui=true";

window.addEventListener('resize', function(event){
  solsysgenIframe.src = solsysgenSource;
});

// Fetch version from package.json
fetch('./package.json')
  .then(response => response.json())
  .then(data => {
    // Affichage de la version
    solSysGenversionElement.innerHTML = data.version;
  })
  .catch(error => console.error(error));

fetch('https://api.github.com/repos/revilofr/revilofr.github.io/commits')
  .then(response => response.json())
  .then(commits => {
    // Do something with the commits

    commits.slice(0, 5).forEach(commit => {
      // Create a new row for each commit
      const row = logsElement.insertRow();
      //add class commitElement
      row.classList.add("commitElement");

      // Create a cell for the commit date
      const dateCell = row.insertCell();
      dateCell.classList.add("commitDate");
      const date = new Date(commit.commit.author.date);
      const dateFormatted = date.toLocaleDateString('fr-FR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      dateCell.innerHTML = dateFormatted;

      // Create a cell for the commit message
      const messageCell = row.insertCell();
      messageCell.classList.add("commitMessage");
      messageCell.innerHTML = commit.commit.message;

      // Create a cell for the commit link
      const linkCell = row.insertCell();
      const linkElement = document.createElement("a");
      linkElement.href = commit.html_url;
      // Open the link of the commit in a new tab
      linkElement.target = "_blank";
      linkElement.innerHTML = "Voir le commit";
      linkCell.appendChild(linkElement);
    })
  })
  .catch((error) => {
    console.error(error);
    /* display no logs message */
    const row = logsElement.insertRow();
    const messageCell = row.insertCell();
    messageCell.colSpan = 3;
    messageCell.innerHTML = "No available git logs";

  })
  // once the commits are loaded, refresh the iframe
  .finally(() => {
    // refresh the iframe so that the iframe height is updated

    solsysgenIframe.src = solsysgenSource;
  });

  // fenêtre du navigateur change de largeur on rafraichit l'iframe




