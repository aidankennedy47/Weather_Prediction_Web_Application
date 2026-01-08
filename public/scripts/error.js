document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const error = document.getElementById('loginError');
    const predictionForm = document.getElementById('predictionForm');
    const predictionError = document.getElementById('predictionError');
    const signupForm = document.getElementById('signupForm');
    const signupError = document.getElementById('signupError');

    // Animation that shakes the error message every time it occurs
    function shake(text) {

        const animation = [
            { transform: 'translateX(0px)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(8px)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(8px)' },
            { transform: 'translateX(0px)' }
        ];

        const timing = {
            duration: 800,
            iterations: 1
        };

        text.animate(animation, timing);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (page) => { // Triggers when submit button is pressed

            page.preventDefault(); // Stops page from reloading
            // @ts-ignore
            let formData = new FormData(loginForm); // Get form data from login form
            let email = formData.get('email');
            let password = formData.get('password');

            try {
                let getErrorMessage = await fetch('/login', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password }) // Get JSON file from login.js
                });

                let result = await getErrorMessage.json();

                if (getErrorMessage.ok) {
                    // There is no conflict, redirect to dashboard
                    window.location.href = result.redirect;
                } else {
                    // Show error message with animation
                    if (error) {
                        error.textContent = result.message;
                    }
                    shake(error);
                }
            } catch (err) {
                if (error) error.textContent = 'An error with the server occurred';

            }

        });
    }

    if (predictionForm) {
        predictionForm.addEventListener('submit', async (page) => {
            page.preventDefault(); // Stops page from reloading
            // @ts-ignore
            let formData = new FormData(predictionForm);
            let location = formData.get('location');
            let predictedType = formData.get('predictedType');
            let predictedDate = formData.get('predictedDate');
            let predictedValue = formData.get('predictedValue');
            let pointsBetted = formData.get('pointsBetted');

            try {
                let getErrorMessage = await fetch('/dashboard/submit', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        location,
                        predictedType,
                        predictedDate,
                        predictedValue,
                        pointsBetted
                    })
                });

                console.log('Response status:', getErrorMessage.status);
                let result = await getErrorMessage.json();
                console.log('Response JSON:', result);

                if (getErrorMessage.ok) {
                    window.location.href = '/dashboard'; // There is no conflict, redirect to dashboard
                } else {
                    // @ts-ignore
                    document.getElementById("predictionError").style.display = "inline";
                    // Show error message with animation
                    if (predictionError) predictionError.textContent = result.message;
                    shake(predictionError);
                }
            } catch (err) {
                if (predictionError) predictionError.textContent = 'An error with the server occurred';
                shake(predictionError);
                console.error(err);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (page) => {
            page.preventDefault(); // Stops page from reloading
            // @ts-ignore
            let formData = new FormData(signupForm);
            let firstName = formData.get('firstName');
            let lastName = formData.get('lastName');
            let username = formData.get('username');
            let email = formData.get('email');
            let password = formData.get('password');
            let country = formData.get('country');
            let location = formData.get('location');

            try {
                let getErrorMessage = await fetch('/signup/submit', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        username,
                        email,
                        password,
                        country,
                        location
                    })
                });

                console.log('Response status:', getErrorMessage.status);
                let result = await getErrorMessage.json();
                console.log('Response JSON:', result);

                if (getErrorMessage.ok) {
                    window.location.href = '/login'; // There is no conflict, redirect to login
                } else {
                    // Show error message with animation
                    if (signupError) signupError.textContent = result.message;
                    shake(signupError);
                }
            } catch (err) {
                if (signupError) signupError.textContent = 'An error with the server occurred';
                shake(signupError);
                console.error(err);
            }
        });
    }
});
