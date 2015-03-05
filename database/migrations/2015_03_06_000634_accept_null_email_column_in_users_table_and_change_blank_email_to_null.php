<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AcceptNullEmailColumnInUsersTableAndChangeBlankEmailToNull extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('users', function(Blueprint $table)
        {
            $table->string('email')->nullable()->change();
        });

        // Change blank email to null
        DB::table('users')->where('email','=','')->update( ['email' => null] );
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
