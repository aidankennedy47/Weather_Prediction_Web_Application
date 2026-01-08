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
      weatherData: null,
      city: "",
      dashSuggestionsList: [],
      predSuggestionsList: [],
      dashboardSuggestions: false,
      predictionSuggestions: false,
      suggestedCity: "",
      suggestedCityDash: ""
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
        this.searchCity(this.city);

        fetch(`/api/call?city=${this.city}`)
          .then((response) => response.json())
          .then((data) => {
            this.weatherData = data;
            console.log(data);
          })
          .catch((err) => console.error("Could not fetch weather API data:", err));
      });
  },

  methods: {
    autocompleteCity(instance, event) {
      const input = event.target.value;
      this.city = input;
      if (!input.trim()) {
        console.warn("Empty search bar");
        this.suggestions = [];
        this.dashboardSuggestions = false;
        this.predictionSuggestions = false;
        return;
      }

      fetch(`/api/autocomplete?q=${input}`)
        .then((response) => response.json())
        .then((data) => {
          if (instance === "dashboard") {
            this.dashSuggestionsList = data.suggestions;
            this.dashboardSuggestions = true;
            this.predictionSuggestions = false;
          } else {
            this.predSuggestionsList = data.suggestions;
            this.dashboardSuggestions = false;
            this.predictionSuggestions = true;
          }
          console.log(this.suggestions);
        })
        .catch((err) => {
          console.error("Autocomplete failed:", err);
          this.suggestions = [];
          this.dashboardSuggestions = false;
          this.predictionSuggestions = false;
        });
    },
    selectCity(cityName) {
      this.city = cityName;
      this.dashboardSuggestions = false;
      this.suggestedCityDash = cityName;
      this.searchCity(cityName);
    },
    updateFormLocation(city) {
      this.suggestedCity = city;
      this.predictionSuggestions = false;
    },
    searchCity(userCity) {
      let city = userCity;
      if (!userCity) {
        const searchBar = document.querySelector(".search-bar");
        // @ts-ignore
        if (searchBar) city = searchBar.value;
      }
      if (!city.trim()) {
        console.warn("Empty city");
        return;
      }

      fetch(`/api/call?city=${city}`)
        .then((response) => response.json())
        .then((data) => {
          this.weatherData = data;
          console.log(data);
        })
        .catch((err) => console.error("Could not fetch API data:", err));
    },
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
  },

  // Will display a different weather icon depending on the condition
  computed: {
    weatherIcons() {
      if (!this.weatherData) return "/img/cloud.png";
      const weatherType = this.weatherData.current.condition.text.toLowerCase();
      const icons = {
        'partly cloudy': '/img/partly_cloudy.png',
        sunny: '/img/simple-sun.png',
        overcast: '/img/cloud.png',
        'light rain': '/img/rain.png',
        'moderate rain': '/img/rain.png',
        'heavy rain': '/img/rain.png',
        clear: '/img/clear.png',
        cloudy: '/img/cloudy.png',
        mist: '/img/mist.png',
        'blowing snow': '/img/snow.png',
        'light snow': '/img/snow.png',
        'moderate snow': '/img/snow.png',
        'heavy snow': '/img/blizard.png',
        blizzard: '/img/blizzard.png',
        fog: '/img/mist.png'
      };

      for (const key in icons) {
        if (weatherType.includes(key)) {
          return icons[key];
        }
      }
      return '/img/cloud.png';
    }
  }
}).mount("#weather");
