//Deconnexion

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

// // Abonnement

// document.addEventListener('DOMContentLoaded', () => {
//   const followForm = document.getElementById('follow-form');
//   const unfollowForm = document.getElementById('unfollow-form');

//   async function handleFormSubmit(event, formId, url) {
//     event.preventDefault();

//     const form = document.getElementById(formId);
//     const response = await fetch(url, {
//       method: 'POST',
//       body: new FormData(form),
//       headers: {
//         'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
//       }
//     });

//     const result = await response.json();

//     if (result.success) {
//       // Update DOM based on the result
//       if (formId === 'follow-form') {
//         // Hide follow form and show unfollow form
//         document.getElementById('follow-form').style.display = 'none';
//         document.getElementById('unfollow-form').style.display = 'block';
//         document.getElementById('unfollow-button').innerText = 'Abonné';
//       } else {
//         // Hide unfollow form and show follow form
//         document.getElementById('unfollow-form').style.display = 'none';
//         document.getElementById('follow-form').style.display = 'block';
//         document.getElementById('follow-button').innerText = 'S\'abonner';
//       }
//     } else {
//       console.error('Error:', result.message);
//     }
//   }

//   if (followForm) {
//     followForm.addEventListener('submit', (e) => handleFormSubmit(e, 'follow-form', '/follow'));
//   }

//   if (unfollowForm) {
//     unfollowForm.addEventListener('submit', (e) => handleFormSubmit(e, 'unfollow-form', '/unfollow'));
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('follow-unfollow-form');
  const button = document.getElementById('follow-unfollow-button');
  const formAction = document.getElementById('form-action');

  form.addEventListener('submit', async function (event) {
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
  });
});

