
const asyncHandler = async(requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,nex)).catch((error) => next(error))
    }
}

export {asyncHandler}