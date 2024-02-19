function bgrTohsr(image) {
    let matrix_img = new cv.Mat();
    cv.cvtColor(image, matrix_img, cv.COLOR_BGR2HSV);
    return matrix_img;
}

function logTrack(min_track) {
    console.log("Hue Min", min_track);
}

function downloadImage() {
    //Get the Canvas Element
    const canvas = document.getElementById('main-canva');

    //Create an Anchor Element to Trigger the Download
    const link = document.createElement('a');

    //Set the download attribute with a filename 
    link.download = 'color_detection.png';

    //Convert the Canvas Content to a data URL
    const dataURL = canvas.toDataURL();

    //Set the href attribute of the anchor with the Data URL
    link.href = dataURL;

    //Append the anchor to the document
    document.body.appendChild(link);

    //Trigger a Click on the anchor to start the download
    link.click();

    //Remove the anchor element from the document
    document.body.removeChild(link);
}

function openCvReady() {
    // this for write cv code
    cv["onRuntimeInitialized"] = () => {
        console.log("OpenCV Ready");

        //read an image from the image source and convert to opencv format
        let imgMain = cv.imread("image-main");//reading
        let imgHSV = bgrTohsr(imgMain);

        // Display the converted image on the canvas
        cv.imshow("main-canva", imgHSV);
    };
}

// Add event listener to the download button
document.getElementById('download-btn').addEventListener('click', downloadImage);
