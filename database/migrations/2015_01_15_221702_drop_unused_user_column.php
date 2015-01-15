<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropUnusedUserColumn extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('users', function($table)
        {
//            $table->dropColumn(array('password','confirmation_code','confirmed'));
//            $table->string('username')->nullable();
        });
        DB::Statement('ALTER TABLE `users` CHANGE `username` `username` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL;');
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
