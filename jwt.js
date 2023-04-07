function authenToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    //'Beaer [token]'
    const token = authorizationHeader.split(' ')[1];
    if(!token) res.status(401).send({error: "missing authenrization token"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
        console.log(error, data);
        if(error){
            res.send({error: `${error} `})
        }else{
            next()
        }
    })
    
}