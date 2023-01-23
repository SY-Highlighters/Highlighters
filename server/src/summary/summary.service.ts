import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, ConsoleLogger } from '@nestjs/common';
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

  async summary_url(url: string, user: User, id: number) {
    console.log('summary_url 시작');
    const feed = await this.prismaService.feed.findUnique({
      where: {
        id: id,
      },
    });
    if (feed.summary) {
      console.log('summary already exists');
      console.log('summary: ', feed.summary);
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
    // console.log(url);

    const full_text = await fetch(url).then((res) => res.text());
    const temp = parse(full_text);
    const title = temp.querySelector('#title_area').innerText.trim();
    const dic_area = temp.querySelector('#dic_area');
    // console.log(dic_area);
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
    console.log(content);

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
      throw new HttpException('문장이 너무 길어요', 400);
    }
    console.log('문장이 너무 긴지 확인');
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
    // console.log(send_data);
    try {
      console.log('summary start');
      const result = this.httpService
        .post(api_url, send_data, AxiosRequestConfig)
        .pipe(map((response) => response.data));
      console.log('summary end: ', result);
      let ss: string;
      result.subscribe(async (res) => {
        ss = res.summary;
        await this.prismaService.feed.update({
          where: {
            id: +id,
          },
          data: {
            summary: ss,
          },
        });
        console.log('summary: ', ss);
        return ss;
      });
    } catch (error) {
      console.log('error', error);
    }
  }
}
