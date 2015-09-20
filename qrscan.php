<?php

// Get the filename for the upload
$filename = $_FILES['file']['tmp_name'];

/*
 *  Compresses the provided file at "source" and saves it to the
 *  server at location "destination"
 */
function compress($source, $destination) {

    // Get the dimensions of the image
    list($img_in_width, $img_in_height) = getimagesize($source);

    // Define the output width
    $out_width = 200;
    
    // Define the height based on the aspect ratio
    $out_height = $out_width * $img_in_height / $img_in_width;

    // Create an output image
    $img_out = imagecreatetruecolor($out_width, $out_height);
    
    // Load the input image
    $img_in = imagecreatefromjpeg($source);
    
    // Copy the contents of the image to the output, resizing in the process
    imagecopyresampled($img_out, $img_in, 0, 0, 0, 0, $out_width, $out_height, $img_in_width, $img_in_height);
    
    // Save the file as a JPEG image to the destination
    imagejpeg($img_out, $destination);
}

// Define the core of the filename for the image
$base_filename = 'qrs/qr-' . time();

// Create a new filename variable with the final value
$new_filename = $base_filename;

// Loop while there is a file with this name
$ending = 0;
while(file_exists($new_filename)) {
    
    // Increment the ending value
    $ending++;
    
    // Append the number to the end of the file name
    $new_filename = $base_filename . '-' . $ending;
}

// Copy the file to the location
compress($filename, './' . $new_filename);

// Get the URL to the file
$image_url = 'http://noteventure.com/' . $new_filename;

// Define the API path for the QR code REST call
$redirect = 'http://api.qrserver.com/v1/read-qr-code/?fileurl=' . urlencode($image_url);

// Get the contents of the request as JSON
$results = json_decode(file_get_contents($redirect));

// Get the results of the request
$code = (array)$results[0];
$code = $code['symbol'];
$code = (array)$code[0];
$code = $code['data'];

// Redirect to the path provided in POST data
$redirpath = $_POST['redirpath'] . '?code=' . $code;
header('Location: ' . $redirpath);