import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, ConsoleLogger, Sse } from '@nestjs/common';
import { User } from '@prisma/client';
import { ElasticsearchService } from 'src/repository/connection';
import { PrismaService } from 'src/repository/prisma.service';
import { parse } from 'node-html-parser';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class SummaryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async summary_url(url: string, user: User, id: number) {
    const feed = await this.prismaService.feed.findUnique({
      where: {
        id: id,
      },
    });
    if (feed.summary) {
      console.log('summary already exists in DB');
      return feed.summary;
    }
    const api_url =
      'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize';
    const AxiosRequestConfig = {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_API_KEY_ID,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_API_KEY,
        'content-type': 'application/json',
      },
    };

    const full_text = await fetch(url).then((res) => res.text());
    const temp = parse(full_text);
    console.log('temp: ', temp);
    const title = temp.querySelector('#title_area').innerText.trim();
    console.log('title: ', title);
    const dic_area = temp.querySelector('#dic_area');
    console.log('dic_area: ', dic_area);
    const end_photo_orgs = dic_area.querySelectorAll('.end_photo_org');
    let end_photo_orgs_text;
    if (end_photo_orgs) {
      end_photo_orgs_text = end_photo_orgs.map((node) => {
        return node.innerText;
      });
    }
    const media_end_summary = dic_area.querySelector('.media_end_summary');
    let content = dic_area.innerText;
    if (media_end_summary) {
      content = dic_area.innerText.replace(media_end_summary.innerText, '');
    }
    for (let i = 0; i < end_photo_orgs_text.length; i++) {
      content = content.replace(end_photo_orgs_text[i], '');
    }
    content = content.trim();
    // console.log(content);

    // let text = temp.querySelector('#dic_area').innerText.trim();
    // console.log(text);
    // console.log('title: ', title);

    // const regExp = [/<\/?[^>]+>/gi];
    // text = text.replace(/(\n)/g, '');
    // text = text.replace(/\n+/g, '');
    // text = text.replace(/\t+/g, '');
    // title = title.replace(regExp[0], '');
    // console.log('text: ', text);

    if (content.length > 1999) {
      console.log('문장이 너무 길어요');
      return '2천자 이상의 문장은 요약할 수 없어요.';
      // throw new HttpException('문장이 너무 길어요', 400);
    }

    const data = {
      document: {
        title: title,
        content: content,
      },
      option: {
        language: 'ko',
        model: 'news',
        tone: 0,
        summaryCount: 3,
      },
    };

    const send_data = JSON.stringify(data);

    try {
      const response = await fetch(api_url, {
        method: 'POST',
        headers: {
          'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_API_KEY_ID,
          'X-NCP-APIGW-API-KEY': process.env.NAVER_API_KEY,
          'content-type': 'application/json',
        },
        body: send_data,
      }).then((res) => res.json());

      await this.prismaService.feed.update({
        where: {
          id: +id,
        },
        data: {
          summary: response.summary,
        },
      });
      return response.summary;
    } catch (error) {
      console.log('error', error);
    }
  }
}
