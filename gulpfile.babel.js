import gulp from 'gulp';
import babel from 'gulp-babel';
import less from 'gulp-less';
import cleanCSS from 'gulp-clean-css';
import pug from 'gulp-pug';
import htmlMin from 'gulp-htmlmin';
import uglify from 'gulp-uglify';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// задача компиляции Less в CSS
gulp.task('styles', function() {
   return gulp.src('src/public/styles/*.less') // Less файлы
       // передаём потоки файлов
       .pipe(less()) // Копмиляция Less
       .pipe(cleanCSS()) //Минификация CSS
       .pipe(gulp.dest('dist/gulp/styles/')); // Папка назначения
});

// транспиляция JS
gulp.task('scripts', function() {
   return gulp.src('src/public/scripts/*.js') // js файлы
       .pipe(babel()) // Babel настройки из .babelrc
       .pipe(uglify()) // минификация js
       .pipe(gulp.dest('dist/gulp/scripts/'));
});

// путь к директории
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, "src/storage/users.json"), "utf8"));

gulp.task('views', function() {
   return gulp.src('src/views/*.pug')
       .pipe(pug({
          locals: { users: users },
       })) // компиляция в HTML
       .pipe(htmlMin({collapseWhitespace: true})) // минификация HTML, удаляем пробелы и переносы
       .pipe(gulp.dest('dist/gulp/views'));
});

// основная задача для запуска всех задач
gulp.task('default', gulp.series('styles', 'scripts', 'views'));