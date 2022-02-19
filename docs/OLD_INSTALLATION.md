
глобально ставим 4 либы

yarn global add typeorm
yarn global add reflect-metadata
yarn global add @types/node
yarn global add mysql

Починка путей:
export PATH="$PATH:$(yarn global bin)"
export PATH=$PATH:/usr/local/mysql/bin

Затем создадим наш проект

typeorm init --name PROJECT_NAME --database mysql

Не забываем
yarn

Создаем бд для нашего проекта
create database НАЗВАНИЕ_СХЕМЫ; 

чтобы подключиться к mysql (придется ввести пароль от mysql - password у меня)
mysql -u root -p mysql

Заменить файл ormconfig.json на config.js со следующими данными:

const ormconfig = {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database": "dimage",
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/**/*.ts"
    ],
    "migrations": [
        "src/migration/**/*.ts"
    ],
    "subscribers": [
        "src/subscriber/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}
const filesConfig = {
    "filesFolder": "files/",
    "filexMaxSize": 20971520
}
const serverStartConfig = {
    port: 3030
}
export {
    ormconfig,
    filesConfig,
    serverStartConfig
};

Удаляем дефолтные сущности (User) - файл класса и его импорт в index.ts

заменить стандартный скрипт запуска на 
"start": "ts-node -r esm index.ts"
 