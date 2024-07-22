import { Text } from "@/components/Text";
import { Tab } from "@/components/Tabs";
import { useFirebase } from "@/hooks";
import {
  deleteUser,
  GithubAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithPopup,
  User,
} from "firebase/auth";
import { Button } from "@/components/Button";
import { deleteFiles } from "./StorageTab";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const AccountTab = () => {
  const { auth } = useFirebase();
  const navigate = useNavigate();
  const [buffer, setBuffer] = useState(false);

  const deleteAccount = async () => {
    setBuffer(true);

    await deleteFiles();
    await reauthenticateWithPopup(
      auth.currentUser as User,
      auth.currentUser?.providerData.at(0)?.providerId === "github.com"
        ? new GithubAuthProvider()
        : new GoogleAuthProvider()
    ).then(async () => {
      await deleteUser(auth.currentUser as User);

      setBuffer(false);

      navigate("/authenticate");
    });
  };

  const signOut = async () => {
    await auth.signOut();
    navigate("/authenticate");
  };

  return (
    <Tab index={1}>
      <div className="w-full flex flex-col justify-start items-start pt-6 gap-7">
        <div className="flex justify-between items-end w-full">
          <Text>profile image</Text>
          <img
            src={auth.currentUser?.photoURL as string}
            className="max-w-[3rem] sm:max-w-[4rem] rounded-lg"
          />
        </div>
        <div className="flex justify-between items-start w-full">
          <Text>name</Text>
          <Text>{auth.currentUser?.displayName?.toLowerCase()}</Text>
        </div>
        {auth.currentUser?.email ? (
          <div className="flex justify-between items-start w-full">
            <Text>email</Text>
            <Text>{auth.currentUser.email}</Text>
          </div>
        ) : null}
        <div className="flex justify-between items-start w-full">
          <Text>provider</Text>
          <Text>
            {auth.currentUser?.providerData.at(0)?.providerId.split(".").at(0)}
          </Text>
        </div>
        <div className="flex justify-between items-center w-full">
          <Text>sign out</Text>
          <Button
            color="text-red-500"
            bgColor="bg-red-100"
            onClick={async () => await signOut()}
          >
            sign out
          </Button>
        </div>
        <div className="flex justify-between items-center w-full">
          <Text>delete account</Text>
          <Button
            color="text-red-500"
            bgColor="bg-red-100"
            onClick={async () => await deleteAccount()}
            disabled={buffer}
          >
            delete account
          </Button>
        </div>
      </div>
    </Tab>
  );
};
