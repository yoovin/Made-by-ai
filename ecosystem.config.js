// PM2 ecosystem 설정 파일
// 재시작/복원 시 이 파일로 정확한 실행 구성을 보장한다.
// 사용: pm2 start ecosystem.config.js

const NODE_BIN = process.env.HOME
  ? `${process.env.HOME}/.nvm/versions/node/v25.8.0/bin/node`
  : "/config/.nvm/versions/node/v25.8.0/bin/node";

const NEXT_BIN =
  __dirname +
  "/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/bin/next";

module.exports = {
  apps: [
    {
      name: "made-by-ai",
      script: NEXT_BIN,
      interpreter: NODE_BIN,
      cwd: __dirname,
      args: "dev --hostname 0.0.0.0 --port 4000",
      env: {
        NODE_ENV: "development",
      },
      // 크래시 시 자동 재시작
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      // 로그
      out_file: "./ops/logs/pm2-out.log",
      error_file: "./ops/logs/pm2-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
