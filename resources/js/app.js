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

///////////////////////////////////////////
/**************Nouveau Tweet**************/
///////////////////////////////////////////

const tweetForm = document.querySelector(".tweet-editor-form");
const imagePreview = document.getElementById("imagePreview");

/*** Cloudinary Informations ****/
const cloudName = "dlo6ktcil";
const presetName = "ml_default";

// Fonction pour uploader l'image à Cloudinary
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

    // Afficher l'image téléchargée
    imagePreview.src = data.secure_url;
    imagePreview.style.display = "block";
    console.log('La photo a été envoyé avec succès')
    return data.secure_url;
  } catch (error) {
    console.log("Le chargement de l'image a échoué");
    return null;
  }
}

async function addTweet(tweet) {
  try {
    const response = await fetch("/tweet", {
      method: "POST",
      body: JSON.stringify(tweet),
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      location.reload(); // Redirection après l'envoi
    } else {
      console.log("Erreur lors de l'envoi du tweet:", data.error);
    }
  } catch (error) {
    console.log("Erreur lors de l'envoi du tweet", error.message);
  }
}


// Gestion du changement d'image
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const imagePreview = document.getElementById('imagePreview');
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
  }
});

// Activation de l'input file quand on clique sur l'image preview
document.getElementById('imagePreview').addEventListener('click', function() {
  document.getElementById('fileInput').click();
});

// Gestion de l'envoi du formulaire
tweetForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const btnSubmit = event.target.querySelector("#btn-submit");
  btnSubmit.disabled = true;

  const formData = new FormData(event.target);
  const tweetImage = formData.get("tweet_image");
  let urlToImage = null;
  if (tweetImage && tweetImage.size > 0) {
    urlToImage = await uploadImage(tweetImage);
  }

  if (urlToImage) {
    formData.set("tweet_image", urlToImage); // Remplace le champ image par l'URL retournée par Cloudinary
  } else {
    formData.set("tweet_image", " "); // Renvoi une chaine vide
  }

  const data = Object.fromEntries(formData.entries());

  await addTweet(data);

  btnSubmit.disabled = false;
  event.target.reset();
});

