document.addEventListener('DOMContentLoaded', function() {
  function showValidationMessage(input, message) {
    let container = input.closest('.input-container');
    let existingMessage = container.querySelector('.validation-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    let messageElement = document.createElement('div');
    messageElement.className = 'validation-message';
    messageElement.textContent = message;

    container.appendChild(messageElement);
    messageElement.style.display = 'block';
  }

  function hideValidationMessage(input) {
    let container = input.closest('.input-container');
    let message = container.querySelector('.validation-message');
    if (message) {
      message.remove();
    }
  }

  function showSuccessMessage() {
    var successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block";
  }

  function showErrorMessage() {
    var errorMessage = document.getElementById("errorMessage");
    errorMessage.style.display = "block";
  }

  function hideMessages() {
    var successMessage = document.getElementById("successMessage");
    var errorMessage = document.getElementById("errorMessage");
    successMessage.style.display = "none";
    errorMessage.style.display = "none";
    
    var validationMessages = document.querySelectorAll(".validation-message");
    validationMessages.forEach(function(message) {
      message.remove();
    });
  }

  function saveToLocalStorage() {
    const formData = {
      nombres: document.getElementById('nombres').value,
      apellidos: document.getElementById('apellidos').value,
      fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
      correo: document.getElementById('correo').value,
      telefono: document.getElementById('telefono').value,
      direccion: document.getElementById('direccion').value
    };

    // Obtener los datos actuales del localStorage
    let savedData = localStorage.getItem('formData');
    if (!savedData) {
      savedData = {};
    } else {
      savedData = JSON.parse(savedData);
    }

    // Actualizar los datos existentes con los nuevos datos del formulario
    Object.assign(savedData, formData);

    // Guardar en localStorage
    localStorage.setItem('formData', JSON.stringify(savedData));
  }

  function loadFromLocalStorage() {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      document.getElementById('nombres').value = formData.nombres || '';
      document.getElementById('apellidos').value = formData.apellidos || '';
      document.getElementById('fecha_nacimiento').value = formData.fecha_nacimiento || '';
      document.getElementById('correo').value = formData.correo || '';
      document.getElementById('telefono').value = formData.telefono || '';
      document.getElementById('direccion').value = formData.direccion || '';
    }
  }

  // Cargar datos guardados al cargar la página
  loadFromLocalStorage();

  // Guardar datos cuando se modifique cualquier campo
  const inputs = document.querySelectorAll('.controls');
  inputs.forEach(input => {
    input.addEventListener('input', saveToLocalStorage);
  });

  function validateForm() {
    var inputs = document.querySelectorAll(".controls");
    var allFilled = true;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phonePattern = /^[0-9]{10}$/;
    var namePattern = /^[a-zA-Z\s]+$/;
    var minYear = 2006;

    inputs.forEach(function(input) {
      hideValidationMessage(input);
      
      if (input.value.trim() === "") {
        showValidationMessage(input, "Rellene este campo.");
        allFilled = false;
      } else if (input.type === "email" && !emailPattern.test(input.value)) {
        showValidationMessage(input, "Introduzca un email válido.");
        allFilled = false;
      } else if (input.type === "tel" && !phonePattern.test(input.value)) {
        showValidationMessage(input, "Debe tener exactamente 10 dígitos.");
        allFilled = false;
      } else if ((input.id === "nombres" || input.id === "apellidos") && !namePattern.test(input.value)) {
        showValidationMessage(input, "Solo puede contener letras y espacios.");
        allFilled = false;
      } else if (input.type === "date" && new Date(input.value).getFullYear() > minYear) {
        showValidationMessage(input, "Debe ser anterior al año " + minYear + ".");
        allFilled = false;
      }
    });

    var termsCheckbox = document.getElementById("termsCheckbox");
    if (!termsCheckbox.checked) {
      showValidationMessage(termsCheckbox, "Debe aceptar los términos y condiciones.");
      allFilled = false;
    }

    if (allFilled) {
      saveToLocalStorage(); // Guardar datos si el formulario es válido
    }

    return allFilled;
  }

  document.getElementById("submitBtn").addEventListener("click", function(event) {
    event.preventDefault();
    hideMessages();
    
    if (validateForm()) {
      showSuccessMessage();
    } else {
      showErrorMessage();
    }
  });
});
