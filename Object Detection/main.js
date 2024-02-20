//Handle Image Input
function handleImageInput(event){
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file){
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgMain = document.getElementById("canva-img");
            imgMain.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
}


//Compute Color for Labels
function computeColorforLabels(className){
    if(className=='person'){
        color=[85, 45, 255,200];
      }
      else if (className='cup'){
        color=[255, 111, 0, 200]
      }
      else if (className='cellphone'){
        color=[200, 204, 255, 200]
      }
      else{
        color=[0,255,0,200];
      }
      return color;
}




function drawBoundingBox(predictions, image){
    predictions.forEach(
        prediction => {
            const bbox = prediction.bbox;
            const x = bbox[0];
            const y = bbox[1];
            const width = bbox[2];
            const height = bbox[3];
            const className = prediction.class;
            const confScore = prediction.score;
            const color = computeColorforLabels(className)
            console.log(x, y, width, height, className, confScore);
            let point1 = new cv.Point(x, y);
            let point2 = new cv.Point(x+width, y+height);
            cv.rectangle(image, point1, point2, color, 2);
            const text = `${className} - ${Math.round(confScore*100)/100}`;
            const font =  cv.FONT_HERSHEY_TRIPLEX;
            const fontsize = 0.70;
            const thickness = 1;
            //Get the size of the text
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const textMetrics = context.measureText(text);
            const twidth = textMetrics.width;
            console.log("Text Width", twidth);
            cv.rectangle(image, new cv.Point(x, y-20), new cv.Point(x + twidth + 150,y), color, -1);
            cv.putText(image, text, new cv.Point(x, y-5), font, fontsize, new cv.Scalar(255, 255, 255, 255), thickness);
        }
    )
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



function openCvReady(){
    // this for write cv code
    cv["onRuntimeInitialized"]=()=>{

        console.log("OpenCV Ready")

        //read an image from the image source and convert to opencv format
        let imgMain = cv.imread("canva-img");//reading
        //let variable 
        cv.imshow("main-canva",imgMain); //displaying image inside the canvas
        //we need to delete the image to free the memmory   
        imgMain.delete();



        // ********* Image handling ***********
        document.getElementById("image_up").addEventListener("change",handleImageInput);





        //-------------- Now we want the html code in the js -------------
        //for the we using document
        //we are taking that getElementById("button_rgb") 
        //once it clicked we are operating the function


       /**** for rgb ***/
        document.getElementById("button_rgb").onclick = function(){

            let imgMain = cv.imread("canva-img");//reading
            cv.imshow("main-canva",imgMain); //displaying at the main_canva
            imgMain.delete();//we need to delete the image to free the memmory

        };


        /**** for gray ***/
        document.getElementById("button_contrast").onclick = function(){
            let imgMain = cv.imread("canva-img");//reading
            let imgGray=imgMain.clone();
            // here convert to grey
            cv.cvtColor(imgMain,imgGray,cv.COLOR_RGBA2GRAY,0)//channel in o/p have 0 for gray
            cv.imshow("main-canva",imgGray); //displaying at the main_canva
            imgMain.delete();//we need to delete the image to free the memmory
            imgGray.delete();

        };


        /**** For Edge ***/
        document.getElementById("button_edge").onclick = function(){
            let imgMain = cv.imread("canva-img");//reading
            let imgCanny=imgMain.clone();
            cv.Canny(imgMain,imgCanny,50,60)
            cv.imshow("main-canva",imgCanny); //displaying at the main_canva
            imgMain.delete();
            imgCanny.delete();//we need to delete the image to free the memmory

        };
        

        /**** for Opjet Detections ***/
        document.getElementById("button_blur").onclick = function(){
            console.log("Object Dection is ON")
            const image= document.getElementById("canva-img");
            let input_image= cv.imread(image);
            // Load the model.
            cocoSsd.load().then(model => {
                // detect objects in the image.
                model.detect(image).then(predictions => {
                  console.log('Predictions: ', predictions);
                  console.log("Length of Predictions", predictions.length)
                  if (predictions.length > 0){
                    drawBoundingBox(predictions, input_image);
                    cv.imshow("main-canva", input_image)
                    input_image.delete();               
                }
                else{
                    cv.imshow("main-canva", input_image);
                    input_image.delete();
                }

                });
              });

            
        };

        


    }
}

document.getElementById('download-btn').addEventListener('click', downloadImage);







