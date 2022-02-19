1. Сперва нужно поставить MySQL Workbench для доступа к sql базе.

2. Дальше необходимо поставить mysql
brew install mysql

3. Для запуска сервиса используйте
brew services start mysql

4. Для доступа к базе
mysql -uroot

5. Установите новый пароль для вашей ДБ
ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyN3wP4ssw0rd';
flush privileges;
exit;

6. Теперь для логина в базу используйте
mysql -u root -p 
MyN3wP4ssw0rd

7. Теперь создайте БД для вашего приложения
create database НАЗВАНИЕ_БД; 

8. Сконфигурируйте config.ts с настройками вашей БД.

9. Глобально устанавливаем следующее:
yarn global add typeorm
yarn global add @types/node

