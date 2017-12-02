'use strict';

var CONFIG = {
    url: 'lightweight.vm',
    warFolder: './target/',
    installedFolder: '/mnt/deploy-themes/',
    localDeployPath: '../vagrant/deploy-themes/', // If your liferay server is on your machine (not on a VM), should be same as CONFIG.installedFolder
    themeName: 'lightweight-theme'
};
var GOGOCONFIG = {
    host: CONFIG.url,
    port: 11311
};
var SRC = {
    scss : './src/main/scss',
    js : './src/main/js',
    images : './src/main/images',
    templates: './src/main/webapp/WEB-INF/templates',
    fonts: './src/main/webapp/fonts'
};
var OUTPUT = {
    css : './src/main/webapp/css',
    js : './src/main/webapp/js',
    images : './src/main/webapp/images',
};


var gulp = require('gulp');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var replace = require('gulp-replace');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var imagemin = require('gulp-imagemin');

var GogoShell = require('gogo-shell');
var fs = require('fs');
var rimraf = require('rimraf-promise');
var unzipper = require('unzipper');
var watch = require('gulp-watch');
var runSequence = require('run-sequence'); // TODO useless on gulp 4

// Instances
var gogoShell = new GogoShell();



// ================
// Styles
gulp.task('styles', () => {
    return gulp.src([`${SRC.scss}/*.scss`, `!${SRC.scss}/_*.scss`])
        .pipe(sass({
                style: 'expanded',
                errLogToConsole: true
            }).on('error', sass.logError))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest(OUTPUT.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({processImport: false}))
        .pipe(gulp.dest(OUTPUT.css));
});

gulp.task('build:styles', ['styles']);


// ================
// JavaScripts
gulp.task('scripts', () => {
    return gulp.src([`${SRC.js}/init.js`])
        .pipe(concat('footer.js'))
        .pipe(gulp.dest(OUTPUT.js))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(OUTPUT.js));
});

gulp.task('build:js', ['scripts']);

// Copy all src images and compress
gulp.task('copyImages', () => {
    return gulp.src([SRC.images + '/**/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest(OUTPUT.images));
});


gulp.task('build:images', ['copyImages']);

/**
 * Build - Execute all build tasks
 */
gulp.task('build', cb => {
    runSequence(
        'build:styles',
        'build:js',
        'build:images',
         cb
    );
});


// ================
/**
* 'deployocal' - Copy, deploy and sync the builded war theme
*/
gulp.task('deployLocal', cb => {
    return runSequence('deployLocal:copyThemeWar', 'deployLocal:syncTheme', cb);
});

gulp.task('deployLocal:copyThemeWar', () => {
    return gulp.src(`${CONFIG.warFolder}${CONFIG.themeName}.war`)
        .pipe(gulp.dest(CONFIG.localDeployPath));
});


/**
* The ugly task
*/
gulp.task('deployLocal:syncTheme', cb => {
    var bundleId;
    gogoShell.connect(GOGOCONFIG)
        .then( () => {
            return gogoShell.sendCommand('lb -u | grep', 'webbundle:' + CONFIG.installedFolder + CONFIG.themeName);
        }).then( result => {
            return parseInt(result.split('\n')[1].split('|')[0]);
        }).then( id => {
            bundleId = id;
            var action = isNaN(id) ? 'install' : 'update ' + id ; //if id is NaN, it's a new theme
            console.log('Bundle action : ' + action);
            return gogoShell.sendCommand(action + ' webbundle:' + CONFIG.installedFolder + CONFIG.themeName+'.war?Web-ContextPath=/'+CONFIG.themeName+'&protocol=file');
        }).then( data => {
            var id = data.match(/Bundle\sID:\s*([0-9]+)/);
            return id ? id[1] : false; // return the bundle id if it's an new install, or false
        }).then( result => {
            bundleId = result ? result : bundleId; // if result is false, it's an update, keep the id. Else, assign the id
            console.log('Bundle id: ' + bundleId);
            return gogoShell.sendCommand('start', bundleId);
        }).then( () => {
            return rimraf(CONFIG.localDeployPath + CONFIG.themeName).then(() => { // Erase actual theme directory if exist
                return fs.createReadStream(CONFIG.localDeployPath + CONFIG.themeName + '.war')
                    .pipe(unzipper.Extract({ path : CONFIG.localDeployPath + CONFIG.themeName })) // Unzip the war
                    .promise();
            });
        }).then( () => {
            return gogoShell.sendCommand('update '+ bundleId + ' webbundledir:file://' + CONFIG.installedFolder + CONFIG.themeName+'/?Web-ContextPath=/'+CONFIG.themeName);
        }).then( () => {
            gogoShell.end();
            cb();
        }).done();
});

// ================
/**
 * Sync tasks - Used by watch task.
 */
gulp.task('sync:css', () => {
    return gulp.src(OUTPUT.css + '/**/*')
        .pipe(gulp.dest(CONFIG.localDeployPath + CONFIG.themeName + '/css/'));
});

gulp.task('sync:js', () => {
    return gulp.src(OUTPUT.js + '/**/*')
        .pipe(gulp.dest(CONFIG.localDeployPath + CONFIG.themeName + '/js/'));
});

gulp.task('sync:images', () => {
    return gulp.src(OUTPUT.images + '/**/*')
        .pipe(gulp.dest(CONFIG.localDeployPath + CONFIG.themeName + '/images/'));
});

gulp.task('sync:templates', () => {
    return gulp.src(SRC.templates + '/**/*')
        .pipe(gulp.dest(CONFIG.localDeployPath + CONFIG.themeName + '/WEB-INF/templates/'));
});


gulp.task('sync', () => {
    return runSequence(['sync:css', 'sync:js', 'sync:images', 'sync:templates']);
});

// ================
/**
 * Default - List usefull task
 */
gulp.task('default', () => {
    console.log(`
====> Gulp tasks:
====>   Use "gulp build" to build projet
====>   Use "gulp deployLocal" to deploy builded war and init the sync for watch
====>   Use "gulp watch" to watch files, build them, and sync it
====>   Use "gulp sync" to copy your files allready builded
    `);
});


/**
 * Watch - Watch files and sync it. A deploy should be already executed (at least one time)
 */
gulp.task('watch', () => {
    var browsersync = require('browser-sync').create();

    browsersync.init({
      proxy: CONFIG.url
    });

    watchAssetsAndSync(browsersync);
});

/**
 * Launch watchers for assets.
 * It will compile, sync, and reload the browsersync Instance
 * @param {ObjectBrowserSync} browsersyncInstance
 */
function watchAssetsAndSync(browsersyncInstance){
    // Watch .scss files, build it, sync compiled css files and refresh
    watch([SRC.scss + '/**/*.scss'], () => {
        runSequence('build:styles', 'sync:css', browsersyncInstance.reload);
    });

    // Watch .js files, build it, sync compiled js files and refresh
    watch(SRC.js + '/**/*.js', () => {
        runSequence('build:js', 'sync:js', browsersyncInstance.reload);
    });

    // Watch image files, build it, sync processed images files and refresh
    watch([SRC.images + '/**/*'], () => {
        runSequence('build:images', 'sync:images', browsersyncInstance.reload);
    });

    // Watch templates, sync it and refresh
    watch(SRC.templates + '/**/*.ftl', () => {
        runSequence('sync:templates', browsersyncInstance.reload);
    });
};
