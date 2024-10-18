// Function to submit an incident
function submitIncident(type, description, image) {
    const url = 'http://ontym.infinityfreeapp.com/api/submit-incident.php'; // Adjust to your submit URL
    const newIncident = {
        title: type,
        content: description,
    };

    const formData = new FormData();
    formData.append('title', newIncident.title);
    formData.append('content', newIncident.content);
    if (image) {
        formData.append('image', image);
    }

    fetch(url, {
        method: 'POST',
        body: formData // Send the FormData directly
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Incident submitted successfully:', data.post_id);
            app.loadIncidents(); // Reload incidents after submitting
        } else {
            console.error('Error:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch incidents
function fetchIncidents() {
    const url = 'http://ontym.infinityfreeapp.com/api/get_recent_posts/'; // Your API endpoint to get posts

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
            incidentsList.innerHTML = ''; // Clear the loading message
            data.posts.forEach(incident => {
                var li = document.createElement('li');
                li.innerHTML = '<strong>' + incident.title + ':</strong> ' + incident.content;
                incidentsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Main app object
var app = {
    start: function() {
        this.bindEvents();
        this.loadIncidents();
    },

    bindEvents: function() {
        document.getElementById('incidentForm').addEventListener('submit', this.submitIncident.bind(this));
    },

    submitIncident: function(event) {
        event.preventDefault();
        alert("Submitted successfully");

        var type = document.getElementById('incidentType').value;
        var description = document.getElementById('incidentDesc').value;
        var image = document.getElementById('incidentImage').files[0];

        if (!description || !type) {
            alert('Please fill out all fields');
            return;
        }

        // Submit the incident
        submitIncident(type, description, image);
    },

    loadIncidents: function() {
        var incidentsList = document.getElementById('incidents');
        incidentsList.innerHTML = '<li>Loading incidents...</li>';
        fetchIncidents();
    }
};

// Start the app
app.start();