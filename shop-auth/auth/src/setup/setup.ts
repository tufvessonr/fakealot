import { CONFIG } from "../config";
import { User } from "../models/user";

export const initAuthService = async () =>{
  let admin = await User.findOne({ email: CONFIG.ADMIN_USER, admin: true });
  if (!admin) {
    const user = User.build({ email: CONFIG.ADMIN_USER, password: CONFIG.ADMIN_PASS, admin: true });  
    admin = await user.save();
  }

  console.log(`Admin exists: ${admin.id !== undefined}`);
  
}