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
        // Remove possible duplicate rows before add unique
        DB::statement('DELETE n1 FROM users n1, users n2 WHERE n1.id > n2.id AND n1.email = n2.email');
        DB::statement('DELETE n1 FROM users n1, users n2 WHERE n1.id > n2.id AND n1.username = n2.username');
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
