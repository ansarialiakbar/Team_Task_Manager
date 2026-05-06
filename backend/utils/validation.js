const validator = require('validator');

const valiadteSignupData = (req) => {
    const {firstName, lastName, email, password} = req.body;
    console.log(firstName);
    
    if(!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }
    if(password.length < 3 || password.length > 15) {
        throw new Error("Password must be between 3 and 15 characters");
    }

}
module.exports = {
   valiadteSignupData,
   
}