import { v1 as uuidv1 } from "uuid";
import { diskStorage } from "multer";
import multer, { memoryStorage } from "multer";
import { ref, uploadBytes, listAll, deleteObject } from "firebase/storage";
import storage from "../firestore/firebase.js";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};



const memoStorage = memoryStorage();
 const upload = multer({ memoStorage });

export const fileUpload = async (req, res) => {
  const file = req.file;
  const ext = MIME_TYPE_MAP[file.mimetype];
  const fileName = uuidv1() + "." + ext;
  console.log(fileName);
  const imageRef = ref(storage, fileName);
  const metatype = { contentType: file.mimetype, name: file.originalname };
  await uploadBytes(imageRef, file.buffer, metatype)
    .then((snapshot) => {})
    .catch((error) => console.log(error.message));
  return fileName;
};

export const fileDelete = async (req) => {
  console.log(req);
  const filePath = req;
  const deleteRef = ref(storage, filePath);
  await deleteObject(deleteRef).catch((error) => console.log(error.message));
};

// module.exports = fileUpload;

export default upload