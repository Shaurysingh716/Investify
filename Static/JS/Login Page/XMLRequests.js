// document.addEventListener("DOMContentLoaded",function(){
//     const form = document.getElementById('post-form-user-credentials');
//     const button = document.getElementById('post-form-credentials-btn');

//     button.addEventListener("click", function(){
//         const userCredentialFormData = new FormData(form);
//         fetch("/",{
//             method : 'POST',
//             body : userCredentialFormData
//         }).then((response)=>{
//             response.json()
//         }).then((response)=>{
//             console.log(response)
//         }).catch((err)=>{
//             console.log("Some Error Occured");
//         });
//     });
// });