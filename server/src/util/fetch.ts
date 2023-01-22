// import * as AWS from 'aws-sdk';
// import * as fs from 'fs';
// import * as sharp from 'sharp';
// import fetch from 'node-fetch';

export function fetchandsave(imageUrl, fileName): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AWS = require('aws-sdk');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sharp = require('sharp');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fetch = require('node-fetch');
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
      .then((buffer) =>
        sharp(buffer)
          // 여기서 이미지 리사이징 작업 수행
          .resize(500, 500)
          .toFormat('jpg')
          .toBuffer(),
      )
      .then((data) => {
        // 우리 서버에 이미지 저장
        fs.writeFileSync(`picture/${fileName}.jpg`, data);
        // S3에 업로드
        const param = {
          Bucket: 'highlighters-s3',
          Key: `picture/${fileName}.jpg`,
          ACL: 'public-read',
          Body: fs.createReadStream(`picture/${fileName}.jpg`),
          ContentType: 'image/jpg',
        };
        s3.upload(param, (error, data) => {
          if (error) {
            console.log('upload s3 error', error);
            return reject(error);
          }
          console.log('upload s3 success', data['Location']);
          return resolve(data['Location']);
        });
      });
  });

  // return new Promise<string>((resolve, reject) => {
  //   fetch(imageUrl).then((res) => {
  //     res.body
  //       // .pipe(fs.createWriteStream(`config/high/${fileName}.jpg`))
  //       .pipe(fs.createWriteStream(`picture/${fileName}.jpg`))
  //       .on('finish', async (data) => {
  //         const param = {
  //           Bucket: 'highlighters-s3',
  //           // Key: `high/${fileName}.jpg`, // s3 bucket 에다가 다운.
  //           Key: `picture/${fileName}.jpg`, // s3 bucket 에다가 다운.
  //           ACL: 'public-read',
  //           // Body: fs.createReadStream(`config/high/${fileName}.jpg`), // 우리 서버에다가 다운
  //           Body: fs.createReadStream(`picture/${fileName}.jpg`), // 우리 서버에다가 다운
  //           ContentType: 'image/jpg',
  //         };
  //         const result = await s3.upload(param, (error, data) => {
  //           if (error) {
  //             console.log('upload s3 error', error);
  //           }
  //           console.log('upload s3 success', data['Location']);
  //         });
  //         return result['Location'];
  //       });
  //     return resolve('success');
  //   });
  // });
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
