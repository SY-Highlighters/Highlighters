import * as cheerio from 'cheerio';

export function _getHostname(url) {
  let start = url.indexOf('://') + 3;
  let end = url.indexOf('/', start);
  return url.slice(start, end);
}

export function _getProtocol(url) {
  let end = url.indexOf('://') + 3;
  return url.slice(0, end);
}

export function _bodyScrap(url) {
  return ($) => {
    // 글제목
    let title = $("meta[property='og:title']").attr('content');
    if (!title) {
      title = $('head title').text();
      if (!title) {
        throw Error('This link has no title');
      }
    }
    // 글이미지
    let image = $("meta[property='og:image']").attr('content');
    if (!image) {
      image = $('img').attr('src');
      //이미지 세팅
      if (image && image.indexOf('http') === 0) {
        // http 로 시작하면 그냥 사용
      } else if (image && image[0] === '/') {
        // image 경로가 / 로 시작한다면
        //let urlObj = new URL(url);
        image = _getProtocol(url) + _getHostname(url) + image;
      } else {
        image = '';
      }
    }

    // 글요약본
    let desc = $("meta[property='og:description']").attr('content');
    if (!desc) {
      desc = '';
    }
    return {
      title,
      image,
      desc,
    };
  };
}

export async function getUrlMeta(url) {
  const meta = await fetch(url)
    .then((res) => res.text())
    .then(cheerio.load)
    .then(_bodyScrap(url));
//   console.log('hi');
  return meta;
}
