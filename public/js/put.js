document.addEventListener("DOMContentLoaded", function() {
    const updateForm = document.getElementById('update-form');
  
    updateForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const userIdInput = document.getElementById('userId');
        const nameInput = document.getElementById('name');
        const usernameInput = document.getElementById('username');
  
        if (userIdInput && nameInput && usernameInput) {
            const userId = userIdInput.value;
            const name = nameInput.value;
            const username = usernameInput.value;

            console.log(`Enviando solicitud de actualización para ID: ${userId}, Nombre: ${name}, Username: ${username}`);
  
            // Realizar la solicitud de actualización al servidor
            fetch(`http://localhost:3000/CRUDRepo/ActualizarPersona/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, username })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                console.log('Respuesta del servidor:', data);
                // Utilizando SweetAlert2 para mostrar un mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: data.message
                }).then(() => {
                    // Opcional: Redireccionar a otra página, recargar la página, etc.
                    // window.location.href = "/crud/get.html"; // Ejemplo de redirección
                });
            })
            .catch(error => {
                console.error('Error al actualizar la persona:', error);
                // Utilizando SweetAlert2 para mostrar un mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'Ocurrió un error al intentar actualizar la persona'
                });
            });
        } else {
            console.error('No se pudo encontrar el elemento userId, name o username en el DOM');
            // Utilizando SweetAlert2 para mostrar un mensaje de error
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Ocurrió un error al intentar actualizar la persona'
            });
        }
    });
});
