<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUserUploadTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        \Schema::create('users_upload', function($table)
        {
            $table->increments('id');
            $table->string('filename');
            $table->string('orginal_filename');
            $table->string('location');
            $table->string('extension');
            $table->string('mimetype');

            $table->bigInteger('size')->unsigned()->index();
            $table->integer('user_id')->unsigned()->index();
            $table->foreign('user_id')->references('id')->on('users');

            $table->timestamps();
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		\Schema::drop('users_upload');
	}

}
