import {
    DeleteObjectCommand
} from "@aws-sdk/client-s3";

import getR2Client from "./r2.js";


const deleteFromR2 = async (key) => {

    if (!key) {
        return;
    }


    const r2 = getR2Client();


    await r2.send(

        new DeleteObjectCommand({

            Bucket:
                process.env.R2_BUCKET_NAME,

            Key:
                key

        })

    );

};


export default deleteFromR2;