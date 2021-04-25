# nuxt_sejong_chungnam

- front: nuxt, vue, socket.io-client
- back: express, mySQL, sequelize, socket.io

오프라인 설치

  [준비]
  
     - node-v14.16.0-x64.msi 설치파일
     - 프로젝트 전체 압축 파일

  [설치방법]
  
    1. node.js와 npm을 설치한다.
	1.1) node-v14.16.0-x64.msi 설치파일 실행 (node와 npm 한번에 설치되는 파일)
	1.2) CMD에서 설치 확인 및 버전 확인
	      -> CMD 예시 ) C:\Users\4cgate>node -v
		    결과 ) v14.16.0
	      -> CMD 예시 ) C:\Users\4cgate>npm -v
		    결과 ) 6.14.11

    2. 프로젝트를 실행한다.
	2.1) back end
	        sejong-chungnam/back 폴더 접근
		* 서버환경 : IP (dev)localhost , (production)서버 IP4주소 / port 3085
			-> (통신할 프론트엔드 IP 설정 부분) app.js 파일 9번 라인 "http://192.168.10.39:3000"에서 IP(192.168.10.39)를 서버IP로 수정
		* DB 환경 : IP (dev)localhost , (production)서버 IP4주소 / port 3307 / username root / password eum5890 / database cnuh_sj_hospital
			-> config/config.json 파일 24번 라인 "host: 192.168.10.39"에서 IP(192.168.10.39)를 서버IP로 수정, localhost도 괜찮음.
		* 외부 서버 환경 : IP (static)192.168.10.39 / port (static)8080
			-> routes/patient.js 파일 16번 라인 "const host="192.168.10.39";"에서 IP(192.168.10.39)를 서버IP로 수정, 포트도 필요시 변경 필요
		* 실행 : CMD로 sejong-chungnam/back 폴더 접근 -> npm run start 입력
			-> CMD 예시 ) C:\Project\설치\세종충남_210414\sejong-chungnam\back>npm run start

	2.2) front end
	        sejong-chungnam/front 폴더 접근
		* 서버환경 : IP (dev)localhost, (production)서버 IP4주소 / port 3000
			-> (통신할 백엔드 IP 설정 부분) nuxt.config.js 파일 1번 라인 "http://192.168.10.39:3085"에서 IP(192.168.10.39)를 서버IP로 수정 
			-> (통신할 백엔드 IP 설정 부분) plugins/socket.client.js 파일 4번째 라인 "http://192.168.10.39:3085"에서 IP(192.168.10.39)를 서버IP로 수정
		* 실행 : CMD로 sejong-chungnam/front 폴더에서 -> npm run start 입력
			-> CMD 예시 ) C:\Project\설치\세종충남_210414\sejong-chungnam\front>npm run start

 	둘 다 start 상태여야 동작!
