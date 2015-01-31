<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFulltextSearchAndViewCountOnTestsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('tests', function($table)
        {
            $table->integer('views')->index()->nullable()->default(0);
        });
        DB::Statement('ALTER TABLE tests ADD FULLTEXT INDEX `FullText` (`name` ASC, `description` ASC);');
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
