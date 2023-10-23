import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserRoles } from "./types";

const fetchUserRoles = async (): Promise<UserRoles> => {
  try {
    const rolesDocRef = doc(db, "userRoles", "roles");
    const rolesDocSnapshot = await getDoc(rolesDocRef);

    if (rolesDocSnapshot.exists()) {
      const data = rolesDocSnapshot.data();
      if (!data) throw new Error("Roles data is undefined");
      return data as UserRoles;
    } else {
      throw new Error("Roles document doesn't exist");
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export default fetchUserRoles;
