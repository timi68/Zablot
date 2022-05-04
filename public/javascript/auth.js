!(function (e) {
  "use strict";

  const password = e("#user-password");
  const pass_svg = e("#pass-svg");
  const auth = e(".auth_form");
  const formGroup = e("#userGender");
  const options = e(".option");
  const formControl = e(".user-gender");
  const gender = e("#gender");

  setTimeout(() => {
    e(".alert-success").detach();
  }, 5000);

  pass_svg.on("click", passControl);
  auth.on("submit", Auth);
  e(".backdrop").on("click", () => formGroup.removeClass("show"));

  options.each(function (index) {
    var value = e(this).data("value");
    e(this).on("click", () => {
      gender.prop("value", value);
      formGroup.removeClass("show");
      formControl.html(
        `<span style="font-weight: 500;color: rgba(0,0,0,.6)">${value}</span>`
      );
    });
  });

  formControl.on("click", () => {
    formGroup.toggleClass("show");
  });

  function passControl() {
    var srcArray = ["/svgs/password-off.svg", "/svgs/password.svg"];
    var typeArray = ["text", "password"];

    var activeSrc = e(this).attr("src");
    var activeType = password.attr("type");

    activeSrc = srcArray.filter((src) => src !== activeSrc);
    activeType = typeArray.filter((type) => type !== activeType);

    e(this).attr("src", activeSrc);
    password.attr("type", activeType).trigger("focus");
  }

  async function Auth(event) {
    event.preventDefault();
    e(".form-group").removeClass("error");
    e(".submit_btn").prop("disabled", true);

    var formData = {};
    var required = [];
    var name = e(this).data("name");
    const formArray = e(this).serializeArray();

    formArray.forEach((field, index) => {
      let key = field.name;
      let value = field.value;
      formData[key] = value;

      if (!value) required.push(key);
    });

    if (required.length) {
      required.forEach((key) => {
        e(`#${key}`).addClass("error");
      });

      e(".submit_btn").prop("disabled", false);
      return false;
    }

    // verify email and password
    var email = formData["userEmail"];
    var password = formData["userPassword"];

    var isPasswordValid =
      name === "register" ? validatePassword(password) : true;
    var isEmailValid = validateEmail(email);

    if (!isPasswordValid) e("#userPassword").addClass("error");
    if (!isEmailValid) e("#userEmail").addClass("error");

    if (!isPasswordValid || !isEmailValid)
      return e(".submit_btn").prop("disabled", false);

    // submit form

    const { success, message } = await Fetch(formData, name);

    if (!success)
      return e(".submit_btn").prop("disabled", false), modal(message);
    console.log({ name });
    if (name === "login") await modal(message, success);

    setTimeout(() => {
      location = name === "login" ? "/dashboard" : "/login";
    }, 1000);
  }

  // modal
  async function modal(message, success) {
    var cssClose = {
      fontSize: "1.6em",
      display: "inline-block",
      background: " #fff",
      border: "none",
      borderRadius: "50px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: "20px",
      width: "20px",
      color: "gray",
    };
    var css = {
      background: success ? "#1b7e1bab" : "#d32222",
      padding: "10px",
      borderRadius: "5px",
      color: "#fff",
      fontWeight: 500,
      textAlign: "center",
      position: "fixed",
      fontSize: ".8em",
      left: "50%",
      transform: "translateX(-50%)",
      top: "-100px",
      display: "flex",
      gap: "1em",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1000,
      width: "max-content",
    };

    var close = e("<button>", { class: "close-modal" })
      .css(cssClose)
      .html("&times;");
    var wrapper = e("<div>", { class: "error-wrapper .alert" })
      .css(css)
      .html(`<span>${message}</span>`);

    wrapper.append(
      close.on("click", () => {
        wrapper.fadeOut();
        setTimeout(() => {
          wrapper.detach();
        }, 1000);
      })
    );

    e("body").append(wrapper);
    wrapper.animate(
      {
        top: "20px",
      },
      "slow",
      function () {
        setTimeout(() => {
          wrapper
            .fadeOut()
            .delay(1000)
            .queue(function () {
              wrapper.detach();
            });
        }, 2000);
      }
    );

    return true;
  }

  // setting function sign user
  async function Fetch(formData, name) {
    try {
      var options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const sendFormData = await fetch(`/api/users/${name}`, options);

      var response = await sendFormData.json();
      return response;
    } catch (err) {
      console.log({ err });
    }
  }

  /**
   *
   * @param {string} password
   * @returns {boolean}
   */
  function validatePassword(password) {
    // requirements
    var isLength, isUppercase, isSymbol, isLowercase;

    // check length;
    isLength = password.length >= 8;

    // check for upperCase
    isUppercase = new RegExp(/[A-Z]/).test(password);

    // check for symbols
    isSymbol = new RegExp(/\W/).test(password);

    // check for lowerCase
    isLowercase = new RegExp(/[a-z]/).test(password);

    return isLength && isUppercase && isSymbol && isLowercase;
  }

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
})(jQuery);
