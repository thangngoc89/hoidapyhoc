<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EditUsersProfileTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        DB::transaction(function()
        {
            DB::Statement('ALTER TABLE users_profile MODIFY COLUMN user_id int(10) unsigned');

            Schema::table('users_profile', function(Blueprint $table)
            {
                $table->text('token')->nullable();
                $table->index('user_id');
                $table->index('id');
                $table->unique(['identifier','provider']);
                $table->foreign('user_id')->references('id')->on('users')
                    ->onUpdate('cascade')->onDelete('cascade');
            });
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
	}

}
