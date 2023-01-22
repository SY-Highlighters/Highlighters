export function fetchandsave(imageUrl, fileName): Promise<string> {
  console.log('fetchandsave', imageUrl, fileName);
  const fetch = require('node-fetch');
  const AWS = require('aws-sdk');
  const fs = require('fs');
  const sharp = require('sharp');
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-2',
  });
  return new Promise<string>((resolve, reject) => {
    fetch(imageUrl)
      .then((res) => res.buffer())
      .then((buffer) => sharp(buffer).jpeg({ quality: 50 }).toBuffer())
      .then((buffer) => {
        const param = {
          Bucket: 'highlighters-s3',
          Key: `picture/${fileName}.jpg`,
          ACL: 'public-read',
          Body: buffer,
          ContentType: 'image/jpeg',
        };
        s3.upload(param, (error, data) => {
          if (error) {
            console.log('upload s3 error', error);
            return reject(error);
          }
          console.log('upload s3 success', data['Location']);
          return resolve(data['Location']);
        });
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });
}

export function deleteS3(id): Promise<boolean> {
  try {
    const AWS = require('aws-sdk');

    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      region: 'ap-northeast-2',
    });

    s3.deleteObject(
      {
        Bucket: 'highlighters-s3',
        Key: `picture/${id}.jpg`,
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      },
    );
    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(false);
  }
}
