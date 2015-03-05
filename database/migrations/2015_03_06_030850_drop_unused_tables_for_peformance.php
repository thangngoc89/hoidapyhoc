<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropUnusedTablesForPeformance extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        DB::transaction(function()
        {
            Schema::table('exams', function($table)
            {
                $table->dropForeign('tests_cid_foreign'); // Drop foreign key 'user_id' from 'posts' table tests_cid_foreign
            });
            Schema::drop('categories');
            Schema::drop('comments');
            Schema::drop('posts');
            Schema::drop('questions');
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
