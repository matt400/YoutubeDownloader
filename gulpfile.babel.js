import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';

const tsProject = ts.createProject("tsconfig.json");

const paths = {
	clean: ['build/'],
	ui: {
		src: 'ui/build/**/*',
		dest: 'build/ui/',
	},
	server: {
		watch: "build/server/**",
		dest: "build/server/"
	},
	migrations: {
		src: 'migrations/*.sql',
		dest: 'build/migrations/'
	},
	otherFiles: {
		src: ['*.py', 'package.json'],
		dest: 'build/'
	}
};

export const clean = () => del(paths.clean);

export function server() {
	return tsProject.src()
	.pipe(tsProject()).js
	.pipe(babel())
	//.pipe(uglify())
	.pipe(gulp.dest(paths.server.dest));
}

export function migrations() {
	return gulp.src(paths.migrations.src).pipe(gulp.dest(paths.migrations.dest));
}

export function importantFiles() {
	return gulp.src(paths.otherFiles.src).pipe(gulp.dest(paths.otherFiles.dest));
}

export function copyUI() {
	return gulp.src(paths.ui.src).pipe(gulp.dest(paths.ui.dest));
}

function watchFiles() {
	gulp.watch(paths.server.watch, server);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(server, migrations, importantFiles, copyUI));
gulp.task('build', build);

export default build;
