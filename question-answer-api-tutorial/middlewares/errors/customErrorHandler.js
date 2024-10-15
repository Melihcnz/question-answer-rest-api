const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
    let customError = { ...err };
    customError.message = err.message || "Internal Server Error";

    // Durum kodu ataması
    if (err.status) {
        customError.statusCode = err.status; // Hata nesnesinin status kodu varsa kullan
    } else if (err.name === "ValidationError") {
        customError.statusCode = 400; // ValidationError için varsayılan kod
    } else {
        customError.statusCode = 500; // Varsayılan durum kodu
    }
    if(err.name === "CastError"){
        customError = new CustomError("Please provide a valid id",400);
    }
    if(err.code === 11000) {
        //Duplicate Key
        customError = new CustomError("Duplicate Key Found : Check Your Input",400);
    }

    console.log(`Error: ${customError.message}, Status: ${customError.statusCode}`);

    res.status(customError.statusCode || 500).json({
        success: false,
        message: customError.message || "Internal Server"
    });
};

module.exports = customErrorHandler;
