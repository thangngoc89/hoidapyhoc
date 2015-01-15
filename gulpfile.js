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
        .scripts([
            'bower_components/jquery/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/wow/dist/wow.min.js',
            'bower_components/sticky-kit/jquery.sticky-kit.js',
            'bower_components/jquery-form/jquery.form.js',
            'resciurces/assets/js/jquery.alterclass.js',
            'bower_components/toastr/toastr.js'
        ])
        .phpSpec()
        .version('css/app.css');
});
