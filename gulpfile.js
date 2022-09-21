const gulp = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const del = require('del');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const paths = require('vinyl-paths');
const workboxBuild = require('workbox-build');
const fs = require('fs');

const PUBLIC_PATH = 'docs';

// Styles

gulp.task('styles', () => {
    return gulp
        .src(`${PUBLIC_PATH}/style.css`)
        .pipe(
            postcss([
                require('postcss-color-hex-alpha'),
                require('autoprefixer')({ grid: 'autoplace' }),
                require('postcss-csso'),
            ]),
        )
        .pipe(gulp.dest(PUBLIC_PATH));
});

// Scripts

gulp.task('scripts', () => {
    return gulp
        .src(`${PUBLIC_PATH}/script.js`)
        .pipe(
            babel({
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: {
                                esmodules: true,
                            },
                        },
                    ],
                ],
            }),
        )
        .pipe(terser())
        .pipe(gulp.dest(PUBLIC_PATH));
});

// Cache

gulp.task('cache:hash', () => {
    return gulp
        .src(
            [
                `${PUBLIC_PATH}/script.js`,
                `${PUBLIC_PATH}/style.css`,
                `${PUBLIC_PATH}/favicon/**/*.{svg,png}`,
                `${PUBLIC_PATH}/manifest.webmanifest`,
            ],
            {
                base: PUBLIC_PATH,
            },
        )
        .pipe(paths(del))
        .pipe(rev())
        .pipe(gulp.dest(PUBLIC_PATH))
        .pipe(rev.manifest('rev.json'))
        .pipe(gulp.dest(PUBLIC_PATH));
});

gulp.task('cache:replace', () => {
    return gulp
        .src([
            `${PUBLIC_PATH}/**/*.{html,css}`,
            `${PUBLIC_PATH}/manifest-*.webmanifest`,
        ])
        .pipe(
            revRewrite({
                manifest: fs.readFileSync(`${PUBLIC_PATH}/rev.json`),
            }),
        )
        .pipe(gulp.dest(PUBLIC_PATH));
});

gulp.task('service-worker', () => {
    return workboxBuild.generateSW({
        globDirectory: PUBLIC_PATH,
        globPatterns: ['**/*.{js,css,webmanifest,ico,woff2}'],
        swDest: `${PUBLIC_PATH}/sw.js`,
        runtimeCaching: [
            {
                urlPattern: /\.(?:png|jpg|avif|svg|ico)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'images',
                    expiration: {
                        maxEntries: 30,
                    },
                },
            },
            {
                urlPattern: /(\.(?:html))|(\/)$/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'pages',
                    expiration: {
                        maxEntries: 20,
                    },
                },
            },
        ],
        mode: 'production',
        skipWaiting: true,
        clientsClaim: true,
        sourcemap: false,
    });
});

gulp.task('cache', gulp.series('cache:hash', 'cache:replace'));

// Build

gulp.task('build', gulp.series('styles', 'scripts', 'cache', 'service-worker'));
