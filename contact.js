(function () {
  emailjs.init("Sv43iccMpHvdhctGj");
})();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const sendIcon = document.getElementById("send-icon");
  const successIcon = document.getElementById("success-icon");
  const submissionError = document.getElementById("submission-error");

  sendIcon.style.display = "block";
  successIcon.style.display = "none";
  submissionError.style.display = "none";

  const rateLimitMinutes = 30;

  function setCookie(name, value, minutes) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  function calculateRemainingTime(lastSubmitted) {
    const currentTime = new Date().getTime();
    const timePassed = currentTime - lastSubmitted;
    const remainingTime = rateLimitMinutes * 60 * 1000 - timePassed;
    const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
    return remainingMinutes;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const lastSubmitted = getCookie("lastFormSubmit");
    const currentTime = new Date().getTime();

    if (lastSubmitted) {
      const remainingMinutes = calculateRemainingTime(Number(lastSubmitted));

      if (remainingMinutes > 0) {
        submissionError.textContent = `Pokušajte ponovo za ${remainingMinutes} minuta.`;
        submissionError.style.display = "block";
        form.reset();
        return;
      }
    } else {
      submissionError.style.display = "none";
    }

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const telephoneInput = document.getElementById("telephone");

    let errors = [];

    [nameInput, emailInput, messageInput, telephoneInput].forEach((input) => {
      input.style.borderColor = "";
      input.placeholder = "";
    });

    if (!nameInput.value.trim()) {
      errors.push("Ime i Prezime je obavezno.");
      nameInput.style.borderColor = "red";
      nameInput.placeholder = "Ime i Prezime je obavezno.";
    } else if (nameInput.value.length > 50) {
      errors.push("Ime ne može biti duže od 50 znakova.");
      nameInput.style.borderColor = "red";
      nameInput.placeholder = "Ime ne može biti duže od 50 znakova.";
    }

    if (!emailInput.value.trim()) {
      errors.push("Email adresa je obavezna.");
      emailInput.style.borderColor = "red";
      emailInput.placeholder = "Email adresa je obavezna.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      errors.push("Unesite važeću email adresu.");
      emailInput.style.borderColor = "red";
      emailInput.placeholder = "Unesite važeću email adresu.";
    }

    if (!messageInput.value.trim()) {
      errors.push("Poruka je obavezna.");
      messageInput.style.borderColor = "red";
      messageInput.placeholder = "Poruka je obavezna.";
    } else if (messageInput.value.length > 800) {
      errors.push("Poruka ne može biti duža od 800 znakova.");
      messageInput.style.borderColor = "red";
      messageInput.placeholder = "Poruka ne može biti duža od 800 znakova.";
    }

    if (!telephoneInput.value.trim()) {
      errors.push("Telefonski broj je obavezan.");
      telephoneInput.style.borderColor = "red";
      telephoneInput.placeholder = "Telefonski broj je obavezan.";
    }

    if (errors.length > 0) {
      return;
    }

    sendIcon.classList.add("scale-out-center");

    emailjs.sendForm("service_1bbnsrf", "template_gbquibl", form).then(
      function (response) {
        console.log("SUCCESS! Inquiry sent", response.status, response.text);

        setTimeout(() => {
          sendIcon.style.display = "none";
          successIcon.style.display = "block";
          successIcon.classList.add("scale-in-center");
        }, 500);

        const formData = new FormData(form);
        const userEmailParams = {
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          telephone: formData.get("telephone"),
        };

        form.reset();

        emailjs
          .send("service_1bbnsrf", "template_5c2qqg7", userEmailParams)
          .then(
            function (response) {
              console.log(
                "SUCCESS! Confirmation email sent",
                response.status,
                response.text
              );
              setCookie("lastFormSubmit", currentTime, rateLimitMinutes);
            },
            function (error) {
              console.error("FAILED to send confirmation email...", error);
            }
          );
      },
      function (error) {
        console.error("FAILED to send inquiry...", error);
      }
    );
  });
});
