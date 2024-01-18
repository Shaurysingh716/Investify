function showModal(){
    document.querySelector('.sign-in-modal').classList.add('sign-in-add')
}
function removeModal(){
    document.querySelector('.sign-in-modal').classList.remove('sign-in-add')
}

function showOTPModal(){
    var otpDivModal = document.querySelector('.otp-div-modal');
    if (otpDivModal){
        otpDivModal.classList.add('show-otp-div-modal');
        document.querySelector('.sign-in-modal').classList.remove('sign-in-add');
    }
}
function removeOTPModal(){
    document.querySelector('.otp-div-modal').classList.remove('show-otp-div-modal');
}