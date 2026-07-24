import "dotenv/config";

import {
    PutObjectCommand
} from "@aws-sdk/client-s3";

import r2 from "../config/r2.js";


const test = async () => {

    try {

        await r2.send(

            new PutObjectCommand({

                Bucket:
                    process.env.R2_BUCKET_NAME,

                Key:
                    "test/hello.txt",

                Body:
                    "Hello Forland R2"

            })

        );


        console.log(
            "R2 upload success"
        );


    } catch(error) {

        console.error(error);

    }

};


test();