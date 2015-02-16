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
            'bower_components/pace/pace.js',
            'bower_components/jquery-unveil/jquery.unveil.js',
            'bower_components/jquery-form/jquery.form.js',
            'bower_components/selectize/dist/js/standalone/selectize.js'
        ], "bower_components",'public/assets/js/vendor.js')
        .scripts([
            'assets/js/jquery.alterclass.js',
            'assets/js/init.js',
            'assets/js/quiz/share.js',
            'assets/js/quiz/history.js',
            'assets/js/quiz/do.js',
            'assets/js/quiz/create.js'
        ], 'resources','public/assets/js/script.js')
        .scripts([
            'bower_components/FroalaWysiwygEditor/js/froala_editor.min.js',
            'bower_components/FroalaWysiwygEditor/js/langs/vi.js',
            'bower_components/FroalaWysiwygEditor/js/plugins/colors.min.js',
            'bower_components/dropzone/dist/dropzone.js'
        ], 'bower_components', 'public/assets/js/editor.js')
        //.phpSpec()
        //.phpUnit()
        .version(['css/main.css','public/assets/js/script.js']);
});
