const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIA4MTWM4LJU2PGTFP2",
  secretAccessKey: "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",
  region:"us-east-1",
});

const s3 = new AWS.S3();

module.exports = s3;
