const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImagePath: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: String,
      default: "",
    },
    // will be removed latter or update///////////////////////////////////////////
    tripList: {
      type: Array,
      default: [],
    },
    wishList: {
      type: Array,
      default: [],
    },
    propertyList: {
      type: Array,
      default: [],
    },
    isSupportStaff: {
      type: Boolean,
      default: false,
    },
    reservationList: {
      type: Array,
      default: [],
    }
    ////////////////////////////////////////////////////////////////////////////////////
  },
  { timestamps: true }
)

const User = mongoose.model("User", UserSchema)
module.exports = User