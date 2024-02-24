import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,

    },
});

export default mongoose.model('User', UserSchema);
