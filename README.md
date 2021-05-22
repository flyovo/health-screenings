# health-screenings

- front: nuxt, vue, socket.io-client
- back: express, mySQL, sequelize, socket.io

오프라인 설치

[준비]

     - node-v14.16.0-x64.msi 설치파일
     - 프로젝트 전체 압축 파일

[설치방법]

1. node.js와 npm을 설치한다.

   > node-v14.16.0-x64.msi 설치파일 실행 (node와 npm 한번에 설치되는 파일)
   >
   > CMD에서 설치 확인 및 버전 확인
   >
   > ```bash
   > C:\Users\4cgate>node -v
   > v14.16.0
   > ```
   >
   > ```bash
   > C:\Users\4cgate>npm -v
   > 6.14.11
   > ```

2. 프로젝트를 실행한다.

   2.1. back-end

   > back 폴더 접근
   >
   > .env.production 파일 확인
   >
   > ```
   > // front-end의 .env.production 파일 내의 API_HOST와 일치
   > PORT=(server port)
   > // front-end의 .env.production 파일 내의 HOST와 일치
   > CLIENT_HOST=(client ip)
   > // front-end의 .env.production 파일 내의 PORT와 일치
   > CLIENT_PORT=(client port)
   > DB_USERNAME=(DB username)
   > DB_PASSWORD=(DB password)
   > DB_DATABASE=(DB name)
   > DB_HOST=(DB ip)
   > DB_PORT=(DB port)
   > // 소켓통신 (환자 상태 변경 통신 서버)
   > EXTERNAL_HOST=(external ip)
   > EXTERNAL_PORT=(external port)
   > ```
   >
   > 실행
   >
   > ```bash
   > C:\...\back> npm run start:prod
   > ```

   2.2. front-end

   > front 폴더 접근
   >
   > .env.production 파일 확인
   >
   > ```
   > // back-end의 .env.production 파일 내의 CLIENT_HOST와 일치
   > HOST=(client ip)
   > // back-end의 .env.production 파일 내의 CLIENT_PORT와 일치
   > PORT=(client port)
   > API_HOST=(server ip)
   > // back-end의 .env.production 파일 내의 PORT와 일치
   > API_PORT=(server port)
   > ```
   >
   > 실행
   >
   > ```bash
   > C:\...\front> npm run start:prod
   > ```

둘 다 실행(start:prod) 상태여야 동작!
