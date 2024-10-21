const app = {
    submitIncident: function(title, description, image) {
        const url = 'https://ontym.infinityfreeapp.com/submit-incident.php'; // API URL
        const formData = new FormData();
        formData.append('title', title);         // Sending title
        formData.append('description', description); // Sending description
        formData.append('image', image);         // Sending image file

        fetch(url, {
            method: 'POST',
            body: formData // Send FormData directly
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                console.log('Incident submitted successfully:', data.incident.id, 'Image ID:', data.incident.image_id);
                app.loadIncidents(); // Reload incidents after submission
            } else {
                console.error('Error:', data.error); // Error from the server
            }
        })
        .catch(error => console.error('Error:', error)); // Log fetch error
    },

    loadIncidents: function() {
        const url = 'https://ontym.infinityfreeapp.com/wp-json/wp/v2/posts'; // API to get posts
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const incidentsContainer = document.getElementById('incidents');
                incidentsContainer.innerHTML = ''; // Clear previous incidents

                // Loop through each incident and display it
                data.forEach(post => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <h3>${post.title.rendered}</h3>
                        <div>${post.content.rendered}</div>
                        ${post.featured_media ? `<img src="${post.featured_media}" alt="${post.title.rendered}" />` : ''}
                    `;
                    incidentsContainer.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error loading incidents:', error)); // Log error if incidents cannot be loaded
    }
};

// Add the event listener for form submission
document.getElementById('incidentForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting the default way
    const title = document.getElementById('incidentType').value; // Get title from form input
    const description = document.getElementById('incidentDesc').value; // Get description from form input
    const image = document.getElementById('incidentImage').files[0]; // Get uploaded image file

    // Call the submitIncident function from the app object
    app.submitIncident(title, description, image);

    // Optionally, reset the form after submission
    this.reset();
});
