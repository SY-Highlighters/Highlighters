import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { User } from '@prisma/client';
import { ElasticsearchService } from 'src/repository/connection';
import { PrismaService } from 'src/repository/prisma.service';
import { parse } from 'node-html-parser';

@Injectable()
export class SummaryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async summary_url(url: string, user: User) {
    const api_url =
      'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize';
    const AxiosRequestConfig = {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_API_KEY_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_API_KEY,
        'content-type': 'application/json',
      },
    };
    // console.log(url);

    const full_text = await fetch(url).then((res) => res.text());
    const temp = parse(full_text);
    let title = temp.querySelector('#title_area').innerHTML;
    let text = temp.querySelector('#dic_area').innerHTML;

    const regExp = [/<\/?[^>]+>/gi];
    text = text.replace(regExp[0], '');
    text = text.replace(/\n+/g, '');
    text = text.replace(/\t+/g, '');
    title = title.replace(regExp[0], '');
    // console.log(title);

    if (text.length > 1999) {
      throw new HttpException('문장이 너무 길어요', 400);
    }
    const data = {
      document: {
        title: title,
        content: text,
      },
      option: {
        language: 'ko',
        // model: 'news',
        tone: 0,
        summaryCount: 3,
      },
    };

    const send_data = JSON.stringify(data);
    console.log(send_data);
    try {
      const result = await this.httpService
        .post(api_url, send_data, AxiosRequestConfig)
        .pipe(map((response) => response.data));

      return result;
    } catch (error) {
      console.log('error', error);
    }
  }
}
