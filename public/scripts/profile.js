
/* Set the width of the sidebar to 50vh */
// eslint-disable-next-line no-unused-vars
function openNav() {
  const sidebar = document.getElementById("mySidebar");
  if (sidebar) {
    sidebar.style.width = "50vh";
    sidebar.style.transition = "width 0.5s";
  }
}

/* Set the width of the sidebar to 0 */
// eslint-disable-next-line no-unused-vars
function closeNav() {
  const sidebar = document.getElementById("mySidebar");
  if (sidebar) {
    sidebar.style.width = "0";
    sidebar.style.transition = "width 0.5s";
  }
}

/**
 * @param {{ date: any; location: any; points: any; }} json
 */
function predictionFromJSON(json) {
  return `<td>${json.date}</td><td>${json.location}</td><td>${json.points}</td>`;
}

let pastPredictionData = [];

function pastPredictions() {
  const predictionList = document.getElementById("past-prediction-list");
  if (predictionList) {
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
        pastPredictionData = json.map((x) => ({
          date: x.predictedDate.substring(0,10), location: x.location, points: x.pointsAwarded
        }));
        predictionList.innerHTML = "";
        pastPredictionData.forEach((prediction) => {
          predictionList.innerHTML += `<tr class="prediction-entry" >${predictionFromJSON(prediction)}</tr>`;
        });
      }
    };

    req.open("GET", "/profile/history", true);
    req.send();
  }
}

// @ts-ignore
// eslint-disable-next-line no-undef
const { createApp } = Vue;

createApp({
  data() {
    // Initialising values to be used/displayed
    return {
      userID: "",
      username: "",
      points: 0,
      city: "",
      fname: "",
      lname: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  },

  mounted() {
    fetch("/session/user")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not Authenticated!");
        }
        return response.json();
      })
      // Getting user data from the login session
      .then((user) => {
        this.userID = user.userID;
        this.username = user.username;
        this.points = user.points;
        this.city = user.city;
        this.fname = user.fname;
        this.lname = user.lname;
        this.email = user.email;
      });

  },
  methods: {
    // Logs out user
    logout() {
      fetch("/login/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      }).then((response) => {
        if (response.ok) {
          window.location.href = "/"; // Go to login page
        } else {
          console.error("Logout failed");
        }
      });
    },

    async updateUsername() {
      try {
        const getResponse = await fetch("/profile/updateUsername", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: this.username, userID: this.userID })
        });

        if (getResponse.ok) {
          alert('Username updated successfully!');
          console.log("Updated database successfully");
        } else {
          alert('Username already exists!');
          console.log("Something went wrong");
        }
      } catch (err) {
        console.log("There was an error with the server1");
      }
    },

    async updateFname() {
      try {
        const getResponse = await fetch("/profile/updateFname", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fname: this.fname, userID: this.userID })
        });

        if (getResponse.ok) {

          alert('First name updated successfully!');
          console.log("Updated database successfully");
        } else {
          alert('Something went wrong!');
          console.log("Something went wrong");
        }
      } catch (err) {
        console.log("There was an error with the server2");
      }
    },

    async updateLname() {
      try {
        const getResponse = await fetch("/profile/updateLname", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lname: this.lname, userID: this.userID })
        });

        if (getResponse.ok) {
          alert('Last name Updated successfully!');
          console.log("Updated database successfully");
        } else {
          alert('Something went wrong!');
          console.log("Something went wrong");
        }
      } catch (err) {
        console.log("There was an error with the server3");
      }
    },

    async updatePassword() {

      try{
        const getResponse = await fetch("/profile/updatePassword", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword
          })
        });

        if(getResponse.ok) {
          alert('Password updated successfully!');
          console.log("Updated database successfully");
        } else {
          const error = await getResponse.text();
          alert("Error: " + error);
        }
      } catch (err) {
        console.log("There was an error with the server");
      }


    },

    async updateEmail() {
      try {
        const getResponse = await fetch("/profile/updateEmail", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, userID: this.userID })
        });

        if (getResponse.ok) {
          alert('Email updated successfully!!');
          console.log("Updated database successfully");
        } else {
          alert('Email already exists!');
          console.log("Something went wrong");
        }
      } catch (err) {
        console.log("There was an error with the server4");
      }
    },

    async deleteUser(){
      try{
        const checkIfDelete = window.confirm("Are you sure you want to delete your account? This action is irreversible!");

        if(!checkIfDelete) {
          return; // Cancels deletion
        }

        const getResponse = await fetch("/profile/deleteUser", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: this.userID })
        });

        if (getResponse.ok) {
          console.log("Deleted user successfully");
          window.location.href = "/login"; // Redirect to login page
        }
      } catch (err) {
        console.log("There was an error with the server");
      }
    }
  }
}).mount("#profile");


pastPredictions();
