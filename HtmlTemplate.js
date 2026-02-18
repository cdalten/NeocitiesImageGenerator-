//Written by Chad Altenburg
//Copyright 2025
//This is the Android html
//template generator used this to
//generate the image html page.


//WARNING. THIS PROGRAM DELETES
//PHOTOS FROM THE PHONE.

//I need to do this because Neocities
//doesn't allow dynamic pages. Also
//because Neocities doesn't support
//photoswipe
                                      
//I wrote the general algorithms.
//But I had AI fill in the specific
//details.

//Need to add desc to title.
//add alt desc. get image, prompt
//for data

//add option to dynamically add
//image url to page

//usage
//progname u 'username' 'password'
//Enter 0 if images need to be
//uploaded. Otherwise, enter number.
//of images on the Neocities server.

//Runs under nodejs on termux for
//Android. Need to run
//termux-setup-storage to access
//photos on camera.

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sharp = require('sharp');

//AI generated
function moveImageToWebDirectory(sourcePath, destinationPath) {
  try {
   fs.copyFileSync(sourcePath, destinationPath);
  //console.log('source.txt was copied to destination.txt');
  } catch (err) {
    console.error(err);
 }


}

function makeDirectory(directory){
  try {
    fs.mkdirSync(directory, { recursive: false });
    console.log('Directory created successfully!');
  } catch (err) {
    console.error('Error creating directory:', err);
  }
  return directory;
}

//AI generated
function writeToDirectory(filePath, content) {
  fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error writingfile:', err);
            return;
        }
        console.log('File written successfully!');
    });
}

//Not AI generated
function currentImageCount(currentCount, total){
  return '' + currentCount +'/'+ total;
}

//Not AI generated
function setJpgPath(jpgFiles,directoryPath, totalJpg) {
  const jpgFileNames = [];

  const relativePath = directoryPath;
  const absolutePath = path.resolve(__dirname, relativePath);

  for (i = 0; i < totalJpg; i++) {
   const jpgFileName = path.join(absolutePath, jpgFiles[i]);
   console.log('path ', jpgFileName);
   jpgFileNames.push(jpgFileName);

  }
  return jpgFileNames;
}

//Partially AI generated
function countJpgFilesInDirectory(directoryPath) {
 try {
    // Read the contents of the directory
  const files = fs.readdirSync(directoryPath);

    // Filter for files ending with .jpg(case-insensitive)
  const jpgFiles = files.filter(file => {
    return path.extname(file).toLowerCase() === '.jpg';
    });

    console.log(jpgFiles);
    let totalJpg = jpgFiles.length;
    let jpgFileNames = setJpgPath(jpgFiles, directoryPath, totalJpg);
    return jpgFileNames;
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    return 0; // Or handle the error asappropriate
  }
}


function login(userName, password) {
  console.log("Second argument:", userName);
  console.log("Third argument:", password);
  console.log("Logged in");

  var neocities = require('neocities');
  var api = new neocities(userName, password);

  return api;
}

//Copied from the Neocities API docs
function uploadFiles(api, fileName) {
  api.upload([
    {name: './' + fileName ,
    path: './' + fileName}
  ], function(resp) {
    console.log(resp)
  })

}

//Not AI generated
function setHrefLink(link) {
  return './' + link + '.html';
}

//Not AI generated
function setLink(link, end) {
  if (end == 1) {
   return '<a href></a>';
  }
  else if (link == 1) {
   return ` <div class = "nextLink"><a href = ${setHrefLink(link + 1)}>next&gt;&gt;</a></div>`;
  } else if (link == end) {
   return `<div class = "prevLink"><a href = ${setHrefLink(link - 1)}>&lt;&lt;prev</a></div>`;
  }
  else {
   return `<div class = "nextLink"><a href = ${setHrefLink(link + 1)}>next&gt;&gt;</a></div><div class = "prevLink"><a href = ${setHrefLink(link - 1)}>&lt;&lt;prev</a></div>`;
  }
}

//Not AI generated
function setJpg(imageName) {
  return `<img src = ` + './' + imageName + '.jpg' + `>`
}

//Not AI generated
function generateHtmlPage(currentPageCount, imageName, prevNextLink, total) {

  let fileContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>

    <link href="/style.css" rel="stylesheet" type="text/css" media="all">
  </head>
  <body>


<p>` + currentPageCount + `</p>
${setLink(prevNextLink, total)}<br>
<br>

<table>
<tr>
<td>
<p id=` +  imageName + `>${setJpg(imageName)}</p>
</td>
</tr>

<tr>
<td>
<p id = "message"></p>
</td>
</tr>

<tr>
<td>
<div class="commentbox"></div>
<script src="https://unpkg.com/commentbox.io/dist/commentBox.min.js"></scrip>
<script>commentBox('5671611076182016-proj')</script>
</td>
</tr>
</table>
<script type="module" src = "../imageHtml4.js?v=1.3"></script>
  </body>
</html>

`
;

  return fileContent;
}

async function compressImage(sourceFilePath, i, api){
  try {
    const compressedImageBuffer = await sharp(sourceFilePath)
      .jpeg({ quality: 75 })
      .rotate()
      .toFile(i);

    await api.upload([
    {name: './' + i ,
    path: './' + i}
    ], function(resp) {
    console.log(resp)
    })
    console.log(`Image synchronously saved`);
  } catch (error) {
    console.error('Error during synchronous image processing:', error);
  }


  try {
    fs.unlinkSync(sourceFilePath);
    console.log('File deleted successful');
  } catch (err) {
    console.error('An error occurred:');
  }

}

//If image is 1.jpg, create 1.html
//Then embed 1.jpg in 1.html.
//Keep doing this for n.jpg
function main() {
  const arg1 = process.argv[2];
  const arg2 = process.argv[3];
  const arg3 = process.argv[4];

  if(arg1 === 'u') {
    api = login(arg2, arg3);

  } else {
    console.log("Not logged in");
    process.exit(0);
  }

  //AI Generated
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the number of images. 0 if images in local dir: ', (numberOfImages) => {
    rl.question('Enter the directory for the html file: ', (directory) => {
    let directoryPath = makeDirectory(directory);
    let imagesInArray = countJpgFilesInDirectory('/sdcard/Download/' );

    console.log('images in array', imagesInArray);
    rl.close();

    if (numberOfImages < 0) {
      console.log('Invalid input');
      process.exit(0);
    }
    else if (numberOfImages == 0) {
      imageCount = imagesInArray.length;
    } else {
     imageCount = numberOfImages;
    }


    for(i = 1; i <= imageCount; i++) {
      const sourceFilePath = imagesInArray[i-1];
      targetDirectoryPath = './' + directoryPath + '/' + i + '.jpg';

      moveImageToWebDirectory(sourceFilePath, targetDirectoryPath);
      compressImage(sourceFilePath, targetDirectoryPath, api);
      const htmlFileName = path.join(directoryPath, i + '.html');

      console.log(imagesInArray[i - 1]);
      //Not AI generated
      let currentPageCount = currentImageCount(i, imageCount);

      console.log(htmlFileName);
      let fileContent = generateHtmlPage(currentPageCount, i, i, imageCount);
      writeToDirectory(htmlFileName, fileContent);

      uploadFiles(api, htmlFileName);
      //uploadFiles(api, targetDirectoryPath);

    }

    });
  });
}

main();
