@servers(['www-data' => '127.0.0.1'])

@macro('deploy')
    git
    migrate
    optimize
    assets
    queue
@endmacro

@task('git')
	cd /home/nginx/hoidapyhoc
	echo "Pulling file and install repo"
	git pull origin master
	composer install
@endtask

@task('migrate')
    php artisan migrate --env=local
@endtask

@task('optimize')
    echo "Optimize framework"
    php artisan cache:clear
    php artisan clear-compiled
    php artisan optimize

    php artisan config:clear
    php artisan config:cache

    php artisan route:clear
    php artisan route:cache
@endtask

@task('assets')
    echo "Compliling assets"
    gulp --production
    gulp version
@endtask

@task('queue')
    php artisan queue:listen > /home/nginx/hoidapyhoc/storage/queue.log
@endtask

@after
    @slack('https://hooks.slack.com/services/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', '#general')
@endafter
