
const User = require(`${__dirname}/../models/userModel`)
const AppError = require(`${__dirname}/../utils/globalError`);

 exports.signUp =  async (req, res) => {
   try {
     const newUser = await User.create(req.body);
     return res.status(201).json({
       message: 'success',
       data: { user: newUser },
       status: true,
     });
   } catch (error) {
     console.error(`ERROR ${error.message}`);
     return res.status('400').json(new AppError(error.message,400));
   }
 }


  exports.login = async (req, res) => {
    try {

    } catch (error) {
      console.error(`ERROR ${error.message}`);
      return res.status('400').json(new AppError(error.message, 400));
    }
  };