<?php

use Illuminate\Database\Migrations\Migration;
use Quiz\Models\History;
class AddHistoryState extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        \Schema::table('history', function($table)
        {
            $table->boolean('isDone')->nullable()->default(false);
        });

        History::where('isDone',0)->update(array('isDone' => 1));

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
