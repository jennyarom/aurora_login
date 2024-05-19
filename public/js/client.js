// Espera a que el documento HTML esté completamente cargado antes de ejecutar el código
$(document).ready(function() {

    // Asigna un evento de clic al elemento con id 'loginLink'
    $('#loginLink').click(function(event) {
        event.preventDefault(); // Previene el comportamiento por defecto del enlace
        // Redirige a la página de inicio de sesión
        window.location.href = '/login';
    });

    // Asigna un evento de clic al elemento con id 'registerLink'
    $('#registerLink').click(function(event) {
        event.preventDefault(); // Previene el comportamiento por defecto del enlace
        // Redirige a la página de registro
        window.location.href = '/register';
    });

    // Asigna un evento de envío al formulario con id 'loginForm'
    $('#loginForm').submit(function(event) {
        event.preventDefault();
        let username = $('#username').val();
        let password = $('#password').val();
    
        $.post('/login', { username: username, password: password }, function(response) {
            if (response.exists) {
                window.location.href = '/home';
            } else {
                Swal.fire('Usuario no encontrado', 'El usuario no existe o la contraseña es incorrecta.', 'error');
            }
        });
    });
    
    $('#registerForm').submit(function(event) {
        event.preventDefault();
        let name = $('#name').val();
        let username = $('#username').val();
        let password = $('#password').val();
        let confirmPassword = $('#confirmPassword').val();
    
        if (password !== confirmPassword) {
            Swal.fire('Contraseñas no coinciden', 'Las contraseñas no coinciden.', 'error');
            return;
        }
    
        $.ajax({
            url: '/register',
            type: 'POST',
            data: { name: name, username: username, password: password },
            success: function(response) {
                if (response.registered) {
                    Swal.fire('Registro exitoso', '¡Usuario registrado correctamente!', 'success').then(() => {
                        window.location.href = '/login';
                    });
                } else {
                    Swal.fire('Error', 'La creación del usuario falló.', 'error');
                }
            },
            error: function(xhr, status, error) {
                Swal.fire('Error', 'El usuario ya está registrado.', 'error');
            }
        });
    });
});