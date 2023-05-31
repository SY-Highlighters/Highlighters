# Highlighters [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FSY-Highlighters%2FHighlighters%2Ftree%2Fdevelop&count_bg=%233DB4C8&title_bg=%23555555&icon=krita.svg&icon_color=%23E7E7E7&title=Highlighters&edge_flat=false)](https://hits.seeyoufarm.com)

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://highlighters.site/" target="_blank">
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F31yWM%2FbtrXCZpaP2S%2FyqPF5xC7b25iYzKE5KflE1%2Fimg.png" alt="Logo" width="" height="">
  </a>

  <p align="center">
   <i>for Collaboration</i>
  </p>
  <p align="center">
    <b> 크롬 익스텐션을 통해 브라우저에서 텍스트/이미지/동영상을 하이라이팅하고, 공유 및 아카이빙 할 수 있는 그룹 협업 툴</b>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## 목차

1. [프로젝트 개요](#Highlighters)
2. [서비스 소개](#Intro)
3. [서비스 구조도](#Arch)
4. [프로젝트 포스터](#Poster)

<!-- ABOUT THE PROJECT -->

<a name="Highlighters"> </a>

## 프로젝트 개요

프로젝트 기간 : 2022.12.23 ~ 2023.01.27 (5주)

기술 스택 :

| 분류                      | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**              | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/react--query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/recoil-362d59?style=for-the-badge&logo=recoil&logoColor=white"> <img src="https://img.shields.io/badge/tailwindcss-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"> |
| **Extension**             | <img src="https://img.shields.io/badge/Extension Manifest v3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/recoil-362d59?style=for-the-badge&logo=recoil&logoColor=white">                                                                                                        |
| **Backend**               | <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">                                                                                                                                                                                                                                                                                                                                         |
| **Database**              | <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <img src="https://img.shields.io/badge/elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white"> <img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">                                                                                                                 |
| **Infrastructure/DevOps** | <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/aws_lambda-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"> <img src="https://img.shields.io/badge/aws_s3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white">            |

팀원 : 박예린(TL/FE), 김현진(BE), 김성태(BE), 길인식(BE), 조성배(FE)

서비스 사용 설명서 : [바로가기](https://www.notion.so/yeriiin/Highlighters-b7074bda3ec542e7bd4002babca6e5fc)

웹사이트 : [바로가기](https://highlighters.site/)

- demo 계정 : test@test.com
- demo 계정 비밀번호 : 1234
- 익스텐션을 설치해야 그룹원들의 하이라이팅을 볼 수 있고, 피드를 추가할 수 있으니 아래의 스토어에서 설치 후 이용해주시면 감사하겠습니다.

크롬 익스텐션 스토어 : [바로가기](https://chrome.google.com/webstore/detail/highlighters/hcagahefhiieeemlfjfhbnhnaedcpdai?hl=ko)

시연 영상 : [바로가기](https://www.youtube.com/watch?v=1hC4BrA4MJI)

현장 발표영상 : [바로가기](https://youtu.be/n9EOK_6DOe0)

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<a name="Intro"> </a>

## 서비스 소개

 <h3 align="left">Highlighters는 3가지 고민에서 시작되었습니다.</h3>
 
- 웹페이지에서 중요한 내용이 한 눈에 보였으면 좋겠어! 
- 브라우저에서 곧바로 팀원에게 링크를 보낼 수 없을까? 
- 공유한 링크를 다시 찾기 쉽게 모아두면 좋겠어!

 <h3 align="left">Highlighters는 이런 서비스입니다.</h3>
 
1. 크롬 익스텐션을 통해 텍스트, 이미지, 영상에 하이라이트를 할 수 있습니다. 
2. 그룹원들에게 쉽게 링크를 공유할 수 있습니다. 
3. 공유한 자료를 아카이빙하고 검색할 수 있습니다.

 <h3 align="left">주요 기능</h3>
 
#### 1. 텍스트 하이라이트
- 텍스트를 하이라이팅하고 이를 피드에서 확인할 수 있습니다.
   <table border="0" >
    <tr>
        <td><img width="400" height="200" src="https://user-images.githubusercontent.com/101175828/216561610-7b3c0b07-2924-4414-be78-281ea964e699.gif"> </img></td>
        <td><img width="400" height="200" src="https://user-images.githubusercontent.com/101175828/216561650-8a524521-d6d2-46fd-91af-0f1cedb5fa21.gif"></img></td>
   </tr>

  </table>
#### 2. 이미지 하이라이트
- 이미지를 하이라이팅하고 이를 피드에서 확인할 수 있습니다.
  <!-- <div>
    <img width="300" height="160"  src="https://user-images.githubusercontent.com/101175828/216537143-2f7bcd1f-9d30-42f8-86de-10587673a030.gif"></img>
    <img width="300" height="160" src="https://user-images.githubusercontent.com/101175828/216537281-4498ad2d-a8c5-44fa-9c54-e0ab51c337cb.gif"> </img>
  </div> -->
   <table border="0" >
    <tr>
        <td>    <img src="https://user-images.githubusercontent.com/101175828/216537143-2f7bcd1f-9d30-42f8-86de-10587673a030.gif"></img></td>
        <td>    <img src="https://user-images.githubusercontent.com/101175828/216537281-4498ad2d-a8c5-44fa-9c54-e0ab51c337cb.gif"> </img></td>
   </tr>

  </table>

#### 3. 유튜브 영상 하이라이트

- 유튜브 영상에서 원하는 시간을 하이라이팅할 수 있습니다.
- 피드에서 하이라이팅한 시간을 곧바로 재생할 수 있습니다.
  <div>
    <img width="400" height="230" src="https://user-images.githubusercontent.com/101175828/216539463-35aa8836-9b30-41c0-aeac-ef03335c031e.gif"> </img>
    <img width="300" height="230" src="https://user-images.githubusercontent.com/101175828/216539648-c765fe17-f104-4500-96ab-0a074e0e70d2.gif"> </img>
  </div>

#### 4. 그룹원간 실시간 하이라이트 동기화

- 동일한 웹사이트에 접속했을 때, 그룹원이 하이라이팅한 내용이 내 화면에도 실시간으로 반영됩니다.
  <img  src="https://user-images.githubusercontent.com/101175828/216539214-8ee34979-d587-49df-a343-38fcc02f5be5.gif"> </img>

#### 5. 그룹원간 메시지 및 링크 알림

- 그룹원에게 메시지 및 링크 알림을 보낼 수 있습니다.
- 링크 알림을 클릭하면 곧바로 해당 링크로 이동할 수 있습니다.
   <div>
    <img width="400" height="400" src="https://user-images.githubusercontent.com/101175828/216554060-f565c9d9-2904-4ed3-890b-ce310bee307f.gif"> </img>
  </div>

#### 6. 3줄 요약

- 링크의 내용을 3줄로 요약해줍니다.
   <div>
    <img width="400" height="230" src="https://user-images.githubusercontent.com/101175828/216561358-16fb58e4-8401-406f-bdb4-5a42b8dc047b.gif"> </img>
  </div>

#### 7. 피드 아카이빙

- **태그 별**로 피드를 모아볼 수 있습니다.
- **날짜 별**로 피드를 모아볼 수 있습니다.
- **즐겨찾기**를 해 둔 피드를 모아볼 수 있습니다.
    <table border="0" >
    <tr>
        <td>    <img src="https://user-images.githubusercontent.com/101175828/216554937-47c37f6d-5eb7-4285-86f4-ab150506d98b.png"></img></td>
        <td>    <img src="https://user-images.githubusercontent.com/101175828/216554961-c3c90f2b-6a71-4265-8bb3-d9c8cf8022ed.png"> </img></td>
        <td>    <img src="https://user-images.githubusercontent.com/101175828/216554978-c0545a1f-4705-44f1-bc2e-5c2403cc9777.png"> </img></td>
   </tr>

  </table>

#### 8. 피드 검색

- 오타가 있어도 의도한 검색결과를 제공해줍니다. (과금 문제로 현재는 일반 검색기능만 작동합니다.)
  <div>
    <img src="https://user-images.githubusercontent.com/101175828/216539091-6fe20844-8241-49ef-9c0d-764449dbca8c.gif"> </img>
  </div>

#### 9. 피드 댓글

- 피드에 댓글을 달 수 있습니다.
   <div>
    <img height="300" width="500"src="https://user-images.githubusercontent.com/101175828/216555375-3e1b4e7c-75fb-45c0-aad3-832f9fee1806.png"> </img>
  </div>

#### 10. 그리드뷰 보기

- 많은 피드들을 한 눈에 볼 수 있습니다.
   <div>
    <img src="https://user-images.githubusercontent.com/101175828/217535465-8ea6a78f-2022-4d3a-a10e-a6ec2477c9d3.png"> </img>
  </div>
<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- 아키텍처 -->

<a name="Arch"></a>

## 서비스 구조도

![image](https://user-images.githubusercontent.com/101175828/214384335-2e829ad4-d4c2-40f0-be71-cf2ebcfc8166.png)

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- 포스터 -->

<a name="Poster"> </a>

## 프로젝트 포스터

![image](https://user-images.githubusercontent.com/109822768/219306111-d702e6cd-c619-45ef-9aa5-a850e5e0158b.png)

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/SY-Highlighters/Highlighters/issues
[product-screenshot]: images/screenshot.png
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[svelte-url]: https://svelte.dev/
[laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[laravel-url]: https://laravel.com
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[jquery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jquery-url]: https://jquery.com
