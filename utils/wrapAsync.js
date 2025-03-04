module.exports =(fn)  =>{
    //If the function throws an error or a rejected promise, the error is passed to the next middleware.
    return (req, res, next)  => {
        fn(req, res, next).catch(next);
    };
};