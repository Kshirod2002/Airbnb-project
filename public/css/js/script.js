(() => {
  'use strict'; // Enforces strict mode to catch common coding errors and improve security
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
       // Attach a 'submit' event listener to each form
      form.addEventListener('submit', event => {
        // Check if the form is valid based on Bootstrap's validation rules
        if (!form.checkValidity()) {
          event.preventDefault();// Stops the form from submitting
          event.stopPropagation(); // Stops the event from propagating further
        }
    // Add Bootstrap's 'was-validated' class to visually indicate validation
        form.classList.add('was-validated')
      }, false)
    });
  })();