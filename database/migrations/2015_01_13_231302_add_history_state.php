<?php

use Illuminate\Database\Migrations\Migration;

class AddHistoryState extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('history', function($table)
        {
            $table->boolean('isDone')->nullable()->default(false);
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
