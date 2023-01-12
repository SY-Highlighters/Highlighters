import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID, // CLIENT_ID
      clientSecret: process.env.CLIENT_SECRET, // CLIENT_SECRET
      callbackURL: 'http://localhost:3001/api/auth/google/redirect',
      // passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }
  // @nestjs/passport PassportStrategy를 상속
  // passport-google-oauth20 Strategy 사용
  // Strategy의 이름은 'google'로 지정
  // validate 함수 내에서, 성공적인 google 로그인에 대한 유효성 검증
  // google에서 보내주는 'profile' 정보만 로그로 기록

  async validate(
    // request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    console.log(profile);
    const { name, emails, photos } = profile;
    const user_with_token = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      image: photos[0].value,
      accessToken,
      refreshToken,
    };
    console.log(user_with_token);
    // return user;
    // return user;
    done(null, user_with_token);
  }
}
