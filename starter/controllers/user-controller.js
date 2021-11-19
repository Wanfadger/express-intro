


exports.getAllUsers = async (req, res) => {

 try {
   //EXCUTE QUERY
   const apiFeature = new ApiFeature(User.find(), req.query)
     .filter()
     .sort()
     .fieldLimiting()
     .paginate();
   const users = await apiFeature.query;

   res.status(200).json({
     status: true,
     message: 'success',
     count: users.length,
     data: { users },
   });
 } catch (error) {
   console.log('ERROR ' + error.message);
   return res.status('404').json({
     message: error.message,
     status: false,
   });
 }
};

exports.createUser = (req, res) => {

  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

exports.pathUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};
