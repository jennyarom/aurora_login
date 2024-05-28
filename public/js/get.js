document.addEventListener("DOMContentLoaded", function(){
    fetch('http://localhost:3000/CRUDRepo/ConsultarPersonas')
    .then(response => response.json())
    .then(data => mostrarData(data))
    .catch(error => console.log(error));

    function mostrarData(data) {
        let body = "";
        for(let i=0; i < data.length; i++){
            body += `<tr><td>${data[i].id}</td><td>${data[i].name}</td><td>${data[i].username}</td></tr>`;
        }
        document.getElementById('data').innerHTML = body;
        
    }
    console.log('data',data)
});
