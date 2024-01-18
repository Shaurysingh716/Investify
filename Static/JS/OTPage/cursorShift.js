const otpInputs = document.querySelectorAll(".otp-input");

// Add input event listeners to each OTP input
otpInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    // Get the value entered in the current input field
    const value = e.target.value;

    // If the value is a number and the field is not the last one
    if (!isNaN(value) && index < otpInputs.length - 1) {
      // Move the focus to the next input field
      otpInputs[index + 1].focus();
    }
  });
});