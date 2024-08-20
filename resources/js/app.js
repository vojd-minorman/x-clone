//Deconnexion

// const { Console } = require("console");

document.addEventListener('DOMContentLoaded', function () {
  const logoutLink = document.getElementById('logout-link');
  const logoutForm = document.getElementById('logout-form');

  logoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      if (logoutForm) {
          logoutForm.submit();
      }
  });
});


//Changement de tab


document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.page-tab');

  tabs.forEach((tab, index) => {
      tab.addEventListener('click', function () {
          showTab(index);
      });
  });
});

function showTab(tabIndex) {
  const tabs = document.querySelectorAll('.page-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab, index) => {
      if (index === tabIndex) {
          tab.classList.add('page-tab-active');
          tab.classList.remove('page-tab-disabled');
      } else {
          tab.classList.add('page-tab-disabled');
          tab.classList.remove('page-tab-active');
      }
  });

  tabContents.forEach((content, index) => {
      if (index === tabIndex) {
          content.classList.add('active');
      } else {
          content.classList.remove('active');
      }
  });
}

/////////////////////////////////////
/// Gestion d'abonnement
///////////////////////////////////


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('follow-unfollow-form');
  const button = document.getElementById('follow-unfollow-button');
  const formAction = document.getElementById('form-action');


    async function followRel(event) {
      event.preventDefault();
      const action = formAction.value; // 'follow' ou 'unfollow'
      const url = formAction.value === 'follow' ? '/follow' : '/unfollow';

      try {
        const response = await fetch(url, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
          }
        });

        const result = await response.json();

        if (result.success) {
          if (action === 'follow') {
            button.innerText = 'Abonné';
            formAction.value = 'unfollow'; // Changer l'action du formulaire pour 'unfollow'
          } else {
            button.innerText = 'S\'abonner';
            formAction.value = 'follow'; // Changer l'action du formulaire pour 'follow'
          }
        } else {
          console.error('Error:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  form.addEventListener('submit', followRel);

});

/////////////////////////////////////////
//Formulaire pour publier un nouveau tweet
/////////////////////////////////////////

const tweetForm = document.querySelector(".tweet-editor-form");

const cloudName = "dlo6ktcil";
const presetName = "ml_default";

// const cloudName = "dzcuoxidd";
// const presetName = "mxvteo84";

// https://api.cloudinary.com/v1_1/<CLOUD_NAME>/image/upload

async function uploadImage(image) {
  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", presetName);
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return data.secure_url;
  } catch (error) {
    console.log("Le chargement de l'image a echoue");
  }
}

async function addTweet(tweet){
  try {
    const response = await fetch("/tweet", {
      method: "POST",
      body:JSON.stringify(tweet),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.success) {
      window.location.href = "/login"
    }

    console.log(response);
  } catch (error) {

  }
}

//Action pour le bouton d'ajout image

// document.getElementById('uploadButton').addEventListener('click', function() {
//   event.preventDefault
//   document.getElementById('fileInput').click();
// });

document.getElementById('fileInput').addEventListener('change', function() {
  const fileName = this.files[0].name;
  document.getElementById('uploadButton').textContent = fileName;
});



tweetForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const btnSubmit = event.target.querySelector("#btn-submit");
  // btnSubmit.disabled = true;

  const formData = new FormData(event.target);
  const urlToImage = await uploadImage(formData.get("tweet_image"));

  const data = Object.fromEntries(formData.entries());
  data.urlToImage = urlToImage;
  delete data.img;
  addTweet(tweet);
  // btnSubmit.disabled = false;
  event.target.reset();
  console.log(urlToImage);

});
