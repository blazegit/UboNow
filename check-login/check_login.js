    var userId;
    function checkLoginStatus() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var userData = JSON.parse(this.responseText);
                if (userData.loggedin) {
                    // User is logged in, retrieve user data
                    userId = userData.user_id;
                    var username = userData.username;
                    // Use userId and username as needed
                    console.log("User ID: " + userId);
                    console.log("Username: " + username);
                    
                    
                    var usuario = username.substring(0, username.indexOf("@")); // Extract the part of the email before the @ symbol
                    
                    var greeting = document.getElementById('greeting');
                    if (greeting) {
                        greeting.textContent = `Hola, ${usuario}!`;
                    }

                } else {
                    // User is not logged in, redirect to the login page
                    window.location.href = "/ingreso"; // Change 'login.php' to your login page
                }
            }
        };
        xhttp.open("GET", "/check-login/check_login.php", true); // Change 'check_login.php' to your PHP script that checks login status and retrieves user data
        xhttp.send();
    }

    // Call the function to check login status when the page loads
    window.onload = function() {
        checkLoginStatus();
    };

