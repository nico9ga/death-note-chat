


export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) =>{ //Acá en callback se refiere a una funcion que va a ser llamada eventualmente.

    // console.log({file})

    if(!file) return callback( new Error('File is empty'), false);
    

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions=['jpg','jpeg','png','gif'];

    if (validExtensions.includes(fileExtension)){
        return callback(null, true)
    }

    callback(null, false);
}