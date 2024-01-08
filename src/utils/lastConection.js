import userModel from "../models/users.model";

const user = await userModel.findById();
await userModel.updateLastConnection();


userModel.methods.updateLastConnection = async function () {
    this.last_connection = new Date();
    await this.save();
  };