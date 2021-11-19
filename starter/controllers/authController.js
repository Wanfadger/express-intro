
const User = require(`${__dirname}/../models/userModel`)
const AppError = require(`${__dirname}/../utils/globalError`);

 exports.signup =  async (req, res) => {
   try {
     const newUser = await User.create(req.body);
     return res.status(201).json({
       message: 'success',
       data: { user: newUser },
       status: true,
     });
   } catch (error) {
     console.log('ERROR ' + error.message);
     return res.status('404').json({
       message: error.message,
       status: false,
     });
   }
 }


  // exports.login = async (req, res) => {
  //   try {

  //   } catch (error) {
  //     console.error(`ERROR ${error.message}`);
  //     return res.status('400').json(new AppError(error.message, 400));
  //   }
  // };