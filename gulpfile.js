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
    mix.sass('app.scss')
        //.sass('editor.scss')
        .scripts([
            'bower_components/jquery/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/wow/dist/wow.min.js',
            'bower_components/sticky-kit/jquery.sticky-kit.js',
            'bower_components/toastr/toastr.js',
            'bower_components/bootstrap-sweetalert/lib/sweet-alert.js',
            'bower_components/pace/pace.js'
        ], "bower_components",'public/assets/js/vendor.js')
        .scripts([
            'assets/js/jquery.alterclass.js',
            'assets/js/jquery.uploadfile.js',
            'assets/js/init.js',
            'assets/js/quiz/share.js',
            'assets/js/quiz/history.js',
            'assets/js/quiz/do.js',
            'assets/js/quiz/create.js'
        ], 'resources','public/js/script.js')
        .scripts([
            'bower_components/medium-editor/dist/js/medium-editor.js',
            'bower_components/medium-editor-insert-plugin/dist/js/addons/medium-editor-insert-plugin.js',
            'bower_components/medium-editor-insert-plugin/dist/js/addons/medium-editor-insert-images.js'
        ], 'bower_components', 'public/assets/js/editor.js')
        .phpSpec()
        .version(['css/app.css','js/script.js']);
});
