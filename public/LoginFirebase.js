 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
 import { getDatabase,set,ref } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
   
   

 const firebaseConfig = {
   apiKey: "AIzaSyCoUfa97f_8YqFFB8NG-0KRd19EI4_vVeo",
   authDomain: "login-form-e80c6.firebaseapp.com",
   projectId: "login-form-e80c6",
   storageBucket: "login-form-e80c6.firebasestorage.app",
   messagingSenderId: "808054939300",
   appId: "1:808054939300:web:67b57324c9f40f3da8d031"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);

   
   

    
 const submit = document.getElementById('SignupBtn')
 const submit2 = document.getElementById('SigninBtn');

 submit.addEventListener("click",function(event){
   event.preventDefault()

 const name = document.getElementById('nameID').value;
 const email = document.getElementById('email').value;
 const password = document.getElementById('password').value;
  
  
createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
 // Signed up 
 const user = userCredential.user;
 alert("Creating Account.....")
 // ...
})
.catch((error) => {
 const errorCode = error.code;
 const errorMessage = error.message;
 alert(errorMessage)
 // ..
});

 })

 submit2.addEventListener("click",function(event){
   event.preventDefault()

 
 const email = document.getElementById('email').value;
 const password = document.getElementById('password').value;
  
  
 signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
 // Signed in 
 const user = userCredential.user;
window.location.href = "./to-doList.html";

 toggle();

 // ...
})
.catch((error) => {
 const errorCode = error.code;
 const errorMessage = error.message;
});
});