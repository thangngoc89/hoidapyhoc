<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropUnusedProfileColumn extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('profiles', function($table)
        {
            $table->dropColumn(array('webSiteURL', 'description', 'age','birthDay', 'birthMonth','birthYear','phone','address','country','region','city','zip','username','coverInfoUrl','emailVerified','firstName','lastName'));
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
