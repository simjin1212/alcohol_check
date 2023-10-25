# README

# ALCOHOL CHECK WEB APP

## 프로젝트 목적

- 음주여부를 측정할 수 있는 어플리케이션
- REACT NATIVE 관련 깊은 이해, 웹 뷰 및 앱에 대한 숙련도 증가
- 신규 팀원들에 대한 기술력 확인 및 커뮤니케이션 레벨 CHECK

## 개발환경 요약

- [NodeJS](https://nodejs.org/) 18.x
- [pnpm](https://pnpm.io/) 7.x
- [NextJS](https://nextjs.org/) 13.x
- [ReactJS](https://reactjs.org/) 18.x
- [Material UI](https://mui.com/) 5.x
- [Typescript](https://www.typescriptlang.org/) 4.5.x (4.9를 사용하고 있습니다)
- [reactNative](https://reactnative.dev/) 0.72 x
- 모노리포: [turborepo](https://turbo.build/) (프론트 엔진 환경구성)

## 사전 준비

### NodeJS 18.x 설치

보통 개발자 PC에 여러 버전의 NodeJS 환경이 필요하므로 nvm 사용을 권장합니다. nvm 없이 사용하려면 [NodeJS 홈페이지](https://nodejs.org/)에서 NodeJS 18.x 버전을 설치해도 됩니다.

### nvm 설치

아래와 같이 nvm을 설치할 수 있습니다.

```bash
choco install nvm
```

### nvm 으로 NodeJS 설치하기

NodeJS 홈페이지에서 18.x의 최신 버전 번호를 확인한 후에, 아래와 같이 설치할 수 있습니다.

```bash
nvm install 18.12.1# 설치한 후에는 use 해야 합니다.nvm use 18.12.1
```

현재는 18.x 가 lts 버전이라서 lts로 설치할 수 있습니다.

```bash
nvm install lts# 설치한 후에는 use 해야 합니다.nvm use 18.12.1
```

### pnpm 7.x 설치

파워쉘에서 아래 명령을 실행합니다. 7.x 버전으로 설치합니다.

- 파워쉘은 윈도우 시작키 누르고, `powershell`을 입력하면 윈도우 메뉴에서 검색됩니다.
- 혹시 설치가 안된다면, 관리자 권한으로 설치하세요.

```bash
npm install --global pnpm# 설치된 버전 예시: 7.16.1
```

더 자세한 설치 방법은 [pnpm](https://pnpm.io/) 사이트를 확인해주세요.

### 애플리케이션과 패키지들

- `web`: fds 웹 [Next.js](https://nextjs.org/) app
- `ui-common`: 공통 UI 라이브러리
- `domain`: 데이터 타입 정의 및 서버 연동 API
- `eslint-config-custom`: `eslint` 설정 (`eslint-config-next`와 `eslint-config-prettier`를 포함하고 있습니다.)
- `tsconfig`: 모노리포에서 사용할 `tsconfig.json`파일을 포함하고 있습니다.
- `tscg`: 모노리포에서 사용할 `tsconfig.json`파일을 포함하고 있습니다.

### 빌드

모든 것을 빌드하려면 아래 명령을 실행하세요.

```
pnpm run build
```

### 개발

개발 모드로 실행하려면 아래 명령을 실행하세요.

```
pnpm run dev
```

## TODO

- Dockerizing

## Tips

### pnpm cheetsheet

```bash
# dependencies에 저장pnpm add saxpnpm add -P saxpnpm add --save-prod sax# devDependencies에 저장pnpm add -D saxpnpm add --save-dev sax# peerDependencies에 저장pnpm add --save-peer sax# optionalDependencies에 저장pnpm add -O saxpnpm add --save-optional sax# global 패키지에 저장pnpm add -g sax
```

```bash
# 실수로 devDependencies에 설치했는데, dependencies로 옮기려면pnpm install -P saxpnpm install --save-prod sax# 실수로 dependencies에 설치했는데, devDependencies로 옮기려면pnpm install -D saxpnpm install --save-dev sax
```