import fs from 'fs'
import * as fsExtra from "fs-extra";

// Update these to match your needs
const NUMBER_OF_IMAGES = 5010 // Your number of image and json files
const FILE_TYPE = "gif" // Your image type
const INCLUDE_INDEX = []
const EXCLUDE_INDEX = []
const PREMINT_AMOUNT = 350 // The amount you want to pre-mint

// DO NOT UPDATE THESE VARIABLES
const PREMINT_NUMBER = PREMINT_AMOUNT + EXCLUDE_INDEX.length
const REMAINING_INDEX = PREMINT_NUMBER - INCLUDE_INDEX.length + EXCLUDE_INDEX.length;

let imageDataObject = {
  filename: "",
  title: "",
}
let imageData = []

function createCSVFile() {
  const dataCSV = imageData.reduce((acc, data) => {
      acc += `${data.filename};${data.title};${data.Background || 'None'};${data.Body || 'None'};${data.Clothes || 'None'};${data.Beard || 'None'};${data.Eyes || 'None'};${data.Quirk || 'None'};${data.Glasses || 'None'};${data.Hat || 'None'};${data.Hair || 'None'};${data.Mouth || 'None'};${data.Flair || 'None'};${data.Bindle || 'None'};${data.nbCopies};${data.nbSelf}\n`; // Only modify data.Background, data.Body, etc to match your attribute set. DO NOT modify data.title, data.filename, data.nbCopies & data.nbSelf
      return acc;
    }, 
    `filename;title;Background;Body;Clothes;Beard;Eyes;Quirk;Glasses;Hat;Hair;Mouth;Flair;Bindle;nbCopies;nbSelf\n` // column names for csv. Do NOT change `filename;title;` or `nbCopies;nbSelf\n`. Only edit the attributes names
  );
  
  fs.writeFile('./output/_metadata.csv', dataCSV, function(err) {
    if (err) {
      console.log("Error: saving _metdata file")
      console.log(err)
      return
    }
    console.log('Saved _metadata.csv');
  });
}

function clearOutput() {
  console.log("Clearing output folder")

  fsExtra.emptyDirSync('./output/');

  console.log("Output folder cleared, continuing...")
}

function verifyFilesExist() {
  console.log("Verifying all files exist")

  for (let index = 0; index < NUMBER_OF_IMAGES; index++) {
    if (!fs.existsSync(`./input/${index}.${FILE_TYPE}`)) {
      console.log(`Error: ${index}.${FILE_TYPE} doesn't exists!`)
      return
    }
  
    if (!fs.existsSync(`./input/${index}.json`)) {
      console.log(`Error: ${index}.json doesn't exists!`)
      return
    }
  }

  console.log("All files present, continuing...")
}

function copyImageFiles() {
  console.log("Copying image files")

  for (let index = 0; index < NUMBER_OF_IMAGES; index++) {
    fs.copyFile(`./input/${index}.${FILE_TYPE}`, `./output/${index}.${FILE_TYPE}`, (err) => {
      if (err) {
        console.log("Error: copying files failed!")
        console.log(err)
        return
      }
    });
  }

  console.log("Copied all image files, continuing...")
}

async function processJsonFiles() {
  console.log("Processing JSON files")

  for (let index = 0; index < NUMBER_OF_IMAGES; index++) {
    let data = await fs.readFileSync(`./input/${index}.json`);
    data = JSON.parse(data)

    // Contruct new json
    let result = Object.assign({}, imageDataObject)

    // Define values
    result.filename = `${index}.${FILE_TYPE}`

    // Define attributes
    data.attributes.forEach(attr => {
      result[attr.trait_type] = attr.value
    })

    // Define number of copies
    result.nbCopies = 1

    result.nbSelf = 0

    if (INCLUDE_INDEX.some(item => item === index)) {
      result.nbSelf = 1
    }

    if (index <= REMAINING_INDEX) {
      result.nbSelf = 1
    }

    if (EXCLUDE_INDEX.some(item => item === index)) {
      result.nbSelf = 0
    }

    imageData.push(result)
  }

  if (imageData.length !== NUMBER_OF_IMAGES) {
    console.log("Error: Issue with the amount of generated nfts")
    return
  }


  console.log(imageData[0])
  console.log(`Total premintable`, imageData.filter(item => item.nbSelf === 1).length)
  console.log(`Total leftover:`, NUMBER_OF_IMAGES - imageData.filter(item => item.nbSelf === 1).length)
  console.log(`Total`, (NUMBER_OF_IMAGES - imageData.filter(item => item.nbSelf === 1).length) + imageData.filter(item => item.nbSelf === 1).length)
  console.log(`${imageData.length} JSON files processed, continuing...`)
}

async function main() {
  clearOutput()
  verifyFilesExist()
  copyImageFiles()
  await processJsonFiles()
  createCSVFile()
}

main();