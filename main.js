
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AlzaSyAlyR3VMDTHyVgXRNYHnLgT20vfxSGf60",
  authDomain: "xoltial.firebaseapp.com",
  projectId: "xoltial",
  storageBucket: "xoltial.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.recaptchaVerifier = new RecaptchaVerifier('sendOtp', {
  size: 'invisible',
  callback: () => {}
}, auth);

document.getElementById("sendOtp").onclick = () => {
  const phone = document.getElementById("phoneInput").value;
  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
    .then(confirmationResult => {
      window.confirmationResult = confirmationResult;
      document.getElementById("otpDiv").style.display = "block";
    });
};

document.getElementById("verifyOtp").onclick = () => {
  const otp = document.getElementById("otpInput").value;
  window.confirmationResult.confirm(otp).then(async result => {
    await loginSuccess(result.user);
  });
};

document.getElementById("googleLogin").onclick = () => {
  signInWithPopup(auth, new GoogleAuthProvider()).then(result => {
    loginSuccess(result.user);
  });
};

async function loginSuccess(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) await setDoc(ref, { paid: false });
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("paymentSection").style.display = "block";

  const userData = (await getDoc(ref)).data();
  if (userData.paid) {
    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("downloadSection").style.display = "block";
  }
}

window.pay = async (amount) => {
  alert(`Simulated payment of $${amount}. Marking as paid.`);
  const user = auth.currentUser;
  await setDoc(doc(db, "users", user.uid), { paid: true });
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("downloadSection").style.display = "block";
};
