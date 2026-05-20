import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Police from "../models/Police.js";
import Admin from "../models/Admin.js";
import axios from "axios";
const secret = process.env.JWT_SECRET||"kalpana75";

export const loginControl= async (req, res) =>
 {
    const { email, password, role } = req.body;
  
    try {
      let foundUser;
  
      if (role === "User") {
        foundUser = await User.findOne({ email });
      } else if (role === "Police") {
        foundUser = await Police.findOne({ email });
      }
      else if(role === "Admin")
{
    foundUser = await Admin.findOne({ email });

    if (!foundUser) {
        return res.status(401).json({
            message: "Admin not found"
        });
    }

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(
        password,
        foundUser.password
    );

    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    // SCAN FINGERPRINT
    const scanRes = await axios.get(
        "http://localhost:5298/fingerprint/scan"
    );

    const newTemplate =
        scanRes.data.template;

    // YOUR HARD CODED FINGERPRINT
    const storedTemplate = "TF1TUzIxAAAFHh4ECAUHCc7QAAApH3YBAABchcMxaB63AH5kXgABAHB6jQAJAXhkXAAYH4Nk5gDNANhklh5rAJBk0wDYAaB63QCHABdkVQBTHpJkGgAWAZwo3h5oAB1k2gCEATN6PwBOAU1kvABgH0VQZQBqAYFkGh+UAJcnDQGKASpMjgDyABFkawDFHpJkhQCHAEBkPB6+APZkIAAbAGIhHADuAOctvwBlHohkugA2AWFk3R52AJxknwCXABh65gBzAJ1kbwBSH6ZIFgAqARYipB5lASoymwDxAJ9/GwBUAc8dsQD2HnJkoACuANNXpB6LAJBkOgBnAPJ6twB5AJld/QCEHvZkhQBDAd1kZh5cAAlkRQCmAHN6HwAjAdcwRABeHy5GLQBhAD8PHR/TAJ1TQwCMAAYBgAAyAIxk6QBiH88gZQn/aRL56OeTgauBzWr0+q8aqA4a4lJvroHqkB4Lrf3Fd0QLOx8XcV8nIXz4fi/i5HgpBV0OmIR0l+92rYCBgGcI34sHkbuRjoBrgUoWGRe1AQot8AEvCtb4L/+D/7aD2ufyj9+PtZooo6ONlH6nBvt6xPfL6rP+TQOSgSOSZJ73cl8SYYAbkt4PfILl+gn7L3G7HzP9rYDZANiE3JK4jx6EWQBEgDyUMHyuBVZ6Vf9wY+sHMYTi/BPqbA0jfDYJ1QNrhWvhDGcu/L8BVIYrlxKQ1ft1D2cByB1LAKuFTQsj/X8UW4DKAD79dOqzy39zfYLylMsKiGDIdwZsDAeYgOoWre8ZGr7sTIZj5rsFa4GrC06LuJHfCJb++ffj+hNtVAOOgLeOOq384fb2ASBBAcetIeYPAJkkHsE6W2jf/3YLAMEs21nF3sHAwMAOAGIlH1nAVsFR/wXF4DkAw0YIAIk20mDFSwcAojgcwJ0GBUk9CcD/MQbFXjMeKf8HAEdFP/zF4VAKAEdLBgX/MuKCBgChUReHwAMen1Ugwf+EwQCdQh9pBwAvXTUqx+ISAExiAz4FwfhGwf52RAMAgWd13AQA7HccwQXADR7ffBP/wMCCFQU0f+s7K8D/+lb6Q8EMALx+Gp5t+lgIADp/7SjwwAMehYSJfsIIxd+DCMHAwMBMEMWLjBJHSlbAPv/NAIaUgsB1WwgAG4sb3MH/wFkOAPqg8t7+QD1C/gvFm66Ow3hwXRkA2qzh4MH//f/AwP7/xVvBSj7ADwBmrBVd/0rA/lfA1QCkrxZlREZLacAAaaqBwYIUAHRyA/rjbP7/RP9GgMMAHm26fcB3DMUbvh7Fwf3/S8DvBgVCw3p7wRMAocP/4fxUwP7/wDpAStwEAFzHcP+9CAX3zBf/QzYJxebVAFVPwBoAHyvnRNz///7+wTXqOENNCgBy83eQBMF53wgAkfMQwDj/Q+ANEIsHgJ2yeMcVEYsMepLAvYwADpINF/84DNWXHZKowHfDUxLV1R+1w3XCwInBB8DH3pkRENEdpwSAxN1oicGACxBTHoPaksLBwXYI1Z4aAjr9bxAQwKm0xd7DwqHEwcIG/5UZEdciLVE+wxCDXQH4/WoFEB1EMt5aBRDdRDA7VwEOPFBMwP8K1ahRs6fFwcKDGdUdUM3Bwv39wv46/sXg/P3//sD+O//64cHAwRgQIa3JPSA0//38/js6MmkQEbdxtMD/WsbG2oHCGxEAaXiHZ5XBkIuLwsAFwvrYGxAdDNP7Bf87Kzov/v//W4MJFXdsyfz++vk/XwIObm/Q/vj35wA=";

    // MATCH
    const matchRes = await axios.post(
        "http://localhost:5298/fingerprint/match",
        {
            storedTemplate,
            newTemplate
        }
    );

    if (!matchRes.data.matched) {

        return res.status(401).json({
            message: "Fingerprint mismatch"
        });

    }
}
      else {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      if (!foundUser) {
        return res.status(401).json({ message: "User not found" });
      }
  
      if (role !== "Admin") {

    const isMatch = await bcrypt.compare(
        password,
        foundUser.password
    );

    if (!isMatch) {

        return res.status(401).json({
            message: "Invalid credentials"
        });

    }

}
  
      
      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        role: role
      };
  
      console.log(" login secret", secret)
      
      const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: { email: foundUser.email, role: role }
      });
  
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }