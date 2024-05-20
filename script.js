
const button = document.getElementById("button");
const resultado = document.getElementById("resultado");
const otros = document.getElementById("otros")

let imgElement;

function loadModelAndClassify() {
    const fileInput = document.getElementById('input');
    const divResultados = document.getElementById("divResultados")
    imgElement = document.getElementById('img');

    // Cargar la imagen
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        const imgUrl = URL.createObjectURL(file);
        imgElement.src = imgUrl;
        button.disabled = false;
    })

    button.addEventListener("click", () => {
        otros.innerHTML = ""
        resultado.innerText = ""
        divResultados.classList.add("hidden")
        // Cambiar el contenido del boton
        button.innerHTML = `<svg class="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> Cargando...`;
        button.disabled = true

        // Clasificar la imagen una vez cargada
        mobilenet.load().then(model => {
           
            model.classify(imgElement).then(predictions => {
                divResultados.classList.remove("hidden")
                console.log(predictions);

                resultado.innerText = "Esta imagen es un: " + predictions[0].className + " con un " + (predictions[0].probability * 100).toFixed(2) + "% de probabilidad";

                predictions.forEach((prediction, index) => {
                    if (index !== 0) { // Omitir la primera predicción
                        const listItem = document.createElement("li");
                        listItem.innerText = "❌ " + prediction.className + " con un " + (prediction.probability * 100).toFixed(2) + "%";
                        otros.appendChild(listItem);
                    }
                });

                button.disabled = false
                button.innerHTML = "¿Qué es esta imagen?"
            }).catch(error => {
                console.error('Error al clasificar la imagen:', error);
            });
        }).catch(error => {
            console.error('Error al cargar el modelo:', error);
        });
    })
}

window.onload = function () {
    loadModelAndClassify();
}
