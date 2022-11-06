import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFileToStorage = (image) => {
  const promise = new Promise(async (resolve, reject) => {
    const imgFile = await (await fetch(image)).blob();
    const imagesRef = ref(storage, `mernappProfilepic/${imgFile._data.name}`);
    const uploadTask = uploadBytesResumable(imagesRef, imgFile);
    return uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });

  return promise;
};
