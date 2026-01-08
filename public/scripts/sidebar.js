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

// @ts-ignore
// eslint-disable-next-line no-undef
const { createApp } = Vue;

createApp({
  data() {
    // Initialising values to be used/displayed
    return {
      username: "",
      points: 0,
      city: ""
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
        this.username = user.username;
        this.points = user.points;
        this.city = user.city;
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
    }
  }
}).mount("#app");
