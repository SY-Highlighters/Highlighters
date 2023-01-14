export function fetchandsave(imageUrl, fileName): Promise<string> {
  const fetch = require('node-fetch');
  const AWS = require('aws-sdk');
  const fs = require('fs');

  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-2',
  });
  return new Promise<string>((resolve, reject) => {
    fetch(imageUrl).then((res) => {
      res.body
        // .pipe(fs.createWriteStream(`config/high/${fileName}.jpg`))
        .pipe(fs.createWriteStream(`picture/${fileName}.jpg`))
        .on('finish', async (data) => {
          const param = {
            Bucket: 'highlighters-s3',
            // Key: `high/${fileName}.jpg`, // s3 bucket 에다가 다운.
            Key: `picture/${fileName}.jpg`, // s3 bucket 에다가 다운.
            ACL: 'public-read',
            // Body: fs.createReadStream(`config/high/${fileName}.jpg`), // 우리 서버에다가 다운
            Body: fs.createReadStream(`picture/${fileName}.jpg`), // 우리 서버에다가 다운
            ContentType: 'image/jpg',
          };
          const result = await s3.upload(param, (error, data) => {
            if (error) {
              console.log('upload s3 error', error);
            }
            console.log('upload s3 success', data['Location']);
          });
          return result['Location'];
        });
      return resolve('success');
    });
  });
}
