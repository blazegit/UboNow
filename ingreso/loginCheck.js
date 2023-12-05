document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var messageDiv = document.getElementById('message');

        if (!username || !password) {
            messageDiv.innerText = 'Por favor, complete tanto el campo de usuario como el de contrase���a.';
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'login.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        if (!response.success) {
                            messageDiv.innerText = response.message;
                        } else {
                            window.location.href = "/";
                        }
                    } else {
                        messageDiv.innerText = "Usuario o contrase���a invalido/s | o cuenta no verificada";
                    }
                }
            };
            var data = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
            xhr.send(data);
        }
    });
});
