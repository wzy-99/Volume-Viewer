# 使用官方 Node.js 作为父镜像
FROM node:current-slim

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install -g pnpm
RUN pnpm install

# 将所有文件复制到工作目录
COPY . .

EXPOSE 5173

# 启动应用程序
CMD [ "pnpm", "dev", "--host" ]