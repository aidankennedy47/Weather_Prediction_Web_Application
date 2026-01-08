
/**
 * @param {{ name: any; position: any; score: any; }} json
 */
function personFromJSON(json) {
  return `<td>${json.position}</td><td>${json.name}</td><td>${json.score}</td>`;
}

let leaderData = [];

function refreshLeaderboard() {
  const leaderList = document.getElementById("leader-list");
  if (leaderList) {
    // get data from database
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        let json = [];
        try {
          json = JSON.parse(req.response);
        } catch (_) {
          console.log("Error parsing json...");
        }
        leaderData = json.map((x, i) => ({
          position: i + 1, uuid: x.userID, score: x.points, name: x.username, fullname: x.firstName + " " + x.lastName
        }));
        leaderList.innerHTML = "";
        leaderData.sort((a, b) => a.position - b.position);
        leaderData.forEach((person) => {
          leaderList.innerHTML += `<tr class="leaderboard-entry" id="${person.name.replaceAll(/\s/g, "").toLowerCase()}" onclick="expandUser(${person.uuid})">${personFromJSON(person)}</tr>`;
        });
      }
    };

    req.open("GET", "/leaderboard/data", true);
    req.send();
  }
}

/**
 * @param {number} uuid
 */
// eslint-disable-next-line no-unused-vars
function expandUser(uuid) {
  const infoDiv = document.getElementById("expanded-user-info");
  if (infoDiv) {
    // Make a db call to get extra info
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      const raw = req.response;
      if (req.readyState === 4 && req.status === 200) {
        let expandedData = {
          extraFields: {
            profile_picture_URL: "/img/default.png",
            country: "Australia"
          },
          predCount: {
            "COUNT(userID)": 1
          }
        };
        try {
          expandedData = JSON.parse(raw);
        } catch (_) {
          console.error("Error parsing JSON response... (womp womp)");
        }
        const person = leaderData.filter((x) => x.uuid === uuid)[0];

        infoDiv.getElementsByTagName("h2")[0].textContent = `#${person.position}`;
        infoDiv.getElementsByTagName("h3")[0].textContent = person.fullname;
        const profileURL = expandedData.extraFields.profile_picture_URL;
        if (profileURL) {
          infoDiv.getElementsByTagName("img")[0].src = profileURL;
        } else {
          infoDiv.getElementsByTagName("img")[0].src = "/img/default.png";
        }

        const extraInfoDiv = infoDiv.getElementsByTagName("div");
        if (extraInfoDiv[0]) {
          extraInfoDiv[0].innerHTML = `<div class="key-value"><p class="key">Country:</p><p class ="value">${expandedData.extraFields.country}</p><p class="key">Total predictions:</p><p class="value">${expandedData.predCount["COUNT(userID)"]}</p><p class="key">Average points/prediction:</p><p class="value">${person.score / expandedData.predCount["COUNT(userID)"]}</p></div>`;
        }

        infoDiv.classList.remove("collapse");
        infoDiv.classList.add("expand");
      }
    };

    req.open("GET", "/leaderboard/expand/?uuid=" + uuid, true);
    req.send();

  }
}

// eslint-disable-next-line no-unused-vars
function collapseUser() {
  const infoDiv = document.getElementById("expanded-user-info");
  if (infoDiv) {
    infoDiv.classList.remove("expand");
    infoDiv.classList.add("collapse");
  }
}

const searchForm = document.getElementById("top-buttons");
if (searchForm) {
  searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    // @ts-ignore
    const searchValue = event.target.search.value.replaceAll(/\s/g, "").toLowerCase();
    const person = document.getElementById(searchValue);
    if (person) {
      person.scrollIntoView({ behavior: "smooth", block: "start" });
      person.classList.add("flash");
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 2000));
      person.classList.remove("flash");
    }
  });
}

// eslint-disable-next-line no-unused-vars
function jumpTop() {
  // @ts-ignore
  document.getElementById("leader-list").children[0].scrollIntoView({ behavior: "smooth", block: "start" });
}

refreshLeaderboard();
