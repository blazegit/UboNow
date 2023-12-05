document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirm-password').value;

        if (!isValidEmail(email)) {
            document.getElementById('message').innerText = 'Por favor, ingrese una dirección de correo electrónico válida de @pregrado.ubo.cl.';
        } else if (!isStrongPassword(password)) {
            document.getElementById('message').innerText = 'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un número.';
        } else if (password !== confirmPassword) {
            document.getElementById('message').innerText = 'Las contraseñas no coinciden. Por favor, vuelva a intentarlo.';
        } else {
            $.ajax({
                type: "POST",
                url: "register.php",
                data: { email: email, password: password },
                dataType: "json",
                success: function(response) {
                    if (!response.success) {
                        document.getElementById('message').innerText = response.message;
                    } else {
                        document.getElementById('message').innerHTML = '<span style="color: green;">¡Registrado con éxito! Por favor, verifica tu cuenta en tu correo electrónico.<br><br><span id="loadingAnimation">Redirigiendo a la pantalla de inicio de sesión</span></span>';
                        setTimeout(function(){
                            window.location.href = "/ingreso";
                        }, 6000);
                        
                        // Implementación de la animación de puntos suspensivos
                        let counter = 0;
                        setInterval(function() {
                            counter = (counter + 1) % 4;
                            document.getElementById('loadingAnimation').innerText = 'Redirigiendo a la pantalla de inicio de sesión' + '.'.repeat(counter);
                        }, 500); // Cambiar la animación cada 0.5 segundos

                    }
                },
                error: function() {
                    document.getElementById('message').innerText = "Error en el registro. Inténtalo de nuevo más tarde.";
                }
            });
        }
    });
});

function isValidEmail(email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@pregrado.ubo.cl$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    var strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return strongPassword.test(password);
}
