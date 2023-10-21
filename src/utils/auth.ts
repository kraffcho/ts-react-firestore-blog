import { getAuth, signOut } from "firebase/auth";

const handleLogout = (onSuccess: () => void, onError: (error: any) => void) => {
  const auth = getAuth();
  signOut(auth).then(onSuccess).catch(onError);
};

export { handleLogout };
