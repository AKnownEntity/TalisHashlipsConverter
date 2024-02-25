# Talis Converter

## Goal of this repo

This repository provides some code to help translate metadata from [Hashlips](https://github.com/HashLips) generated NFTs to the [Talis](https://injective.talis.art/) CSV format.
Talis uses an unusual way of uploading metadata, using a CSV file instead. See more here: [Talis Documentation](https://talis-protocol.notion.site/How-to-create-NFTs-on-Talis-art-1-19a1cb62bf1140daba036d12bdb5dcd6)

## Disclaimer

This code is not perfect and quickly put together for our mint, working specifically in our use case. You may need to modify it to match your own.
We will eventually update this if the ecosystem needs it in order to be more generic and handle multiple use cases. For now we are not intending on actively maintaining it and only sharing in case it helps others.

You will need some basic developement knowledge with Javascript in order to use this repo.

We are not responsible for any errors this may generate in your metadata. Always double check everything is correct after running the generation.

This code has been tested only on Windows.

## How to use
You will need Nodejs to use this repository. Download it from [the official website](https://nodejs.org/en).

You will need to run this command at the root of the repo in order to install dependencies:

```
npm i
```

Nodemon is installed for convinience if you wish to do some development, you can run it using:

```
npm dev
```

## Premint logic

Talis uses 2 ways to premint NFTs, either via their UI, or via the `nbSelf` value in their CSV file.
This script enables you to premint as many NFTs as you'd like using the `nbSelf` value. This means you can cherry-pick specific NFT numbers to mint.
You can also set a premint number which will premint the first X NFTs in the list starting from 0.

## Converting

### Step 1 - Import files

Import your Hashlips output files into the `/input` folder. You will need to import each image file & json.
These files should be named only using numbers in incremental order.

### Step 2 - Update variables

Inside of `index.js`, you will need to update multiple variables:

- l.5 => `NUMBER_OF_IMAGES`, set this to the total number of images in your input folder
- l.6 => `FILE_TYPE`, set this to your image file type (.jpg, .jpeg, .gif, etc)
- l.7 => `INCLUDE_INDEX`, this is an array of specific numbered NFTs (based on file names) you want to premint (for example: `[69, 420]`)
- l.8 => `EXCLUDE_INDEX`, this is to exclude specific numbered NFTs (based on file names) you do NOT want to premint using the next value
- l.9 => `PREMINT_AMOUNT`, this is the total amount of NFTs you would like to premint for the collection, starting from 0. `EXCLUDE_INDEX` will skip over these
- l.23 => Update your attribute values replacing `data.Background`, `data.Body` etc to match your attributes. You MUST respect the order they are in, additionally:
  - Do not touch the first 2 data values `${data.filename};${data.title};`
  - Do not touch the last 2 data values `${data.nbCopies};${data.nbSelf}\n`
  - `|| None` sets the value of the attribute to none if it doesn't have one in hashlips
- l.26 => Update the attribute values replacin `Background;Body` etc in the string. You must respect the same logic as above, e.g. NOT modifying `filename;title;` and `nbCopies;nbSelf\n` 

#### Premint logic

You have 100 NFTs and wish to premint 10, however you want to premint nft#1 to nft#10 and #100.
In this case you would set:

```
INCLUDE_INDEX = [100]
EXCLUDE_INDEX = [0]
PREMINT_AMOUNT = 10
```

This will skip the first NFT (0), set #1 - #10 as premint, and set #100 as premint as well.

### Step 3 - Run the generation

After all this, simply run this command in your console to generate the output folder:

```
node index.js
```

### Step 4 - Verify your output

Manually verify your output is correct. Verify the number of NFTs in the output folder, and the `matadata.json` file contain all of your metadata correctly. Cross-reference multiple NFTs to confirm, in various increments.

### Step 5 - Use your output folder

After verifying everything, you can use your output folder in the Talis upload process. Talis will have an additional step to verify your metadata.

