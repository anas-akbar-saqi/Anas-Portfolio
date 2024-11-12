(function ($) {
  "use strict";
  
  // EmailJS initialization
  emailjs.init("aTU8Nc-jAP6ZnoP61"); // User ID
  
  $.fn.conformyEmailValidate = function () {
    var emailRegexp =
      /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegexp.test(String($(this).val()));
  };

  $.fn.conformyPhoneValidate = function () {
    var phoneRegexp =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneRegexp.test($(this).val());
  };

  $.fn.modalClose = function () {
    let thisModalTarget = $(this).attr("id"),
      $this = $(this);
    $(window).on("click", function (event) {
      if (event.target.id == thisModalTarget) {
        $this.removeClass("active");
      }
    });
  };

  var contactEmail = $("input[name=contact_email]");
  var contactPhone = $("input[name=contact_phone]");
  var formControl = $(".cf-form-control");

  // Real-time validation handlers
  contactEmail.on("keyup", function () {
    if ($(this).val().trim().length > 0) {
      if (!($(this).conformyEmailValidate() === true)) {
        contactEmail.parent().removeClass("success").addClass("error");
      } else {
        contactEmail.parent().removeClass("error").addClass("success");
      }
    } else {
      contactEmail.parent().removeAttr("class");
    }
  });

  contactPhone.on("keyup", function () {
    if ($(this).val().trim().length > 0) {
      if (!($(this).conformyPhoneValidate() === true)) {
        contactPhone.parent().removeClass("success").addClass("error");
      } else {
        contactPhone.parent().removeClass("error").addClass("success");
      }
    } else {
      contactPhone.parent().removeAttr("class");
      contactPhone.parent().addClass("error");
    }
  });

  // Dropdown validation for subject
  $("select[name=contact_subject]").on("change", function () {
    var item = $(this);
    var sNull = $('select[name="contact_subject"]').find("option").eq(0).val();
    if (item.val() == sNull) {
      $('select[name="contact_subject"]')
        .parent()
        .removeClass("success")
        .addClass("error");
    } else {
      $('select[name="contact_subject"]')
        .parent()
        .removeClass("error")
        .addClass("success");
    }
  });

  $(".cf-form-control:not('[name=contact_email],[name=contact_phone]')").on(
    "keyup",
    function () {
      if ($(this).val().trim().length > 0) {
        $(this).parent().removeClass("error").addClass("success");
      } else {
        $(this).parent().removeAttr("class");
        $(this).parent().addClass("error");
      }
    }
  );

  let textCaptcha = $("#txtCaptcha");
  let textCaptchaSpan = $("#txtCaptchaSpan");
  let textInput = $("#txtInput");

  function randomNumber() {
    let a = Math.ceil(Math.random() * 9) + "",
      b = Math.ceil(Math.random() * 9) + "",
      c = Math.ceil(Math.random() * 9) + "",
      d = Math.ceil(Math.random() * 9) + "",
      e = Math.ceil(Math.random() * 9) + "",
      code = a + b + c + d + e;
    textCaptcha.val(code);
    textCaptchaSpan.html(code);
  }
  randomNumber();

  function validateCaptcha() {
    let str1 = textCaptcha.val();
    let str2 = textInput.val();
    return str1 == str2;
  }

  textInput.on("keyup", function () {
    if (validateCaptcha() === true) {
      $(this).parent().removeClass("error").addClass("success");
    } else {
      $(this).parent().removeAttr("class").addClass("error");
    }
  });

  $("#send_message").on("click", function (event) {
    var $this = $("#contactForm");
    var contact_name = $this.find('input[name="contact_name"]').val().trim();
    var contact_email = $this.find('input[name="contact_email"]').val().trim();
    var contact_phone = $this.find('input[name="contact_phone"]').val().trim();
    var contact_subject = $this.find('select[name="contact_subject"]').val().trim();
    var contact_message = $this.find('textarea[name="contact_message"]').val().trim();
    var validateEmail = $this.find('input[name="contact_email"]').conformyEmailValidate();
    var validatePhone = $this.find('input[name="contact_phone"]').conformyPhoneValidate();
    var selectedNull = $this.find('select[name="contact_subject"]').find("option").eq(0).val();

    if (
      contact_name == "" ||
      contact_email == "" ||
      contact_phone == "" ||
      contact_message == "" ||
      textInput == "" ||
      contact_subject == selectedNull
    ) {
      $this.find("li").addClass("error");
      if ($("#empty-form").css("display") == "none") {
        $("#empty-form").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else if (!validateEmail) {
      $('input[name="contact_email"]').parent().removeClass("success").addClass("error");
      if ($("#email-invalid").css("display") == "none") {
        $("#email-invalid").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else if (contact_subject == selectedNull) {
      $('select[name="contact_subject"]').parent().removeClass("success").addClass("error");
      if ($("#subject-alert").css("display") == "none") {
        $("#subject-alert").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else if (!validatePhone) {
      $('input[name="contact_phone"]').parent().removeClass("success").addClass("error");
      if ($("#phone-invalid").css("display") == "none") {
        $("#phone-invalid").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else if (!validateCaptcha()) {
      $("#textInput").parent().find("span").removeClass("success").addClass("error");
      if ($("#security-alert").css("display") == "none") {
        $("#security-alert").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else {
      // EmailJS integration
      emailjs.send("service_6w2jc0n", "template_nsah1l5", {
        contact_name: contact_name,
        contact_email: contact_email,
        contact_phone: contact_phone,
        contact_subject: contact_subject,
        contact_message: contact_message,
      }).then(
        function(response) {
          console.log("SUCCESS!", response.status, response.text);
          $(".cf-form-control").parent().removeAttr("class");
          $("#contactForm")[0].reset();
          $("#success_mail").show().stop().slideDown().delay(3000).slideUp();
          randomNumber();
        },
        function(error) {
          console.log("FAILED...", error);
          $("#error_mail").find("p").html("An error occurred. Please try again.");
          $("#error_mail").stop().slideDown().delay(3000).slideUp();
        }
      );
    }
    event.preventDefault();
    return false;
  });
})(window.jQuery);
