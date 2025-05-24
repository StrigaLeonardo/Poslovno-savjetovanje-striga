(function () {
  emailjs.init("Sv43iccMpHvdhctGj");
})();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-button");
  const submissionError = document.getElementById("submission-error");

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
    return Math.ceil((rateLimitMinutes * 60 * 1000 - timePassed) / (60 * 1000));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");

    let isValid = true;

    [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
      input.style.borderColor = "";
      input.placeholder = "";
    });

    if (!nameInput.value.trim()) {
      nameInput.style.borderColor = "red";
      nameInput.placeholder = "Ime i Prezime je obavezno.";
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      emailInput.style.borderColor = "red";
      emailInput.placeholder = "Email adresa je obavezna.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.style.borderColor = "red";
      emailInput.placeholder = "Unesite važeću email adresu.";
      isValid = false;
    }

    if (!phoneInput.value.trim()) {
      phoneInput.style.borderColor = "red";
      phoneInput.placeholder = "Telefonski broj je obavezan.";
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      messageInput.style.borderColor = "red";
      messageInput.placeholder = "Poruka je obavezna.";
      isValid = false;
    }

    if (!isValid) {
      submissionError.textContent = "Molimo popunite sva obavezna polja.";
      submissionError.classList.add("show");
      return;
    } else {
      submissionError.classList.remove("show");
    }

    const lastSubmitted = getCookie("lastFormSubmit");
    const currentTime = new Date().getTime();

    if (lastSubmitted) {
      const remainingMinutes = calculateRemainingTime(Number(lastSubmitted));
      if (remainingMinutes > 0) {
        submissionError.textContent = `Spam limit: Pokušajte ponovo za ${remainingMinutes} min.`;
        submissionError.classList.add("show");

        form.reset();
        return;
      }
    }

    const userEmailParams = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      message: messageInput.value,
    };

    emailjs.sendForm("service_ais3k2r", "template_gbquibl", form).then(
      function () {
        submitButton.textContent = "Zaprimljeno";
        setTimeout(() => {
          submitButton.textContent = "Pošalji";
        }, 2000);

        form.reset();

        console.log(
          "Sending confirmation email with parameters:",
          userEmailParams
        );

        emailjs
          .send("service_ais3k2r", "template_5c2qqg7", userEmailParams)
          .then(
            function () {
              console.log("Confirmation email sent successfully to the user.");
            },
            function (error) {
              console.error(
                "Failed to send confirmation email to the user.",
                error
              );
            }
          );

        setCookie("lastFormSubmit", currentTime, rateLimitMinutes);
      },
      function (error) {
        console.error("Failed to send form data.", error);
        submissionError.textContent = "Greška prilikom slanja poruke.";
        submissionError.classList.add("show");
      }
    );
  });
});
