<?php

use Illuminate\Database\Migrations\Migration;

class AddTestimonials extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::create('testimonials', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');

            $table->string('name');
            $table->string('link')->nullable();
            $table->string('avatar');
            $table->string('content');

            $table->boolean('isHome')->default(0);
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::drop('testimonials');

    }

}
