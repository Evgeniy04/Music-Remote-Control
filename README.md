## 1. Сначала установите node.js и npm

## 2. Поставьте и настройте nginx:

1. Установите nginx:

```bash
    apt-get install nginx
```

2. Пропишите в конфигурационном файле по пути /etc/nginx/sites-available/default следующее:

```bash
    server {
        listen 80;
        server_name avradev.ru;
        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection ‘upgrade’;
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        location /socket/ {
            proxy_pass http://127.0.0.1:8443;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_read_timeout 70s;
        }
    }
```

3. Сохраните и перезагрузите nginx:

```bash
    service nginx restart
```

4. Проверьте конфигурацию nginx:

```bash
   nginx -t
```

## 3. Настройте SSL в Nginx с помощью сертификатов Let’s Encrypt в Ubuntu:

1. Установите Certbot:

```bash
apt install certbot python3-certbot-nginx
```

2. Перезагрузите nginx:

```bash
systemctl reload nginx
```

3. Получите сертификат SSL:

```bash
certbot --nginx -d avradev.ru
```

4. Проверьте автоматическое обновление Certbot:

```bash
systemctl status certbot.timer
```

5. Чтобы протестировать процесс обновления, можно сделать запуск вручную (Если ошибок нет, значит все ок):

```bash
certbot renew --dry-run
```

## 4. Установите pm2

```bash
npm install pm2 -g
```

## 5. В каталоге приложения Next.js выполните сборку и запустите проект:

```bash
npm run build
pm2 start npm — start
```

## 6. В каталоге вебсокета:

```bash
pm2 start index.js
```
