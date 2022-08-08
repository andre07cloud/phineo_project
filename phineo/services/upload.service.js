require("dotenv").config();
const { S3 } = require("aws-sdk");
const fs = require("fs");
const config = require("../config/config");

const s3 = new S3({
    region: config.aws.region
});

function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: config.aws.bucketName,
        Body: fileStream,
        Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
}

function getFile(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: config.aws.bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
}

module.exports = { uploadFile, getFile };