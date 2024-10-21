<?php
// Enable error reporting for debugging (optional)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow CORS for all origins
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once 'https://ontym.infinityfreeapp.com/wp-load.php'; // path to access WordPress

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize input
    $title = sanitize_text_field($_POST['title']);
    $description = sanitize_textarea_field($_POST['description']);
    
    // Handle file upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = wp_upload_dir(); // Get WordPress upload directory
        $upload_path = $upload_dir['path'] . '/'; // Set the path to save the file
        $image_file = $_FILES['image'];
        
        // Generate a unique file name
        $filename = wp_unique_filename($upload_path, $image_file['name']);
        $file_path = $upload_path . $filename;

        // Move the uploaded file to the correct directory
        if (move_uploaded_file($image_file['tmp_name'], $file_path)) {
            // Create a new attachment for the uploaded image
            $attachment = [
                'guid'           => $upload_dir['url'] . '/' . $filename,
                'post_mime_type' => $image_file['type'],
                'post_title'     => sanitize_file_name($filename),
                'post_content'   => '',
                'post_status'    => 'inherit'
            ];
            $attach_id = wp_insert_attachment($attachment, $file_path);
            require_once ABSPATH . 'https://ontym.infinityfreeapp.com/wp-admin/includes/image.php';
            $attach_data = wp_generate_attachment_metadata($attach_id, $file_path);
            wp_update_attachment_metadata($attach_id, $attach_data);
        } else {
            echo json_encode(['status' => 'error', 'error' => 'File upload failed']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'error' => 'Image is required']);
        exit;
    }

    // Create a new post
    $post_data = [
        'post_title'   => $title,
        'post_content' => $description,
        'post_status'  => 'publish',
        'post_type'    => 'post', // Change this if using a custom post type
        'meta_input'   => [
            'image_id' => $attach_id, // Save the attachment ID as metadata
        ]
    ];
    $post_id = wp_insert_post($post_data);
    
    if ($post_id) {
        echo json_encode(['status' => 'ok', 'incident' => ['id' => $post_id, 'image_id' => $attach_id]]);
    } else {
        echo json_encode(['status' => 'error', 'error' => 'Failed to create incident']);
    }
} else {
    echo json_encode(['status' => 'error', 'error' => 'Invalid request']);
}
?>
