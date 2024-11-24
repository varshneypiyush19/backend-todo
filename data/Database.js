import mongoose from "mongoose";

export const ConnectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "backendAPI",
    })
    .then((c) => {
      console.log(`database connected with ${c.connection.host}`);
    })
    .catch((e) => console.log(e));
};
