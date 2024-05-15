import app from "../../config/firebase";
import {
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore(app);
export default async function getData(req, res) {
  console.log("Fetching all Products");
  try {
    const dbRef = collection(db, `data`);

    const resp = await getDocs(dbRef);

    console.log("Recieved all products");
    const sheetData = resp.docs.map((entry) => ({
      ...entry.data(),
    }));

    return res.status(200).json({
      msg: `Successfully Fetched Products`,
      data: sheetData,
    });
  } catch (error) {
    console.log(error);
    console.log("Error while fetching products!");
    return res.status(500).json({
      msg: "Error while fetching products!",
    });
  }
}
