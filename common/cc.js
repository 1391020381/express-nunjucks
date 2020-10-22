module.exports = function callBackCatch(callback){
    return async (req,res,next)=>{
        try{
            await callback(req,res,next)
        }catch(e){
            console.log(e.message)
            next(e)
        }
    }
}