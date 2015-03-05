<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUniqueUsernameAndUniqueEmailInUsersTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{

		Schema::table('users', function($table)
        {
            $table->unique('email');
            $table->unique('username');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table('users', function($table)
        {
            $table->dropUnique('users_email_unique'); // Drop unique index in 'email' from 'users' tableunique('email');
            $table->dropUnique('users_username_unique'); // Drop unique index in 'email' from 'users' tablenique('username');
        });
	}

}
