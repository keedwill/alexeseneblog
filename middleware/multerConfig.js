const multer = require('multer')

// Creation of a dictionary for the management of mime-types
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
}

// We create a configuration object for multer with two elements: destination & filename
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // 1st argument null to say that there was no error, images for the name of the folder where we want to store the images
    callback(null, 'images')
  },
  // we create a new file name to avoid that two files have the same name
  filename: (req, file, callback) => {
    // we recover the original name of the file, we eliminate the spaces (to avoid problems on the server side) which we replace with underscores
    const name = file.originalname.split(' ').join('_')
    // we get the name of the file without extension
    const nameNoExtension = name.split('.')[0]
    // we generate an extension to the file
    const extension = MIME_TYPES[file.mimetype]
    callback(null, nameNoExtension + Date.now() + '.' + extension)
  },
})

// We call the multer method with our storage object, we use the single method because it is a single file and not a group of files and we specify that it is an image file
module.exports = multer({ storage: storage }).single('image')
