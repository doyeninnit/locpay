// // // models.ts
// // import mongoose from 'mongoose';

// // const userSchema = new mongoose.Schema({
// //     phoneNumber: { type: String, unique: true },
// //     walletAddress: String
// // });

// // export const User = mongoose.model('User', userSchema);
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   phoneNumber: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   walletAddress: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   privateKey: {
//     type: String,
//     required: true,
//     unique: true
//   }
// });

// export const User = mongoose.model('User', userSchema);


import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true
  },
  tillNumber: {
    type: String,
    required: true,
    unique: true
  },
  obfuscatedIdentifier: {
    type: String,
    required: true
  }
});

const Merchant = mongoose.model('Merchant', merchantSchema);

export default Merchant;
