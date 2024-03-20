const AWS = require('aws-sdk');
require('dotenv').config();

module.exports.uploadToS3 = (data, filename, res) => {
    try {
        let etrackerBucket = new AWS.S3({
            accessKeyId: process.env.IAM_ACCESS_KEY_ID,
            secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY
        });

        return new Promise((resolve, reject) => {
            etrackerBucket.createBucket(() => {
                let params = {
                    Bucket: "etracker1",
                    Key: filename,
                    Body: data,
                    ACL: 'public-read'
                }

                etrackerBucket.upload(params, (err, response) => {
                    if (err)
                        reject(err);
                    else
                        resolve(response.Location);
                });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, success: false, fileURL: '' });
    }
}