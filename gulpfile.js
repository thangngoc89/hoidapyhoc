var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass(['main.scss','editor.scss'])
        .scripts([
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/wow/dist/wow.min.js',
            'bower_components/sticky-kit/jquery.sticky-kit.js',
            'bower_components/toastr/toastr.js',
            'bower_components/bootstrap-sweetalert/lib/sweet-alert.js',
            'bower_components/jquery-unveil/jquery.unveil.js',
            'bower_components/selectize/dist/js/standalone/selectize.js',
            'bower_components/jquery-stickit/src/jquery.stickit.js'
        ], 'public/assets/js/vendor.js', 'bower_components')
        .scripts([
            'jquery.alterclass.js',
            'init.js',
            'quiz/share.js',
            'quiz/history.js',
            'quiz/do.js',
            'quiz/create.js'
        ], 'public/assets/js/script.js')
        .scripts([
            'bower_components/FroalaWysiwygEditor/js/froala_editor.min.js',
            //'bower_components/FroalaWysiwygEditor/js/langs/vi.js',
            'bower_components/FroalaWysiwygEditor/js/plugins/colors.min.js',
            'bower_components/dropzone/dist/dropzone.js'
        ], 'public/assets/js/editor.js','bower_components')
        //.phpSpec()
        //.phpUnit()
        .version([
            'css/main.css',
            'css/editor.css',
            'public/assets/js/script.js',
            'public/assets/js/vendor.js',
            'public/assets/js/admin.js'
        ]);
});