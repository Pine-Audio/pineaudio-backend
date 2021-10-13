import { Schema, Model, model, CallbackError } from "mongoose"
import bcrypt from "bcrypt"
import HttpException from "../common/httpexception";

interface User {
    password: string,
    email: string,
    registered?: Date
}

var UserSchema = new Schema<User>({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    registered: Date,
});

UserSchema.pre('save', function (next) {
    var user = this;
    user.registered = new Date();

    // Encrypting the password so no plain-text password is stored anywhere
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        return next();
    });
});

UserSchema.statics.authenticate = function (email, pass) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: email }, (err: CallbackError, user: User) => {
            if (err || !user) {
                let error = new HttpException(401, 'User not found');
                return reject(error);
            }
            bcrypt.compare(pass, user.password, (err, result) => {
                if (result === true)
                    resolve(user);
                var error = new HttpException(401, 'Wrong password');
                return reject(error);
            });
        });
    });   
};

export const UserModel: Model<User> = model<User>('User', UserSchema)
export { User as IUser }