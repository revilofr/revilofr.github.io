
// Fetch version from package.json
fetch('./package.json')
  .then(response => response.json())
  .then(data => {
    // Affichage de la version
    const versionElement = document.getElementById("version");
    versionElement.innerHTML = data.version;
  });


  fetch('https://api.github.com/repos/revilofr/revilofr.github.io/commits')
  .then(response => response.json())
  .then(commits => {
    // Do something with the commits
    const logsElement = document.getElementById("logs");
    commits.slice(0, 5).forEach(commit => {
      // Affichage des logs avec la classe gitlogElement
      const gitlogElement = document.createElement("li");
      gitlogElement.classList.add("gitlogElement");
      // Afficher la date du commit
      const dateElement = document.createElement("span");
      dateElement.classList.add("commitDate");
      //Formater la date
      const date = new Date(commit.commit.author.date);
      // format date YYYY.MM.DD HH:mm
      const dateFormatted = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      dateElement.innerHTML = dateFormatted;     

      gitlogElement.appendChild(dateElement);
      // Afficher le message du commit
      const messageElement = document.createElement("span");
      messageElement.classList.add("CommitMessage");
      messageElement.innerHTML = commit.commit.message;
      gitlogElement.appendChild(messageElement);
      // Afficher le lien vers le commit
      const linkElement = document.createElement("a");
      gitlogElement.appendChild(linkElement);
      logsElement.appendChild(gitlogElement);
    
    });
  })
  .catch(error => console.error(error));