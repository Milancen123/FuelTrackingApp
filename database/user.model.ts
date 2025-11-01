import { model, models, Schema } from "mongoose";

export interface IUser{
    name:string;
    username:string;
    email:string;
    image:string;
}


const UserSchema = new Schema({
    name: {type:String, required:true},
    username: {type:String, required:true},
    email:{type:String, required:true, unique:true},
    image: {type:String, required:true},
}, {
    timestamps:true
});

const User = models.User || model<IUser>("User", UserSchema);


export default User;