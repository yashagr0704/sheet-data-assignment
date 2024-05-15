import app from "../../config/firebase";
import {
   collection,
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const db = getFirestore(app);
export default async function addData(req, res) {
  console.log("Adding data");
  try {
  const dbRef = doc(db, `data`,req.body.Code);
  const docm = await getDoc(dbRef);
  console.log(docm.data());
   if (docm.exists()) {
    console.log(`Already data is present there with Code ${req.body.Code}`)
    return res.status(400).send(`Already data is present there with Code ${req.body.Code}`);
   }
   else{
    const firebase_data = {
          ...req.body,
         };
         const response = await setDoc(dbRef, firebase_data);
         console.log(`Successfully Added Product`);

        return res.status(200).json({
               msg: `Successfully Added Data`,
               data:req.body
             });
   }
  } catch (error) {
    console.log("Error while Added Product", error);
      return res.status(500).json({
        msg: `Error in Added Product`,
      });
  }


  
}
