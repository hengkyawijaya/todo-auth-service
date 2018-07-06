const jwt = require("jsonwebtoken");
const { User } = require("../model"); 
const config = require("../config");

module.exports = {
  async login(req, res){
    const { user:{ email, password } } = req.body;
    try {

      const theUser = await User.findOne({ email });

            if(!theUser){
                next({
                    message: "username/password doesn't match!"
                })
            }

            const match = await bcrypt.compare(password, theUser.password);

            if(!match) {
                next({
                    message: "username/password doesn't match!"
                })
            }

            const payload = {
                id: theUser.id
            }

            const token = jwt.sign(payload, config.JWT_SECRET_KEY, {
            expiresIn: 7 * 24 * 60 * 60
            });
            
      res.send({
        data: {
          token
        },
        status: {
          code: 200,
          message: "Operation handle correctly",
          succeeded: true
        }
      });

    } catch(err) {
      res.send(err)
    }
  },
  async check(req, res){
    try {
      const theUser = await jwtVerify(req, res);

      res.send({
        data: {
          user: theUser,
        },
        status: {
          code: 200,
          message: "Operation handle correctly",
          succeeded: true
        }
      });
    } catch(err) {
      res.send(err)
    }
  },
 

}

async function jwtVerify(req, res) {
  //TODO: IF Auth True
  const {headers:{authorization}} = req;

  console.log(authorization);

  //no token provided
  if(!authorization){
      return res.status(401).send({
          status: {
              code: 401,
              message: "Token doesn't exist",
              succeeded: false
            }
      })
  } 

  const bearerLength = "Bearer ".length;
  //token from header
  let token = authorization.slice(bearerLength) || null;

  
  
  //no token provided
  if(!token){
      return res.status(401).send({
          status: {
              code: 401,
              message: "Token doesn't exist",
              succeeded: false
            }
          })
  }
  
  try{
  decoded =  await jwt.verify(token, config.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id);

  if(!user){
      return res.status(401).send({
          status: {
              code: 401,
              message: "Token Invalid",
              succeeded: false
            }
      })
  }

  return user;
  
  } catch(err){
      return res.status(401).send({
          status: {
              code: 401,
              message: err.message,
              succeeded: false
            }
      })
  }
}