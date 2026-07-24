import deleteFromR2 from "./deleteFromR2.js";


const deleteUploadedFiles = async (files = {}) => {

    const uploadedFiles = Object
        .values(files)
        .flat();


    for (const file of uploadedFiles) {


        try {


            if (file.key) {

                await deleteFromR2(
                    file.key
                );

            }


        } catch (error) {


            console.error(
                "Failed deleting uploaded file:",
                error.message
            );


        }


    }


};


export default deleteUploadedFiles;