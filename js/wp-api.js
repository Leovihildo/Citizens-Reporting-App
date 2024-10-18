// Function to submit a new incident
function submitIncident(type, description, image) {
    const url = 'http://ontym.infinityfreeapp.com/submit-incident.php'; // The PHP endpoint for submitting incidents
    const formData = new FormData();

    formData.append('title', type);
    formData.append('content', description);
    
    if (image) {
        formData.append('image', image); // Append the image if available
    }

    fetch(url, {
        method: 'POST',
        body: formData // Send the form data containing title, description, and optional image
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Incident submitted successfully:', data.post_id);
            app.loadIncidents(); // Reload the incidents after submitting
        } else {
            console.error('Error:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch incidents from the WordPress REST API
function fetchIncidents() {
    const url = 'http://ontym.infinityfreeapp.com/wp-json/wp/v2/posts'; // REST API endpoint for posts

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Incidents:', data); // Handle the retrieved posts
            const incidentsList = document.getElementById('incidents');
            incidentsList.innerHTML = ''; // Clear the previous list

            data.forEach(incident => {
                var li = document.createElement('li');
                li.innerHTML = '<strong>' + incident.title.rendered + ':</strong> ' + incident.content.rendered;
                incidentsList.appendChild(li); // Append each incident to the list
            });
        })
        .catch(error => console.error('Error:', error));
}

// Main app object to initialize and handle events
var app = {
    start: function() {
        this.bindEvents();
        this.loadIncidents(); // Load the incidents when the app starts
    },

    bindEvents: function() {
        document.getElementById('incidentForm').addEventListener('submit', this.submitIncident.bind(this)); // Bind the form submission event
    },

    submitIncident: function(event) {
        event.preventDefault();

        var type = document.getElementById('incidentType').value;
        var description = document.getElementById('incidentDesc').value;
        var image = document.getElementById('incidentImage').files[0];

        if (!description || !type) {
            alert('Please fill out all fields');
            return;
        }

        // Submit the incident through the API
        submitIncident(type, description, image);
    },

    loadIncidents: function() {
        var incidentsList = document.getElementById('incidents');
        incidentsList.innerHTML = '<li>Loading incidents...</li>'; // Show a loading message

        fetchIncidents(); // Fetch incidents from WordPress
    }
};

// Initialize the app when the device is ready
document.addEventListener('deviceready', function() {
    app.start(); // Start the app when the device is ready
}, false);
