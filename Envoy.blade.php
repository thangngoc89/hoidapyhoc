@servers(['www-data' => '127.0.0.1'])

@macro('deploy')
    git
    file
@endmacro

@task('git')
	cd /home/nginx/hoidapyhoc
	echo "Pulling file and install repo"
	git pull origin master
	composer install
@endtask

@task('file')
    echo "Backup and re-complied everything"
    php artisan migrate --env=local
    php artisan cache:clear
    php artisan clear-compiled
    php artisan optimize
    gulp --production
    gulp version
    echo "Deployment complete"
@endtask

@after
    @slack('https://hooks.slack.com/services/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', '#general')
@endafter
