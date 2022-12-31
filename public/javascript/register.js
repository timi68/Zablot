!(function (e) {
  "use strict";

  const password = e("#user-password");
  const passwordToggle = e(".password-toggle");
  const auth = e(".auth_form");
  const formGroup = e("#userGender");
  const options = e(".option");
  const formControl = e(".user-gender");
  const gender = e("#gender");

  passwordToggle.on("click", function passControl() {
    var typeArray = ["text", "password"];

    var activeType = password.attr("type");
    activeType = typeArray.filter((type) => type !== activeType);

    e(".password-toggle").toggleClass("show");
    password.attr("type", activeType).trigger("focus");
  });

  const setLoading = (/** @type {boolean} */ l) => {
    let target = e(".submit_btn");
    return target
      .prop("disabled", l)
      [`${l ? "add" : "remove"}Class`]("loading")
      .text(l ? "Processing..." : "Sign up");
  };

  auth.on("submit", async function Auth(event) {
    event.preventDefault();
    e(".form-group").removeClass("error");
    setLoading(true);

    var formData = {};
    var required = [];
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

      return setLoading(false);
    }

    var isPasswordValid = validatePassword(formData["userPassword"]);
    var isEmailValid = validateEmail(formData["userEmail"]);

    if (!isPasswordValid) e("#userPassword").addClass("error");
    if (!isEmailValid) e("#userEmail").addClass("error");

    if (!isPasswordValid || !isEmailValid) return setLoading(false);

    // submit form
    var options = {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const sendFormData = await fetch(`/api/auth/register/local`, options);
    const { success, message } = await sendFormData.json();

    if (!success) return setLoading(false), modal(message);

    await Promise.resolve(modal("Account Created Successfully.", success));
    location = "/dashboard";
  });

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

  formControl.on("click", () => formGroup.toggleClass("show"));

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
